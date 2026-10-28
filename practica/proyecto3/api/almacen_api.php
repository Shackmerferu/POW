<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Content-Type: application/json');

require_once("conexion.php");

extract($_REQUEST);
if (!isset($action)) $action = "listar";

switch ($action) {
    case "listar":
        listar();
        break;
    case "listar_categorias":
        listar_categorias();
        break;
    case "insertar_con_imagen":
        insertar_con_imagen();
        break;
    default:
        echo json_encode(['status' => 400, 'mensaje' => 'Acción no válida']);
        break;
}

function listar() {
    global $conexion;
    $sql = "SELECT p.*, c.nombre as categoria_nombre 
            FROM productos p 
            INNER JOIN categorias c ON p.id_categoria = c.id";
    
    $result = mysqli_query($conexion, $sql);
    $data = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $data[] = $row;
    }
    echo json_encode(['status' => 200, 'productos' => $data]);
}

function listar_categorias() {
    global $conexion;
    $sql = "SELECT * FROM categorias";
    $result = mysqli_query($conexion, $sql);
    $data = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $data[] = $row;
    }
    echo json_encode(['status' => 200, 'categorias' => $data]);
}

function insertar_con_imagen() {
    global $conexion;
    
    $codigo = $_POST['codigo'] ?? null;
    $nombre = $_POST['nombre'] ?? null;
    $precio = $_POST['precio'] ?? null;
    $stock = $_POST['stock'] ?? null;
    $id_categoria = $_POST['id_categoria'] ?? null;
    
    if (!$codigo || !$nombre || !$precio || !$stock || !$id_categoria) {
        echo json_encode(['status' => 400, 'mensaje' => 'Campos incompletos']);
        return;
    }

    $nombreFoto = "default.jpg";

    // Procesar archivo de imagen mediante $_FILES[cite: 10]
    if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) { //[cite: 10]
        $ext = pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION); //[cite: 10]
        $nombreFoto = "prod_" . time() . "." . $ext; //[cite: 10]
        $dirDestino = "uploads/";
        
        if (!is_dir($dirDestino)) {
            mkdir($dirDestino, 0777, true);
        }

        move_uploaded_file($_FILES['imagen']['tmp_name'], $dirDestino . $nombreFoto); //[cite: 10]
    }

    $sql = "INSERT INTO productos (codigo, nombre, precio, stock, id_categoria, imagen) 
            VALUES ('$codigo', '$nombre', '$precio', '$stock', '$id_categoria', '$nombreFoto')";

    if (mysqli_query($conexion, $sql)) {
        echo json_encode(['status' => 200, 'mensaje' => 'Producto insertado correctamente']);
    } else {
        echo json_encode(['status' => 500, 'mensaje' => 'Error al guardar']);
    }
}
?>