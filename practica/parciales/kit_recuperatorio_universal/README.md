# KIT UNIVERSAL – Recuperatorio (basado en Prueba1)

Este kit está organizado para reproducir el **tipo de parcial de Prueba1 con otro dominio**.
No es un proyecto que funcione sin adaptación: primero se cambian nombres de entidad/campos/endpoints y se comprueba el contrato real de la API.

## Funcionalidades incluidas

1. Login contra API y guardado del token en `sessionStorage`.
2. Verificación de token antes de entrar al panel.
3. Navegación por secciones.
4. Listado dinámico de la entidad principal.
5. ABM genérico: listar, crear, editar y borrar.
6. Búsqueda de persona/registro por DNI o código mediante búsqueda binaria (si el enunciado exige IDs consecutivos y ordenados).
7. Carga de una entidad con imagen mediante `FormData`.
8. Lectura opcional de metadatos IPTC con ExifReader.
9. Modal de detalle Bootstrap.
10. Endpoints PHP de ejemplo y conexión MySQL con PDO.

## Puesta en marcha (estado actual)

1. Importar `SQL-PLANTILLA.sql` (crea la base `parcial` con tablas y datos de prueba).
2. Abrir `http://localhost/facultad/POW/practica/parciales/kit_recuperatorio_universal/`.
3. Usuario de prueba: **admin / admin123**.
4. Los endpoints funcionales están en `api/`; los de `php/ejemplos/` siguen siendo plantillas para adaptar en el examen.

## Cómo usarlo en el examen

### Paso 1 – Traducir el dominio
Ejemplos:
- Termos → Libros: `termo` pasa a `libro`, `tituloTermo` a `tituloLibro`, `personas` podría pasar a `autores`.
- Termos → Mascotas: `termo` pasa a `mascota`, `personas` podría pasar a `dueños`.
- Termos → Instrumentos: `termo` pasa a `instrumento`.

No cambies nombres al azar: usá exactamente los nombres de tablas, columnas, parámetros y claves JSON que entregue el profesor.

### Paso 2 – Configurar `js/config.js`
Modificar:
- `API_BASE`
- rutas de endpoints
- nombre de la entidad
- campos que se muestran
- nombres de campos enviados al PHP
- claves donde viene la lista y el registro en el JSON.

### Paso 3 – Revisar el HTML
Los `id` de los inputs y formularios deben coincidir con los usados por JS. Si cambiás un id, cambialo también en JS.

### Paso 4 – Adaptar el PHP
Los PHP de `php/ejemplos/` son plantillas PDO. Ajustar tabla, columnas, tipos, validaciones y nombres de parámetros. Si el profesor entrega una API ya hecha, adaptá el frontend al contrato de esa API; no dupliques endpoints innecesariamente.

### Paso 5 – Probar por partes
1. Login: verificar respuesta y token.
2. Verificación de token.
3. GET de listado.
4. POST de alta.
5. PUT/POST de edición según lo que acepte el servidor.
6. DELETE.
7. Upload.
8. Consola del navegador y pestaña Network.

## Importante sobre la búsqueda binaria
La búsqueda binaria solo funciona si el conjunto está ordenado por el criterio de búsqueda y la relación `id` ↔ posición es válida. En Prueba1 se consulta cantidad y luego registros por ID secuencial. Si el nuevo dominio no garantiza eso, no uses búsqueda binaria: usa el endpoint de búsqueda o un recorrido lineal.

## Importante sobre archivos
Al enviar `FormData`, NO agregues manualmente `Content-Type`: el navegador debe establecer el boundary. Ver referencia MDN: https://developer.mozilla.org/es/docs/Web/API/Fetch_API/Using_Fetch

## Estructura
- `index.html`: login.
- `panel.html`: panel y formularios.
- `js/config.js`: único lugar para adaptar rutas/campos.
- `js/api.js`: fetch reutilizable.
- `js/auth.js`: login/token/salida.
- `js/entidad.js`: listado y ABM.
- `js/busqueda-binaria.js`: búsqueda binaria configurable.
- `js/imagen.js`: carga de imagen y metadatos opcionales.
- `php/ejemplos/`: plantillas PHP.
- `SQL-PLANTILLA.sql`: estructura orientativa.
- `MAPA-DE-ADAPTACION.md`: qué cambiar al recibir otro dominio.
