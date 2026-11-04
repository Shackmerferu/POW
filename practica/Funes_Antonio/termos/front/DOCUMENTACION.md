# Documentación del front — Parcial 2026

**Materia:** Programación Orientada a la Web  
**Trabajo:** Primer parcial — parte práctica (29/10/2026)  
**Alumno:** Funes, Luis Antonio  
**Carrera:** Ingeniería en Sistemas  
**Tecnologías:** HTML5, CSS3, Bootstrap 5, JavaScript (ES6+), Fetch API, ExifReader, PHP/MySQL (API provista)  
**Carpeta entregada:** `termos/front`

---

## 1. Objetivo y alcance

El objetivo fue construir el **front completo y funcional** de un sistema de administración de termos y personas, respetando los requerimientos del enunciado y sin modificar los archivos de la API.

El front cubre los tres bloques pedidos:

1. **Logueo y control de sesión** (`index.html` + `panel.html`).
2. **Listado y carga de termos** con metadatos IPTC/XMP.
3. **Consulta, alta y edición de personas** mediante búsqueda binaria por DNI.

Además se agregó:

- Diseño responsive propio sobre Bootstrap.
- Validación de formularios en el navegador.
- Mensajes de éxito y error accesibles.
- Documento de auditoría del código heredado (`ERRORES_DETECTADOS.md`).
- Cheatsheet de estudio y resolución (`CHEATSHEET.md`).

> **La API no fue modificada.** Todas las adaptaciones necesarias se resolvieron desde el front. Los archivos originales del intento previo se conservaron en `front/_legacy/` únicamente como evidencia para la auditoría.

---

## 2. Cómo ejecutar el proyecto

### Requisitos

- XAMPP (Apache + MySQL/MariaDB) o equivalente.
- PHP 8.x.
- Base de datos `termos` creada e importada desde `termos/termos.sql`.
- Navegador moderno con JavaScript habilitado.

### Pasos

1. Iniciar **Apache** y **MySQL** desde el panel de XAMPP.
2. Verificar que el proyecto esté en:
   ```
   C:\xampp\htdocs\facultad\POW\POW\practica\Funes_Antonio\termos
   ```
3. Importar `termos.sql` en phpMyAdmin si la base no existe.
4. Abrir:
   ```
   http://localhost/facultad/POW/POW/practica/Funes_Antonio/termos/front/index.html
   ```
5. Ingresar con:
   - **Usuario:** `gaston`
   - **Contraseña:** `12345`

> Si el proyecto se copia a `C:\xampp\htdocs\termos`, la URL queda:
> `http://localhost/termos/front/index.html`.
> El front detecta automáticamente la carpeta `api` hermana.

### Configuración de la URL de la API

Toda la configuración está centralizada en `front/js/config.js`.

```js
const API_BASE = (() => {
  if (window.API_BASE_OVERRIDE) {
    return String(window.API_BASE_OVERRIDE).replace(/\/+$/, "");
  }

  if (window.location.protocol === "file:") {
    return "http://localhost/termos/api";
  }

  return new URL("../api/", window.location.href).href.replace(/\/+$/, "");
})();
```

Orden de resolución:

1. `window.API_BASE_OVERRIDE` si se define antes de cargar `config.js`.
2. `http://localhost/termos/api` si se abre con doble clic (`file://`).
3. Ruta relativa `../api/` si se sirve desde Apache.

Ejemplo de override para otro host:

```html
<script>
  window.API_BASE_OVERRIDE = "http://localhost/otra-ruta/api";
</script>
<script src="js/config.js"></script>
```

---

## 3. Estructura de archivos

