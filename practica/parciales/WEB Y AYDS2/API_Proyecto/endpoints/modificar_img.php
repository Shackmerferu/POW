<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../config/database.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST" && $_SERVER["REQUEST_METHOD"] !== "PUT") {
    echo json_encode(["error" => "Método no permitido"]);
    exit;
}

if (isset($_POST['id'])) {
    $id = $_POST['id'];
    $titulo = $_POST['titulo'] ?? '';
    $categoria = $_POST['categoria'] ?? '';
    $autor = $_POST['autor'] ?? '';
    $fecha = $_POST['fecha'] ?? '';
    $descripcion = $_POST['descripcion'] ?? '';
    $palabras = $_POST['palabras_clave'] ?? '';

    $nuevaRuta = null;

    // Si viene nueva imagen
    if (isset($_FILES['imagen'])) {
        $img = $_FILES['imagen'];
        $ext = strtolower(pathinfo($img['name'], PATHINFO_EXTENSION));
        if (in_array($ext, ["jpg", "jpeg", "png"])) {
            $nuevaRuta = "../uploads/" . uniqid() . "." . $ext;
            move_uploaded_file($img['tmp_name'], $nuevaRuta);
        }
    }

    // Actualizar con o sin nueva imagen
    if ($nuevaRuta) {
        $sql = "UPDATE imagenes SET ruta = ?, titulo = ?, categoria = ?, autor = ?, fecha = ?, descripcion = ?, palabras_clave = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssssssi", $nuevaRuta, $titulo, $categoria, $autor, $fecha, $descripcion, $palabras, $id);
    } else {
        $sql = "UPDATE imagenes SET titulo = ?, categoria = ?, autor = ?, fecha = ?, descripcion = ?, palabras_clave = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssssi", $titulo, $categoria, $autor, $fecha, $descripcion, $palabras, $id);
    }

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "mensaje" => "Imagen modificada correctamente"]);
    } else {
        echo json_encode(["error" => "Error al modificar la imagen"]);
    }
} else {
    echo json_encode(["error" => "ID no especificado"]);
}