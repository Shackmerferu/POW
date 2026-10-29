
<?php

// Inicia o recupera la sesión actual.
// Permite saber si el usuario inició sesión y cuál es su rol.
session_start();

// Incluye la conexión con la base de datos.
// __DIR__ representa la carpeta donde está este archivo.
require_once __DIR__ . "/conexion.php";

// Indica que la respuesta del servidor será HTML codificado en UTF-8.
header("Content-Type: text/html; charset=UTF-8");

// VERIFICAR SI EL USUARIO ES ADMINISTRADOR.

// Comprueba que exista un rol en la sesión
// y que su valor sea exactamente "admin".
$esAdmin = isset($_SESSION["usuario"]["rol"])
    && $_SESSION["usuario"]["rol"] === "admin";

// OBTENER LA CATEGORÍA SOLICITADA.

// Lee la categoría recibida mediante GET.
// Si no se envía, utiliza "todos".
$categoria = $_GET["categoria"] ?? "todos";

/*
 * El selector del HTML utiliza "termo" y "mate".
 * La consulta filtra usando esos mismos valores.
 */

// VALIDAR LA CATEGORÍA.

// Solo permite consultar todas las categorías,
// termos o mates.
if (!in_array($categoria, ["todos", "termo", "mate"], true)) {

    // Devuelve el código HTTP 400: solicitud incorrecta.
    http_response_code(400);

    // Devuelve un mensaje HTML y detiene la ejecución.
    exit('<p class="text-danger">Categoría no válida.</p>');
}

// PREPARAR LA CONSULTA SQL.

// Si se eligió "todos", consulta todos los productos activos.
if ($categoria === "todos") {

    // Selecciona los campos necesarios para mostrar el catálogo.
    // ORDER BY id DESC ordena los productos del ID más alto al más bajo.
    $stmt = $conexion->prepare(
        "SELECT id, nombre, categoria, descripcion, imagen, precio, stock
         FROM productos
         WHERE activo = 1
         ORDER BY id DESC"
    );

} else {

    // Si se eligió una categoría específica,
    // prepara una consulta que filtre por ella.
    $stmt = $conexion->prepare(
        "SELECT id, nombre, categoria, descripcion, imagen, precio, stock
         FROM productos
         WHERE activo = 1 AND categoria = ?
         ORDER BY id DESC"
    );

    // Vincula la categoría al parámetro ?.
    // La letra "s" indica que es una cadena de texto.
    $stmt->bind_param("s", $categoria);
}

// EJECUTAR LA CONSULTA.

// Comprueba que la consulta se haya preparado correctamente
// y que su ejecución no haya fallado.
if (!$stmt || !$stmt->execute()) {

    // Devuelve el código HTTP 500: error interno del servidor.
    http_response_code(500);

    // Muestra un mensaje y detiene el script.
    exit('<p class="text-danger">No se pudieron cargar los productos.</p>');
}

// Recupera las filas obtenidas por la consulta.
// Cada fila representará un producto.
$productos = $stmt->get_result();

// VERIFICAR SI HAY PRODUCTOS.

// Comprueba si la consulta no devolvió ningún registro.
if ($productos->num_rows === 0) {

    // Muestra un mensaje dentro de una columna de Bootstrap.
    echo '
        <div class="col-12">
            <div class="loading-state">
                No hay productos disponibles en esta categoría.
            </div>
        </div>
    ';
}

// RECORRER Y MOSTRAR LOS PRODUCTOS.