```text
termos/
├─ api/                         # API original (NO modificada)
├─ recursos/                    # Imágenes, Bootstrap y mockups provistos
├─ termos.sql                   # Esquema y datos de la base
└─ front/
   ├─ index.html                # Login
   ├─ panel.html                # Panel protegido: termos y personas
   ├─ DOCUMENTACION.md          # Este documento
   ├─ ERRORES_DETECTADOS.md     # Auditoría del código heredado y de la API
   ├─ CHEATSHEET.md             # Resumen teórico-práctico para el examen
   ├─ css/
   │  └─ styles.css             # Tema visual, layout y responsive
   ├─ js/
   │  ├─ config.js              # URL de la API, endpoints y claves de sesión
   │  ├─ app.js                 # Utilidades compartidas: fetch, sesión, escape, alertas
   │  ├─ login.js               # Lógica de index.html
   │  ├─ metadatos.js           # Lectura IPTC/XMP con ExifReader
   │  └─ panel.js               # Listado, carga de termos y CRUD de personas
   ├─ lib/
   │  ├─ bootstrap/             # Bootstrap 5 local (CSS y bundle JS)
   │  ├─ ExifReader-main/       # ExifReader local
   │  └─ metadatos.html         # Ejemplo provisto por la cátedra
   └─ _legacy/                  # Código original del intento previo (solo auditoría)
      ├─ index.original.html
      ├─ panel.original.html
      └─ app.original.js
```

### Orden de carga de scripts

`index.html`:

```html
<script src="js/config.js"></script>
<script src="js/app.js"></script>
<script src="js/login.js"></script>
```

`panel.html`:

```html
<script src="lib/ExifReader-main/dist/exif-reader.js"></script>
<script src="lib/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="js/config.js"></script>
<script src="js/app.js"></script>
<script src="js/metadatos.js"></script>
<script src="js/panel.js"></script>
```

El orden importa: `config.js` define `API_BASE`, `API` y `APP_STORAGE`; `app.js` usa esas constantes; las páginas usan `App`. ExifReader debe existir antes de `metadatos.js`, y Bootstrap antes de abrir modales.

---

## 4. Funcionalidades implementadas

### 4.1 Login (`index.html`)

- Formulario con **usuario** y **contraseña**, ambos requeridos.
- Botón **Mostrar / Ocultar** contraseña.
- Validación del navegador con `checkValidity()` y clase `was-validated`.
- Envío **POST** `application/x-www-form-urlencoded` a `login.php`.
  - Parámetros correctos: `usuario` y `password`.
  - Se evita mandar la contraseña por URL.
- Si la respuesta tiene `status === 200` y `token`, guarda:
  - `sessionStorage.termos_token`
  - `sessionStorage.termos_usuario` (nombre, apellido e id)
- Redirige a `panel.html` con `location.replace()`.
- Si ya existe una sesión válida al abrir `index.html`, redirige directamente al panel.
- Si el token guardado ya no es válido, limpia la sesión y muestra el formulario.
- Los errores se muestran en una alerta Bootstrap dentro de la página, no con `alert()`.

### 4.2 Protección del panel (`panel.html`)

- El panel arranca oculto (`d-none`) y muestra un spinner de verificación.
- `App.requireSession()`:
  1. Lee el token de `sessionStorage`.
  2. Si no existe, redirige a `index.html`.
  3. Si existe, lo valida contra `verifica_token.php`.
  4. Si no es válido, limpia la sesión y redirige.
- Solo después de validar se muestra la aplicación.
- El nombre del usuario logueado se muestra en la barra de navegación.
- **Cerrar sesión** pide confirmación con `window.confirm`, limpia `sessionStorage` y vuelve al login.
- Navegación interna entre las vistas **Termos** y **Personas** sin recargar la página.
- En móvil, el menú se cierra automáticamente al elegir una opción.

### 4.3 Listado de termos

- Obtiene los productos desde `listar_productos.php?token=...`.
- **Ordena en el front por `titulo`** con `localeCompare(..., "es", { sensitivity: "base" })`, porque la API no ordena.
- Renderiza tarjetas responsive:
  - `col-12 col-sm-6 col-xl-4`
  - Título del producto en negrita.
  - Descripción corta.
  - Botón **Ver detalle**.
- Cada imagen incluye:
  - `src` desde `API.imagenes/<archivo>` con `encodeURIComponent`.
  - `alt` desde `texto_alternativo`.
  - `title` desde `titulo_imagen`.
  - `aria-description` desde `descripcion_larga`.
  - `loading="lazy"`.
