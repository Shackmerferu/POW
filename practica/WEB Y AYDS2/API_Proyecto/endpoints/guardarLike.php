<?php
require_once "../config/database.php";
header("Content-Type: application/json");

//Recibir JSON del fetch()
$input = json_decode(file_get_contents("php://input"), true);

$usid = $input["usid"] ?? null;
$idColect = $input["idColect"] ?? null;
$like = $input["like"] ?? null;

//Validar datos
if (!$usid || !$idColect || $like === null) {
    echo json_encode(["success" => false, "error" => "Datos incompletos"]);
    exit;
}



if ($like) {
    //Agregar like
    $query = $conn->prepare("INSERT IGNORE INTO me_gusta (uidd, id_imagen) VALUES (?, ?)");
    $query->bind_param("si", $usid, $idColect);
    $success = $query->execute();
} else {
    //Quitar like
    $query = $conn->prepare("DELETE FROM me_gusta WHERE uidd = ? AND id_imagen = ?");
    $query->bind_param("si", $usid, $idColect);
    $success = $query->execute();
}

echo json_encode(["success" => $success]);
$conn->close();
?>