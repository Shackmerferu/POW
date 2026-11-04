# Termo Store — Front del parcial

Front completo para el parcial de **Programación Orientada a la Web**.

## Inicio rápido

1. Iniciar **Apache** y **MySQL** en XAMPP.
2. Verificar que la base `termos` esté importada desde `../termos.sql`.
3. Abrir:

```text
http://localhost/facultad/POW/POW/practica/Funes_Antonio/termos/front/index.html
```

4. Ingresar con:

```text
Usuario: gaston
Clave:   12345
```

> Si el proyecto está en `C:\xampp\htdocs\termos`, usar:
> `http://localhost/termos/front/index.html`.
> La URL de la API se detecta automáticamente como la carpeta `../api/`.

## Documentación

| Archivo | Contenido |
|---|---|
| [`DOCUMENTACION.md`](DOCUMENTACION.md) | Funcionalidades, endpoints, decisiones, pruebas y checklist del enunciado |
| [`CONSIDERACIONES.txt`](CONSIDERACIONES.txt) | Resumen en texto plano para la entrega |
| [`ERRORES_DETECTADOS.md`](ERRORES_DETECTADOS.md) | Auditoría del código heredado y de la API |
| [`CHEATSHEET.md`](CHEATSHEET.md) | Resumen de HTML, CSS, Bootstrap, JS, AJAX y PHP + plan de 3 h 15 min |

## Estructura

```text
front/
├─ index.html              # Login
├─ panel.html              # Panel protegido
├─ css/styles.css          # Tema y responsive
├─ js/config.js            # API y claves de sesión
├─ js/app.js               # Utilidades compartidas
├─ js/login.js             # Lógica del login
├─ js/metadatos.js         # ExifReader / IPTC / XMP
├─ js/panel.js             # Termos y personas
├─ lib/                    # Bootstrap y ExifReader locales
└─ _legacy/                # Código original auditado
```

## Nota

La carpeta `../api/` **no fue modificada**. Las adaptaciones a los defectos de la API se resolvieron desde el front y se documentan en `ERRORES_DETECTADOS.md`.
