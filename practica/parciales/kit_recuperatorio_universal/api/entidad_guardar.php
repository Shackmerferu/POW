<?php
// POST con token -> crea un registro de entidad.
require_once "conexion.php";
exigir_token($pdo);

$nombre      = trim($_POST["nombre"] ?? "");
$descripcion = trim($_POST["descripcion"] ?? "");
$valor       = $_POST["valor"] ?? "0";
$categoria   = trim($_POST["categoria"] ?? "");

if ($nombre === "" || $descripcion === "" || !is_numeric($valor)) {
    http_response_code(400);
    echo json_encode(["status" => 400, "mensaje" => "Datos invalidos"]);
    exit;
}

try {
    $stmt = $pdo->prepare(
        "INSERT INTO entidad (nombre, descripcion, valor, categoria)
         VALUES (:nombre, :descripcion, :valor, :categoria)"
    );
    $stmt->execute([
        ":nombre"      => $nombre,
        ":descripcion" => $descripcion,
        ":valor"       => $valor,
        ":categoria"   => $categoria,
    ]);
    echo json_encode(["status" => 200, "mensaje" => "Registro creado", "id" => (int)$pdo->lastInsertId()]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["status" => 500, "mensaje" => "No se pudo guardar"]);
}
