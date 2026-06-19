# Acción de GitHub para dev-readme-stats

Genera tarjetas dinámicas con tus estadísticas de GitHub mediante GitHub Actions, súbelas mediante un commit a tu repositorio de perfil, e insértalas directamente desde ahí. 

Esta es una versión personalizada basada en el proyecto original, optimizada para funcionar en español y con las mejores configuraciones por defecto para el ecosistema `dev-readme-stats`.

## Inicio rápido

```yaml
name: Generar todas las tarjetas y temas

on:
  schedule:
    - cron: "0 3 * * *"
  workflow_dispatch:

permissions:
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
    steps:
      - uses: actions/checkout@df4cb1c069e1874edd31b4311f1884172cec0e10
      
      # --- TEMA: DEFAULT ---
      - name: stats - default
        uses: alvar3zjos3/dev-readme-stats-action@main
        with:
          card: stats
          options: username=${{ github.repository_owner }}&theme=default
          path: profile/themes/default/stats.svg
          token: ${{ secrets.GITHUB_TOKEN }}
          
      - name: top-langs - default
        uses: alvar3zjos3/dev-readme-stats-action@main
        with:
          card: top-langs
          options: username=${{ github.repository_owner }}&theme=default
          path: profile/themes/default/top-langs.svg
          token: ${{ secrets.GITHUB_TOKEN }}
          
      - name: pin - default
        uses: alvar3zjos3/dev-readme-stats-action@main
        with:
          card: pin
          options: username=${{ github.repository_owner }}&repo=dev-readme-stats&show_owner=true&theme=default
          path: profile/themes/default/pin.svg
          token: ${{ secrets.GITHUB_TOKEN }}
          
      - name: wakatime - default
        uses: alvar3zjos3/dev-readme-stats-action@main
        with:
          card: wakatime
          options: username=${{ github.repository_owner }}&theme=default
          path: profile/themes/default/wakatime.svg
          token: ${{ secrets.GITHUB_TOKEN }}
          
      # Aquí puedes añadir tu paso final preferido (como peter-evans/create-pull-request)
      # para subir los archivos generados a tu repositorio.
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
