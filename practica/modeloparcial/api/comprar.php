
<?php
session_start();
require_once __DIR__ . "/conexion.php";

header("Content-Type: text/plain; charset=UTF-8");

function errorCompra($mensaje, $codigo = 400) {
    http_response_code($codigo);
    exit($mensaje);
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    errorCompra("Método no permitido.", 405);
}

if (!isset($_SESSION["usuario"]["id"])) {
    errorCompra("Iniciá sesión para comprar.", 401);
}

$tokenSesion = $_SESSION["token"] ?? "";
$tokenRecibido = $_POST["token"] ?? "";

if (
    $tokenSesion === "" ||
    $tokenRecibido === "" ||
    !hash_equals($tokenSesion, $tokenRecibido)
) {
    errorCompra("Token de seguridad inválido.", 403);
}

$carrito = json_decode($_POST["carrito"] ?? "", true);

if (!is_array($carrito) || count($carrito) === 0) {
    errorCompra("El carrito está vacío.");
}

$cantidades = [];

foreach ($carrito as $item) {
    $id = filter_var($item["id"] ?? null, FILTER_VALIDATE_INT);
    $cantidad = filter_var(
        $item["cantidad"] ?? null,
        FILTER_VALIDATE_INT
    );

    if (!$id || !$cantidad || $cantidad < 1) {
        errorCompra("Producto o cantidad inválida.");
    }

    if (!isset($cantidades[$id])) {
        $cantidades[$id] = 0;
    }

    $cantidades[$id] += $cantidad;
}

$transaccionIniciada = false;

try {
    $conexion->begin_transaction();
    $transaccionIniciada = true;

    $consulta = $conexion->prepare(
        "SELECT stock
         FROM productos
         WHERE id = ? AND activo = 1
         FOR UPDATE"
    );

    $actualizar = $conexion->prepare(
        "UPDATE productos
         SET stock = stock - ?
         WHERE id = ? AND activo = 1 AND stock >= ?"
    );

    foreach ($cantidades as $id => $cantidad) {
        $consulta->bind_param("i", $id);
        $consulta->execute();

        $resultado = $consulta->get_result();
        $producto = $resultado->fetch_assoc();

        if (!$producto) {
            throw new Exception(
                "Uno de los productos ya no está disponible."
            );
        }

        if ((int)$producto["stock"] < $cantidad) {
            throw new Exception(
                "Stock insuficiente para uno de los productos."
            );
        }
    }

    foreach ($cantidades as $id => $cantidad) {
        $actualizar->bind_param(
            "iii",
            $cantidad,
            $id,
            $cantidad
        );

        $actualizar->execute();

        if ($actualizar->affected_rows !== 1) {
            throw new Exception(
                "No se pudo actualizar el stock."
            );
        }
    }

    $conexion->commit();
    $transaccionIniciada = false;

    echo "Compra realizada correctamente. Stock actualizado.";

} catch (Throwable $e) {
    if ($transaccionIniciada) {
        $conexion->rollback();
    }

    errorCompra($e->getMessage());
}

$consulta->close();
$actualizar->close();
$conexion->close();
?>
