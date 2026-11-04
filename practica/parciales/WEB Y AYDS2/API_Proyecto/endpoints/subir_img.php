<?php
header("Content-Type: application/json; charset=UTF-8");
require_once "../config/database.php";

// Verificamos método
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["error" => "Método no permitido"]);
    exit;
}

// Si viene como form-data (con archivo)
if (isset($_FILES['imagen'])) {
    $archivo = $_FILES['imagen'];
    $nombre =basename($_POST['name']);
    $rutaDestino = "../uploads/" . $nombre;

    // Validar extensión
    $ext = strtolower(pathinfo($archivo['name'], PATHINFO_EXTENSION));
    $extPermitidas = ["jpg", "jpeg", "png"];
    if (!in_array($ext, $extPermitidas)) {
        echo json_encode(["error" => "Formato no permitido"]);
        exit;
    }

    // Validar tamaño (5 MB máx)
    if ($archivo['size'] > 5 * 1024 * 1024) {
        echo json_encode(["error" => "El archivo excede los 5MB"]);
        exit;
    }

    // Subir archivo
    if (move_uploaded_file($archivo['tmp_name'], $rutaDestino)) {
        $titulo = $_POST['titulo'] ?? '';
        $categoria = $_POST['categoria'] ?? '';
        $autor = $_POST['autor'] ?? '';
        $fecha = $_POST['fecha'] ?? '';
        $descripcion = $_POST['descripcion'] ?? '';
        $palabras = $_POST['palabras_clave'] ?? '';

        $sql = "INSERT INTO imagenes (nombre_archivo, ruta, titulo, categoria, autor, fecha, descripcion, palabras_clave, fecha_subida)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssssss", $nombre, $rutaDestino, $titulo, $categoria, $autor, $fecha, $descripcion, $palabras);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "ruta" => $rutaDestino]);
        } else {
            echo json_encode(["error" => "Error al guardar en la base de datos"]);
        }
    } else {
        echo json_encode(["error" => "Error al subir la imagen"]);
    }
    exit;
}

// Si NO viene archivo, intentamos leer JSON
$input = json_decode(file_get_contents("php://input"), true);

if ($input) {
    $nombre = $input['nombre_archivo'] ?? '';
    $ruta = $input['ruta'] ?? '';
    $titulo = $input['titulo'] ?? '';
    $categoria = $input['categoria'] ?? '';
    $autor = $input['autor'] ?? '';
    $fecha = $input['fecha'] ?? '';
    $descripcion = $input['descripcion'] ?? '';
    $palabras = $input['palabras_clave'] ?? '';

    if (empty($nombre) || empty($titulo)) {
        echo json_encode(["error" => "Faltan datos obligatorios"]);
        exit;
    }

    $sql = "INSERT INTO imagenes (nombre_archivo, ruta, titulo, categoria, autor, fecha, descripcion, palabras_clave, fecha_subida)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssssss", $nombre, $ruta, $titulo, $categoria, $autor, $fecha, $descripcion, $palabras);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "mensaje" => "Imagen agregada con JSON"]);
    } else {
        echo json_encode(["error" => "Error al guardar los datos JSON"]);
    }
} else {
    echo json_encode(["error" => "No se recibió ninguna imagen ni datos JSON válidos"]);
}