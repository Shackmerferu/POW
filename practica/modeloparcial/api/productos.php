<?php
session_start();

require_once __DIR__ . "/conexion.php";

header("Content-Type: text/html; charset=UTF-8");

$esAdmin = isset($_SESSION["usuario"]["rol"])
    && $_SESSION["usuario"]["rol"] === "admin";

$categoria = $_GET["categoria"] ?? "todos";

/*
 * El selector del HTML usa "termo" y "mate".
 * La consulta filtra por esos mismos valores.
 */
if (!in_array($categoria, ["todos", "termo", "mate"], true)) {
    http_response_code(400);
    exit('<p class="text-danger">Categoría no válida.</p>');
}

if ($categoria === "todos") {
    $stmt = $conexion->prepare(
        "SELECT id, nombre, categoria, descripcion, imagen, precio, stock
         FROM productos
         WHERE activo = 1
         ORDER BY id DESC"
    );
} else {
    $stmt = $conexion->prepare(
        "SELECT id, nombre, categoria, descripcion, imagen, precio, stock
         FROM productos
         WHERE activo = 1 AND categoria = ?
         ORDER BY id DESC"
    );

    $stmt->bind_param("s", $categoria);
}

if (!$stmt || !$stmt->execute()) {
    http_response_code(500);
    exit('<p class="text-danger">No se pudieron cargar los productos.</p>');
}

$productos = $stmt->get_result();

if ($productos->num_rows === 0) {
    echo '
        <div class="col-12">
            <div class="loading-state">
                No hay productos disponibles en esta categoría.
            </div>
        </div>
    ';
}

while ($p = $productos->fetch_assoc()) {
    $id = (int) $p["id"];
    $nombre = htmlspecialchars($p["nombre"], ENT_QUOTES, "UTF-8");
    $descripcion = htmlspecialchars(
        $p["descripcion"] ?? "",
        ENT_QUOTES,
        "UTF-8"
    );
    $imagen = htmlspecialchars(
        $p["imagen"] ?? "",
        ENT_QUOTES,
        "UTF-8"
    );
    $precioReal = (float) $p["precio"];
    $precio = number_format($precioReal, 2, ",", ".");
    $stock = (int) $p["stock"];

    echo '<div class="col-12 col-sm-6 col-lg-4">';

    echo '<article class="producto-card card h-100">';

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
        echo '
            <div class="product-image-placeholder">
                <span>Termo Store</span>
            </div>
        ';
    }

    echo '<div class="card-body">';

    echo '<h3 class="card-title">' . $nombre . '</h3>';

    if ($descripcion !== "") {
        echo '<p class="card-text">' . $descripcion . '</p>';
    }

    echo '<p class="precio">$' . $precio . '</p>';

    echo '<p class="product-stock">Stock disponible: ' . $stock . '</p>';

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
        echo '
        <button
            type="button"
            class="btn btn-secondary w-100"
            disabled>
            Sin stock
        </button>
    ';
    }

    if ($esAdmin) {
        echo '
        <div class="d-flex gap-2 mt-2">

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

    echo '</div>';
    echo '</article>';
    echo '</div>';
}

$stmt->close();
$conexion->close();
?>