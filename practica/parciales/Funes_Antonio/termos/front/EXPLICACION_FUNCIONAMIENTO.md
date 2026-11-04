# Cómo funciona el front (`termos/front`)

Guía completa del funcionamiento del front: HTML, CSS, JavaScript, AJAX (fetch), Bootstrap y cómo se comunica con el back en PHP. Ejemplos tomados directamente del código del proyecto.

---

## 1. Visión general de la arquitectura

El proyecto sigue el patrón clásico **front (cliente) + API PHP (servidor) + MySQL**:

```text
Navegador                         Servidor (XAMPP)
┌──────────────────────┐          ┌──────────────────────────┐
│ index.html / panel.html │  fetch │ termos/api/*.php         │
│ css/styles.css          │ ─────► │  (leen $_REQUEST         │
│ js/*.js                 │  JSON  │   consultan MySQL        │
│ lib/bootstrap/          │ ◄───── │   responden JSON)        │
└──────────────────────┘          └──────────────────────────┘
```

- El front **nunca toca la base de datos directamente**: todo pasa por los endpoints PHP de `termos/api/`.
- Los PHP siempre responden **JSON** (con `echo json_encode(...)`) y `Content-Type: application/json`.
- La sesión no usa cookies del servidor: usa un **token** que la API genera en `login.php`, lo guarda en la base (`update usuarios set token=...`) y el front lo guarda en `sessionStorage` y lo envía en cada petición.

### Archivos del front

| Archivo | Rol |
|---|---|
| `index.html` | Pantalla de login |
| `panel.html` | Panel de administración (termos + personas) |
| `css/styles.css` | Estilos propios + personalización de Bootstrap |
| `js/config.js` | Configuración central: URL de la API y mapa de endpoints |
| `js/app.js` | Librería compartida: sesión, fetch, alertas, utilidades |
| `js/login.js` | Lógica exclusiva del login |
| `js/panel.js` | Lógica exclusiva del panel |
| `js/metadatos.js` | Lectura de metadatos IPTC/XMP de las imágenes (con ExifReader) |
| `lib/bootstrap/` | Bootstrap 5 local (CSS + JS bundle) |
| `lib/ExifReader-main/` | Librería para leer metadatos de imágenes |
| `_legacy/` | Versiones originales/simple del parcial (backup) |

### Orden de carga de los scripts

En `index.html`:

```html
<script src="js/config.js"></script>   <!-- 1: configura API_BASE y API -->
<script src="js/app.js"></script>      <!-- 2: utilidades que usan API -->
<script src="js/login.js"></script>    <!-- 3: lógica de la página -->
```

En `panel.html`:

```html
<script src="lib/ExifReader-main/dist/exif-reader.js"></script> <!-- 1: librería global ExifReader -->
<script src="lib/bootstrap/js/bootstrap.bundle.min.js"></script> <!-- 2: modales y menú -->
<script src="js/config.js"></script>      <!-- 3: rutas de la API -->
<script src="js/app.js"></script>         <!-- 4: utilidades -->
<script src="js/metadatos.js"></script>   <!-- 5: usa ExifReader -->
<script src="js/panel.js"></script>       <!-- 6: lógica de la página -->
```

**El orden importa**: `config.js` crea las constantes `API_BASE` y `API` que después consumen `app.js`, `login.js` y `panel.js`. Si se invirtiera, los scripts fallarían por `API is not defined`.

---

## 2. HTML: estructura de cada página

### 2.1 `index.html` — Login

Es una página estática simple. Todo lo "vivo" lo hace JavaScript:

- `<form id="form-login" novalidate>`: el `novalidate` desactiva la validación nativa automática para que **el JS decida cuándo validar** (usa la API de validación de HTML5 a mano: `checkValidity()`).
- Campos con `required` + `.invalid-feedback`: Bootstrap muestra esos mensajes solo cuando el formulario tiene la clase `was-validated`.
- `id="login-alert"`: contenedor vacío donde `app.js` inserta alerts Bootstrap dinámicamente.
- Botón `type="submit"`: al hacer submit, `login.js` intercepta con `preventDefault()` (nunca se recarga la página).

```html
<form id="form-login" novalidate>
    <input type="text" id="usuario" class="form-control" required>
    <input type="password" id="password" class="form-control" required>
    <button type="submit" class="btn btn-success btn-lg w-100">Ingresar</button>
</form>
```

