<?php
session_start();
require_once "conexion.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    exit("Método no permitido");
}

if (empty($_SESSION["usuario"]) ||
    $_SESSION["usuario"]["rol"] !== "admin") {
    http_response_code(403);
    exit("No autorizado.");
}

$token = $_POST["token"] ?? "";

if (
    empty($_SESSION["token"]) ||
    !hash_equals($_SESSION["token"], $token)
) {
    http_response_code(403);
    exit("Token inválido.");
}

$id = (int) ($_POST["id"] ?? 0);
$nombre = trim($_POST["nombre"] ?? "");
$descripcion = trim($_POST["descripcion"] ?? "");
$precio = filter_var($_POST["precio"] ?? null, FILTER_VALIDATE_FLOAT);
$imagen = trim($_POST["imagen"] ?? "");
$categoria = $_POST["categoria"] ?? "";
$stock = filter_var($_POST["stock"] ?? null, FILTER_VALIDATE_INT);

if (
    $nombre === "" ||
    $precio === false || $precio <= 0 ||
    $stock === false || $stock < 0 ||
    !in_array($categoria, ["termo", "mate"], true)
) {
    http_response_code(400);
    exit("Datos inválidos.");
}

if ($id > 0) {
    $stmt = $conexion->prepare(
        "UPDATE productos
         SET nombre=?, descripcion=?, precio=?,
             imagen=?, categoria=?, stock=?
         WHERE id=? AND activo=1"
    );

    $stmt->bind_param(
        "ssdssii",
        $nombre, $descripcion, $precio,
        $imagen, $categoria, $stock, $id
    );
} else {
    $stmt = $conexion->prepare(
        "INSERT INTO productos
         (nombre, descripcion, precio, imagen, categoria, stock)
         VALUES (?, ?, ?, ?, ?, ?)"
    );

    $stmt->bind_param(
        "ssdssi",
        $nombre, $descripcion, $precio,
        $imagen, $categoria, $stock
    );
}

if ($stmt->execute()) {
    echo "OK";
} else {
    http_response_code(500);
    echo "Error al guardar.";
}
?>