// Obtiene cada producto como un array asociativo.
// El nombre de cada columna SQL se utiliza como clave.
while ($p = $productos->fetch_assoc()) {

    // Convierte el ID a entero.
    $id = (int) $p["id"];

    // Escapa caracteres especiales del nombre para evitar
    // que se interpreten como HTML o JavaScript.
    $nombre = htmlspecialchars(
        $p["nombre"],
        ENT_QUOTES,
        "UTF-8"
    );

    // Escapa la descripción.
    // Si es NULL, utiliza una cadena vacía.
    $descripcion = htmlspecialchars(
        $p["descripcion"] ?? "",
        ENT_QUOTES,
        "UTF-8"
    );

    // Escapa el valor de la imagen.
    // Si es NULL, utiliza una cadena vacía.
    $imagen = htmlspecialchars(
        $p["imagen"] ?? "",
        ENT_QUOTES,
        "UTF-8"
    );

    // Convierte el precio a número decimal.
    // Se conserva el valor numérico para utilizarlo en JavaScript.
    $precioReal = (float) $p["precio"];

    // Formatea el precio para mostrarlo al usuario.
    // Ejemplo: 12500.50 se muestra como 12.500,50.
    $precio = number_format($precioReal, 2, ",", ".");

    // Convierte el stock a entero.
    $stock = (int) $p["stock"];

    // Crea una columna responsive de Bootstrap.
    // 12 columnas en pantallas pequeñas,
    // 6 en pantallas medianas y 4 en pantallas grandes.
    echo '<div class="col-12 col-sm-6 col-lg-4">';

    // Crea la tarjeta del producto.
    // h-100 hace que ocupe el 100 % de la altura disponible
    // dentro de su contenedor.
    echo '<article class="producto-card card h-100">';

    // MOSTRAR LA IMAGEN DEL PRODUCTO.

    // Si existe una ruta de imagen, muestra la imagen.
    if ($imagen !== "") {

        echo '
            <img
                src="' . $imagen . '"
                class="card-img-top"
                alt="' . $nombre . '"
                loading="lazy"
            >
        ';

    } else {

        // Si no hay imagen, muestra un espacio alternativo.
        echo '
            <div class="product-image-placeholder">
                <span>Termo Store</span>
            </div>
        ';
    }

    // Abre el contenedor del contenido de la tarjeta.
    echo '<div class="card-body">';

    // Muestra el nombre del producto como título.
    echo '<h3 class="card-title">' . $nombre . '</h3>';

    // Muestra la descripción solo si no está vacía.
    if ($descripcion !== "") {
        echo '<p class="card-text">' . $descripcion . '</p>';
    }

    // Muestra el precio con formato argentino.
    echo '<p class="precio">$' . $precio . '</p>';

    // Muestra la cantidad disponible en stock.
    echo '<p class="product-stock">Stock disponible: ' . $stock . '</p>';

    // MOSTRAR LOS BOTONES DEL CLIENTE.

    // Si hay stock y el usuario NO es administrador,
    // muestra el botón para agregar el producto al carrito.
    if ($stock > 0 && !$esAdmin) {

        echo '
            <button
                type="button"
                class="agregar-carrito btn btn-warning w-100"
                data-id="' . $id . '"
                data-nombre="' . $nombre . '"
                data-precio="' . $precioReal . '"
                data-stock="' . $stock . '"
            >
                Agregar al carrito
            </button>
        ';

    } elseif (!$esAdmin) {

        // Si no hay stock y el usuario no es administrador,
        // muestra un botón deshabilitado.
        echo '
        <button
            type="button"
            class="btn btn-secondary w-100"
            disabled>
            Sin stock
        </button>
    ';
    }

    // MOSTRAR LOS BOTONES DEL ADMINISTRADOR.

    // Si el usuario es administrador, muestra las opciones
    // para editar o eliminar el producto.
    if ($esAdmin) {

        echo '
        <div class="d-flex gap-2 mt-2">

            <!-- Botón para editar el producto.
                 Los atributos data-* guardan sus datos
                 para que JavaScript pueda recuperarlos. -->
            <button
                type="button"
                class="btn btn-primary flex-fill"
                data-admin-accion="editar"
                data-id="' . $id . '"
                data-nombre="' . $nombre . '"
                data-categoria="' . htmlspecialchars($p["categoria"] ?? "", ENT_QUOTES, "UTF-8") . '"
                data-descripcion="' . $descripcion . '"
                data-imagen="' . $imagen . '"
                data-precio="' . $precioReal . '"
                data-stock="' . $stock . '">
                Editar
            </button>

            <!-- Botón para eliminar el producto.
                 JavaScript puede identificar la acción
                 y el producto mediante estos atributos. -->
            <button
                type="button"
                class="btn btn-danger flex-fill text-nowrap"
                data-admin-accion="eliminar"
                data-id="' . $id . '">
                Eliminar
            </button>

        </div>
    ';
    }

    // Cierra el contenedor del contenido de la tarjeta.
    echo '</div>';

    // Cierra la tarjeta del producto.
    echo '</article>';

    // Cierra la columna de Bootstrap.
    echo '</div>';
}

// CERRAR LOS RECURSOS.

// Cierra la consulta preparada.
$stmt->close();

// Cierra la conexión a la base de datos.
$conexion->close();

?>
