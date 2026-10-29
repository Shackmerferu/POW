<?php

// Inicia o recupera la sesión actual.
// Permite acceder a los datos del usuario autenticado.
session_start();

// Indica que la respuesta del servidor será texto plano en UTF-8.
header("Content-Type: text/plain; charset=UTF-8");

// VERIFICAR PERMISOS.

// Comprueba que exista un usuario en la sesión,
// que tenga definido un rol y que ese rol sea "admin".
if (
    !isset($_SESSION["usuario"]) ||
    !isset($_SESSION["usuario"]["rol"]) ||
    $_SESSION["usuario"]["rol"] !== "admin"
) {
    // Devuelve el código HTTP 403 (acceso prohibido).
    http_response_code(403);

    // Muestra el mensaje y finaliza la ejecución.
    exit("No tenés permisos para eliminar productos.");
}

// VERIFICAR EL MÉTODO HTTP.

// La operación solo puede ejecutarse mediante POST.
if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    // Devuelve el código HTTP 405 (método no permitido).
    http_response_code(405);

    // Finaliza el script.
    exit("Método no permitido.");
}

// VALIDAR EL ID DEL PRODUCTO.

// Obtiene el parámetro "id" enviado mediante POST
// e intenta validarlo como un número entero.
$id = filter_input(INPUT_POST, "id", FILTER_VALIDATE_INT);

// Rechaza los IDs inválidos, iguales a cero o negativos.
if (!$id || $id < 1) {

    // Devuelve el código HTTP 400 (solicitud incorrecta).
    http_response_code(400);

    // Finaliza el script.
    exit("El identificador del producto no es válido.");
}

// CONECTAR CON LA BASE DE DATOS.

// Incluye el archivo de conexión.
// __DIR__ representa la carpeta donde está este archivo PHP.
require_once __DIR__ . "/conexion.php";

// PREPARAR LA ELIMINACIÓN LÓGICA.

// En lugar de borrar el registro, cambia su campo "activo" a 0.
// Solo afecta al producto cuyo ID coincide y que todavía está activo.
// El signo ? se reemplaza posteriormente por el ID validado.
$stmt = $conexion->prepare(
    "UPDATE productos SET activo = 0 WHERE id = ? AND activo = 1"
);

// Comprueba si la consulta pudo prepararse correctamente.
if (!$stmt) {

    // Devuelve el código HTTP 500 (error interno del servidor).
    http_response_code(500);

    // Finaliza el script.
    exit("No se pudo preparar la operación.");
}

// Vincula el ID al parámetro ?.
// La letra "i" indica que se trata de un número entero.
$stmt->bind_param("i", $id);

// EJECUTAR LA CONSULTA.

// Ejecuta el UPDATE en la base de datos.
if (!$stmt->execute()) {

    // Si la ejecución falla, devuelve un error HTTP 500.
    http_response_code(500);

    // Finaliza el script.
    exit("No se pudo eliminar el producto.");
}

// VERIFICAR EL RESULTADO.

// affected_rows indica cuántas filas fueron modificadas.
// Si es 0, no se encontró un producto activo con ese ID.
if ($stmt->affected_rows === 0) {

    // Devuelve el código HTTP 404 (recurso no encontrado).
    http_response_code(404);

    // Finaliza el script.
    exit("El producto no existe o ya fue eliminado.");
}

// CERRAR LOS RECURSOS.

// Cierra la consulta preparada.
$stmt->close();

// Cierra la conexión con la base de datos.
$conexion->close();

// Informa que la operación terminó correctamente.
http_response_code(200);

// Envía el mensaje de confirmación al cliente.
echo "Producto eliminado correctamente.";

?>