import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { afterAll, beforeAll, describe, expect, test } from "vitest";

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const repoOwner = process.env.GITHUB_REPOSITORY_OWNER ?? "alvar3zjos3";
let buildDir;

const runCard = (card, options, output, coreVersion) =>
  new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(rootDir, "index.js")], {
      stdio: "inherit",
      env: {
        ...process.env,
        INPUT_CARD: card,
        INPUT_OPTIONS: options,
        INPUT_PATH: output,
        INPUT_CORE_VERSION: coreVersion,
      },
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`La tarjeta ${card} falló con el código ${code}`));
      }
    });
  });

const assertSvg = async (filePath) => {
  const data = await readFile(filePath, "utf8");
  expect(data).toContain("<svg");
};

beforeAll(async () => {
  buildDir = await mkdtemp(path.join(os.tmpdir(), "grs-action-"));
});

afterAll(async () => {
  if (buildDir) {
    await rm(buildDir, { recursive: true, force: true });
  }
});

describe.concurrent("generar tarjetas localmente", () => {
  test("la tarjeta stats generada contiene un svg", async () => {
    const statsPath = path.join(buildDir, "stats.svg");
    await runCard("stats", `username=${repoOwner}&show_icons=true`, statsPath);
    await assertSvg(statsPath);
  });

  test("la tarjeta top-langs generada contiene un svg", async () => {
    const langsPath = path.join(buildDir, "top-langs.svg");
    await runCard(
      "top-langs",
      `username=${repoOwner}&layout=compact&langs_count=6`,
      langsPath,
    );
    await assertSvg(langsPath);
  });

  test("la tarjeta pin generada contiene un svg", async () => {
    const pinPath = path.join(
      buildDir,
      "pin-alvar3zjos3-dev-readme-stats-action.svg",
    );
    await runCard(
      "pin",
      "username=alvar3zjos3&repo=dev-readme-stats-action",
      pinPath,
    );
    await assertSvg(pinPath);
  });

  test("la tarjeta wakatime generada contiene un svg", async () => {
    const wakatimePath = path.join(buildDir, "wakatime.svg");
    await runCard("wakatime", "username=MNZ&layout=compact", wakatimePath);
    await assertSvg(wakatimePath);
  });

  test("rechaza la entrada de core_version no válida antes de instalar", async () => {
    const invalidVersionPath = path.join(buildDir, "invalid-version.svg");

    await expect(
      runCard(
        "stats",
        `username=${repoOwner}`,
        invalidVersionPath,
        "latest && whoami",
      ),
    ).rejects.toThrow();
  });
});

describe("incluir las versiones del paquete core solicitadas", () => {
  test("usar la versión 'v2' del paquete core", async () => {
    const v2Path = path.join(buildDir, "v2.svg");

    await runCard("stats", `username=${repoOwner}`, v2Path, "v2");
    await assertSvg(v2Path);
  });

  test("usar la versión 'latest' del paquete core", async () => {
    const latestPath = path.join(buildDir, "latest.svg");

    await runCard("stats", `username=${repoOwner}`, latestPath, "latest");
    await assertSvg(latestPath);
  });

  test("la versión 'abcdef' del paquete core falla", async () => {
    const abcdefPath = path.join(buildDir, "abcdef.svg");

    await expect(
      runCard("stats", `username=${repoOwner}`, abcdefPath, "abcdef"),
    ).rejects.toThrow();
  });
}, 20_000);