### 2.2 `panel.html` — Panel

Estructura por capas:

1. **Pantalla de verificación** (`#auth-loading`): spinner que se ve mientras JS comprueba el token con la API. Evita el "flash" de contenido protegido.
2. **Aplicación** (`#app` con `d-none`): navbar + main. Solo se muestra si `requireSession()` valida el token.
3. **Dos vistas dentro de un solo archivo** (SPA-lite):
   - `#vista-termos`: grid donde JS inyecta las tarjetas (`#grid-termos` está vacío en el HTML).
   - `#vista-personas`: formulario de búsqueda por DNI + alta/edición, oculto con `d-none` hasta que se busca.
4. **Modales**: `#modalVerTermo` (ver detalle) y `#modalTermo` (cargar termo nuevo, con `<form enctype="multipart/form-data">` para subir la imagen).

Concepto clave: **el HTML no contiene datos, solo "huecos" con `id` que JavaScript rellena**. Por ejemplo el grid de productos:

```html
<!-- Las tarjetas se generan desde panel.js -->
<div id="grid-termos" class="row g-4 product-grid"></div>
```

---

## 3. CSS: Bootstrap + hoja propia

Existen **dos capas de estilos** cargadas en este orden:

```html
<link rel="stylesheet" href="lib/bootstrap/css/bootstrap.min.css">  <!-- framework -->
<link rel="stylesheet" href="css/styles.css">                       <!-- personalización -->
```

Siempre va primero Bootstrap y después `styles.css`, para que las reglas propias **pisen** las del framework cuando coinciden.

### 3.1 Bootstrap local (no CDN)

Las librerías están dentro de `lib/` para que el front sea **autocontenido**: funciona sin internet. Se usan dos cosas de Bootstrap:

- **CSS**: grid responsivo (`container`, `row`, `col-12 col-md-6`), componentes (`navbar`, `card`, `modal`, `alert`, `btn`, `form-control`, `spinner-border`) y utilidades (`d-none`, `w-50`, `gap-2`, `text-danger`, `shadow-lg`).
- **JS** (`bootstrap.bundle.min.js`): incluye Popper y habilita los componentes interactivos **solo con atributos HTML**:

```html
<!-- Menú hamburguesa: funciona sin escribir una línea de JS propio -->
<button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#menuPrincipal">

<!-- Botón que abre el modal "Cargar termo" -->
<button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#modalTermo">
```

### 3.2 `styles.css`: variables CSS y overrides

El archivo está organizado en 8 secciones y arranca con **variables CSS**:

```css
:root {
  --color-primary: #203b32;
  --color-accent: #eebf55;
  --radius-md: 16px;
  --shadow-card: 0 3px 14px rgba(32, 59, 50, 0.06);
  ...
  /* Pisa variables nativas de Bootstrap */
  --bs-body-font-family: var(--font-base);
  --bs-body-bg: var(--color-background);
}
```

Truco importante: Bootstrap 5 define sus colores en variables `--bs-*`. Como el CSS propio **reescribe esas variables**, sin tocar `.btn-success`, `.card`, etc., todo el framework adopta la paleta del proyecto. El resto del archivo son componentes propios (login-card, producto-card, alert-tag, etc.) y media queries para responsive.

---

## 4. JavaScript: los tres módulos

### 4.1 `config.js` — la única fuente de rutas y sesión

Calcula `API_BASE` automáticamente según cómo se abra el front:

```js
const API_BASE = (() => {
  if (window.API_BASE_OVERRIDE) return ...;               // 1) override manual
  if (window.location.protocol === "file:") return "http://localhost/termos/api"; // 2) doble clic
  return new URL("../api/", window.location.href).href...; // 3) ruta relativa (caso normal)
})();
```

Luego define el **mapa de endpoints**:

```js
const API = {
  login:             `${API_BASE}/login.php`,
  verificaToken:     `${API_BASE}/verifica_token.php`,
  listarProductos:   `${API_BASE}/listar_productos.php`,
  registrarProducto: `${API_BASE}/registrar_productos.php`,
  personasCantidad:  `${API_BASE}/personas_cantidad.php`,
  personasListar:    `${API_BASE}/personas_listar.php`,
  personasGuardar:   `${API_BASE}/personas_guardar.php`,
  personasEditar:    `${API_BASE}/personas_guardar_editar.php`,
  ciudades:          `${API_BASE}/ciudades.php`,
  imagenes:          `${API_BASE}/imagenes`
};

const APP_STORAGE = { token: "termos_token", usuario: "termos_usuario" };
```

