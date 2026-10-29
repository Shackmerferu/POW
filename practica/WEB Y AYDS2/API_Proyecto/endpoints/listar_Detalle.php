<?php
require_once "../config/database.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

// Verificar que se haya enviado el id
if (!isset($_GET['id'])) {
    echo json_encode(["error" => "Falta el parámetro 'id'"]);
    exit;
}

$id = $_GET['id'];

// Preparar consulta
$sql = "SELECT * FROM imagenes WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id); // 'i' porque es un número entero
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    $imagen = $result->fetch_assoc();
    echo json_encode($imagen, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(["error" => "No se encontró la exhibición"]);
}

$stmt->close();
$conn->close();
?>