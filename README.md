# Acción de GitHub para dev-readme-stats

Genera tarjetas dinámicas con tus estadísticas de GitHub mediante GitHub Actions, súbelas mediante un commit a tu repositorio de perfil, e insértalas directamente desde ahí. 

Esta es una versión personalizada basada en el proyecto original, optimizada para funcionar en español y con las mejores configuraciones por defecto para el ecosistema `dev-readme-stats`.

## Inicio rápido

```yaml
name: Generar todas las tarjetas y temas

on:
  #schedule:
  #  - cron: "0 3 * * *"
  workflow_dispatch:

permissions:
  contents: read

jobs:
  generate_svgs_1:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
    strategy:
      fail-fast: false
      max-parallel: 15
      matrix:
        theme:
          [
            "default",
            "white",
            "default_repocard",
            "transparent",
            "shadow_red",
            "shadow_green",
            "shadow_blue",
            "dark",
            "radical",
            "merko",
            "gruvbox",
            "gruvbox_light",
            "tokyonight",
            "onedark",
            "cobalt",
            "synthwave",
            "highcontrast",
            "dracula",
            "prussian",
            "monokai",
            "vue",
            "nightowl",
            "buefy",
            "algolia",
            "darcula",
            "bear",
            "nord",
            "gotham",
            "graywhite",
            "calm",
            "omni",
            "react",
            "jolly",
            "maroongold",
            "yeblu",
            "blueberry",
            "slateorange",
            "kacho_ga",
            "outrun",
            "ocean_dark",
            "city_lights",
            "github_dark",
            "github_dark_dimmed",
            "discord_old_blurple",
            "aura_dark",
            "panda",
            "noctis_minimus",
            "cobalt2",
            "swift",
            "aura",
            "apprentice",
            "moltack",
            "codeSTACKr",
            "rose_pine",
            "catppuccin_latte",
            "catppuccin_mocha",
            "date_night",
            "one_dark_pro",
            "rose",
            "holi",
            "neon",
            "blue_navy",
            "calm_pink",
            "ambient_gradient",
            "neon_emerald",
            "sonic_platinum",
            "stellar_titanium",
            "solar_coral",
            "twilight_silver",
            "stellar_crimson",
            "pastel_bronze",
            "quantum_copper",
            "stellar_amber",
            "cosmic_titanium",
            "stellar_platinum",
            "retro_coral",
            "retro_platinum",
            "sonic_topaz",
            "velvet_amethyst",
            "velvet_silver",
            "cosmic_onyx",
            "retro_amethyst",
            "forest_topaz",
            "stellar_pearl",
            "solar_quartz",
            "pastel_topaz",
            "twilight_pearl",
            "cyber_platinum",
            "retro_amber",
            "solar_onyx",
            "retro_topaz",
            "velvet_bronze",
            "electric_titanium",
            "stellar_quartz",
            "midnight_bronze",
            "pastel_onyx",
            "dawn_emerald",
            "dusk_sapphire",
            "dawn_jade",
            "stellar_bronze",
            "forest_copper",
            "solar_bronze",
            "lunar_onyx",
            "electric_amber",
            "retro_copper",
            "crystal_jade",
            "dusk_onyx",
            "lunar_coral",
            "dusk_platinum",
            "pastel_coral",
            "solar_indigo",
            "dawn_crimson",
            "quantum_bronze",
            "cosmic_coral",
            "twilight_bronze",
            "stellar_indigo",
            "ocean_onyx",
            "lunar_pearl",
            "electric_jade",
            "dawn_platinum",
            "sonic_violet",
            "cosmic_jade",
            "neon_platinum",
            "solar_platinum",
            "electric_crimson",
            "midnight_jade",
            "pastel_jade",
            "electric_quartz",
            "crystal_bronze",
            "ocean_violet",
            "stellar_onyx",
            "forest_violet",
          ]
    steps:
      - name: Harden the runner
        uses: step-security/harden-runner@9af89fc71515a100421586dfdb3dc9c984fbf411
        with:
          egress-policy: audit
      - uses: actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0
      - name: stats
        uses: alvar3zjos3/dev-readme-stats-action@6ce6b8aab3851d24f237e0b9c1160cfb42aa05c9
        with:
          card: stats
          options:
            username=${{ github.repository_owner }}&theme=${{ matrix.theme }}
          path: profile/themes/${{ matrix.theme }}/stats.svg
          token: ${{ secrets.GITHUB_TOKEN }}
      - name: top-langs
        uses: alvar3zjos3/dev-readme-stats-action@6ce6b8aab3851d24f237e0b9c1160cfb42aa05c9
        with:
          card: top-langs
          options:
            username=${{ github.repository_owner }}&theme=${{ matrix.theme }}
          path: profile/themes/${{ matrix.theme }}/top-langs.svg
          token: ${{ secrets.GITHUB_TOKEN }}
      - name: pin
        uses: alvar3zjos3/dev-readme-stats-action@6ce6b8aab3851d24f237e0b9c1160cfb42aa05c9
        with:
          card: pin
          options:
            username=${{ github.repository_owner
            }}&repo=dev-readme-stats&show_owner=true&theme=${{ matrix.theme }}
          path: profile/themes/${{ matrix.theme }}/pin.svg
          token: ${{ secrets.GITHUB_TOKEN }}
      - name: wakatime
        uses: alvar3zjos3/dev-readme-stats-action@6ce6b8aab3851d24f237e0b9c1160cfb42aa05c9
        with:
          card: wakatime
          options:
            username=${{ github.repository_owner }}&theme=${{ matrix.theme }}
          path: profile/themes/${{ matrix.theme }}/wakatime.svg
          token: ${{ secrets.GITHUB_TOKEN }}
      - name: Upload artifacts
        uses: actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a # v7.0.1
        with:
          name: ${{ matrix.theme }}
          path: profile/themes/${{ matrix.theme }}/

  generate_svgs_2:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      max-parallel: 15
      matrix:
        theme:
          [
            "twilight_violet",
            "cosmic_bronze",
            "dusk_pearl",
            "desert_jade",
            "stellar_jade",
            "dawn_indigo",
            "twilight_coral",
            "dawn_gold",
            "quantum_gold",
            "cyber_sapphire",
            "retro_violet",
            "pastel_emerald",
            "cosmic_crimson",
            "crystal_emerald",
            "cyber_silver",
            "crystal_titanium",
            "midnight_ruby",
            "cyber_jade",
            "twilight_copper",
            "cosmic_pearl",
            "lunar_sapphire",
            "retro_sapphire",
            "velvet_topaz",
            "velvet_pearl",
            "electric_indigo",
            "electric_gold",
            "forest_ruby",
            "cosmic_platinum",
            "dawn_coral",
            "neon_jade",
            "lunar_crimson",
            "forest_indigo",
            "twilight_topaz",
            "ocean_gold",
            "ocean_quartz",
            "crystal_platinum",
            "lunar_bronze",
            "retro_ruby",
            "retro_indigo",
            "crystal_sapphire",
            "sonic_sapphire",
            "sonic_jade",
            "twilight_sapphire",
            "cosmic_amber",
            "lunar_copper",
            "cosmic_violet",
            "cyber_emerald",
            "velvet_ruby",
            "stellar_silver",
            "forest_jade",
            "cosmic_emerald",
            "dusk_silver",
            "forest_sapphire",
            "midnight_indigo",
            "desert_onyx",
            "desert_amethyst",
            "dawn_onyx",
            "ocean_bronze",
            "quantum_silver",
            "midnight_titanium",
            "ocean_indigo",
            "electric_platinum",
            "velvet_copper",
            "neon_indigo",
            "sonic_quartz",
            "velvet_jade",
            "dusk_crimson",
            "dusk_violet",
            "velvet_indigo",
            "twilight_platinum",
            "pastel_platinum",
            "twilight_onyx",
            "neon_violet",
            "dawn_sapphire",
            "forest_emerald",
            "forest_crimson",
            "crystal_pearl",
            "ocean_crimson",
            "sonic_onyx",
            "sonic_copper",
            "electric_emerald",
            "ocean_amethyst",
            "forest_coral",
            "quantum_platinum",
            "velvet_sapphire",
            "twilight_quartz",
            "retro_onyx",
            "dusk_gold",
            "neon_bronze",
            "cyber_amethyst",
            "stellar_ruby",
            "cyber_ruby",
            "stellar_gold",
            "cosmic_topaz",
            "desert_amber",
            "electric_sapphire",
            "ocean_emerald",
            "dusk_bronze",
            "cyber_indigo",
            "desert_silver",
            "lunar_platinum",
            "twilight_jade",
            "sonic_emerald",
            "ocean_coral",
            "cyber_quartz",
            "dawn_amber",
            "electric_violet",
            "dawn_ruby",
            "dusk_quartz",
            "crystal_crimson",
            "midnight_sapphire",
            "forest_platinum",
            "neon_crimson",
            "velvet_emerald",
            "dawn_silver",
            "lunar_jade",
            "solar_silver",
            "stellar_coral",
            "retro_gold",
            "cosmic_copper",
            "crystal_onyx",
            "electric_coral",
            "desert_gold",
            "pastel_ruby",
            "pastel_amber",
            "cosmic_sapphire",
            "neon_pearl",
            "cyber_topaz",
            "lunar_emerald",
            "retro_silver",
            "twilight_ruby",
            "ocean_titanium",
          ]
    steps:
      - name: Harden the runner
        uses: step-security/harden-runner@9af89fc71515a100421586dfdb3dc9c984fbf411
        with:
          egress-policy: audit
      - uses: actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0
      - name: stats
        uses: alvar3zjos3/dev-readme-stats-action@6ce6b8aab3851d24f237e0b9c1160cfb42aa05c9
        with:
          card: stats
          options:
            username=${{ github.repository_owner }}&theme=${{ matrix.theme }}
          path: profile/themes/${{ matrix.theme }}/stats.svg
          token: ${{ secrets.GITHUB_TOKEN }}
      - name: top-langs
        uses: alvar3zjos3/dev-readme-stats-action@6ce6b8aab3851d24f237e0b9c1160cfb42aa05c9
        with:
          card: top-langs
          options:
            username=${{ github.repository_owner }}&theme=${{ matrix.theme }}
          path: profile/themes/${{ matrix.theme }}/top-langs.svg
          token: ${{ secrets.GITHUB_TOKEN }}
      - name: pin
        uses: alvar3zjos3/dev-readme-stats-action@6ce6b8aab3851d24f237e0b9c1160cfb42aa05c9
        with:
          card: pin
          options:
            username=${{ github.repository_owner
            }}&repo=dev-readme-stats&show_owner=true&theme=${{ matrix.theme }}
          path: profile/themes/${{ matrix.theme }}/pin.svg
          token: ${{ secrets.GITHUB_TOKEN }}
      - name: wakatime
        uses: alvar3zjos3/dev-readme-stats-action@6ce6b8aab3851d24f237e0b9c1160cfb42aa05c9
        with:
          card: wakatime
          options:
            username=${{ github.repository_owner }}&theme=${{ matrix.theme }}
          path: profile/themes/${{ matrix.theme }}/wakatime.svg
          token: ${{ secrets.GITHUB_TOKEN }}
      - name: Upload artifacts
        uses: actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a # v7.0.1
        with:
          name: ${{ matrix.theme }}
          path: profile/themes/${{ matrix.theme }}/

  create_pr:
    needs: [generate_svgs_1, generate_svgs_2]
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
    steps:
      - uses: actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0
      - name: Descargar todos los SVGs generados
        uses: actions/download-artifact@3e5f45b2cfb9172054b4087a40e8e0b5a5461e7c # v8.0.1
        with:
          path: profile/themes/
      - name: Crear Pull Request con estadísticas actualizadas
        uses: peter-evans/create-pull-request@5f6978faf089d4d20b00c7766989d076bb2fc7f1 # v8.1.1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message:
            "Actualizar combinaciones de tarjetas y temas (Matrix)"
          branch: "update-stats/patch"
          delete-branch: true
          title: "Actualizar combinaciones de tarjetas y temas"
          body: "Actualización automática usando estrategia Matrix."
          labels: "ci, stats-update"
```

