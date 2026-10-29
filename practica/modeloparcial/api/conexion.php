<?php
$conexion = new mysqli(
    "localhost",
    "root",
    "",
    "termo_store" //cambiar
);

if ($conexion->connect_error) {
    die("Error de conexión a la base de datos.");
}

$conexion->set_charset("utf8mb4");
?>