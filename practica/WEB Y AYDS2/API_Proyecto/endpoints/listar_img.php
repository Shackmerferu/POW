<?php
require_once "../config/database.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

// Leer parámetro GET (si existe)
$categoria = isset($_GET['categoria']) ? trim($_GET['categoria']) : null;
$query = isset($_GET['query']) ? trim($_GET['query']) : null;

// Consulta base
$sql = "SELECT * FROM imagenes";
$conditions = [];
$params = [];
$types = "";

// Filtros dinámicos
if ($categoria) {
    $conditions[] = "categoria = ?";
    $params[] = $categoria;
    $types .= "s";
}

if ($query) {
    $conditions[] = "(titulo LIKE ? OR descripcion LIKE ?)";
    $searchTerm = "%" . $query . "%";
    $params[] = $searchTerm;
    $params[] = $searchTerm;
    $types .= "ss";
}

// Unir condiciones con AND si hay alguna
if (!empty($conditions)) {
    $sql .= " WHERE " . implode(" AND ", $conditions);
}

// Preparar y ejecutar
$stmt = $conn->prepare($sql);

if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

$imagenes = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $imagenes[] = $row;
    }
}

echo json_encode($imagenes, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

$stmt->close();
$conn->close();
?>