- La imagen está dentro de un `<button>` para que sea accesible por teclado.
- Al hacer clic en la imagen o en **Ver detalle** se abre un modal Bootstrap con:
  - Título del producto arriba.
  - Imagen ampliada con `alt`, `title` y `aria-description`.
  - Descripción larga.
- Si no hay productos, se muestra un estado vacío claro.
- Si la API devuelve el error de tabla vacía (`"algo malo paso"`), se interpreta como listado vacío, no como falla.
- Si el token fue invalidado, se limpia la sesión y se redirige al login.

### 4.4 Carga de un termo nuevo

- Modal con formulario `multipart/form-data`.
- El **primer campo es la imagen**.
- Al seleccionar una imagen:
  - Se valida que sea de tipo `image/*`.
  - Se limita el tamaño a 8 MB.
  - Se muestra una vista previa con `URL.createObjectURL()`.
  - Se leen los metadatos con **ExifReader** y se autocompletan:
    - `titulo`
    - `titulo_imagen`
    - `descripcion`
    - `descripcion_larga`
    - `texto_alternativo`
  - Se avisa si faltan metadatos para que el usuario complete a mano.
- Mapeo de metadatos implementado en `metadatos.js`:

  | Campo del formulario | Orden de búsqueda en ExifReader |
  |---|---|
  | `titulo` | `Headline`, `title`, `Object Name`, `ImageDescription` |
  | `titulo_imagen` | `title`, `Headline`, `Object Name`, `ImageDescription` |
  | `descripcion` | `Caption/Abstract`, `description`, `ImageDescription` |
  | `descripcion_larga` | `ExtDescrAccessibility`, `description`, `Caption/Abstract` |
  | `texto_alternativo` | `AltTextAccessibility`, `Headline`, `title` |

- Todos los campos son requeridos.
- El POST incluye el token en la query string y el archivo en `FormData`.
- Al guardar correctamente:
  - Se cierra el modal.
  - Se muestra la alerta **“El termo se guardó correctamente.”**
  - Se recarga el listado y el nuevo termo aparece ordenado.
- Al cerrar o cancelar el modal se limpia el formulario y se libera la URL de la vista previa.

### 4.5 Personas: consulta por DNI con búsqueda binaria

- Campo numérico con rango **3.000.000 a 50.000.000**.
- El front no puede consultar por DNI directamente, así que implementa búsqueda binaria:

```text
1. GET personas_cantidad.php  -> cantidad N
2. inicio = 1, fin = N
3. Mientras inicio <= fin:
     medio = floor((inicio + fin) / 2)
     GET personas_listar.php?id=medio
     comparar persona.dni con el DNI buscado
     si es menor -> inicio = medio + 1
     si es mayor -> fin = medio - 1
     si es igual -> encontrada
4. Si no se encuentra -> null
```

- La API reindexa los IDs de 1 a N en cada consulta, por eso la búsqueda es válida.
- La cantidad de peticiones es logarítmica (`O(log n)`), no lineal.
- Si el DNI existe, se abre el formulario en modo **edición** con los datos precargados.
- Si no existe, se abre el formulario en modo **alta** con el DNI precargado.

### 4.6 Alta de persona

- Formulario con todos los campos requeridos:
  - DNI, nombre, apellido, dirección, teléfono, ciudad, email.
  - Provincia fija **La Pampa** con valor `5`, deshabilitada.
- El DNI se precarga desde la búsqueda y es editable en el alta.
- Las ciudades se obtienen de `ciudades.php` y se ordenan **ascendentemente** en el front por `nombre_ciudad`.
- El `value` de cada opción es el `id` de la localidad.
- Al guardar correctamente se **reemplaza el formulario** por:

  > **“La persona XXX YYY fue dada de alta con éxito.”**

- El botón **Consultar otro DNI** vuelve al estado inicial.

### 4.7 Edición de persona

- El DNI se muestra precargado y **deshabilitado** (no se puede modificar).
- La ciudad de la persona se selecciona automáticamente en el `<select>`.
- Si la ciudad no estuviera en el listado, se agrega una opción para no perder el valor.
- El formulario se envía a `personas_guardar_editar.php?id=...`.
- La API devuelve `status: 505` cuando el `UPDATE` no modifica filas (por ejemplo, si se guarda sin cambios). El front lo trata como **éxito**, porque para el usuario la operación es correcta.
- Al actualizar se reemplaza el formulario por:

  > **“Los datos de XXX YYY fueron actualizados.”**

