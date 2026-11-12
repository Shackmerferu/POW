<?php
header("Content-Type: application/json; charset=utf-8");
require_once "conexion.php";
try {
    $stmt = $pdo->query("SELECT id, nombre, descripcion, valor FROM entidad ORDER BY id");
    echo json_encode(["status" => 200, "registros" => $stmt->fetchAll()]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["status" => 500, "mensaje" => "No se pudo listar"]);
}
