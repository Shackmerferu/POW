# Documentación de la carpeta `punto14`

Sitio web estático de **Deportes General Pico**, que muestra información sobre los clubes de fútbol de la ciudad de General Pico (La Pampa, Argentina). Es un proyecto de HTML y CSS puro, sin JavaScript.

---

## Estructura de archivos

```
punto14/
├── index.html          → Página principal (home)
├── costabrava.html     → Club Atlético Costa Brava
├── cultural.html       → Club Atlético y Cultural Argentino
├── ferro.html          → Ferro Carril Oeste
├── independiente.html  → Club Sportivo Independiente
├── picofutbol.html     → Pico Football Club
├── text.css            → Hoja tipográfica base (raíz)
├── css/
│   ├── style.css                 → Estilos compartidos por todos los clubes
│   ├── stylecostabrava.css       → Tema de Costa Brava (rojo)
│   ├── stylecultural.css         → Tema de Cultural Argentino (azul)
│   ├── styleferro.css            → Tema de Ferro (verde)
│   ├── styleindependiente.css    → Tema de Independiente (rojo)
│   └── picofcstyle.css           → Tema de Pico FC (violeta)
├── recursos/          → Imágenes y logos
└── ejemplo/           → Plantillas de ejemplo (deportes, equipos)
```

---

## Archivos HTML

### `index.html` (Página principal)
- **Función:** Página de inicio del portal de deportes. Presenta el logo, el menú de navegación y una grilla de los 5 clubes con enlaces a sus páginas individuales.
- **Contenido:**
  - Header con logo y botones "Iniciar Sesión" y "Registrarse".
  - `sticky-header`: barra con los 5 clubes que permanece fija al hacer scroll.
  - Sección "Noticias" con 3 artículos.
  - Tabla de posiciones de la Liga Pampeana.
  - Footer con contacto, redes y descripción.

### `costabrava.html` (Club Atlético Costa Brava)
- **Función:** Página del club Costa Brava con su historia, deportes, noticias y tabla de posiciones.
- **Particularidad:** En la tabla, la fila del propio club (Costa Brava) está resaltada con la clase `fila-activa`.
- **Tema visual:** Rojo/blanco.

### `cultural.html` (Club Atlético y Cultural Argentino)
- **Función:** Página del Cultural Argentino con historia, deportes, noticias y tabla.
- **Particularidad:** La fila activa corresponde a Cultural Argentino.
- **Tema visual:** Azul (`#0033a0`)/blanco.

### `ferro.html` (Ferro Carril Oeste)
- **Función:** Página de Ferro con historia, deportes, noticias y tabla.
- **Particularidad:** En la tabla, el escudo de Ferro se carga desde el recurso local `recursos/ferro.png` (a diferencia de otros clubes que usan imágenes remotas).
- **Tema visual:** Verde (`#087f3f`)/blanco.

### `independiente.html` (Club Sportivo Independiente)
- **Función:** Página de Independiente con historia, deportes, noticias y tabla.
- **Tema visual:** Rojo/blanco.

### `picofutbol.html` (Pico Football Club)
- **Función:** Página del Pico FC con historia, deportes, noticias y tabla.
- **Particularidad:** Noticias orientadas a básquet (Liga Argentina).
- **Tema visual:** Violeta (`#310055`, `#4A0A77`).
- **Nota:** Es el único que usa la clase `btn-pf` en lugar de `btn` en el menú.

---

## Clases CSS (`css/style.css`)

Estas son las "funciones" (clases) compartidas que definen el comportamiento visual de todo el sitio:

### Tipografía
- **`.historia`** → Define la fuente tipográfica de la sección de historia de cada club.
- **`.historia p, .articulo p`** → Aplica fuente y peso a los párrafos de historia y artículos.
- **`.titulo`** → Estilo de los títulos de sección (Noticias, Tabla de Posiciones). Color `#d4d4d4` y fuente Franklin Gothic.

### Artículos y noticias
- **`.articulo`** → Contenedor de cada noticia. Fondo `#141414`, borde gris, esquinas redondeadas (12px), padding interno, y `flex-direction: column` para apilar los elementos verticalmente.
- **`.articulo h2`** → Estilo del título de cada artículo/noticia (blanco, tamaño 1.2rem).
- **`.articulo img`** → Centra las imágenes dentro de los artículos.

### Tabla de posiciones
- **`.tabla-equipos`** → Contenedor de la tabla. Define borde, radio de esquinas, color de texto y centrado de la tabla.
- **`.tabla-equipos table`** → Hace que la tabla ocupe el 100% del ancho y colapsa los bordes (`border-collapse`).
- **`.tabla-equipos th, .tabla-equipos td`** → Alineación de celdas, padding y evita que el texto se parta (`nowrap`).
- **`.tabla-equipos th:nth-child(2), .tabla-equipos td:nth-child(2)`** → Alinea a la izquierda la columna del nombre del club.
- **`.tabla-equipos td img`** → Alinea verticalmente los escudos dentro de las celdas.
- **`.fila-activa`** → Resalta la fila del club actual (en cada página de club) con un fondo semitransparente y sombra.

### Botones
- **`.btn`** → Botón estándar (Iniciar Sesión). Transparente con borde gris, con `transition` para las animaciones.
- **`.btn:hover`** → Al pasar el cursor: borde blanco y fondo tenue.
- **`.btn:active`** → Al hacer clic: se encoge (`scale(0.97)`).
- **`.btn-solid`** → Botón sólido (fondo blanco, texto oscuro); usado cuando se quiere un botón invertido.
- **`.btn-redondo`** → Botón redondo (para "volver"). Posición absoluta a la izquierda, forma circular, con animación de `transform`, `box-shadow` y `border-color`.
- **`.btn-redondo:hover`** → Al pasar el cursor: fondo rojo, se agranda (`scale(1.06)`) y sube (`translateY(-4px)`), con sombra suave.
- **`.btn-redondo-enlace`** → Enlace redondo para redes sociales (Instagram). Circular con fondo gris claro.
- **`.btn-redondo-enlace:hover`** → Mismo efecto de agrandado y sombra que el redondo clásico.