### 4.8 Escape de datos y seguridad del front

- Todo texto que se inserta con `innerHTML` pasa por `App.escapeHtml()` para evitar XSS.
- Los datos que se muestran con `textContent` no necesitan escape.
- La API de personas **no escapa** los valores recibidos y la de productos tiene un error con `descripcion`. Para evitar romper el SQL con apóstrofos, el front aplica:

```js
function escaparParaSql(texto) {
  return String(texto ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'");
}
```

- Se probó con `O'Brien` y `L'termo` y los datos se guardaron y mostraron correctamente.
- **Aclaración:** esto es un parche de compatibilidad. La solución correcta es usar consultas preparadas en la API. Se documenta en `ERRORES_DETECTADOS.md`.

### 4.9 Accesibilidad y responsive

- `lang="es"`, `meta viewport`, jerarquía de títulos y landmarks (`header`, `main`, `footer`).
- Todos los campos tienen `<label for>`.
- Mensajes con `aria-live="polite"` y `role="alert"` / `role="status"`.
- Botones con `aria-label` cuando solo muestran un ícono o una imagen.
- Modal con `aria-labelledby`, `aria-hidden` y cierre por teclado.
- Navegación por teclado en tarjetas y formularios.
- Grid de Bootstrap con breakpoints `sm`, `md`, `lg`, `xl`.
- Navbar colapsable en pantallas chicas.
- Estilos propios en `css/styles.css` con variables CSS, foco visible y reducción de movimiento.

---

## 5. Endpoints utilizados

| Endpoint | Método | Parámetros | Uso en el front |
|---|---|---|---|
| `login.php` | POST | `usuario`, `password` | Iniciar sesión y obtener token |
| `verifica_token.php` | GET | `token` | Validar sesión al entrar al panel |
| `listar_productos.php` | GET | `token` | Listar termos |
| `registrar_productos.php` | POST multipart | `token` + `titulo`, `titulo_imagen`, `descripcion`, `descripcion_larga`, `texto_alternativo`, `imagen` | Cargar un termo |
| `personas_cantidad.php` | GET | — | Obtener cantidad de personas para la búsqueda binaria |
| `personas_listar.php` | GET | `id` | Consultar una persona por ID |
| `ciudades.php` | GET | — | Cargar localidades de La Pampa |
| `personas_guardar.php` | POST | `dni`, `nombre`, `apellido`, `direccion`, `ciudad`, `provincia`, `email`, `telefono` | Alta de persona |
| `personas_guardar_editar.php` | POST | `id`, `nombre`, `apellido`, `direccion`, `ciudad`, `provincia`, `email`, `telefono` | Edición de persona |
| `api/imagenes/<archivo>` | GET | — | Mostrar imágenes de los termos |

### Formato de respuesta

La API responde siempre con HTTP 200 y un campo `status` interno:

```json
{ "status": 200, "data": [ ... ] }
```

```json
{ "status": 500, "menssage": "Desautorizado" }
```

Por eso el front revisa `datos.status`, no solo `response.ok`. También acepta los errores con el typo `menssage` y con `mensaje`.

---

## 6. Decisiones de implementación y adaptaciones a la API

