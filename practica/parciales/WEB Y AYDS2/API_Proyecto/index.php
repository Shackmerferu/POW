<?php
header("Content-Type: application/json; charset=utf-8");

echo json_encode([
    "nombre_api" => "API del Museo de Ciencias Naturales de La Pampa",
    "version" => "1.0",
    "endpoints_disponibles" => [
        "GET  /endpoints/list.php" => "Listar todas las imágenes y metadatos",
        "POST /endpoints/upload.php" => "Subir nueva imagen y metadatos",
        "POST /endpoints/update.php" => "Actualizar metadatos de una imagen",
        "DELETE /endpoints/delete.php" => "Eliminar una imagen"
    ]
]);
?>