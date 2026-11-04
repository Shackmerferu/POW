<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once "../config/database.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, POST");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json; charset=utf-8');

// Manejo de OPTIONS (preflight)
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

/*if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["error" => "Metodo no permitido"]);
    exit;
}*/

if (isset($_POST['uidd']) && isset($_POST['premiun'])) {

    $uid = $_POST['uidd'];
    $premiun = $_POST['premiun'];

    $sql = "UPDATE usuario SET premiun = ? WHERE uidd = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $premiun, $uid);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "mensaje" => "usuario actualizado correctamente"]);
    } else {
        echo json_encode(["error" => "Error al actualizar usuario"]);
    }
} else {
    echo json_encode(["error" => "Parámetros incompletos"]);
}
?>