<?php
require_once "../config/database.php";
header("Content-Type: application/json");

$userId = $_GET["uidd"] ?? null;
$exhibicionId = $_GET["id_imagen"] ?? null;

if (!$userId || !$exhibicionId) {
    echo json_encode(["liked" => false]);
    exit;
}



$query = $conn->prepare("SELECT id_megusta FROM me_gusta WHERE uidd = ? AND id_imagen = ?");
$query->bind_param("ii", $userId, $exhibicionId);
$query->execute();
$result = $query->get_result();

$liked = $result->num_rows > 0;

echo json_encode(["liked" => $liked]);
$conn->close();
?>