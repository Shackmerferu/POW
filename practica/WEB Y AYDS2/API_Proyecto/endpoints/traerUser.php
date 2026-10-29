<?php
require_once "../config/database.php";
header("Content-Type: application/json");

$userId = $_GET["uidd"] ?? null;

$query = $conn->prepare("SELECT premiun, nombre FROM usuario WHERE uidd = ?");
$query->bind_param("s", $userId);
$query->execute();
$result = $query->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode([
        "premiun" => $row["premiun"],
        "nombre" => $row["nombre"]
    ]);
} else {
    echo json_encode([
        "premiun" => 15, // o null
        "mensaje" => "Usuario no encontrado"
    ]);
}

$conn->close();
?>