# Mapa de adaptación en el examen

| Si el enunciado dice… | Cambiás en el kit |
|---|---|
| Producto / termo / libro / mascota | `ENTITY.label`, `ENTITY.plural`, `ENTITY.fields` |
| Nombre, descripción, precio, categoría | `ENTITY.fields` y formulario de `panel.html` |
| Listar registros | `ENDPOINTS.list` y `RESPONSE.listKey` |
| Registrar | `ENDPOINTS.create` y `ENTITY.payload` |
| Modificar | `ENDPOINTS.update` y `ENTITY.payload` |
| Eliminar | `ENDPOINTS.delete` |
| Imagen | `ENDPOINTS.upload`, `IMAGE.fileField` y campos |
| Login | `ENDPOINTS.login`, `AUTH.*` |
| Token | `ENDPOINTS.verify`, `AUTH.tokenKey` |
| Búsqueda por DNI/código | `SEARCH.*` y endpoint de cantidad/consulta |
| Detalle en modal | campos visibles en `ENTITY.fields` |

## Contrato de datos que tenés que identificar
Antes de programar, anotá:
1. URL exacta de cada endpoint.
2. Método HTTP: GET, POST, PUT o DELETE.
3. Parámetros GET o nombres de campos POST.
4. Si recibe `application/x-www-form-urlencoded`, JSON o `multipart/form-data`.
5. Forma exacta de la respuesta JSON.
6. Nombre exacto de la clave del token.
7. Nombre exacto de la clave de la lista/objeto.
8. Si el token va por query string, body o header.

No supongas que todas las APIs usan los mismos nombres.
