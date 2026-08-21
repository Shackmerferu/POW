# TRABAJO PRÁCTICO N° 1 — Programación Orientada a la Web

**Carrera:** Ingeniería en Sistemas
**Materia:** Programación Orientada a la Web

---

## 1) Estructura general de un documento HTML

```html
<HTML>
  <HEAD>
    ............
  </HEAD>
  <BODY>
    ............
  </BODY>
</HTML>
```

### a. ¿El encabezado es obligatorio u opcional?

El encabezado (`<HEAD>`) es **opcional** desde el punto de vista práctico: un navegador puede mostrar una página aunque no lo incluya. Sin embargo, se recomienda siempre utilizarlo porque en él se declara información importante del documento como el título, metadatos, estilos, scripts y la codificación de caracteres.

### b. Describa los componentes TITLE, META, BASE, STYLE

| Componente | Descripción |
|------------|-------------|
| `<TITLE>` | Define el **título del documento**. Es el texto que aparece en la barra de título del navegador, en las pestañas y como título del resultado en los buscadores. Es el único elemento del encabezado obligatorio según el estándar HTML. Solo puede contener texto. |
| `<META>` | Proporciona **metadatos** sobre el documento: información que no se muestra pero que describen su contenido. Se usa para declarar la codificación de caracteres (`charset`), autor, descripción, palabras clave, configuración de viewport, refresco automático, etc. Es un elemento vacío (no tiene etiqueta de cierre). Ejemplos: `<meta charset="UTF-8">`, `<meta name="author" content="Juan Pérez">`. |
| `<BASE>` | Establece una **URL base** para todas las URL relativas del documento. Todos los enlaces e imágenes con rutas relativas se resuelven a partir de esa dirección. Debe aparecer antes que cualquier elemento que use una URL. Ejemplo: `<base href="https://www.misitio.com/">` hace que `<a href="paginas/contacto.html">` apunte a `https://www.misitio.com/paginas/contacto.html`. |
| `<STYLE>` | Permite incluir **hojas de estilo CSS** dentro del propio documento (CSS interno). En su interior se escriben reglas CSS que definen la presentación visual de los elementos de la página. Ejemplo: `<style> body { background-color: white; } </style>`. |

### c. ¿El cuerpo es obligatorio u opcional? ¿Qué se codifica en él?

El cuerpo (`<BODY>`) también es **opcional**: si el documento solo contiene texto plano, el navegador lo muestra igualmente. No obstante, en la práctica toda página real lo utiliza.

En el cuerpo se codifica **todo el contenido visible del documento**: textos, párrafos, títulos, imágenes, enlaces, tablas, listas, formularios, videos, botones, etc., junto con los elementos estructurales que los contienen (`<div>`, `<section>`, `<header>`, `<footer>`, etc.).

### d. Atributos del tag `<BODY>`

| Atributo | Para qué sirve |
|----------|----------------|
| `BGCOLOR` | Establece el **color de fondo** de la página. Puede indicarse con nombre (`red`) o valor hexadecimal (`#FF0000`). |
| `TEXT` | Define el **color del texto** normal de todo el documento. |
| `LINK` | Define el color de los **enlaces no visitados**. |
| `VLINK` (*visited link*) | Define el color de los enlaces **ya visitados** por el usuario. |
| `ALINK` (*active link*) | Define el color del enlace **mientras está siendo presionado/clickeado**. |
| `BACKGROUND` | Establece una **imagen de fondo** para la página; si la imagen es más chica que la ventana, se repite (tiling). |

Ejemplo:

```html
<BODY BGCOLOR="#FFFFFF" TEXT="#000000" LINK="#0000FF"
      VLINK="#800080" ALINK="#FF0000" BACKGROUND="fondo.gif">
```

> **Nota:** estos atributos están **obsoletos (deprecated)** en HTML5. Hoy en día estas propiedades se definen mediante CSS (`background-color`, `color`, `a:link`, `a:visited`, `a:active`, `background-image`).

---

## 2) Ejemplos de uso de tags

### Referencias a imágenes — `<img>`

```html
<!-- Imagen con ruta relativa -->
<img src="imagenes/foto.jpg" alt="Foto de perfil" width="300" height="200">

<!-- Imagen desde una URL externa -->
<img src="https://www.ejemplo.com/logo.png" alt="Logo del sitio">
```

- `src`: ruta de la imagen.
- `alt`: texto alternativo que se muestra si la imagen no carga (y ayuda a la accesibilidad).
- `width` / `height`: dimensiones.