| Situación de la API | Decisión en el front |
|---|---|
| Login espera `usuario` y `password`, no `user`/`pass`. | Se envían los nombres correctos por POST. |
| `login.php` devuelve `id_usurio` (typo). | Se acepta `id_usurio` y, por compatibilidad, `id_usuario`. |
| `verifica_token.php` devuelve `tpken_presente` (typo). | Se aceptan `tpken_presente` y `token_presente`. |
| La API usa `status` interno y siempre HTTP 200. | Se valida `datos.status` además de `response.ok`. |
| Los errores usan `menssage` (typo). | Se prueban `menssage`, `mensaje` y `message`. |
| `listar_productos.php` no ordena. | Ordenamiento por `titulo` en el front. |
| Tabla de productos vacía devuelve `status: 500` con `"algo malo paso"`. | Se interpreta como listado vacío y se muestra un estado vacío. |
| Tabla de personas vacía devuelve `status: 500` en `personas_cantidad.php`. | Se interpreta como cantidad 0 y se ofrece el alta para cualquier DNI. |
| Token inválido devuelve `status: 500` con `"Desautorizado"`. | Se limpia la sesión y se redirige al login. |
| `registrar_productos.php` calcula `$descrpicion` pero inserta `$descripcion` sin escapar. | Se escapa la descripción en el front con `escaparParaSql()`. |
| Los endpoints de personas no escapan ningún campo. | Se escapan nombre, apellido, dirección, email y teléfono en el front. |
| `personas_guardar_editar.php` devuelve `505` si no hubo cambios. | Se acepta `200` y `505` como éxito. |
| `personas_cantidad.php` y `personas_listar.php` reindexan los IDs. | La búsqueda binaria usa el rango 1..cantidad devuelto por la API. |
| `ciudades.php` no ordena. | Ordenamiento ascendente por `nombre_ciudad` en el front. |
| No hay endpoint de logout. | Se elimina el token de `sessionStorage` y se redirige al login. |
| No hay endpoint para buscar por DNI. | Búsqueda binaria con `personas_cantidad.php` + `personas_listar.php?id=N`. |

---

## 7. Pruebas realizadas

Se ejecutó una prueba automatizada de extremo a extremo con Chrome headless y el protocolo CDP sobre la aplicación real y la base de datos real.

| # | Prueba | Resultado |
|---|---|---|
| 1 | Título y estructura de `index.html` | OK |
| 2 | Bootstrap local y CSS propio cargados | OK |
| 3 | Login incorrecto muestra alerta y no navega | OK |
| 4 | Login correcto con `gaston` / `12345` redirige al panel | OK |
| 5 | Token guardado en `sessionStorage` | OK |
| 6 | Panel permanece oculto hasta verificar el token | OK |
| 7 | Nombre del usuario visible en la barra | OK |
| 8 | Se renderizan las 2 tarjetas existentes | OK |
| 9 | Tarjetas ordenadas por título | OK |
| 10 | Imágenes apuntan a `/api/imagenes/` | OK |
| 11 | Imágenes con `alt`, `title` y `aria-description` | OK |
| 12 | Modal de detalle con título, imagen y descripción larga | OK |
| 13 | Navegación a la vista Personas | OK |
| 14 | Búsqueda binaria de DNI existente (`28901236`, id 37) | OK |
| 15 | DNI precargado y deshabilitado en edición | OK |
| 16 | Datos de la persona precargados | OK |
| 17 | Provincia La Pampa fija y deshabilitada | OK |
| 18 | Select de ciudades con 40 localidades + placeholder | OK |
| 19 | Edición sin cambios: se acepta `status: 505` y se muestra éxito | OK |
| 20 | DNI inexistente: formulario de alta con DNI precargado | OK |
| 21 | Autocompletado de título desde metadatos | OK |
| 22 | Autocompletado de título de imagen | OK |
| 23 | Autocompletado de descripción | OK |
| 24 | Autocompletado de descripción larga | OK |
| 25 | Autocompletado de texto alternativo | OK |
| 26 | Vista previa de la imagen | OK |
| 27 | Logout con confirmación y limpieza de sesión | OK |
| 28 | Acceso directo a `panel.html` sin token redirige a `index.html` | OK |
| 29 | Consola del navegador sin errores ni advertencias | OK |

### Pruebas adicionales

- Alta de persona con apóstrofos (`O'Brien`, `D'Angelo`) y termo con `L'termo`: los datos se guardaron y mostraron correctamente.
- Estado final de la base restaurado: **99 personas** y **2 productos**.
- Verificación de sintaxis de todos los archivos JS con `node --check`: sin errores.

---

## 8. Checklist contra el enunciado