Ventajas: si el proyecto se mueve de carpeta, solo se ajusta `API_BASE`; y el resto del código nunca escribe URLs a mano (evita typos).

### 4.2 `app.js` — librería compartida (el "corazón" del AJAX)

Es un módulo con IIFE que expone un objeto global `App`. Responsabilidades:

**a) Sesión con `sessionStorage`** (se borra al cerrar la pestaña):

```js
App.saveSession(token, usuario);   // guarda token + usuario (JSON)
App.getToken();                    // lee el token
App.clearSession();                // logout
```

**b) AJAX con la Fetch API.** Hoy en día el "AJAX" se hace con `fetch()` (mismo concepto que `XMLHttpRequest`: peticiones HTTP sin recargar la página, pero con promesas). `app.js` lo encapsula en tres funciones:

```js
// GET con parámetros en la query string
async function getJSON(url, params) {
  const response = await fetch(withParams(url, params), {
    method: "GET",
    headers: { "Accept": "application/json" },
    cache: "no-store"
  });
  return leerRespuesta(response);
}

// POST con FormData (archivos: subir imagen del termo)
async function postForm(url, formData, params) { ... }

// POST urlencoded (campos simples: login, personas)
// porque los PHP leen extract($_REQUEST), que acepta ambos
async function postUrlEncoded(url, valores, params) { ... }
```

Helpers clave:

- `withParams(url, params)`: arma la query string con `URL.searchParams`, que **encodea automáticamente** los valores (espacios, `&`, acentos...). Se usa para mandar el `token` en todos los endpoints que lo exigen:

```js
await App.getJSON(API.listarProductos, { token: token });
// -> http://.../listar_productos.php?token=abc123...
```

- `leerRespuesta(response)`: lee el texto, lo parsea a JSON y, si el HTTP no es ok, lanza un error con el mensaje del PHP (maneja los typos de la API: `menssage`, `mensaje`, `message`).
- `parseJson(texto)`: **tolerante a ruido** — si el PHP imprimió un warning antes del JSON, recorta desde el primer `{` hasta el último `}` y reintenta.

**c) Seguridad: `escapeHtml()`**. Siempre que un dato que viene de la API se inserta con `innerHTML`, se escapa antes para evitar **XSS**:

```js
function escapeHtml(valor) {
  return String(valor ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ... }[c]));
}
```

**d) Control de sesión contra la API.** Antes de mostrar el panel, el front pregunta a `verifica_token.php`:

```js
async function requireSession() {
  const token = App.getToken();
  if (!token) { redirectToLogin(); return null; }   // ni siquiera hay token
  const valido = await verifyToken(token);          // GET verifica_token.php?token=...
  if (!valido) { clearSession(); redirectToLogin(); return null; }
  return token;
}
```

**e) UI.** `showAlert(contenedor, mensaje, tipo)` inserta alerts Bootstrap dinámicos:

```js
contenedor.innerHTML = `
  <div class="alert alert-${tipo}">
    <strong class="alert-tag">OK</strong>
    <span>${escapeHtml(mensaje)}</span>
  </div>`;
```

y `setLoading(boton, cargando)` convierte un botón en spinner (componente `spinner-border` de Bootstrap) mientras se espera la respuesta.

### 4.3 `login.js` — flujo completo del login

Al cargar `index.html` (`DOMContentLoaded`):

1. **¿Ya hay sesión?** `comprobarSesionExistente()`: si hay token en `sessionStorage` y `verifica_token.php` dice que es válido → redirige directo a `panel.html` con `window.location.replace()`.
2. **Toggle mostrar/ocultar contraseña** (cambia el campo entre `type="password"` y `type="text"`).
3. **Submit**:

```js
formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();                        // no recargar la página
  if (!formulario.checkValidity()) {              // validación HTML5 a mano
    formulario.classList.add("was-validated");    // Bootstrap muestra errores
    return;
  }

  App.setLoading(boton, true, "Ingresando...");   // botón en modo spinner

  const datos = await App.postUrlEncoded(API.login, {   // AJAX POST -> login.php
    usuario: usuario,
    password: password
  });

  if (datos.status !== 200 || !datos.token) throw new Error(...); // credenciales malas

  App.saveSession(datos.token, { nombre: datos.nombre, ... });    // guardar token
  window.location.replace("panel.html");                          // entrar al panel
});
```

