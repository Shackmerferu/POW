<?php
// GET con token -> devuelve todos los registros de la entidad.
require_once "conexion.php";
exigir_token($pdo);

try {
    $stmt = $pdo->query(
        "SELECT id, nombre, descripcion, valor, categoria, imagen,
                texto_alternativo, titulo_imagen, descripcion_larga
         FROM entidad ORDER BY id"
    );
    echo json_encode(["status" => 200, "registros" => $stmt->fetchAll()]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["status" => 500, "mensaje" => "No se pudo listar"]);
}