### Tarjetas de equipos
- **`.caja`** → Tarjeta que contiene el escudo de cada club en el home. Fondo `#141414`, borde gris, esquinas redondeadas y `cursor: pointer`.
- **`.caja:hover`** → Al pasar el cursor: se agranda y sube con sombra blanca suave.

### Otros
- **`.hr`** → Línea separadora horizontal (borde superior gris de 2px).
- **`.sticky-header`** → Cabecera fija (`position: sticky`) que se mantiene visible al hacer scroll; fondo `#0a0a0a` con `z-index: 100`.
- **`.header-pf`** → Header particular de Pico FC (flex centrado).
- **`.linea-vertical`** → Línea vertical decorativa (definida pero no usada en el HTML final).
- **`.btn-pf`** → Variante de botón para Pico FC (idéntica a `.btn` pero con fondo `#444`).

---

## Clases de temas por club (CSS específicos)

Cada hoja CSS específica **sobrescribe** (`override`) los estilos compartidos de `style.css` con la paleta de colores del club.

### `stylecostabrava.css` (rojo)
- `body` → fondo gris claro `#f1f1f1`, texto negro.
- `header` → fondo rojo `rgb(220,40,40)`.
- `.btn-register` → botón blanco con texto rojo.
- `.fila-activa` → fondo rojo intenso semitransparente.
- `.caja img` → imágenes con `filter: grayscale(100%)` (blanco y negro por defecto, color en hover).

### `stylecultural.css` (azul)
- `header` → fondo azul `#0033a0` con sombra.
- `.btn-register` → blanco con texto azul.
- `.tabla-equipos thead th` → encabezado de tabla azul con texto blanco.
- `.tabla-equipos tbody tr:nth-child(even)` → filas pares con fondo gris azulado (efecto cebra).
- `.fila-activa` → fondo azul claro con barra lateral azul (`.box-shadow: inset`).

### `styleferro.css` (verde)
- `header` → fondo verde `#087f3f`.
- `.btn-ferro` → botón blanco con texto verde (clase exclusiva de Ferro).
- `.fila-activa` → verde semitransparente con sombra.
- Aplica `display: block` y centrado a las imágenes de artículos.

### `styleindependiente.css` (rojo)
- `body` → fondo gris claro, texto negro.
- `header` → rojo.
- `.fila-activa` → rojo semitransparente.
- `.btn-register` → blanco con texto rojo.

### `picofcstyle.css` (violeta)
- `html` → fondo violeta fijo `#4A0A77`.
- `header` → violeta oscuro `#310055`.
- `.btn, .btn-pf` → fondo violeta `#5A108F` con borde lavanda.
- `.articulo` → fondo blanco con borde lavanda y texto negro (invertido respecto al estilo base).
- `.tabla-equipos` → fondo violeta semitransparente con borde lavanda.
- `.caja img` → imágenes en escala de grises.

---

## Hoja tipográfica global (`text.css`)

- **Función:** Define la tipografía base reutilizable del proyecto.
- **`body`** → Fondo claro `#f5f5f5`, tamaño 20px, fuente Franklin Gothic.
- **`h1` a `h6`** → Escala tipográfica jerárquica (2.4rem → 1rem) con `font-weight: bold`.
- **`p`** → Tamaño 1rem con `line-height: 1.6`.
- **`a`** → Color claro sin subrayado; al pasar el cursor se subraya.
- **Clases utilitarias tipográficas:** `.text-sm` (0.85rem), `.text-md` (1rem), `.text-lg` (1.25rem), `.text-xl` (1.6rem), `.text-bold`, `.text-normal`, `.text-muted` (#a3a3a3).

---

## Decisiones de diseño tomadas

1. **Una sola hoja de estilos base + temas por club:** En lugar de repetir todo el CSS, se usa `style.css` como base y cada club tiene su hoja específica que `overrides` solo lo necesario (colores). Esto facilita mantener el sitio y añadir clubes nuevos.

2. **Uso de CSS Grid para la grilla de clubes y deportes:** Las grillas de clubes (home) y deportes (páginas de club) usan `display: grid` con `grid-auto-flow: column` para alinearlas horizontalmente con separación uniforme (`gap`).

3. **`position: sticky` para el encabezado del home:** El menú de clubes permanece visible al hacer scroll, mejorando la navegación.

4. **`filter: grayscale(100%)` en las imágenes de deportes:** Las imágenes aparecen en blanco y negro y recuperan su color en el hover, dando un efecto visual atractivo.

5. **Resaltado de la fila activa:** En cada página de club, la fila del club correspondiente se resalta con `.fila-activa` para que el usuario sepa dónde está posicionado.

6. **Paletas de colores por club:** Cada club tiene su identidad (rojo, azul, verde, violeta) tanto en el `header` como en los acentos de la página.

7. **`lang="es"` en páginas de clubes pero `lang="en"` en `index.html`, `independiente.html` y `picofutbol.html`:** Inconsistencia que aunque no afecta la visualización, no es ideal para accesibilidad/SEO.

8. **Estilos inline abundantes:** Muchas propiedades (especialmente `display: flex`, `gap`, `padding`) están definidas directamente en atributos `style` en el HTML en lugar de clases CSS. Esto funciona pero dificulta la reutilización y el mantenimiento.