Respuesta esperada de `login.php` (JSON):

```json
{ "status": 200, "token": "a1b2c3...", "nombre": "...", "apellido": "...", "id_usurio": 3 }
```

Como la API usa `extract($_REQUEST)`, el POST se hace con `application/x-www-form-urlencoded` y el PHP recibe `$_REQUEST['usuario']` y `$_REQUEST['password']`.

---

## 5. `panel.js` — el panel por dentro

En `DOMContentLoaded` corre una secuencia de arranque:

```js
token = await App.requireSession();   // 1) validar token (si no: redirige a index.html)
mostrarUsuario();                     // 2) nombre en la navbar
configurarNavegacion();               // 3) botones Termos / Personas
configurarLogout();                   // 4) cerrar sesión (con confirm)
configurarListado();                  // 5) listeners del grid de termos
configurarFormularioTermo();          // 6) alta de termos
configurarPersonas();                 // 7) búsqueda/ABM de personas

// recién ahora se muestra la app y se piden los datos
document.getElementById("auth-loading").classList.add("d-none");
document.getElementById("app").classList.remove("d-none");
await Promise.all([ cargarTermos(), cargarCiudades() ]);  // 8) dos fetch en paralelo
```

### 5.1 Listado de termos (GET) y render

```js
const datos = await App.getJSON(API.listarProductos, { token: token });
```

`listar_productos.php` verifica el token, hace `select * from productos` y responde `{ status: 200, data: [ {...}, ... ] }`.

El render construye las tarjetas como **HTML en texto (template strings)** y las inyecta en el grid, escapando **cada campo**:

```js
grid.innerHTML = productos.map(renderizarProducto).join("");
```

Detalles relevantes:

- **Orden en el cliente**: la API no ordena, así que el front lo hace con `localeCompare(..., "es")` por título.
- **Imágenes**: los archivos quedan en `api/imagenes/`; se arma la URL con `App.imageUrl(nombre)` → `api/imagenes/<encodeURIComponent(nombre)>`.
- **Sin recargar la página**: después del render la app sigue viva.
- **Delegación de eventos**: en vez de un listener por tarjeta, hay **uno** en el grid:

```js
document.getElementById("grid-termos").addEventListener("click", (evento) => {
  const boton = evento.target.closest("[data-ver]");
  if (!boton) return;
  abrirModalProducto(boton.dataset.ver);   // abre modal #modalVerTermo
});
```

### 5.2 Cargar un termo nuevo (POST multipart con imagen)

Modal `#modalTermo`, flow completo:

1. Al elegir archivo (`change` del input), lee los **metadatos IPTC/XMP** con `Metadatos.leer(imagen)` (ExifReader) y **autocompleta** los 5 campos de texto. También:
   - valida que sea imagen y ≤ 8 MB,
   - **detecta duplicados** comparando el nombre original contra los terms ya cargados (la API guarda `timestamp-nombre.jpg`),
   - Genera un **preview local** con `URL.createObjectURL(imagen)` (sin subir nada todavía).
2. Al enviar:

```js
const datos = new FormData();
datos.append("titulo", ...);
datos.append("imagen", imagen);                        // el archivo real
const respuesta = await App.postForm(API.registrarProducto, datos, { token: token });
```

Aquí el AJAX envía `multipart/form-data` (igual que un `<form>` con `enctype="multipart/form-data"`): el PHP recibe los campos en `$_REQUEST`/`$_POST` y el archivo en `$_FILES`, lo mueve a `api/imagenes/` con prefijo `time()-` y hace el INSERT. El token va por **query string** (`postForm` tercer parámetro → `withParams`).

Después de guardar: cierra el modal, muestra alert de éxito y **recarga el listado** con `await cargarTermos()`.

### 5.3 Personas: búsqueda binaria por DNI

Es el algoritmo pedido por el enunciado, implementado **en el front** sobre tres endpoints:

```text
1. personas_cantidad.php   → { status:200, cantidad: 50 }   (techo de la búsqueda)
2. personas_listar.php?id=N → { status:200, persona: [ {...} ] }  (fila N, ordenada por DNI)
3. repetir con el punto medio hasta encontrar el DNI...
```

