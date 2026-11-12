<?php
// Ajustar servidor, base, usuario y contraseña.
$host = "localhost";
$db   = "NOMBRE_BASE";
$user = "root";
$pass = "";
try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$db;charset=utf8mb4",
        $user,
        $pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
         PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => 500, "mensaje" => "Error de conexión"]);
    exit;
}
