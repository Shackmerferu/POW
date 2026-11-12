<?php
// Conexion PDO usada por todos los endpoints de api/.
// Ajustar base, usuario y contraseña si el parcial lo pide.
header("Content-Type: application/json; charset=utf-8");

$host = "localhost";
$db   = "parcial";
$user = "root";
$pass = "";

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$db;charset=utf8mb4",
        $user,
        $pass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => 500, "mensaje" => "Error de conexion con la base de datos"]);
    exit;
}

// Verifica el token recibido por query (?token=) o por POST.
// Devuelve los datos del usuario o corta la ejecucion con 401.
function exigir_token(PDO $pdo): array
{
    $token = trim($_GET["token"] ?? $_POST["token"] ?? "");
    if ($token === "") {
        http_response_code(401);
        echo json_encode(["status" => 401, "mensaje" => "Token no enviado"]);
        exit;
    }
    $stmt = $pdo->prepare("SELECT id, usuario FROM usuarios WHERE token = :token LIMIT 1");
    $stmt->execute([":token" => $token]);
    $usuario = $stmt->fetch();
    if (!$usuario) {
        http_response_code(403);
        echo json_encode(["status" => 403, "mensaje" => "Token invalido o vencido"]);
        exit;
    }
    return $usuario;
}