```js
let inicio = 1, fin = cantidad;
while (inicio <= fin) {
  const medio = Math.floor((inicio + fin) / 2);
  const respuesta = await App.getJSON(API.personasListar, { id: medio });
  const dniMedio = Number(respuesta.persona[0].dni);
  if (dniMedio === dniBuscado) return persona;
  if (dniMedio < dniBuscado) inicio = medio + 1;
  else fin = medio - 1;
}
return null;  // no existe -> se abre el formulario de ALTA con ese DNI
```

- Si la persona **existe** → modo "editar": formulario precargado, DNI deshabilitado, se envía a `personas_guardar_editar.php` con el `id` en la query.
- Si **no existe** → modo "crear": formulario vacío (con el DNI buscado fijo), se envía a `personas_guardar.php`.
- Las **ciudades** se cargan una sola vez desde `ciudades.php` y se ordenan alfabéticamente en el cliente.

### 5.4 Detalle de robustez frente a la API

El front está lleno de defensas conscientes contra los comportamientos del PHP del parcial:

- La API devuelve **HTTP 200 con `status:500` en el body** (el código de error va en el JSON, no en el HTTP). Por eso `leerRespuesta` mira ambos.
- La API tiene typos (`menssage`, `tpken_presente`, `id_usurio`): el front acepta ambas grafías.
- Tabla vacía → la API devuelve 500 "algo malo paso": se trata como **estado vacío**, no error.
- El UPDATE de personas devuelve `status:505` si no cambió ninguna fila: se acepta como éxito.
- Endpoints de personas no escapan valores → el front escapa `'` y `\` manualmente (`escaparParaSql`) para que nombres como `O'Brien` no rompan el SQL.

---

## 6. El "AJAX" en resumen

AJAX = hacer peticiones HTTP desde JavaScript **sin recargar la página**. En este proyecto:

| Operación | Función | Tipo de envío |
|---|---|---|
| Login | `App.postUrlEncoded(API.login, {...})` | POST `x-www-form-urlencoded` |
| Verificar token | `App.getJSON(API.verificaToken, { token })` | GET con query string |
| Listar termos | `App.getJSON(API.listarProductos, { token })` | GET con query string |
| Registrar termo | `App.postForm(API.registrarProducto, formData, { token })` | POST `multipart/form-data` |
| Buscar persona (binaria) | `App.getJSON(API.personasListar, { id })` | GET, muchos request |
| Alta/edición persona | `App.postUrlEncoded(...)` | POST `x-www-form-urlencoded` |
| Ciudades | `App.getJSON(API.ciudades)` | GET sin parámetros |

Todas devuelven JSON y se procesan en promesas (`async/await`), con el manejo de errores centralizado en `leerRespuesta` y feedback visual con `setLoading` / `showAlert`.

Los PHP admiten esto por los headers CORS que agregan al inicio:

```php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
extract($_REQUEST);   // convierte cada parámetro recibido a variable ($token, $usuario, ...)
```

---

## 7. Resumen de un ciclo completo (ejemplo: loguearse y ver termos)

1. Usuario abre `index.html` → el navegador carga Bootstrap (CSS), `styles.css` y los tres JS.
2. `login.js` verifica si ya hay sesión válida; si no, espera el submit.
3. El usuario envía el formulario → JS valida → **fetch POST** a `api/login.php` con `usuario` y `password`.
4. El PHP consulta MySQL, genera `token = bin2hex(random_bytes(32))`, lo guarda en la tabla `usuarios` y responde JSON.
5. El JS guarda token y datos del usuario en `sessionStorage` y redirige a `panel.html`.
6. `panel.js` llama a `requireSession()` → **fetch GET** a `verifica_token.php` → si responde ok, muestra la app.
7. **En paralelo**: GET `listar_productos.php?token=...` y GET `ciudades.php`.
8. Con los datos, JS ordena, escapa y renderiza las tarjetas en `#grid-termos` y el `<select>` de ciudades.
9. El usuario navega, amplía imágenes (modales Bootstrap), carga termos (POST FormData + ExifReader) o busca personas (búsqueda binaria con múltiples GET).
10. "Cerrar sesión" → `confirm()` → `clearSession()` → redirige a `index.html`.
