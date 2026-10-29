<?php

// Inicia o recupera la sesión del usuario.
// Permite acceder a los datos guardados en $_SESSION.
session_start();

// Incluye el archivo que contiene la conexión a la base de datos.
require_once __DIR__ . "/conexion.php";

// Indica que la respuesta del servidor será texto plano en UTF-8.
header("Content-Type: text/plain; charset=UTF-8");

// Función auxiliar para devolver un error HTTP y finalizar el script.
// $mensaje: texto que recibirá el cliente.
// $codigo: código HTTP; por defecto, 400 (solicitud incorrecta).
function errorCompra($mensaje, $codigo = 400)
{
    http_response_code($codigo);
    exit($mensaje);
}

// Verifica que la petición se haya enviado mediante POST.
// Si se usa otro método, devuelve 405 (método no permitido).
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    errorCompra("Método no permitido.", 405);
}

// Comprueba que exista un usuario autenticado en la sesión.
// Si no inició sesión, devuelve 401 (no autorizado).
if (!isset($_SESSION["usuario"]["id"])) {
    errorCompra("Iniciá sesión para comprar.", 401);
}

// Obtiene el token de seguridad guardado en la sesión.
$tokenSesion = $_SESSION["token"] ?? "";

// Obtiene el token enviado por el cliente mediante POST.
$tokenRecibido = $_POST["token"] ?? "";

// Verifica que ambos tokens existan y coincidan.
// hash_equals() compara los valores de forma segura.
// Esto ayuda a prevenir ataques CSRF.
if (
    $tokenSesion === "" ||
    $tokenRecibido === "" ||
    !hash_equals($tokenSesion, $tokenRecibido)
) {
    errorCompra("Token de seguridad inválido.", 403);
}

// Convierte el JSON del carrito en un array asociativo de PHP.
// El segundo argumento true hace que los objetos JSON se conviertan
// en arrays asociativos en lugar de objetos.
$carrito = json_decode($_POST["carrito"] ?? "", true);

// Verifica que el carrito se haya convertido correctamente
// en un array y que contenga al menos un elemento.
if (!is_array($carrito) || count($carrito) === 0) {
    errorCompra("El carrito está vacío.");
}

// Array que almacenará las cantidades totales por producto.
// Ejemplo: si el producto 5 aparece dos veces, suma ambas cantidades.
$cantidades = [];

foreach ($carrito as $item) {

    // Valida que el ID del producto sea un número entero.
    $id = filter_var(
        $item["id"] ?? null,
        FILTER_VALIDATE_INT
    );

    // Valida que la cantidad también sea un número entero.
    $cantidad = filter_var(
        $item["cantidad"] ?? null,
        FILTER_VALIDATE_INT
    );

    // Rechaza IDs inválidos, cantidades inválidas
    // y cantidades menores que uno.
    if (!$id || !$cantidad || $cantidad < 1) {
        errorCompra("Producto o cantidad inválida.");
    }

    // Inicializa la cantidad acumulada si es la primera
    // vez que aparece ese producto.
    if (!isset($cantidades[$id])) {
        $cantidades[$id] = 0;
    }

    // Suma la cantidad solicitada a la cantidad acumulada.
    $cantidades[$id] += $cantidad;
}

// Indica si hay una transacción abierta.
// Sirve para saber si corresponde ejecutar un rollback
// en caso de que ocurra un error.
$transaccionIniciada = false;

try {

    // Inicia una transacción SQL.
    // Los cambios podrán confirmarse todos juntos o deshacerse.
    $conexion->begin_transaction();

    $transaccionIniciada = true;

    // Prepara una consulta para obtener el stock de un producto.
    // Solo considera productos activos.
    // FOR UPDATE bloquea las filas seleccionadas para evitar
    // que otra transacción las modifique simultáneamente.
    $consulta = $conexion->prepare(
        "SELECT stock
         FROM productos
         WHERE id = ? AND activo = 1
         FOR UPDATE"
    );

    // Prepara la actualización del stock.
    // Descuenta la cantidad únicamente si el producto está activo
    // y todavía tiene stock suficiente.
    $actualizar = $conexion->prepare(
        "UPDATE productos
         SET stock = stock - ?
         WHERE id = ? AND activo = 1 AND stock >= ?"
    );

    // PRIMER RECORRIDO:
    // Comprueba que todos los productos existan, estén activos
    // y tengan stock suficiente antes de descontar nada.
    foreach ($cantidades as $id => $cantidad) {

        // Vincula el ID con el parámetro ? de la consulta.
        // "i" indica que el parámetro es un entero.
        $consulta->bind_param("i", $id);

        // Ejecuta la consulta.
        $consulta->execute();

        // Obtiene el resultado de la consulta.
        $resultado = $consulta->get_result();

        // Recupera la fila como un array asociativo.
        $producto = $resultado->fetch_assoc();

        // Si no hay fila, el producto no existe
        // o no está activo.
        if (!$producto) {
            throw new Exception(
                "Uno de los productos ya no está disponible."
            );
        }

        // Compara el stock disponible con la cantidad solicitada.
        if ((int) $producto["stock"] < $cantidad) {
            throw new Exception(
                "Stock insuficiente para uno de los productos."
            );
        }
    }

    // SEGUNDO RECORRIDO:
    // Como ya se validaron todos los productos,
    // comienza a descontar el stock de cada uno.
    foreach ($cantidades as $id => $cantidad) {

        // Vincula los tres parámetros de la consulta UPDATE:
        // 1. Cantidad que se descuenta.
        // 2. ID del producto.
        // 3. Cantidad mínima de stock que debe haber disponible.
        $actualizar->bind_param(
            "iii",
            $cantidad,
            $id,
            $cantidad
        );

        // Ejecuta la actualización del stock.
        $actualizar->execute();

        // Si no se modificó exactamente una fila,
        // considera que la actualización falló.
        if ($actualizar->affected_rows !== 1) {
            throw new Exception(
                "No se pudo actualizar el stock."
            );
        }
    }

    // Confirma la transacción.
    // Los descuentos de stock quedan guardados en la base de datos.
    $conexion->commit();

    // Marca la transacción como finalizada.
    $transaccionIniciada = false;

    // Informa al cliente que la operación terminó correctamente.
    echo "Compra realizada correctamente. Stock actualizado.";

} catch (Throwable $e) {

    // Si hubo un error mientras la transacción estaba abierta,
    // deshace todos los cambios realizados en ella.
    if ($transaccionIniciada) {
        $conexion->rollback();
    }

    // Devuelve el mensaje del error y finaliza el script.
    errorCompra($e->getMessage());
}

// Cierra las consultas preparadas.
$consulta->close();
$actualizar->close();

// Cierra la conexión a la base de datos.
$conexion->close();

?>