<?php
// POST con token -> actualiza un registro existente (requiere id).
require_once "conexion.php";
exigir_token($pdo);

$id          = filter_input(INPUT_POST, "id", FILTER_VALIDATE_INT);
$nombre      = trim($_POST["nombre"] ?? "");
$descripcion = trim($_POST["descripcion"] ?? "");
$valor       = $_POST["valor"] ?? "0";
$categoria   = trim($_POST["categoria"] ?? "");

if (!$id || $nombre === "" || $descripcion === "" || !is_numeric($valor)) {
    http_response_code(400);
    echo json_encode(["status" => 400, "mensaje" => "Datos invalidos"]);
    exit;
}

try {
    $stmt = $pdo->prepare(
        "UPDATE entidad
         SET nombre = :nombre, descripcion = :descripcion,
             valor = :valor, categoria = :categoria
         WHERE id = :id"
    );
    $stmt->execute([
        ":nombre"      => $nombre,
        ":descripcion" => $descripcion,
        ":valor"       => $valor,
        ":categoria"   => $categoria,
        ":id"          => $id,
    ]);
    echo json_encode(["status" => 200, "mensaje" => "Registro actualizado"]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["status" => 500, "mensaje" => "No se pudo actualizar"]);
}
