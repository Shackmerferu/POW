<?php
// POST multipart con token -> guarda la imagen en uploads/ y crea el registro.
require_once "conexion.php";
exigir_token($pdo);

$nombre      = trim($_POST["nombre"] ?? "");
$descripcion = trim($_POST["descripcion"] ?? "");
$alt         = trim($_POST["texto_alternativo"] ?? "");
$tituloImg   = trim($_POST["titulo_imagen"] ?? "");
$descLarga   = trim($_POST["descripcion_larga"] ?? "");
$titulo      = trim($_POST["titulo"] ?? "");

if ($nombre === "" || $descripcion === "" || !isset($_FILES["imagen"])) {
    http_response_code(400);
    echo json_encode(["status" => 400, "mensaje" => "Faltan datos o imagen"]);
    exit;
}

$archivo = $_FILES["imagen"];
if ($archivo["error"] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(["status" => 400, "mensaje" => "Error al recibir la imagen"]);
    exit;
}

$mime = mime_content_type($archivo["tmp_name"]);
$permitidos = ["image/jpeg" => "jpg", "image/png" => "png", "image/webp" => "webp"];
if (!isset($permitidos[$mime])) {
    http_response_code(400);
    echo json_encode(["status" => 400, "mensaje" => "Formato de imagen no permitido"]);
    exit;
}

$directorio = __DIR__ . "/../uploads/";
if (!is_dir($directorio)) {
    mkdir($directorio, 0775, true);
}

$nombreArchivo = bin2hex(random_bytes(8)) . "." . $permitidos[$mime];
if (!move_uploaded_file($archivo["tmp_name"], $directorio . $nombreArchivo)) {
    http_response_code(500);
    echo json_encode(["status" => 500, "mensaje" => "No se pudo guardar el archivo"]);
    exit;
}

try {
    $stmt = $pdo->prepare(
        "INSERT INTO entidad
            (nombre, descripcion, imagen, texto_alternativo, titulo_imagen, descripcion_larga, categoria)
         VALUES
            (:nombre, :descripcion, :imagen, :alt, :tituloImg, :descLarga, :categoria)"
    );
    $stmt->execute([
        ":nombre"    => $nombre,
        ":descripcion" => $descripcion,
        ":imagen"    => $nombreArchivo,
        ":alt"       => $alt,
        ":tituloImg" => $tituloImg,
        ":descLarga" => $descLarga,
        ":categoria" => $titulo, // se guarda el headline como categoria de ejemplo
    ]);
    echo json_encode([
        "status"  => 200,
        "mensaje" => "Registro con imagen guardado",
        "archivo" => $nombreArchivo,
        "id"      => (int)$pdo->lastInsertId(),
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["status" => 500, "mensaje" => "No se pudo guardar el registro con imagen"]);
}
