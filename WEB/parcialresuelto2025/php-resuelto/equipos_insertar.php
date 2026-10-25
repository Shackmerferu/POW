<?php
/* ============================================================
   equipos_insertar.php  —  VERSIÓN RESUELTA (punto EXTRA "B")
   ------------------------------------------------------------
   El archivo original estaba vacío. Acá se completa para:
     1) Recibir el nombre del club y su logo (archivo).
     2) Guardar la imagen en  api/img/logos/  del servidor.
     3) Insertar el equipo en la tabla `equipos`.

   Se invoca por AJAX con FormData (method POST):
     nombre : texto
     logo   : archivo de imagen

   Respuesta: JSON { status, mensaje }
   ============================================================ */

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Content-Type: application/json');

require("conexion.php");

$conexion = mysqli_connect($server_db, $usuario_db, $password_db)
    or die(json_encode(['status' => 500, 'mensaje' => 'No se puede conectar con el servidor']));

mysqli_select_db($conexion, $base_db)
    or die(json_encode(['status' => 500, 'mensaje' => 'No se puede seleccionar base de datos']));

// --- Validar que llegó el nombre ---
if (!isset($_POST['nombre']) || trim($_POST['nombre']) === '') {
    echo json_encode(['status' => 500, 'mensaje' => 'Falta el nombre del club']);
    exit;
}

$nombre = mysqli_real_escape_string($conexion, trim($_POST['nombre']));

// --- Validar el archivo subido ---
if (!isset($_FILES['logo']) || $_FILES['logo']['error'] !== 0) {
    echo json_encode(['status' => 500, 'mensaje' => 'No se recibió el logo (o hubo un error al subirlo)']);
    exit;
}

$archivo    = $_FILES['logo'];
$permitidos = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
$ext        = strtolower(pathinfo($archivo['name'], PATHINFO_EXTENSION));

if (!in_array($ext, $permitidos)) {
    echo json_encode(['status' => 500, 'mensaje' => 'Extensión no permitida (usá png, jpg, jpeg, gif o webp)']);
    exit;
}

if ($archivo['size'] > 2 * 1024 * 1024) {
    echo json_encode(['status' => 500, 'mensaje' => 'El logo supera los 2 MB']);
    exit;
}

// --- Mover el archivo a img/logos/ con nombre único ---
$nuevoNombre = "logo_" . uniqid() . "." . $ext;
$carpeta     = __DIR__ . "/img/logos/";

if (!is_dir($carpeta)) {
    mkdir($carpeta, 0777, true);
}

if (!move_uploaded_file($archivo['tmp_name'], $carpeta . $nuevoNombre)) {
    echo json_encode(['status' => 500, 'mensaje' => 'No se pudo guardar la imagen en el servidor']);
    exit;
}

// --- Insertar el equipo (puntos inicia en 0) ---
$instruccion = "INSERT INTO equipos (nombre, logo, puntos)
                VALUES ('$nombre', '$nuevoNombre', 0)";

if (mysqli_query($conexion, $instruccion)) {
    echo json_encode([
        'status'  => 200,
        'mensaje' => "Club \"$nombre\" guardado con el logo $nuevoNombre",
    ]);
} else {
    echo json_encode([
        'status'  => 500,
        'mensaje' => 'No se pudo guardar el equipo: ' . mysqli_error($conexion),
    ]);
}

mysqli_close($conexion);
?>
