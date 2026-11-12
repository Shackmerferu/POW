<?php
// POST usuario + clave -> genera token, lo guarda en la tabla usuarios y lo devuelve.
require_once "conexion.php";

$usuario = trim($_POST["usuario"] ?? "");
$clave   = $_POST["clave"] ?? "";

if ($usuario === "" || $clave === "") {
    http_response_code(400);
    echo json_encode(["status" => 400, "mensaje" => "Faltan usuario o clave"]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id, usuario, clave FROM usuarios WHERE usuario = :usuario LIMIT 1");
    $stmt->execute([":usuario" => $usuario]);
    $fila = $stmt->fetch();

    if (!$fila || !password_verify($clave, $fila["clave"])) {
        http_response_code(401);
        echo json_encode(["status" => 401, "mensaje" => "Usuario o clave incorrectos"]);
        exit;
    }

    // Token aleatorio de 32 caracteres hexadecimales.
    $token = bin2hex(random_bytes(16));

    $upd = $pdo->prepare("UPDATE usuarios SET token = :token WHERE id = :id");
    $upd->execute([":token" => $token, ":id" => $fila["id"]]);

    echo json_encode(["status" => 200, "mensaje" => "Login correcto", "token" => $token]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["status" => 500, "mensaje" => "Error en el login"]);
}