| Requerimiento | Estado |
|---|---|
| `index.html` con formulario de usuario y password | ✅ |
| Login contra `login.php` con `usuario` y `password` | ✅ |
| Si ya está logueado, redirige a `panel.html` | ✅ |
| `panel.html` con menú, termos, personas y cerrar sesión | ✅ |
| Panel protegido: sin token redirige a `index.html` | ✅ |
| Token verificado contra la API, no solo presence en storage | ✅ |
| Punto extra: confirmación antes de cerrar sesión | ✅ |
| Listado de termos en tarjetas | ✅ |
| Ordenado por título en el front | ✅ |
| Imagen con `title` desde `titulo_imagen` | ✅ |
| Imagen con `alt` desde `texto_alternativo` | ✅ |
| `aria-description` desde `descripcion_larga` | ✅ |
| Click en imagen abre modal con título e imagen ampliada | ✅ |
| Botón para cargar nuevo termo | ✅ |
| Primer campo del alta: imagen | ✅ |
| Autocompletado de los 5 campos con metadatos IPTC/XMP | ✅ |
| POST multipart con token e imagen | ✅ |
| Vuelve al listado actualizado tras guardar | ✅ |
| Campo DNI con rango 3.000.000–50.000.000 | ✅ |
| Búsqueda binaria usando cantidad + listar por ID | ✅ |
| DNI inexistente: formulario de alta con DNI precargado | ✅ |
| DNI existente: formulario de edición precargado | ✅ |
| DNI deshabilitado en edición | ✅ |
| Punto extra: ciudad como `<select>` con IDs de la tabla | ✅ |
| Ciudades ordenadas ascendente | ✅ |
| Provincia deshabilitada, única opción La Pampa, valor 5 | ✅ |
| Todos los campos requeridos | ✅ |
| Mensaje exacto de alta reemplazando el formulario | ✅ |
| Mensaje exacto de actualización reemplazando el formulario | ✅ |
| Diseño responsive y estético | ✅ |
| Documento con consideraciones | ✅ (este archivo) |
| API sin modificar | ✅ |
| Auditoría del código heredado | ✅ (`ERRORES_DETECTADOS.md`) |

---

## 9. Limitaciones y notas

1. **La API no se modificó.** Varias decisiones del front existen solo para convivir con sus defectos (typos, falta de escape, errores con HTTP 200, reindexación de IDs).
2. **El escape SQL manual es un parche.** No reemplaza el uso de consultas preparadas. Se implementó porque el enunciado prohíbe tocar la API.
3. **El token viaja en la query string** en los endpoints protegidos porque así lo exige la API. En un sistema real se usaría un header `Authorization`.
4. **No hay logout real del lado del servidor.** El token sigue siendo válido en la base hasta que se genera uno nuevo con otro login. El front solo elimina su copia local.
5. **La búsqueda binaria depende de que la API mantenga los IDs consecutivos de 1 a N.** La API los reindexa en cada consulta, por lo que el supuesto se cumple.
6. **Las imágenes se guardan con el nombre original** y un prefijo `time()`. Si se suben dos archivos con el mismo nombre en el mismo segundo, podría haber colisión. Es una limitación de la API.
7. **El proyecto fue probado en Chrome.** Usa `fetch`, `FormData`, `URLSearchParams`, `URL.createObjectURL`, `sessionStorage`, `localeCompare` y `async/await`, disponibles en navegadores modernos.
8. **El diseño se basó en los lineamientos del PDF y en el mockup provisto.** No se modificaron los archivos de `recursos/`.

---

## 10. Archivos originales conservados

Para que la auditoría sea verificable, el código del intento previo se conserva sin cambios en:

- `front/_legacy/index.original.html`
- `front/_legacy/panel.original.html`
- `front/_legacy/app.original.js`

El detalle de cada error, su impacto y la corrección aplicada está en `front/ERRORES_DETECTADOS.md`.

---

## 11. Resumen de la entrega

- `index.html` y `panel.html` funcionales y responsive.
- `css/styles.css` con tema propio.
- `js/config.js`, `app.js`, `login.js`, `metadatos.js`, `panel.js`.
- Bootstrap y ExifReader locales, sin dependencia de CDN.
- Documentación, auditoría y cheatsheet incluidos.
- API intacta.
