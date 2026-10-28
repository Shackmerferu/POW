<?php
$server_db   = "localhost";
$usuario_db  = "root";
$password_db = "";
$base_db     = "bd_guia";

$conexion = mysqli_connect($server_db, $usuario_db, $password_db, $base_db);

if (!$conexion) {
    die(json_encode([
        'status' => 500,
        'mensaje' => 'Error al conectar con la base de datos: ' . mysqli_connect_error()
    ]));
}

mysqli_set_charset($conexion, "utf8mb4");
?>