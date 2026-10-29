<?php
header("Content-Type: application/json; charset=UTF-8");
require_once "../config/database.php";

$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['id'])) {
    echo json_encode(["error" => "Falta el ID"]);
    exit;
}

$id = intval($input['id']);

// Buscar la imagen en la base de datos
$sql = "SELECT ruta FROM imagenes WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["error" => "Imagen no encontrada"]);
    exit;
}

$row = $result->fetch_assoc();
$rutaRelativa = $row['ruta']; // ej: "uploads/imagen.jpg"

// Construir la ruta física completa
$baseDir = realpath(__DIR__);  // ruta base de tu proyecto
$rutaFisica = $baseDir . DIRECTORY_SEPARATOR . $rutaRelativa;

// Normalizamos separadores por seguridad
$rutaFisica = str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $rutaFisica);

// Verificar y eliminar el archivo físico
if (file_exists($rutaFisica)) {
    if (unlink($rutaFisica)) {
        $archivoEliminado = true;
    } else {
        $archivoEliminado = false;
    }
} else {
    $archivoEliminado = false;
}

// Eliminar el registro de la base de datos
$sqlDelete = "DELETE FROM imagenes WHERE id = ?";
$stmtDelete = $conn->prepare($sqlDelete);
$stmtDelete->bind_param("i", $id);

if ($stmtDelete->execute()) {
    echo json_encode([
        "success" => true,
        "mensaje" => "Imagen eliminada correctamente",
        "archivo_eliminado" => $archivoEliminado,
        "ruta_fisica" => $rutaFisica
    ]);
} else {
    echo json_encode([
        "error" => "Error al eliminar el registro",
        "archivo_eliminado" => $archivoEliminado,
        "ruta_fisica" => $rutaFisica
    ]);
}
