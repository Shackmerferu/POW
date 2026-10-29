```php
<?php

// =====================================================
// 1. INICIALIZACIÓN Y CONFIGURACIÓN
// =====================================================

session_start();

require_once __DIR__ . "/conexion.php";

header("Content-Type: text/plain; charset=UTF-8");

// Devuelve un mensaje de error y finaliza la petición.
function errorCompra($mensaje, $codigo = 400)
{
    http_response_code($codigo);
    exit($mensaje);
}

// =====================================================
// 2. VALIDACIÓN DE LA PETICIÓN Y DEL USUARIO
// =====================================================

// Solo se permiten peticiones POST.
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    errorCompra("Método no permitido.", 405);
}

// Debe existir un usuario autenticado.
if (
    !isset($_SESSION["usuario"]) ||
    !isset($_SESSION["usuario"]["id"])
) {
    errorCompra("Iniciá sesión para comprar.", 401);
}

// IMPORTANTE:
// Se supone que el rol está guardado en
// $_SESSION["usuario"]["rol"].
// Si tu login utiliza otra clave, adaptá esta validación.
$rol = $_SESSION["usuario"]["rol"] ?? "";

// Solo los clientes pueden comprar.
if ($rol !== "cliente") {
    errorCompra(
        "No tenés permisos para realizar compras.",
        403
    );
}

// =====================================================
// 3. VALIDACIÓN DEL TOKEN CSRF
// =====================================================

$tokenSesion = $_SESSION["token"] ?? "";
$tokenRecibido = $_POST["token"] ?? "";

if (
    !is_string($tokenSesion) ||
    !is_string($tokenRecibido) ||
    $tokenSesion === "" ||
    $tokenRecibido === "" ||
    !hash_equals($tokenSesion, $tokenRecibido)
) {
    errorCompra("Token de seguridad inválido.", 403);
}

// =====================================================
// 4. VALIDACIÓN DEL CARRITO
// =====================================================

$carritoJSON = $_POST["carrito"] ?? "";

if (!is_string($carritoJSON) || $carritoJSON === "") {
    errorCompra("No se recibió un carrito válido.");
}

// Convierte el JSON en un array asociativo.
$carrito = json_decode($carritoJSON, true);

// Comprueba que el JSON sea válido y contenga productos.
if (
    json_last_error() !== JSON_ERROR_NONE ||
    !is_array($carrito) ||
    count($carrito) === 0
) {
    errorCompra("El carrito está vacío o tiene un formato inválido.");
}

// Evita procesar carritos excesivamente grandes.
if (count($carrito) > 100) {
    errorCompra("El carrito contiene demasiados productos.");
}

// Acumula las cantidades por ID de producto.
$cantidades = [];

foreach ($carrito as $item) {

    if (!is_array($item)) {
        errorCompra("Los datos de un producto son inválidos.");
    }

    // El cliente solo necesita enviar ID y cantidad.
    // No aceptamos precios ni stock como datos confiables.
    $id = filter_var(
        $item["id"] ?? null,
        FILTER_VALIDATE_INT,
        ["options" => ["min_range" => 1]]
    );

    $cantidad = filter_var(
        $item["cantidad"] ?? null,
        FILTER_VALIDATE_INT,
        ["options" => ["min_range" => 1]]
    );

    if ($id === false || $cantidad === false) {
        errorCompra("Producto o cantidad inválida.");
    }

    // Evita cantidades excesivas y desbordamientos.
    if ($cantidad > 100000) {
        errorCompra("La cantidad solicitada no es válida.");
    }

    if (!isset($cantidades[$id])) {
        $cantidades[$id] = 0;
    }

    $cantidades[$id] += $cantidad;

    if ($cantidades[$id] > 100000) {
        errorCompra("La cantidad solicitada no es válida.");
    }
}

// =====================================================
// 5. TRANSACCIÓN Y VALIDACIÓN DEL STOCK
// =====================================================

$transaccionIniciada = false;
$consulta = null;
$actualizar = null;

try {

    // Inicia una transacción SQL.
    $conexion->begin_transaction();
    $transaccionIniciada = true;

    // Consulta el stock y bloquea las filas seleccionadas.
    // Esto evita que otras transacciones descuenten
    // simultáneamente el mismo stock sin coordinación.
    $consulta = $conexion->prepare(
        "SELECT stock
         FROM productos
         WHERE id = ? AND activo = 1
         FOR UPDATE"
    );

    // Prepara el descuento de stock.
    // La condición stock >= cantidad actúa como
    // una segunda comprobación de seguridad.
    $actualizar = $conexion->prepare(
        "UPDATE productos
         SET stock = stock - ?
         WHERE id = ?
           AND activo = 1
           AND stock >= ?"
    );

    // PRIMER RECORRIDO:
    // Verifica todos los productos antes de descontar stock.
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

        if ((int) $producto["stock"] < $cantidad) {
            throw new Exception(
                "Stock insuficiente para uno de los productos."
            );
        }
    }

    // SEGUNDO RECORRIDO:
    // Descuenta el stock después de validar todos los productos.
    foreach ($cantidades as $id => $cantidad) {

        $actualizar->bind_param(
            "iii",
            $cantidad,
            $id,
            $cantidad
        );

        $actualizar->execute();

        // Cada UPDATE debe modificar exactamente una fila.
        if ($actualizar->affected_rows !== 1) {
            throw new Exception(
                "No se pudo actualizar el stock."
            );
        }
    }

    // Confirma todos los descuentos juntos.
    $conexion->commit();
    $transaccionIniciada = false;

    echo "Compra realizada correctamente. Stock actualizado.";

} catch (Throwable $e) {

    // Si alguna operación falla, deshace todos los descuentos.
    if ($transaccionIniciada) {
        try {
            $conexion->rollback();
        } catch (Throwable $errorRollback) {
            error_log(
                "Error al revertir la compra: " .
                $errorRollback->getMessage()
            );
        }
    }

    // Guarda el error técnico en el registro del servidor.
    error_log("Error en comprar.php: " . $e->getMessage());

    // Los errores de validación se muestran al cliente.
    // Los errores internos de SQL no se exponen.
    if ($e instanceof mysqli_sql_exception) {
        errorCompra(
            "Ocurrió un error al procesar la compra.",
            500
        );
    }

    errorCompra($e->getMessage());
    
} finally {

    // Cierra las consultas preparadas si fueron creadas.
    if ($consulta !== null) {
        $consulta->close();
    }

    if ($actualizar !== null) {
        $actualizar->close();
    }

    // Cierra la conexión.
    $conexion->close();
}

?>
```