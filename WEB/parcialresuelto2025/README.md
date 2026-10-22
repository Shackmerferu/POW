# Parcial 2025 resuelto — Club Deportivo La Tania (Canicas)

Prototipo **minimalista y funcional** que resuelve el parcial usando la **Opción A**:
HTML + CSS tradicional + **JavaScript puro** (sin librerías ni frameworks).

## Estructura

```
parcialresuelto2025/
├── index.html                 Página inicial (banner + texto + menú)
├── canicas_masculino.html     Jugadores + tabla de posiciones (id_categoria = 1)
├── canicas_femenino.html      Ídem femenino (id_categoria = 3)
├── registrar_club.html        Página huérfana: alta de club (punto EXTRA)
├── css/estilo.css             Diseño responsivo y estético propio
├── js/
│   ├── config.js              API_BASE y constantes (endpoints, categorías)
│   ├── app.js                 Helpers: fetch a la API, menú desde BD, WhatsApp
│   ├── canicas.js             Jugadores, modal, palmarés y tabla de posiciones
│   └── registrar.js           Envío del formulario por AJAX con FormData
├── assets/                    logo, banner, WhatsApp y fuente shadowed_serif
└── php-resuelto/
    ├── palmares_guardar.php   Versión RESUELTA de la funcionalidad A
    └── equipos_insertar.php   Versión RESUELTA del punto extra B
```

## Qué resuelve cada requisito del parcial

| Requisito | Dónde |
|---|---|
| Header fijo con logo + título (fuente shadowed_serif) | `.header` en `estilo.css`, `index.html` |
| Menú desde la base de datos, solo `visible='SI'`, en mayúsculas | `armarMenu()` en `js/app.js` |
| Banner con texto superpuesto | `.banner` en `estilo.css` |
| Texto de la página principal (con negritas) | `index.html` |
| Botón WhatsApp fijo abajo a la derecha | `armarWhatsapp()` en `js/app.js` |
| Footer destacado | `.footer` |
| Jugadores con foto, nombre y apodo (sin repetidos por DNI) | `cargarJugadores()` en `js/canicas.js` |
| Modal "Ver más" con datos + palmarés | `abrirModal()` / `cargarPalmares()` |
| Guardar nuevo palmarés (funcionalidad **A**) | `guardarPalmares()` + `php-resuelto/palmares_guardar.php` |
| Tabla de posiciones (C1 = 3/1, C2 = 5/2), ordenada | `cargarTabla()` / `puntosPartido()` |
| Canicas Femenino (`id_categoria=3`) | `canicas_femenino.html` |
| Alta de club con logo (punto **EXTRA B**) | `registrar_club.html` + `php-resuelto/equipos_insertar.php` |

## Puesta en marcha (XAMPP)

1. Iniciar **Apache** y **MySQL** en el panel de XAMPP.
2. Crear la base `la_tania` e importar `la_tania.sql` (phpMyAdmin → Importar).
3. Copiar la carpeta de la API al servidor: `htdocs/la_tania/` (debe quedar
   `htdocs/la_tania/api/...`). Verificar credenciales en `api/conexion.php`.
4. **Completar los dos PHP** con las versiones resueltas de esta carpeta:
   - `php-resuelto/palmares_guardar.php`  → reemplaza `api/palmares_guardar.php`
   - `php-resuelto/equipos_insertar.php`  → reemplaza `api/equipos_insertar.php`
5. Copiar esta carpeta `parcialresuelto2025/` dentro de `htdocs/` y abrir
   `http://localhost/parcialresuelto2025/index.html`.
6. Si la API está en otra ruta, **solo editá `API_BASE`** en `js/config.js`.

## Notas de diseño

- El menú se arma por JavaScript leyendo `menu.php`; los enlaces usan `id_categoria`
  para decidir a qué página ir (1 → masculino, 3 → femenino, 0 → inicio).
- La tabla de posiciones recorre **todos** los equipos y, por cada uno, consulta sus
  partidos como local (`localia=A`) y visitante (`localia=B`), sumando puntos según la
  modalidad (`puntos_A`/`puntos_B` y `modalidad` C1/C2) y ordenando al final.
- Los jugadores repetidos (que juegan varios deportes) se deduplican con un `Map` por `dni`.
- Las dos únicas modificaciones a la API son los PHP que el enunciado pedía completar.
