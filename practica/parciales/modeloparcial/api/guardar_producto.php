<?php

// Inicia o recupera la sesión del usuario.
session_start();

// Incluye la conexión con la base de datos.
require_once "conexion.php";

// VERIFICAR EL MÉTODO HTTP.

// Comprueba que la petición se haya enviado mediante POST.
if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    // Devuelve el código HTTP 405: método no permitido.
    http_response_code(405);

    // Muestra el mensaje y finaliza el script.
    exit("Método no permitido");
}

// VERIFICAR LOS PERMISOS.

// Comprueba que exista un usuario en la sesión
// y que su rol sea "admin".
if (
    empty($_SESSION["usuario"]) ||
    $_SESSION["usuario"]["rol"] !== "admin"
) {

    // Devuelve el código HTTP 403: acceso prohibido.
    http_response_code(403);

    // Finaliza la ejecución.
    exit("No autorizado.");
}

// VALIDAR EL TOKEN DE SEGURIDAD.

// Obtiene el token enviado mediante POST.
// Si no se envió, utiliza una cadena vacía.
$token = $_POST["token"] ?? "";

// Comprueba que exista el token de la sesión
// y que coincida con el recibido.
// Esto ayuda a prevenir ataques CSRF.
if (
    empty($_SESSION["token"]) ||
    !hash_equals($_SESSION["token"], $token)
) {

    // Devuelve el código HTTP 403.
    http_response_code(403);

    // Finaliza la ejecución si el token no es válido.
    exit("Token inválido.");
}

// OBTENER Y LIMPIAR LOS DATOS.

// Convierte el ID recibido a entero.
// Un ID mayor que cero indica que se quiere editar.
// Un ID igual a cero o negativo hará que se intente insertar.
$id = (int) ($_POST["id"] ?? 0);

// Obtiene el nombre y elimina los espacios
// al principio y al final.
$nombre = trim($_POST["nombre"] ?? "");

// Obtiene la descripción y elimina los espacios exteriores.
$descripcion = trim($_POST["descripcion"] ?? "");

// Valida el precio como número decimal.
// Si el valor no es válido, devuelve false.
$precio = filter_var(
    $_POST["precio"] ?? null,
    FILTER_VALIDATE_FLOAT
);

// Obtiene la ruta o el nombre de la imagen.
$imagen = trim($_POST["imagen"] ?? "");

// Obtiene la categoría seleccionada.
$categoria = $_POST["categoria"] ?? "";

// Valida el stock como número entero.
// Si el valor no es válido, devuelve false.
$stock = filter_var(
    $_POST["stock"] ?? null,
    FILTER_VALIDATE_INT
);

// VALIDAR LOS DATOS.

// Rechaza el nombre vacío, el precio inválido o menor o igual a cero,
// el stock inválido o negativo y las categorías no permitidas.
if (
    $nombre === "" ||
    $precio === false || $precio <= 0 ||
    $stock === false || $stock < 0 ||
    !in_array($categoria, ["termo", "mate"], true)
) {

    // Devuelve el código HTTP 400: datos incorrectos.
    http_response_code(400);

    // Finaliza el script sin guardar el producto.
    exit("Datos inválidos.");
}

// DECIDIR ENTRE EDITAR O CREAR.

// Si el ID es mayor que cero, se intenta editar un producto existente.
if ($id > 0) {

    // Prepara una consulta UPDATE.
    // Modifica los datos del producto indicado por su ID.
    // Solo permite actualizar productos que estén activos.
    $stmt = $conexion->prepare(
        "UPDATE productos
         SET nombre=?, descripcion=?, precio=?,
             imagen=?, categoria=?, stock=?
         WHERE id=? AND activo=1"
    );

    // Asocia los valores con los signos ? de la consulta.
    //
    // "ssdssii" indica los tipos de los parámetros:
    // s = cadena (nombre)
    // s = cadena (descripción)
    // d = número decimal (precio)
    // s = cadena (imagen)
    // s = cadena (categoría)
    // i = entero (stock)
    // i = entero (ID)
    $stmt->bind_param(
        "ssdssii",
        $nombre,
        $descripcion,
        $precio,
        $imagen,
        $categoria,
        $stock,
        $id
    );

} else {

    // Si el ID no es mayor que cero, se intenta crear un producto.
    // Prepara una consulta INSERT para agregar un registro nuevo.
    $stmt = $conexion->prepare(
        "INSERT INTO productos
         (nombre, descripcion, precio, imagen, categoria, stock)
         VALUES (?, ?, ?, ?, ?, ?)"
    );

    // Asocia los datos con los seis parámetros.
    //
    // "ssdssi" significa:
    // s = nombre
    // s = descripción
    // d = precio decimal
    // s = imagen
    // s = categoría
    // i = stock entero
    $stmt->bind_param(
        "ssdssi",
        $nombre,
        $descripcion,
        $precio,
        $imagen,
        $categoria,
        $stock
    );
}

// EJECUTAR LA OPERACIÓN.

// Ejecuta el UPDATE o el INSERT, según el caso.
if ($stmt->execute()) {

    // Si la consulta se ejecutó correctamente,
    // devuelve "OK" al cliente.
    echo "OK";

} else {

    // Si ocurre un error durante la ejecución,
    // devuelve el código HTTP 500.
    http_response_code(500);

    // Muestra un mensaje genérico.
    echo "Error al guardar.";
}

?>