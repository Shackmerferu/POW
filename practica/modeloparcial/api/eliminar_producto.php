
<?php
session_start();

header("Content-Type: text/plain; charset=UTF-8");

if (
    !isset($_SESSION["usuario"]) ||
    !isset($_SESSION["usuario"]["rol"]) ||
    $_SESSION["usuario"]["rol"] !== "admin"
) {
    http_response_code(403);
    exit("No tenés permisos para eliminar productos.");
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    exit("Método no permitido.");
}

$id = filter_input(INPUT_POST, "id", FILTER_VALIDATE_INT);

if (!$id || $id < 1) {
    http_response_code(400);
    exit("El identificador del producto no es válido.");
}

require_once __DIR__ . "/conexion.php";

$stmt = $conexion->prepare(
    "UPDATE productos SET activo = 0 WHERE id = ? AND activo = 1"
);

if (!$stmt) {
    http_response_code(500);
    exit("No se pudo preparar la operación.");
}

$stmt->bind_param("i", $id);

if (!$stmt->execute()) {
    http_response_code(500);
    exit("No se pudo eliminar el producto.");
}

if ($stmt->affected_rows === 0) {
    http_response_code(404);
    exit("El producto no existe o ya fue eliminado.");
}

$stmt->close();
$conexion->close();

http_response_code(200);
echo "Producto eliminado correctamente.";
?>
