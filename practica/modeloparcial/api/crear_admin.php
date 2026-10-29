<?php
require_once "conexion.php";

$nombre = "Administrador";
$email = "admin@termostore.com";
$password = password_hash("Admin123!", PASSWORD_DEFAULT);
$rol = "admin";

$stmt = $conexion->prepare(
    "INSERT INTO usuarios (nombre, email, password, rol)
     VALUES (?, ?, ?, ?)"
);

$stmt->bind_param("ssss", $nombre, $email, $password, $rol);

if ($stmt->execute()) {
    echo "Administrador creado. Eliminá este archivo.";
} else {
    echo "No se pudo crear. Verificá si el usuario ya existe.";
}
?>
