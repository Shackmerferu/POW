<?php
header("Content-Type: application/json; charset=utf-8");
require_once "conexion.php";
$id = filter_input(INPUT_POST, "id", FILTER_VALIDATE_INT);
$nombre = trim($_POST["nombre"] ?? "");
$descripcion = trim($_POST["descripcion"] ?? "");
$valor = $_POST["valor"] ?? 0;
if (!$id || $nombre === "" || $descripcion === "" || !is_numeric($valor)) {
    http_response_code(400); echo json_encode(["status"=>400,"mensaje"=>"Datos inválidos"]); exit;
}
try {
    $stmt = $pdo->prepare("UPDATE entidad SET nombre=:nombre, descripcion=:descripcion, valor=:valor WHERE id=:id");
    $stmt->execute([":nombre"=>$nombre,":descripcion"=>$descripcion,":valor"=>$valor,":id"=>$id]);
    echo json_encode(["status"=>200,"mensaje"=>"Actualizado"]);
} catch (Throwable $e) {
    http_response_code(500); echo json_encode(["status"=>500,"mensaje"=>"No se pudo actualizar"]);
}
