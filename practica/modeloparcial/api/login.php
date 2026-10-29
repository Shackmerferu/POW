<?php
session_start();
require_once "conexion.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    exit("Método no permitido");
}

$email = trim($_POST["email"] ?? "");
$password = $_POST["password"] ?? "";

$stmt = $conexion->prepare(
    "SELECT id, nombre, email, password, rol
     FROM usuarios
     WHERE email = ?"
);

$stmt->bind_param("s", $email);
$stmt->execute();

$resultado = $stmt->get_result();
$usuario = $resultado->fetch_assoc();

if (!$usuario || !password_verify($password, $usuario["password"])) {
    http_response_code(401);
    exit("Correo o contraseña incorrectos.");
}

session_regenerate_id(true);

$_SESSION["usuario"] = [
    "id" => $usuario["id"],
    "nombre" => $usuario["nombre"],
    "email" => $usuario["email"],
    "rol" => $usuario["rol"]
];

$_SESSION["token"] = bin2hex(random_bytes(32));

echo "OK";
?>