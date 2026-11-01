# Cheatsheet — Desarrollo Web: HTML, CSS, Bootstrap, JavaScript, AJAX y PHP

Resumen teórico-práctico de desarrollo web front-end y back-end, útil para cualquier trabajo o parcial, no atado a un proyecto en particular.

> **Cómo usar este archivo:** estudiar primero las secciones 1 a 7. En un trabajo o examen, ir directo a las plantillas de los apéndices y al checklist de la sección 9.

---

## Índice

1. [HTML5](#1-html5)
2. [CSS3](#2-css3)
3. [Bootstrap 5](#3-bootstrap-5)
4. [JavaScript](#4-javascript)
5. [AJAX y Fetch](#5-ajax-y-fetch)
6. [PHP](#6-php)
7. [MySQL y SQL básico](#7-mysql-y-sql-básico)
8. [Errores comunes y debugging](#8-errores-comunes-y-debugging)
9. [Checklist de entrega](#9-checklist-de-entrega)

---

## 1. HTML5

### 1.1 Estructura mínima

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Descripción de la página">
  <title>Título de la página</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
  <script src="js/app.js"></script>
</body>
</html>
```

### 1.2 Etiquetas semánticas

| Etiqueta | Uso |
|---|---|
| `<header>` | Cabecera de página o sección |
| `<nav>` | Menú de navegación |
| `<main>` | Contenido principal (uno por página) |
| `<section>` | Sección temática |
| `<article>` | Contenido independiente (tarjeta, noticia) |
| `<aside>` | Contenido lateral |
| `<footer>` | Pie de página |
| `<h1>`…`<h6>` | Jerarquía de títulos |
| `<figure>` / `<figcaption>` | Imagen con leyenda |
| `<button>` | Acción |
| `<a>` | Navegación a otra URL |

### 1.3 Enlaces, botones e imágenes

```html
<!-- Enlace -->
<a href="panel.html" title="Ir al panel">Panel</a>

<!-- Botón de acción -->
<button type="button" id="btn-salir">Cerrar sesión</button>

<!-- Botón de envío -->
<button type="submit">Guardar</button>

<!-- Imagen accesible -->
<img src="foto.jpg"
     alt="Producto azul de acero inoxidable"
     title="Producto azul 1 litro"
     aria-description="Producto con tapa hermética y asa lateral."
     loading="lazy"
     width="400" height="300">
```

Reglas:

- `alt` describe la imagen. Si es decorativa: `alt=""`.
- `title` es información adicional, no reemplaza a `alt`.
- `aria-description` amplía la descripción para tecnologías asistivas.
- `loading="lazy"` mejora la carga.
- `width` y `height` evitan saltos de layout.

### 1.4 Formularios

```html
<form id="form-login" novalidate>
  <label for="usuario" class="form-label">Usuario</label>
  <input type="text" id="usuario" name="usuario"
         class="form-control" autocomplete="username" required>
  <div class="invalid-feedback">Ingresá el usuario.</div>

  <label for="password" class="form-label">Contraseña</label>
  <input type="password" id="password" name="password"
         class="form-control" autocomplete="current-password" required>

  <button type="submit" class="btn btn-success">Ingresar</button>
</form>
```

### 1.5 Tipos de input

| Tipo | Uso | Atributos útiles |
|---|---|---|
| `text` | Texto corto | `maxlength`, `pattern`, `placeholder` |
| `password` | Contraseña | `autocomplete="current-password"` |
| `email` | Email | Validación automática |
| `number` | Número | `min`, `max`, `step` |
| `tel` | Teléfono | `pattern` |
| `date` | Fecha | `min`, `max` |
| `file` | Archivo | `accept`, `multiple` |
| `hidden` | Dato oculto | `value` |
| `checkbox` | Booleano | `checked` |
| `radio` | Opción única | `name` igual para el grupo |
| `range` | Rango | `min`, `max`, `step` |
| `search` | Búsqueda | — |
| `url` | URL | Validación automática |
| `color` | Color | — |

### 1.6 `select`

```html
<label for="ciudad" class="form-label">Ciudad</label>
<select id="ciudad" name="ciudad" class="form-select" required>
  <option value="">Seleccioná una ciudad</option>
  <option value="1">Santa Rosa</option>
  <option value="2">General Pico</option>
</select>
```

- `value` es lo que se envía; el texto es lo que se ve.
- `selected` marca la opción inicial.
- `disabled` deshabilita el control **y no se envía**.
- `multiple` permite varias opciones.

### 1.7 `textarea`

```html
<label for="descripcion" class="form-label">Descripción</label>
<textarea id="descripcion" name="descripcion"
          class="form-control" rows="4" maxlength="500" required></textarea>
```

### 1.8 Atributos de validación

| Atributo | Efecto |
|---|---|
| `required` | Obligatorio |
| `minlength` / `maxlength` | Longitud |
| `min` / `max` | Rango numérico o de fecha |
| `step` | Incremento |
| `pattern` | Expresión regular |
| `type="email"` | Formato de email |
| `type="url"` | Formato de URL |
| `novalidate` | Desactiva la validación nativa del form (se valida con JS) |

### 1.9 Accesibilidad básica

- Un solo `<h1>` por página.
- `<label for="id">` para cada control.
- `aria-live="polite"` en contenedores de mensajes.
- `role="alert"` para errores importantes.
- `aria-label` en botones sin texto visible.
- `aria-current="page"` en la navegación activa.
- `aria-hidden="true"` en elementos decorativos.
- No usar `<div>` clickeable: usar `<button>`.
- Orden de tabulación lógico.
- Contraste suficiente.

### 1.10 Tablas

```html
<table class="table table-striped">
  <caption>Personas registradas</caption>
  <thead>
    <tr><th scope="col">DNI</th><th scope="col">Nombre</th></tr>
  </thead>
  <tbody>
    <tr><th scope="row">28901236</th><td>Ana Pérez</td></tr>
  </tbody>
</table>
```

### 1.11 Listas

```html
<ul>
  <li>Santa Rosa</li>
  <li>General Pico</li>
</ul>

<ol>
  <li>Primero</li>
  <li>Segundo</li>
</ol>
```

### 1.12 `data-*`

```html
<button data-ver="37" data-tipo="producto">Ver detalle</button>
```

```js
const boton = document.querySelector("[data-ver]");
console.log(boton.dataset.ver);   // "37"
console.log(boton.dataset.tipo);  // "producto"
```

### 1.13 Comentarios

```html
<!-- Comentario HTML -->
```

---

## 2. CSS3

### 2.1 Sintaxis

```css
selector {
  propiedad: valor;
}
```

### 2.2 Selectores

| Selector | Ejemplo | Selecciona |
|---|---|---|
| Etiqueta | `p` | Todos los `<p>` |
| Clase | `.card` | Elementos con `class="card"` |
| ID | `#app` | El elemento con `id="app"` |
| Universal | `*` | Todos |
| Descendiente | `.card img` | Imágenes dentro de `.card` |
| Hijo directo | `.card > img` | Imágenes hijas directas |
| Hermano adyacente | `h2 + p` | El `<p>` inmediatamente después |
| Atributo | `[data-ver]` | Elementos con ese atributo |
| Pseudo-clase | `:hover`, `:focus`, `:disabled` | Estado |
| Pseudo-elemento | `::before`, `::after` | Parte generada |

### 2.3 Especificidad

De menor a mayor:

1. Selector universal `*`.
2. Etiquetas y pseudo-elementos.
3. Clases, atributos y pseudo-clases.
4. IDs.
5. Estilos inline (`style="..."`).
6. `!important` (evitar).

> Si dos reglas empatan, gana la que aparece **después** en el archivo.

### 2.4 Modelo de caja

```css
.caja {
  width: 300px;
  height: 200px;
  padding: 16px;
  border: 2px solid #203b32;
  margin: 24px;
  box-sizing: border-box;
}
```

- `content-box` (default): `width` no incluye padding ni border.
- `border-box`: `width` incluye padding y border. **Recomendado.**

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

### 2.5 Unidades

| Unidad | Uso |
|---|---|
| `px` | Tamaño fijo |
| `%` | Relativo al padre |
| `rem` | Relativo al `font-size` del `<html>` (16px por defecto) |
| `em` | Relativo al `font-size` del elemento |
| `vw` / `vh` | Relativo al viewport |
| `fr` | Fracción en Grid |
| `ch` | Ancho de un carácter |

### 2.6 Colores

```css
color: #203b32;
color: rgb(32 59 50);
color: rgba(32, 59, 50, 0.8);
color: hsl(160 30% 22%);
background: linear-gradient(135deg, #203b32, #2f5d4e);
```

### 2.7 Variables CSS

```css
:root {
  --color-primary: #203b32;
  --color-accent: #f2b705;
  --radius: 16px;
  --shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

.boton {
  background: var(--color-primary);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}
```

### 2.8 Flexbox

```css
.contenedor {
  display: flex;
  flex-direction: row;        /* row | column */
  justify-content: space-between; /* eje principal */
  align-items: center;        /* eje cruzado */
  flex-wrap: wrap;
  gap: 16px;
}

.hijo {
  flex: 1 1 240px;            /* grow shrink basis */
}
```

| Propiedad | Valores comunes |
|---|---|
| `justify-content` | `flex-start`, `center`, `space-between`, `space-around`, `space-evenly` |
| `align-items` | `stretch`, `flex-start`, `center`, `flex-end` |
| `flex-direction` | `row`, `row-reverse`, `column`, `column-reverse` |
| `flex-wrap` | `nowrap`, `wrap`, `wrap-reverse` |
| `gap` | Espacio entre hijos |

### 2.9 Grid

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}
```

```css
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
```

### 2.10 Posicionamiento

| `position` | Comportamiento |
|---|---|
| `static` | Normal (default) |
| `relative` | Se desplaza respecto de su posición normal |
| `absolute` | Se posiciona respecto del ancestro posicionado más cercano |
| `fixed` | Se posiciona respecto del viewport |
| `sticky` | Se comporta como relative hasta un umbral, luego fixed |

```css
.padre {
  position: relative;
}

.hijo {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
}
```

> `z-index` solo funciona en elementos posicionados o flex/grid items.

### 2.11 Responsive y media queries

```css
/* Mobile first */
.card {
  width: 100%;
}

@media (min-width: 576px) {
  .card { width: 50%; }
}

@media (min-width: 992px) {
  .card { width: 33.333%; }
}
```

Breakpoints de Bootstrap:

| Nombre | Ancho |
|---|---|
| `sm` | ≥ 576px |
| `md` | ≥ 768px |
| `lg` | ≥ 992px |
| `xl` | ≥ 1200px |
| `xxl` | ≥ 1400px |

### 2.12 Pseudo-clases y pseudo-elementos

```css
button:hover { background: #2f5d4e; }
button:focus-visible { outline: 3px solid #f2b705; }
button:disabled { opacity: 0.6; cursor: not-allowed; }
input:invalid { border-color: #dc3545; }
input:valid { border-color: #198754; }

.card::before {
  content: "";
  display: block;
  height: 4px;
  background: #f2b705;
}
```

### 2.13 Transiciones y animaciones

```css
.boton {
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.boton:hover {
  transform: translateY(-2px);
}

@keyframes aparecer {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.aparece {
  animation: aparecer 0.3s ease both;
}
```

### 2.14 Ocultar elementos

```css
.oculto {
  display: none;      /* no ocupa espacio, no accesible */
}

.invisible {
  visibility: hidden; /* ocupa espacio, no visible */
}

.solo-lectores {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
```

### 2.15 Buenas prácticas

- Mobile first.
- Variables para colores y espaciados.
- Evitar `!important`.
- Evitar IDs para estilos.
- Usar clases semánticas (`.producto-card`, no `.azul`).
- No fijar alturas innecesarias.
- Respetar `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 3. Bootstrap 5

### 3.1 Inclusión local

```html
<link rel="stylesheet" href="lib/bootstrap/css/bootstrap.min.css">
...
<script src="lib/bootstrap/js/bootstrap.bundle.min.js"></script>
```

`bootstrap.bundle.min.js` incluye Popper, necesario para modales, dropdowns y tooltips.

### 3.2 Contenedores

```html
<div class="container">...</div>        <!-- ancho fijo responsive -->
<div class="container-fluid">...</div>  <!-- ancho completo -->
```

### 3.3 Grid

```html
<div class="row g-4">
  <div class="col-12 col-sm-6 col-xl-4">...</div>
  <div class="col-12 col-sm-6 col-xl-4">...</div>
  <div class="col-12 col-sm-6 col-xl-4">...</div>
</div>
```

- `row`: fila.
- `col-*`: columnas (12 por fila).
- `g-*`: gutter (espaciado).
- `gx-*` / `gy-*`: gutter horizontal/vertical.
- `offset-*`: desplazamiento.

| Clase | Significado |
|---|---|
| `col-12` | 100% en todos los tamaños |
| `col-sm-6` | 50% desde `sm` |
| `col-md-4` | 33% desde `md` |
| `col-lg-3` | 25% desde `lg` |
| `col-xl-4` | 33% desde `xl` |
| `col-auto` | Ancho del contenido |

### 3.4 Utilidades de espaciado

Escala: `0`, `1` (0.25rem), `2` (0.5rem), `3` (1rem), `4` (1.5rem), `5` (3rem).

| Clase | Efecto |
|---|---|
| `m-3` | Margin en todos lados |
| `mt-3` | Margin top |
| `mb-0` | Margin bottom 0 |
| `mx-auto` | Margin horizontal automático (centra) |
| `p-4` | Padding en todos lados |
| `px-3` | Padding horizontal |
| `py-2` | Padding vertical |
| `gap-2` | Gap en flex/grid |

### 3.5 Utilidades de display y flex

```html
<div class="d-flex align-items-center justify-content-between gap-2">
  <span>Texto</span>
  <button class="btn btn-success">Acción</button>
</div>
```

| Clase | Efecto |
|---|---|
| `d-none` | `display: none` |
| `d-block` | `display: block` |
| `d-flex` | `display: flex` |
| `d-grid` | `display: grid` |
| `d-md-none` | Oculto desde `md` |
| `d-none d-md-flex` | Oculto en mobile, flex desde `md` |
| `flex-column` | Columna |
| `flex-wrap` | Permite salto de línea |
| `align-items-center` | Centrado vertical |
| `justify-content-between` | Separación extrema |
| `ms-auto` | Margin start automático (empuja a la derecha) |

### 3.6 Texto y colores

```html
<p class="text-muted">Texto secundario</p>
<p class="text-danger">Error</p>
<p class="text-success">Éxito</p>
<p class="fw-bold">Negrita</p>
<p class="text-center">Centrado</p>
<p class="text-truncate">Texto muy largo que se recorta...</p>
```

| Clase | Color |
|---|---|
| `text-primary` | Azul |
| `text-success` | Verde |
| `text-danger` | Rojo |
| `text-warning` | Amarillo |
| `text-info` | Celeste |
| `text-muted` | Gris |
| `bg-light` | Fondo claro |
| `bg-dark` | Fondo oscuro |
| `bg-success-subtle` | Verde suave |

### 3.7 Botones

```html
<button class="btn btn-success">Guardar</button>
<button class="btn btn-outline-success">Secundario</button>
<button class="btn btn-danger btn-sm">Eliminar</button>
<button class="btn btn-warning btn-lg w-100">Ancho completo</button>
```

| Clase | Uso |
|---|---|
| `btn` | Base |
| `btn-success` | Acción principal |
| `btn-outline-*` | Borde |
| `btn-sm` / `btn-lg` | Tamaño |
| `w-100` | Ancho completo |
| `disabled` | Deshabilitado |

### 3.8 Formularios

```html
<div class="mb-3">
  <label for="email" class="form-label">Email</label>
  <input type="email" id="email" name="email"
         class="form-control" required>
  <div class="form-text">No compartiremos tu email.</div>
  <div class="invalid-feedback">Ingresá un email válido.</div>
</div>

<div class="mb-3">
  <label for="ciudad" class="form-label">Ciudad</label>
  <select id="ciudad" name="ciudad" class="form-select" required>
    <option value="">Seleccioná...</option>
    <option value="1">Santa Rosa</option>
  </select>
</div>

<div class="form-check">
  <input class="form-check-input" type="checkbox" id="acepto">
  <label class="form-check-label" for="acepto">Acepto</label>
</div>
```

Validación visual:

```html
<form class="was-validated">...</form>
```

```js
formulario.classList.add("was-validated");
```

### 3.9 Input group

```html
<div class="input-group">
  <input type="password" id="password" class="form-control">
  <button type="button" class="btn btn-outline-secondary">Mostrar</button>
</div>
```

### 3.10 Alertas

```html
<div class="alert alert-success" role="status">Guardado correctamente.</div>
<div class="alert alert-danger" role="alert">Ocurrió un error.</div>
<div class="alert alert-warning">Atención.</div>
<div class="alert alert-info">Información.</div>
```

Con cierre:

```html
<div class="alert alert-success alert-dismissible fade show" role="alert">
  Guardado.
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
</div>
```

### 3.11 Cards

```html
<article class="card h-100 shadow-sm">
  <img src="..." class="card-img-top" alt="...">
  <div class="card-body d-flex flex-column">
    <h3 class="card-title h5">Título</h3>
    <p class="card-text">Descripción.</p>
    <button class="btn btn-outline-success mt-auto align-self-start">Ver</button>
  </div>
</article>
```

### 3.12 Navbar

```html
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="panel.html">Mi Sitio</a>

    <button class="navbar-toggler" type="button"
            data-bs-toggle="collapse" data-bs-target="#menu"
            aria-controls="menu" aria-expanded="false"
            aria-label="Abrir menú">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="menu">
      <ul class="navbar-nav me-auto">
        <li class="nav-item">
          <a class="nav-link active" href="#">Inicio</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Productos</a>
        </li>
      </ul>
      <button class="btn btn-outline-light btn-sm">Cerrar sesión</button>
    </div>
  </div>
</nav>
```

### 3.13 Modal

```html
<div class="modal fade" id="miModal" tabindex="-1"
     aria-labelledby="miModalTitulo" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title fs-5" id="miModalTitulo">Título</h2>
        <button type="button" class="btn-close"
                data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>
      <div class="modal-body">Contenido</div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div>
```

Abrir desde JS:

```js
const modal = new bootstrap.Modal(document.getElementById("miModal"));
modal.show();
modal.hide();
```

O reutilizando la instancia:

```js
bootstrap.Modal.getOrCreateInstance(
  document.getElementById("miModal")
).show();
```

Eventos:

```js
document.getElementById("miModal")
  .addEventListener("hidden.bs.modal", () => {
    // limpiar formulario
  });
```

### 3.14 Collapse

```js
const menu = document.getElementById("menu");
bootstrap.Collapse.getOrCreateInstance(menu).hide();
```

### 3.15 Spinner

```html
<div class="spinner-border text-success" role="status" aria-hidden="true"></div>
<span class="visually-hidden">Cargando...</span>
```

Botón con spinner:

```html
<button class="btn btn-success" disabled>
  <span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
  Guardando...
</button>
```

### 3.16 Badges y breadcrumbs

```html
<span class="badge bg-success">Nuevo</span>

<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="panel.html">Panel</a></li>
    <li class="breadcrumb-item active" aria-current="page">Productos</li>
  </ol>
</nav>
```

### 3.17 Tabla

```html
<div class="table-responsive">
  <table class="table table-striped table-hover align-middle">
    ...
  </table>
</div>
```

---

## 4. JavaScript

### 4.1 Variables

```js
let contador = 0;        // reasignable
const nombre = "Ana";    // no reasignable
var viejo = "evitar";    // scope de función, evitar
```

- `const` por defecto.
- `let` si necesita reasignación.
- `var` solo en código legacy.

### 4.2 Tipos

```js
typeof "texto";      // "string"
typeof 123;          // "number"
typeof true;         // "boolean"
typeof undefined;    // "undefined"
typeof null;         // "object" (bug histórico)
typeof {};           // "object"
typeof [];           // "object"
typeof function(){}; // "function"
```

### 4.3 Operadores

```js
// Comparación
5 == "5";    // true  (evitar)
5 === "5";   // false (usar)
5 !== "5";   // true

// Lógicos
true && false;  // false
true || false;  // true
!true;          // false

// Nullish
const valor = null ?? "default"; // "default"

// Ternario
const estado = edad >= 18 ? "mayor" : "menor";
```

### 4.4 Strings

```js
const texto = "Hola mundo";

texto.length;                 // 11
texto.toUpperCase();          // "HOLA MUNDO"
texto.toLowerCase();          // "hola mundo"
texto.trim();                 // sin espacios extremos
texto.includes("mundo");      // true
texto.startsWith("Hola");     // true
texto.endsWith("mundo");      // true
texto.indexOf("mundo");       // 5
texto.slice(0, 4);            // "Hola"
texto.replace("mundo", "JS"); // "Hola JS"
texto.split(" ");             // ["Hola", "mundo"]
texto.padStart(15, "-");      // "----Hola mundo"
```

Template literals:

```js
const nombre = "Ana";
const saludo = `Hola, ${nombre}. Tenés ${2 + 2} mensajes.`;
```

### 4.5 Números

```js
Number("42");          // 42
parseInt("42px", 10);  // 42
parseFloat("3.14");    // 3.14
Number.isInteger(42);  // true
Number.isNaN(NaN);     // true
(3.14159).toFixed(2);  // "3.14"
Math.floor(3.9);       // 3
Math.ceil(3.1);        // 4
Math.round(3.5);       // 4
Math.max(1, 5, 3);     // 5
Math.min(1, 5, 3);     // 1
Math.random();         // 0 <= x < 1
```

### 4.6 Arrays

```js
const frutas = ["manzana", "pera", "uva"];

frutas.length;             // 3
frutas[0];                 // "manzana"
frutas.at(-1);             // "uva"
frutas.push("kiwi");       // agrega al final
frutas.pop();              // quita del final
frutas.unshift("banana");  // agrega al inicio
frutas.shift();            // quita del inicio
frutas.includes("pera");   // true
frutas.indexOf("uva");     // 2
frutas.join(", ");         // "manzana, pera, uva"
frutas.slice(0, 2);        // copia parcial
frutas.splice(1, 1);       // elimina/modifica
frutas.reverse();          // invierte (muta)
```

Métodos funcionales:

```js
const numeros = [1, 2, 3, 4, 5];

numeros.map(n => n * 2);          // [2, 4, 6, 8, 10]
numeros.filter(n => n % 2 === 0); // [2, 4]
numeros.reduce((acc, n) => acc + n, 0); // 15
numeros.find(n => n > 3);         // 4
numeros.findIndex(n => n > 3);    // 3
numeros.some(n => n > 4);         // true
numeros.every(n => n > 0);        // true
numeros.sort((a, b) => a - b);    // orden numérico
```

Ordenar strings:

```js
const productos = [
  { titulo: "Zafiro" },
  { titulo: "Ámbar" },
  { titulo: "Beta" }
];

productos.sort((a, b) =>
  a.titulo.localeCompare(b.titulo, "es", { sensitivity: "base" })
);
```

> `sort()` sin comparador ordena como texto y puede dar resultados raros con números (`[10, 2, 1]` → `[1, 10, 2]`).

### 4.7 Objetos

```js
const persona = {
  nombre: "Ana",
  apellido: "Pérez",
  edad: 30,
  saludar() {
    return `Hola, soy ${this.nombre}`;
  }
};

persona.nombre;          // "Ana"
persona["apellido"];     // "Pérez"
persona.edad = 31;
persona.email = "ana@mail.com";

delete persona.edad;

"nombre" in persona;     // true
Object.keys(persona);    // ["nombre", "apellido", ...]
Object.values(persona);
Object.entries(persona);

const { nombre, apellido } = persona; // destructuring
const copia = { ...persona, edad: 32 }; // spread
```

Optional chaining:

```js
const ciudad = persona?.domicilio?.ciudad ?? "Sin dato";
```

### 4.8 `Map`

```js
const productosPorId = new Map();

productosPorId.set("1", { titulo: "Producto" });
productosPorId.get("1");
productosPorId.has("1");
productosPorId.delete("1");
productosPorId.size;
```

### 4.9 Funciones

```js
function sumar(a, b) {
  return a + b;
}

const restar = function (a, b) {
  return a - b;
};

const multiplicar = (a, b) => a * b;

const saludar = (nombre = "invitado") => `Hola ${nombre}`;

// Rest parameters
function sumarTodos(...numeros) {
  return numeros.reduce((acc, n) => acc + n, 0);
}
```

### 4.10 Condicionales y bucles

```js
if (edad >= 18) {
  // ...
} else if (edad >= 13) {
  // ...
} else {
  // ...
}

switch (dia) {
  case "lunes":
    // ...
    break;
  default:
    // ...
}

for (let i = 0; i < 10; i++) {
  // ...
}

for (const fruta of frutas) {
  // ...
}

for (const clave in persona) {
  // ...
}

while (condicion) {
  // ...
}

do {
  // ...
} while (condicion);
```

### 4.11 DOM: selección

```js
document.getElementById("app");
document.querySelector(".card");        // primer match
document.querySelectorAll(".card");     // NodeList
document.getElementsByClassName("card");
document.getElementsByTagName("div");
```

Convertir NodeList a array:

```js
const cards = Array.from(document.querySelectorAll(".card"));
// o
const cards = [...document.querySelectorAll(".card")];
```

### 4.12 DOM: contenido y atributos

```js
elemento.textContent = "Texto seguro";
elemento.innerHTML = "<strong>HTML</strong>"; // cuidado con datos externos
elemento.value = "nuevo valor";

elemento.getAttribute("src");
elemento.setAttribute("alt", "descripción");
elemento.removeAttribute("title");
elemento.hasAttribute("disabled");

elemento.dataset.id;             // data-id
elemento.dataset.id = "37";

elemento.classList.add("activo");
elemento.classList.remove("oculto");
elemento.classList.toggle("show");
elemento.classList.contains("show");

elemento.style.color = "red";
elemento.hidden = true;
elemento.disabled = true;
```

### 4.13 DOM: crear y eliminar

```js
const option = document.createElement("option");
option.value = "1";
option.textContent = "Santa Rosa";
select.appendChild(option);

const div = document.createElement("div");
div.className = "alerta";
div.textContent = "Guardado";
contenedor.append(div);

elemento.remove();
```

### 4.14 Eventos

```js
boton.addEventListener("click", (evento) => {
  evento.preventDefault();
  // ...
});

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  // ...
});

input.addEventListener("input", (evento) => {
  console.log(evento.target.value);
});

input.addEventListener("change", () => {});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { /* cerrar */ }
});
```

Delegación de eventos:

```js
grid.addEventListener("click", (evento) => {
  const boton = evento.target.closest("[data-ver]");
  if (!boton) return;
  abrirModal(boton.dataset.ver);
});
```

Ventajas: funciona con elementos creados dinámicamente.

### 4.15 Formularios

```js
const form = document.getElementById("form-persona");

form.elements.nombre.value;
form.elements["nombre"].value;
form.checkValidity();
form.reportValidity();
form.reset();
form.classList.add("was-validated");

const datos = new FormData(form);
datos.get("nombre");
datos.set("nombre", "Ana");
datos.append("extra", "valor");

for (const [clave, valor] of datos.entries()) {
  console.log(clave, valor);
}
```

### 4.16 `sessionStorage` y `localStorage`

```js
sessionStorage.setItem("token", "abc123");
sessionStorage.getItem("token");       // "abc123"
sessionStorage.removeItem("token");
sessionStorage.clear();

localStorage.setItem("tema", "oscuro");
```

Diferencias:

| | `sessionStorage` | `localStorage` |
|---|---|---|
| Duración | Hasta cerrar la pestaña | Persistente |
| Alcance | Pestaña | Origen |
| Uso típico | Token de sesión | Preferencias |

> Solo guardar strings. Para objetos: `JSON.stringify()` / `JSON.parse()`.

```js
sessionStorage.setItem("usuario", JSON.stringify({ nombre: "Ana" }));
const usuario = JSON.parse(sessionStorage.getItem("usuario") || "{}");
```

### 4.17 JSON

```js
const texto = JSON.stringify({ nombre: "Ana", edad: 30 });
const objeto = JSON.parse('{"nombre":"Ana","edad":30}');
```

### 4.18 Fechas

```js
const ahora = new Date();
ahora.getFullYear();
ahora.getMonth();       // 0-11
ahora.getDate();
ahora.toISOString();
ahora.toLocaleDateString("es-AR");
```

### 4.19 Promesas y `async/await`

```js
function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  try {
    await esperar(500);
    const datos = await obtenerDatos();
    console.log(datos);
  } catch (error) {
    console.error("Falló:", error.message);
  } finally {
    console.log("Fin");
  }
}
```

### 4.20 `try/catch/finally`

```js
try {
  const datos = JSON.parse(texto);
} catch (error) {
  console.error("JSON inválido", error);
} finally {
  // siempre se ejecuta
}
```

### 4.21 Módulos e IIFE

Patrón IIFE:

```js
const App = (() => {
  function privada() {}

  function publica() {}

  return { publica };
})();
```

Ventaja: no contamina el scope global.

---

## 5. AJAX y Fetch

### 5.1 GET básico

```js
const response = await fetch("api/entidades.php");
const datos = await response.json();
```

### 5.2 GET con parámetros

```js
const url = new URL("api/entidades.php", window.location.href);
url.searchParams.set("id", 37);

const response = await fetch(url);
const datos = await response.json();
```

O:

```js
const params = new URLSearchParams({ id: 37, token: "abc" });
const response = await fetch(`api/entidades.php?${params}`);
```

### 5.3 POST `application/x-www-form-urlencoded`

```js
const datos = new URLSearchParams();
datos.append("usuario", "demo");
datos.append("password", "holamundo");

const response = await fetch("api/login.php", {
  method: "POST",
  body: datos,
  headers: { "Accept": "application/json" }
});

const json = await response.json();
```

### 5.4 POST JSON

```js
const response = await fetch("api/endpoint.php", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  body: JSON.stringify({ nombre: "Ana" })
});
```

> En PHP se lee con `file_get_contents("php://input")` y `json_decode(..., true)`.

### 5.5 POST multipart (archivos)

```js
const formData = new FormData();
formData.append("titulo", "Producto azul");
formData.append("imagen", archivo); // File de un input

const response = await fetch("api/registrar.php?token=" + token, {
  method: "POST",
  body: formData
});
```

> **No** establecer `Content-Type` manualmente en multipart: el navegador agrega el `boundary`.

### 5.6 Leer la respuesta correctamente

```js
async function leerRespuesta(response) {
  const texto = await response.text();

  let datos;
  try {
    datos = texto ? JSON.parse(texto) : {};
  } catch {
    throw new Error("La API no devolvió JSON: " + texto.slice(0, 200));
  }

  if (!response.ok) {
    throw new Error(datos.mensaje || `HTTP ${response.status}`);
  }

  return datos;
}
```

### 5.7 Manejo de errores

```js
async function cargar() {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    const datos = await response.json();
    return datos;

  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Petición cancelada");
    } else if (error instanceof TypeError) {
      console.error("Error de red o CORS", error);
    } else {
      console.error("Error", error.message);
    }
    throw error;
  }
}
```

### 5.8 Timeout con `AbortController`

```js
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 5000);

try {
  const response = await fetch(url, { signal: controller.signal });
  const datos = await response.json();
} finally {
  clearTimeout(timeout);
}
```

### 5.9 CORS

- El navegador bloquea respuestas si el servidor no envía los headers correctos.
- Si la API que usás ya envía `Access-Control-Allow-Origin: *`, no habrá problemas de mismo origen.
- Si se envía un header personalizado, el navegador hace un **preflight** `OPTIONS`.
- Para evitar problemas, usar los headers que la API permite o parámetros de query.

### 5.10 Códigos HTTP

| Código | Significado |
|---|---|
| 200 | OK |
| 201 | Creado |
| 204 | Sin contenido |
| 400 | Petición inválida |
| 401 | No autenticado |
| 403 | Prohibido |
| 404 | No encontrado |
| 405 | Método no permitido |
| 500 | Error del servidor |

> Ojo: algunas APIs devuelven **200** incluso en errores lógicos y comunican el error en el cuerpo del JSON (por ejemplo con un campo `status` o `mensaje`). Revisar el cuerpo de la respuesta, no solo el código HTTP.

### 5.11 Depurar en el navegador

1. Abrir DevTools (`F12`).
2. Pestaña **Network**.
3. Filtrar `Fetch/XHR`.
4. Revisar:
   - URL.
   - Método.
   - Headers.
   - Payload.
   - Response.
   - Status.
5. Pestaña **Console** para errores de JS.

---

## 6. PHP

### 6.1 Estructura básica

```php
<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$datos = [
    "status" => 200,
    "mensaje" => "OK"
];

echo json_encode($datos, JSON_UNESCAPED_UNICODE);
```

### 6.2 Variables y tipos

```php
$nombre = "Ana";
$edad = 30;
$precio = 19.99;
$activo = true;
$nulo = null;

$frutas = ["manzana", "pera"];          // indexado
$persona = ["nombre" => "Ana", "edad" => 30]; // asociativo

echo $nombre;
echo "Hola $nombre";
echo 'Hola ' . $nombre;

var_dump($persona);
print_r($persona);
```

### 6.3 Operadores

```php
$a == $b;   // igualdad de valor
$a === $b;  // igualdad de valor y tipo
$a != $b;
$a !== $b;

$a && $b;
$a || $b;
!$a;

$a ?? "default"; // null coalescing
$nombre ??= "Invitado"; // asignación null coalescing
```

### 6.4 Condicionales y bucles

```php
if ($edad >= 18) {
    echo "Mayor";
} elseif ($edad >= 13) {
    echo "Adolescente";
} else {
    echo "Menor";
}

switch ($dia) {
    case "lunes":
        echo "Inicio";
        break;
    default:
        echo "Otro";
}

for ($i = 0; $i < 10; $i++) {
    echo $i;
}

foreach ($frutas as $fruta) {
    echo $fruta;
}

foreach ($persona as $clave => $valor) {
    echo "$clave: $valor";
}

while ($condicion) {
    // ...
}
```

### 6.5 Funciones

```php
function sumar(int $a, int $b): int {
    return $a + $b;
}

function saludar(string $nombre = "invitado"): string {
    return "Hola $nombre";
}

// Arrow function
$doble = fn($n) => $n * 2;
```

### 6.6 Superglobales

| Variable | Contenido |
|---|---|
| `$_GET` | Parámetros de query string |
| `$_POST` | Datos de formulario POST |
| `$_REQUEST` | `$_GET` + `$_POST` + `$_COOKIE` |
| `$_FILES` | Archivos subidos |
| `$_SERVER` | Información del servidor |
| `$_SESSION` | Datos de sesión |
| `$_COOKIE` | Cookies |

```php
$id = $_GET["id"] ?? null;
$nombre = $_POST["nombre"] ?? "";
$token = $_REQUEST["token"] ?? "";
```

> Evitar `extract($_REQUEST)`: mezcla fuentes y permite sobrescribir variables.

### 6.7 Validación

```php
$errores = [];

$dni = filter_input(INPUT_POST, "dni", FILTER_VALIDATE_INT);
if ($dni === false || $dni < 3000000 || $dni > 50000000) {
    $errores[] = "DNI inválido";
}

$email = filter_input(INPUT_POST, "email", FILTER_VALIDATE_EMAIL);
if (!$email) {
    $errores[] = "Email inválido";
}

$nombre = trim($_POST["nombre"] ?? "");
if ($nombre === "") {
    $errores[] = "El nombre es obligatorio";
}

if ($errores) {
    http_response_code(400);
    echo json_encode(["status" => 400, "errores" => $errores]);
    exit;
}
```

### 6.8 Conexión a MySQL con `mysqli`

```php
$server = "localhost";
$usuario = "root";
$password = "";
$base = "mi_base";

$conexion = mysqli_connect($server, $usuario, $password, $base);

if (!$conexion) {
    http_response_code(500);
    echo json_encode(["status" => 500, "mensaje" => "No se pudo conectar"]);
    exit;
}

mysqli_set_charset($conexion, "utf8mb4");
```

### 6.9 Consulta simple (solo si no hay datos del usuario)

```php
$sql = "SELECT * FROM productos";
$resultado = mysqli_query($conexion, $sql);

$filas = [];
while ($fila = mysqli_fetch_assoc($resultado)) {
    $filas[] = $fila;
}

echo json_encode([
    "status" => 200,
    "data" => $filas
], JSON_UNESCAPED_UNICODE);
```

### 6.10 Consultas preparadas (obligatorio con datos del usuario)

```php
$sql = "SELECT * FROM personas WHERE dni = ?";
$stmt = mysqli_prepare($conexion, $sql);

mysqli_stmt_bind_param($stmt, "i", $dni);
mysqli_stmt_execute($stmt);

$resultado = mysqli_stmt_get_result($stmt);
$persona = mysqli_fetch_assoc($resultado);

mysqli_stmt_close($stmt);
```

INSERT preparado:

```php
$sql = "INSERT INTO personas
        (dni, nombre, apellido, direccion, ciudad, provincia, email, telefono)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = mysqli_prepare($conexion, $sql);

mysqli_stmt_bind_param(
    $stmt,
    "isssiiss",
    $dni, $nombre, $apellido, $direccion,
    $ciudad, $provincia, $email, $telefono
);

mysqli_stmt_execute($stmt);
```

Tipos de `bind_param`:

| Letra | Tipo |
|---|---|
| `i` | Integer |
| `d` | Double |
| `s` | String |
| `b` | Blob |

UPDATE preparado:

```php
$sql = "UPDATE personas
        SET nombre = ?, apellido = ?, direccion = ?,
            ciudad = ?, provincia = ?, email = ?, telefono = ?
        WHERE id = ?";

$stmt = mysqli_prepare($conexion, $sql);

mysqli_stmt_bind_param(
    $stmt, "sssiissi",
    $nombre, $apellido, $direccion,
    $ciudad, $provincia, $email, $telefono, $id
);

mysqli_stmt_execute($stmt);
```

### 6.11 Escape (solo como último recurso)

```php
$nombre = mysqli_real_escape_string($conexion, $nombre);
```

> No reemplaza a las consultas preparadas. Solo tiene sentido en código legacy que ya lo usa; en código propio, siempre `mysqli_prepare`.

### 6.12 Subida de archivos

```php
if (!isset($_FILES["imagen"]) || $_FILES["imagen"]["error"] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(["status" => 400, "mensaje" => "Falta la imagen"]);
    exit;
}

$archivo = $_FILES["imagen"];

// Validar tamaño (8 MB)
if ($archivo["size"] > 8 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(["status" => 400, "mensaje" => "Archivo demasiado grande"]);
    exit;
}

// Validar tipo real
$tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];
$tipo = mime_content_type($archivo["tmp_name"]);

if (!in_array($tipo, $tiposPermitidos, true)) {
    http_response_code(400);
    echo json_encode(["status" => 400, "mensaje" => "Tipo no permitido"]);
    exit;
}

// Nombre seguro
$nombreOriginal = basename($archivo["name"]);
$nombreFinal = time() . "-" . preg_replace("/[^A-Za-z0-9._-]/", "_", $nombreOriginal);
$destino = __DIR__ . "/imagenes/" . $nombreFinal;

if (!move_uploaded_file($archivo["tmp_name"], $destino)) {
    http_response_code(500);
    echo json_encode(["status" => 500, "mensaje" => "No se pudo guardar"]);
    exit;
}
```

### 6.13 Contraseñas

```php
// Guardar
$hash = password_hash($password, PASSWORD_DEFAULT);

// Verificar
if (password_verify($password, $hash)) {
    // correcto
}
```

> Nunca guardar contraseñas en texto plano ni con `md5`/`sha1`: es una vulnerabilidad grave. Usar siempre `password_hash` + `password_verify`.

### 6.14 Sesiones

```php
session_start();

$_SESSION["usuario"] = "demo";

if (!isset($_SESSION["usuario"])) {
    header("Location: index.html");
    exit;
}

session_destroy();
```

### 6.15 Headers

```php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Accept");
```

> Los headers deben enviarse **antes** de cualquier salida.

### 6.16 Respuestas JSON uniformes

```php
function responder(int $status, array $datos = []): void {
    http_response_code($status);
    header("Content-Type: application/json; charset=utf-8");
    echo json_encode(array_merge(["status" => $status], $datos), JSON_UNESCAPED_UNICODE);
    exit;
}

responder(200, ["data" => $filas]);
responder(400, ["mensaje" => "Datos inválidos"]);
responder(401, ["mensaje" => "No autorizado"]);
```

### 6.17 Errores comunes en PHP

| Error | Causa | Solución |
|---|---|---|
| `Undefined variable` | Variable no inicializada | Usar `??` o inicializar |
| `Undefined array key` | Índice inexistente | `??` o `isset()` |
| `Cannot modify header information` | Salida antes de `header()` | Mover headers al inicio |
| `mysqli_connect(): Access denied` | Credenciales incorrectas | Revisar `conexion.php` |
| `Call to undefined function` | Extensión no habilitada | Revisar `php.ini` |
| `JSON malformed` | Warning/HTML antes del JSON | `error_reporting`, revisar salida |
| `Headers already sent` | Espacio o BOM antes de `<?php` | Eliminar salida accidental |

---

## 7. MySQL y SQL básico

### 7.1 Consultas

```sql
SELECT * FROM productos;

SELECT id, titulo, descripcion
FROM productos
ORDER BY titulo ASC;

SELECT * FROM personas
WHERE dni = 28901236;

SELECT * FROM personas
WHERE dni BETWEEN 3000000 AND 50000000
ORDER BY dni ASC;

SELECT COUNT(*) AS cantidad FROM personas;

INSERT INTO personas
(dni, nombre, apellido, direccion, ciudad, provincia, email, telefono)
VALUES
(28901236, 'Ana', 'Pérez', 'Calle 123', 1, 5, 'mail@mail.com', '2302-123456');

UPDATE personas
SET nombre = 'Ana', telefono = '2302-999999'
WHERE dni = 28901236;

DELETE FROM personas
WHERE dni = 28901236;
```

### 7.2 JOIN

```sql
SELECT p.nombre, p.apellido, c.nombre
FROM personas p
INNER JOIN ciudades c ON c.id = p.ciudad
ORDER BY p.apellido ASC;
```

### 7.3 Índices

```sql
CREATE INDEX idx_personas_dni ON personas (dni);
```

- Acelera búsquedas por esa columna.
- No abusar: ralentiza INSERT/UPDATE.

### 7.4 Orden de ejecución

```text
FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT
```

### 7.5 Seguridad

- Consultas preparadas para datos del usuario.
- No concatenar strings.
- Validar tipos.
- Limitar privilegios del usuario de la base.

---

## 8. Errores comunes y debugging

### 8.1 JavaScript

| Error | Causa | Solución |
|---|---|---|
| `Cannot read properties of null` | `getElementById` no encontró el elemento | Verificar ID y orden de carga |
| `addEventListener is not a function` | El selector devolvió `null` | Verificar que exista |
| `Unexpected token < in JSON` | La API devolvió HTML | Revisar endpoint, ruta y errores PHP |
| `CORS policy` | Falta header en el servidor | Configurar CORS o usar mismo origen |
| `401` / `403` | Token inválido | Verificar token y query string |
| `Failed to fetch` | URL mal, servidor caído o CORS | Revisar Network |
| `form.submit is not a function` | Nombre de input `submit` | Renombrar el campo |
| `event.preventDefault is not a function` | Se pasó mal el evento | Usar el parámetro del listener |
| `JSON.parse: unexpected character` | Texto no JSON | Revisar respuesta cruda |
| `Assignment to constant variable` | Se reasignó un `const` | Usar `let` |

### 8.2 HTML/CSS

| Problema | Causa | Solución |
|---|---|---|
| Estilos no se aplican | Ruta incorrecta o caché | Revisar Network, `Ctrl+F5` |
| Layout roto | Falta `viewport` | Agregar meta viewport |
| Elemento no se ve | `d-none`, `display:none`, `visibility` | Revisar clases |
| Modal no abre | Falta Bootstrap JS o el ID | Incluir bundle y verificar ID |
| Formulario recarga la página | Falta `preventDefault()` | Agregarlo en `submit` |
| Botón no hace nada | Handler no registrado o error previo | Revisar consola |
| Texto desbordado | Falta `overflow-wrap` o ancho | Ajustar CSS |
| Z-index no funciona | Falta `position` | Agregar `position: relative` |

### 8.3 PHP/API

| Problema | Causa | Solución |
|---|---|---|
| JSON inválido | Warning antes del `json_encode` | Revisar logs, `error_reporting` |
| `Headers already sent` | Salida antes de `header()` | Mover headers |
| `Access denied` | Credenciales de MySQL | Revisar `conexion.php` |
| `Unknown column` | Nombre de campo mal | Revisar esquema |
| `Duplicate entry` | PK duplicada | Validar antes de insertar |
| Sin acentos | Falta charset | `mysqli_set_charset($conexion, "utf8mb4")` |
| SQL roto con apóstrofos | Falta escape | Consultas preparadas |
| `500` con HTML | `or die()` | Devolver JSON |

### 8.4 Checklist de debugging

1. Abrir DevTools → Console.
2. Leer el **primer** error, no el último.
3. Revisar Network → estado, URL, payload, response.
4. Verificar que el elemento exista: `console.log(document.getElementById("x"))`.
5. Verificar el orden de scripts.
6. Verificar que la función esté definida antes de usarla.
7. Verificar `await` en funciones `async`.
8. Verificar `preventDefault()` en formularios.
9. Verificar la ruta de la API.
10. Verificar el token en `sessionStorage`.
11. Probar el endpoint directamente en el navegador.
12. Revisar los logs de Apache/PHP.

### 8.5 Comandos útiles

```powershell
# Verificar sintaxis JS
node --check archivo.js

# Verificar sintaxis PHP
php -l archivo.php

# Ver versión de PHP
php -v

# Ver módulos
php -m
```

---

## 9. Checklist de entrega

### Funcionalidad

- [ ] Login correcto y error de login sin navegar.
- [ ] Token o sesión guardados en `sessionStorage` (y verificados contra el backend).
- [ ] Páginas protegidas redirigen al login sin sesión.
- [ ] Logout con confirmación.
- [ ] Listado de datos con orden consistente.
- [ ] Alta, edición y vista de detalle funcionando.
- [ ] Campos clave deshabilitados donde corresponda.
- [ ] Mensajes de éxito y error visibles (no `alert()`).
- [ ] Todos los campos requeridos validados.
- [ ] Carga de archivos con validación de tipo y tamaño.

### Calidad

- [ ] Sin errores en consola.
- [ ] Sin `console.log` de depuración.
- [ ] Sin `alert()` para errores.
- [ ] Sin `innerHTML` con datos sin escapar.
- [ ] Sin credenciales en la URL.
- [ ] Sin rutas absolutas innecesarias.
- [ ] Sin CDN obligatorio cuando se pide local.
- [ ] Consultas preparadas en todo acceso a datos del usuario.

### Diseño

- [ ] Responsive en mobile, tablet y desktop.
- [ ] Navbar funcional.
- [ ] Tarjetas o grillas alineadas.
- [ ] Formularios legibles.
- [ ] Mensajes visibles.
- [ ] Estados de foco.
- [ ] Contraste adecuado.
- [ ] Sin scroll horizontal.

### Pruebas manuales

- [ ] Login vacío.
- [ ] Login incorrecto.
- [ ] Login correcto.
- [ ] Recargar una página protegida.
- [ ] Abrir página protegida en otra pestaña sin sesión.
- [ ] Logout cancelado.
- [ ] Logout confirmado.
- [ ] Alta con datos límite (campos vacíos, valores muy largos).
- [ ] Registro existente (duplicados).
- [ ] Registro inexistente.
- [ ] Edición con cambios.
- [ ] Edición sin cambios.
- [ ] Apóstrofos y caracteres especiales en los datos.
- [ ] Navegación por teclado.

---

## Apéndice A — Atajos y expresiones

```js
// Ternario
condicion ? valorSiTrue : valorSiFalse

// Nullish
valor ?? "default"

// Optional chaining
objeto?.propiedad?.subpropiedad

// Spread
[...array]
{ ...objeto }

// Desestructuración
const { nombre, edad } = persona;
const [primero, segundo] = array;

// Arrow
const fn = (a, b) => a + b;

// Async
async function f() { await promesa; }

// Fetch
const res = await fetch(url);
const data = await res.json();

// FormData
const fd = new FormData(form);

// URLSearchParams
const params = new URLSearchParams({ id: 1 });

// Storage
sessionStorage.setItem("k", "v");
JSON.parse(sessionStorage.getItem("k") || "{}");

// Array
array.map(x => x * 2)
array.filter(x => x > 0)
array.reduce((a, x) => a + x, 0)
array.find(x => x.id === 1)
array.sort((a, b) => a.localeCompare(b, "es"))

// DOM
document.querySelector(".clase")
document.querySelectorAll(".clase")
elemento.classList.toggle("activo")
elemento.dataset.id

// Evento
evento.preventDefault();
evento.target.closest("[data-ver]");
```

---

## Apéndice B — Plantilla rápida de `index.html`

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Login</title>
  <link rel="stylesheet" href="lib/bootstrap/css/bootstrap.min.css">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <main class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card shadow-sm">
          <div class="card-body p-4">
            <h1 class="h4 mb-3">Iniciar sesión</h1>
            <div id="alertas" aria-live="polite"></div>
            <form id="form-login" novalidate>
              <div class="mb-3">
                <label for="usuario" class="form-label">Usuario</label>
                <input type="text" id="usuario" name="usuario"
                       class="form-control" required autocomplete="username">
                <div class="invalid-feedback">Ingresá el usuario.</div>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Contraseña</label>
                <input type="password" id="password" name="password"
                       class="form-control" required autocomplete="current-password">
                <div class="invalid-feedback">Ingresá la contraseña.</div>
              </div>
              <button type="submit" class="btn btn-success w-100">Ingresar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>
  <script src="js/config.js"></script>
  <script src="js/app.js"></script>
  <script src="js/login.js"></script>
</body>
</html>
```

---

## Apéndice C — Plantilla rápida de endpoint PHP

```php
<?php
declare(strict_types=1);

header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

require __DIR__ . "/conexion.php";

$conexion = mysqli_connect($server_db, $usuario_db, $password_db, $base_db);

if (!$conexion) {
    http_response_code(500);
    echo json_encode(["status" => 500, "mensaje" => "Error de conexión"]);
    exit;
}

mysqli_set_charset($conexion, "utf8mb4");

$id = filter_input(INPUT_GET, "id", FILTER_VALIDATE_INT);

if ($id === false || $id === null) {
    http_response_code(400);
    echo json_encode(["status" => 400, "mensaje" => "ID inválido"]);
    exit;
}

$stmt = mysqli_prepare($conexion, "SELECT * FROM entidades WHERE id = ?");
mysqli_stmt_bind_param($stmt, "i", $id);
mysqli_stmt_execute($stmt);

$resultado = mysqli_stmt_get_result($stmt);
$fila = mysqli_fetch_assoc($resultado);

if (!$fila) {
    http_response_code(404);
    echo json_encode(["status" => 404, "mensaje" => "No encontrado"]);
    exit;
}

echo json_encode(
    ["status" => 200, "data" => $fila],
    JSON_UNESCAPED_UNICODE
);
```

---

**Fin del cheatsheet.**
