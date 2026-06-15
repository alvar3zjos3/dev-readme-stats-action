import { exec } from "node:child_process";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { promisify } from "node:util";

import { getInput, info, setFailed, setOutput, warning } from "@actions/core";

const execAsync = promisify(exec);
// Modificamos el core para usar la dependencia interna en caso de que crees tu propio core,
// si planeas seguir usando el core original de stats-organization déjalo como estaba.
const CORE_PACKAGE_NAME = "@stats-organization/github-readme-stats-core";
const supportedCoreExports = ["api", "topLangs", "pin", "wakatime", "gist"];

const validateCoreVersion = (value) => {
  const pattern = /^[a-zA-Z0-9._-]*$/;
  if (!pattern.test(value)) {
    throw new Error("core_version debe contener solo caracteres a-zA-Z0-9._-.");
  }
  return value;
};

/**
 * Instala el paquete core solicitado en un directorio temporal aislado.
 * @param {string} version Versión del paquete.
 * @returns {Promise<string>} Directorio que contiene el paquete instalado.
 */
const installCorePackage = async (version) => {
  const installDir = await mkdtemp(path.join(os.tmpdir(), "grs-core-"));
  const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
  const packageSpec = `${CORE_PACKAGE_NAME}@${version}`;

  try {
    await writeFile(
      path.join(installDir, "package.json"),
      JSON.stringify({ private: true, type: "module" }),
      "utf8",
    );

    await execAsync(
      `${npmCommand} install --no-save --ignore-scripts --no-package-lock ${packageSpec}`,
      {
        cwd: installDir,
        env: process.env,
      },
    );

    return installDir;
  } catch (error) {
    throw new Error(
      `Fallo al instalar ${CORE_PACKAGE_NAME}@${version}: ${error}`,
    );
  }
};

/**
 * Carga el paquete core ya sea desde la dependencia empaquetada o desde una instalación aislada.
 * @param {string} version Versión del paquete.
 * @returns {Promise<Record<string, unknown>>} Módulo cargado y callback de limpieza.
 */
const loadCoreModule = async (version) => {
  if (!version) {
    return await import(CORE_PACKAGE_NAME);
  }

  const installDir = await installCorePackage(version);
  const installRequire = createRequire(path.join(installDir, "package.json"));
  const modulePath = installRequire.resolve(CORE_PACKAGE_NAME);
  return await import(pathToFileURL(modulePath).href);
};

/**
 * Construye el mapa de manejadores de tarjetas compatibles desde el módulo core cargado.
 * @param {Record<string, unknown>} coreModule Módulo del paquete core cargado.
 * @returns {Record<string, Function>} Manejadores de tarjetas.
 */
const createCardHandlers = (coreModule) => {
  for (const exportName of supportedCoreExports) {
    if (typeof coreModule[exportName] !== "function") {
      throw new Error(
        `El módulo cargado ${CORE_PACKAGE_NAME} no expone la función esperada '${exportName}'.`,
      );
    }
  }

  return {
    stats: coreModule.api,
    "top-langs": coreModule.topLangs,
    pin: coreModule.pin,
    wakatime: coreModule.wakatime,
    gist: coreModule.gist,
  };
};

/**
 * Normaliza los valores de las opciones a cadenas de texto.
 * @param {Record<string, unknown>} options Opciones de entrada.
 * @returns {Record<string, string>} Opciones normalizadas.
 */
const normalizeOptions = (options) => {
  const normalized = {};
  for (const [key, val] of Object.entries(options)) {
    if (Array.isArray(val)) {
      normalized[key] = val.join(",");
    } else if (val === null || val === undefined) {
      continue;
    } else {
      normalized[key] = String(val);
    }
  }
  return normalized;
};

/**
 * Analiza las opciones desde la cadena de consulta (query string) o JSON y normaliza los valores a texto.
 * @param {string} value Valor de entrada.
 * @returns {Record<string, string>} Opciones analizadas.
 */
const parseOptions = (value) => {
  if (!value) {
    return {};
  }

  const trimmed = value.trim();
  const options = {};
  if (trimmed.startsWith("{")) {
    try {
      Object.assign(options, JSON.parse(trimmed));
    } catch {
      throw new Error("JSON no válido en las opciones.");
    }
  } else {
    const queryString = trimmed.startsWith("?") ? trimmed.slice(1) : trimmed;
    const params = new URLSearchParams(queryString);
    for (const [key, val] of params.entries()) {
      if (options[key]) {
        options[key] = `${options[key]},${val}`;
      } else {
        options[key] = val;
      }
    }
  }

  return normalizeOptions(options);
};

/**
 * Valida las opciones requeridas para cada tipo de tarjeta.
 * @param {string} card Tipo de tarjeta.
 * @param {Record<string, string>} query Opciones analizadas.
 * @param {string | undefined} repoOwner Propietario del repositorio desde el entorno.
 * @throws {Error} Si faltan opciones requeridas.
 */
const validateCardOptions = (card, query, repoOwner) => {
  if (!query.username && repoOwner) {
    query.username = repoOwner;
    warning(
      "No se proporcionó nombre de usuario; usando por defecto el propietario del repositorio.",
    );
  }
  switch (card) {
    case "stats":
    case "top-langs":
    case "wakatime":
      if (!query.username) {
        throw new Error(
          `El nombre de usuario (username) es obligatorio para la tarjeta ${card}.`,
        );
      }
      break;
    case "pin":
      if (!query.repo) {
        throw new Error(
          "El repositorio (repo) es obligatorio para la tarjeta pin.",
        );
      }
      break;
    case "gist":
      if (!query.id) {
        throw new Error(
          "El identificador (id) es obligatorio para la tarjeta gist.",
        );
      }
      break;
    default:
      break;
  }
};

const run = async () => {
  const card = getInput("card", { required: true }).toLowerCase();
  const optionsInput = getInput("options") || "";
  const outputPathInput = getInput("path");
  const coreVersion = validateCoreVersion(getInput("core_version") || "");

  const coreModule = await loadCoreModule(coreVersion);

  // Mapa de los tipos de tarjeta a sus respectivos manejadores de la API.
  const cardHandlers = createCardHandlers(coreModule);
  const handler = cardHandlers[card];
  if (!handler) {
    throw new Error(`Tipo de tarjeta no soportado: ${card}`);
  }

  const query = parseOptions(optionsInput);

  validateCardOptions(card, query, process.env.GITHUB_REPOSITORY_OWNER);

  const outputPathValue =
    outputPathInput || path.join("profile", `${card}.svg`);
  const outputPath = path.resolve(process.cwd(), outputPathValue);
  await mkdir(path.dirname(outputPath), { recursive: true });

  const svg = (await handler(query))?.content;
  if (!svg) {
    throw new Error("El generador de la tarjeta devolvió un resultado vacío.");
  }

  await writeFile(outputPath, svg, "utf8");
  info(`Escrito correctamente en ${outputPath}`);
  setOutput("path", outputPathValue);
};

run().catch((error) => {
  setFailed(error instanceof Error ? error.message : String(error));
});
