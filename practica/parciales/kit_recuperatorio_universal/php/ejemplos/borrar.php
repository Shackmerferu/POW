<?php
header("Content-Type: application/json; charset=utf-8");
require_once "conexion.php";
$id = filter_input(INPUT_POST, "id", FILTER_VALIDATE_INT);
if (!$id) { http_response_code(400); echo json_encode(["status"=>400,"mensaje"=>"ID inválido"]); exit; }
try {
    $stmt = $pdo->prepare("DELETE FROM entidad WHERE id=:id");
    $stmt->execute([":id"=>$id]);
    echo json_encode(["status"=>200,"mensaje"=>"Eliminado"]);
} catch (Throwable $e) {
    http_response_code(500); echo json_encode(["status"=>500,"mensaje"=>"No se pudo eliminar"]);
}