### Referencias (enlaces) — `<a>`

```html
<!-- Enlace a OTRA página (externa) -->
<a href="https://www.google.com">Ir a Google</a>

<!-- Enlace a otra página del mismo sitio (ruta relativa) -->
<a href="contacto.html">Página de contacto</a>

<!-- Enlace a la MISMA página (ancla) -->
<a href="#seccion2">Ir a la sección 2</a>

<!-- Destino del ancla dentro de la misma página -->
<h2 id="seccion2">Sección 2</h2>

<!-- Volver al inicio de la misma página -->
<a href="#top">Volver arriba</a>
```

### Tablas — `<table>`

```html
<table border="1">
  <tr>
    <th>Nombre</th>
    <th>Apellido</th>
    <th>Edad</th>
  </tr>
  <tr>
    <td>Juan</td>
    <td>Pérez</td>
    <td>25</td>
  </tr>
  <tr>
    <td>María</td>
    <td>Gómez</td>
    <td>30</td>
  </tr>
</table>
```

- `<table>`: define la tabla.
- `<tr>` (*table row*): fila.
- `<th>` (*table header*): celda de encabezado (negrita y centrada).
- `<td>` (*table data*): celda de datos.

También existen `<caption>` (título de la tabla), `<thead>`, `<tbody>` y `<tfoot>` para agrupar filas semánticamente.

### Listas

```html
<!-- Lista NO ordenada (con viñetas) -->
<ul>
  <li>Manzanas</li>
  <li>Naranjas</li>
  <li>Bananas</li>
</ul>

<!-- Lista ORDENADA (numerada) -->
<ol>
  <li>Prender la computadora</li>
  <li>Abrir el navegador</li>
  <li>Escribir la URL</li>
</ol>

<!-- Lista de DEFINICIÓN -->
<dl>
  <dt>HTML</dt>
  <dd>Lenguaje de marcado para estructurar páginas web.</dd>
  <dt>CSS</dt>
  <dd>Lenguaje de hojas de estilo para dar presentación.</dd>
</dl>
```

---

## 3) IFRAME

Un **IFRAME** (*inline frame*) permite insertar **otro documento HTML dentro de la página actual**, como si fuera una "ventana" embebida que muestra una página independiente.

### Cómo se incluye

```html
<iframe src="https://www.ejemplo.com"
        width="600"
        height="400"
        name="miFrame">
  Su navegador no soporta iframes.
</iframe>
```

Atributos principales:

- `src`: URL del documento que se carga dentro del frame.
- `width` / `height`: dimensiones del marco.
- `name`: nombre del frame (útil para dirigir enlaces hacia él con `target`).
- `frameborder`: define si se muestra o no el borde (obsoleto, hoy se usa CSS `border`).

Ejemplo típico: insertar un video de YouTube o un mapa de Google Maps.

```html
<iframe width="560" height="315"
        src="https://www.youtube.com/embed/VIDEO_ID">
</iframe>
```

### ¿Qué sucede al accionar los enlaces dentro del frame?

Por defecto, cuando se hace clic en un enlace que está **dentro** del contenido del iframe, la nueva página **se carga dentro del propio iframe**, sin afectar al documento principal (la página "contenedora" permanece intacta).

Este comportamiento se controla con el atributo `target` del enlace:

| Valor de `target` | Comportamiento |
|-------------------|----------------|
| *(nada / self)* | El enlace se abre **dentro del mismo iframe** (comportamiento por defecto). |
| `_parent` | La página se carga en el documento **padre** que contiene el iframe. |
| `_top` | La página se carga reemplazando **todo el documento** actual. |
| `_blank` | La página se abre en una **ventana/pestaña nueva**. |
| `nombre_de_frame` | La página se carga en el frame cuyo `name` coincida. |

```html
<!-- Enlace DENTRO del iframe que abre la página en la ventana principal -->
<a href="pagina.html" target="_parent">Abrir en la página padre</a>
```

Además, desde la página contenedora se puede hacer que un enlace cargue su destino *dentro* del iframe usando `target` con el nombre del frame:

```html
<a href="pagina.html" target="miFrame">Cargar en el iframe</a>
```

---

## 4) Imágenes SVG

Una imagen **SVG** (*Scalable Vector Graphics*, gráficos vectoriales escalables) es un formato de imagen basado en **XML** que describe gráficos **vectoriales bidimensionales** mediante instrucciones matemáticas (puntos, líneas, curvas, formas) en lugar de píxeles como JPEG o PNG.

