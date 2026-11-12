<?php
header("Content-Type: application/json; charset=utf-8");
require_once "conexion.php";
$nombre = trim($_POST["nombre"] ?? "");
$descripcion = trim($_POST["descripcion"] ?? "");
if ($nombre === "" || $descripcion === "" || !isset($_FILES["imagen"])) {
    http_response_code(400); echo json_encode(["status"=>400,"mensaje"=>"Faltan datos o imagen"]); exit;
}
$archivo = $_FILES["imagen"];
if ($archivo["error"] !== UPLOAD_ERR_OK) {
    http_response_code(400); echo json_encode(["status"=>400,"mensaje"=>"Error al recibir imagen"]); exit;
}
$mime = mime_content_type($archivo["tmp_name"]);
$permitidos = ["image/jpeg"=>"jpg", "image/png"=>"png", "image/webp"=>"webp"];
if (!isset($permitidos[$mime])) {
    http_response_code(400); echo json_encode(["status"=>400,"mensaje"=>"Formato no permitido"]); exit;
}
$directorio = __DIR__ . "/../uploads/";
if (!is_dir($directorio)) mkdir($directorio, 0775, true);
$nombreArchivo = bin2hex(random_bytes(8)) . "." . $permitidos[$mime];
if (!move_uploaded_file($archivo["tmp_name"], $directorio . $nombreArchivo)) {
    http_response_code(500); echo json_encode(["status"=>500,"mensaje"=>"No se pudo guardar archivo"]); exit;
}
$stmt = $pdo->prepare("INSERT INTO entidad (nombre, descripcion, imagen) VALUES (:n,:d,:i)");
$stmt->execute([":n"=>$nombre,":d"=>$descripcion,":i"=>$nombreArchivo]);
echo json_encode(["status"=>200,"mensaje"=>"Imagen guardada","archivo"=>$nombreArchivo]);
