<?php
header("Content-Type: application/json; charset=utf-8");
require_once "conexion.php";
$nombre = trim($_POST["nombre"] ?? "");
$descripcion = trim($_POST["descripcion"] ?? "");
$valor = $_POST["valor"] ?? 0;
if ($nombre === "" || $descripcion === "" || !is_numeric($valor)) {
    http_response_code(400);
    echo json_encode(["status" => 400, "mensaje" => "Datos inválidos"]);
    exit;
}
try {
    $sql = "INSERT INTO entidad (nombre, descripcion, valor) VALUES (:nombre, :descripcion, :valor)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([":nombre"=>$nombre, ":descripcion"=>$descripcion, ":valor"=>$valor]);
    echo json_encode(["status"=>200, "mensaje"=>"Creado", "id"=>$pdo->lastInsertId()]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["status"=>500, "mensaje"=>"No se pudo guardar"]);
}