Como son vectores, las imágenes SVG **se escalan a cualquier tamaño sin perder calidad** (no se pixelan), y además el archivo es texto plano, por lo que puede editarse con cualquier editor de texto.

### ¿Son compatibles con todos los navegadores?

Sí. SVG es un **estándar del W3C** y hoy en día está **soportado por todos los navegadores modernos** (Chrome, Firefox, Edge, Safari, Opera), tanto en escritorio como en móviles. Las versiones muy antiguas (por ejemplo Internet Explorer 8 o anteriores) no lo soportaban de forma nativa, pero eso ya no tiene relevancia práctica.

### ¿Qué se puede utilizar en una imagen SVG?

Dentro de un archivo SVG se pueden usar:

- **Formas básicas:** rectángulos (`<rect>`), círculos (`<circle>`), elipses (`<ellipse>`), líneas (`<line>`), polilíneas (`<polyline>`), polígonos (`<polygon>`).
- **Trazados libres:** el elemento `<path>`, que permite dibujar cualquier figura mediante comandos de dibujo (líneas, curvas Bézier, arcos).
- **Texto:** elemento `<text>`, con fuentes, tamaños y colores.
- **Imágenes rasterizadas embebidas:** se pueden incrustar PNG/JPEG dentro del SVG.
- **Rellenos y bordes:** colores sólidos, **degradados** (`<linearGradient>`, `<radialGradient>`), patrones (`<pattern>`), transparencias.
- **Filtros y efectos:** desenfoques, sombras, iluminación (`<filter>`).
- **Transformaciones:** rotación, escala, traslación y sesgado (`transform`).
- **Animaciones:** nativas con SMIL (`<animate>`) o mediante CSS y JavaScript.
- **Interactividad:** los elementos SVG pueden responder a eventos (clic, hover) y manipularse con JavaScript, ya que cada forma es parte del DOM.

---

## 5) Ventajas, desventajas y casos de uso de SVG

### Ventajas

1. **Escalabilidad infinita:** no pierden calidad al ampliarlas ni en pantallas de alta resolución (retina); ideal para diseño responsivo.
2. **Peso liviano:** para logotipos, iconos y dibujos simples, los archivos suelen ser mucho más chicos que sus equivalentes en PNG/JPG.
3. **Editables:** al ser XML/texto plano, pueden crearse y modificarse con editores de texto o herramientas vectoriales (Illustrator, Inkscape, Figma).
4. **Manipulables con código:** se les puede aplicar CSS, animaciones y JavaScript, y acceder a sus elementos vía DOM.
5. **Accesibilidad y SEO:** el texto dentro del SVG es texto real, indexable y seleccionable; admiten atributos `title` y `desc`.
6. **Un solo archivo para todos los tamaños:** no hace falta generar múltiples versiones (@1x, @2x, @3x) como con los mapas de bits.
7. **Fondo transparente** de forma nativa.

### Desventajas

1. **No aptas para fotografías:** al crecer la cantidad de detalles y colores (como en una foto), el archivo SVG se vuelve enorme y pesado comparado con un JPEG/WebP.
2. **Consumo de procesamiento:** renderizar vectores complejos (miles de nodos) puede ser más costoso para la CPU/GPU que pintar un mapa de bits.
3. **Compatibilidad limitada con versiones antiguas:** navegadores muy viejos (IE8-) no las soportan.
4. **Seguridad:** al poder contener scripts, un SVG malicioso puede ser vector de ataques XSS si se permiten subidas de usuarios sin sanitizar.
5. **Curva de aprendizaje:** manipularlos directamente requiere conocer su estructura XML.
6. Algunas funciones avanzadas (filtros complejos, fuentes incrustadas) pueden renderizarse distinto entre navegadores.

### ¿En qué casos utilizaría una imagen SVG?

Utilizaría SVG cuando:

- **Logotipos e íconos** de la interfaz (menús, botones, redes sociales): deben verse nítidos en cualquier tamaño y pantalla.
- **Ilustraciones, diagramas y gráficos planos** con pocas cantidades de colores y formas geométricas.
- **Gráficos estadísticos e infografías** interactivos (charts que responden al usuario).
- **Elementos que necesitan animación o interactividad** (iconos animados, mapas interactivos).
- **Imágenes que deben escalar** en un diseño responsivo sin generar múltiples archivos.
- **Mapas y planos** vectoriales.

En cambio, **no** usaría SVG para fotografías o imágenes con muchos gradientes y texturas complejas; para eso son mejores formatos JPEG, PNG o WebP.
