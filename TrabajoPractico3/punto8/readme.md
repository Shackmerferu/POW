# Punto 8 - Sign Up for a Free Trial

## Estructura de la página

La página muestra un encabezado (`Sign Up for a Free Trial`) con un subtítulo y una grilla de 6 columnas iguales (3 por fila en pantallas medianas+) que alterna:

- **3 imágenes** (fotos de entrenamiento).
- **3 carteles de texto** con listas (Our Programs, Indoor Sports, Yoga Classes).

El orden es: imagen / cartel negro / imagen → cartel amarillo / imagen / cartel rojo.

## Cambios realizados para alinear los carteles con las imágenes

### 1. Imágenes que llenan su columna

Agregué a cada `<img>` las clases:

- `img-fluid` → hace que la imagen sea responsive (`max-width: 100%`) y no desborde su contenedor.
- `w-100` → le da `width: 100%`, ocupando todo el ancho de la columna.
- `h-100` → le da `height: 100%`, ocupando toda la altura de la columna (que ya es igual por el flexbox de Bootstrap).
- `object-fit-cover` → recorta la imagen sin deformarla para que cubra todo el espacio disponible.
- La columna contenedora tiene `d-flex` para que `h-100` funcione correctamente.

### 2. Carteles de texto centrados verticalmente

Agregué a cada cartel (las columnas `bg-dark`, `bg-warning`, `bg-danger`):

- `d-flex` → activa flexbox dentro del cartel.
- `align-items-center` → centra el título y la lista verticalmente, de modo que el contenido del cartel queda a la misma altura visual que las imágenes vecinas.

### 3. Corrección de un bug en la URL de la imagen

La tercera imagen tenía un espacio de más al final del nombre del archivo:

```
src="imagenes/Captura de pantalla 2026-09-15 194129.png "
```

Se eliminó el espacio final para que la imagen se cargue correctamente.

## Definición de cada clase usada

| Clase | Qué hace |
| --- | --- |
| `container` | Centra el contenido con un ancho máximo responsivo y márgenes laterales. |
| `mt-5` | Agrega margen superior grande (gap por defecto de Bootstrap). |
| `text-center` | Centra el texto horizontalmente. |
| `text-secondary` | Aplica el color gris secundario de Bootstrap al texto. |
| `row` | Fila del sistema de grillas de Bootstrap; los hijos (`col`) quedan en flexbox. |
| `g-0` | Elimina el espacio (gutter) entre columnas. |
| `col-md-4` | Cada columna ocupa 4 de 12 partes en pantallas ≥ 768px (3 por fila). |
| `d-flex` | Activa el modo flexbox en el elemento. |
| `align-items-center` | Centra los hijos verticalmente dentro del flexbox. |
| `bg-dark`, `bg-warning`, `bg-danger` | Colores de fondo de Bootstrap (oscuro, amarillo, rojo). |
| `text-white`, `text-dark` | Color del texto (blanco / oscuro). |
| `p-4` | Padding de 1.5rem en los cuatro lados. |
| `text-start` | Alinea el texto a la izquierda. |
| `img-fluid` | Imagen responsive: `max-width: 100%; height: auto`. |
| `w-100` | Ancho del 100% del contenedor. |
| `h-100` | Altura del 100% del contenedor. |
| `object-fit-cover` | La imagen cubre el área sin deformarse (recorta lo que sobra). |