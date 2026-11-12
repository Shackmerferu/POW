<?php
// GET ?token=XXX -> valida el token contra la tabla usuarios.
require_once "conexion.php";

$usuario = exigir_token($pdo);

echo json_encode([
    "status" => 200,
    "mensaje" => "Token valido",
    "usuario" => $usuario["usuario"],
]);