Luego, inclúyelas (embed) desde el `README.md` de tu perfil:

```md
![Estadísticas](./profile/themes/default/stats.svg)
![Lenguajes](./profile/themes/default/top-langs.svg)
![Pin](./profile/themes/default/pin.svg)
![WakaTime](./profile/themes/default/wakatime.svg)
```

## Entradas (Inputs)

- `card` (requerido): Tipo de tarjeta a generar. Valores soportados: `stats`, `top-langs`, `pin`, `wakatime`, `gist`.
- `options`: Opciones de la tarjeta como una cadena de consulta (`clave=valor&...`) o JSON. Si se omite el `username`, la Acción usará el propietario del repositorio actual. **(Nota: El idioma español, el layout compacto y los iconos vienen activados por defecto).**
- `path`: Ruta de salida para el archivo SVG. Por defecto es `profile/<card>.svg`. Te recomendamos usar `profile/themes/<nombre_del_tema>/<card>.svg`.
- `token`: Token de GitHub (PAT o `GITHUB_TOKEN`). Para generar estadísticas de repositorios privados, usa un [PAT](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) con los permisos `repo` y `read:user`. Para cualquier Gist, usa un PAT con permisos de `gist`.
- `core_version`: Versión del paquete core a usar internamente. Si se omite, la Acción usa la última versión `2.x.x`.

## Salidas (Outputs)

- `path`: Ruta donde se escribió el archivo SVG generado, relativa al espacio de trabajo.

## Temas Disponibles

El ecosistema `dev-readme-stats` incluye múltiples temas visuales preconfigurados que puedes aplicar pasando el parámetro `&theme=nombre_del_tema` en la opción `options`.

El tema por defecto es `default`, que proporciona un elegante diseño oscuro. Algunos otros temas populares incluyen:

- `white` (tema blanco clásico)
- `transparent` (sin fondo)
- `dark` (tema oscuro alternativo)
- `radical`
- `tokyonight`
- `gruvbox`
- `dracula`
