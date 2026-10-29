<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Content-Type: application/json');
extract($_REQUEST);
require("conexion.php");

extract($_POST);

if (!isset($nombre) || !isset($_FILES['logo'])) {
    echo json_encode([
        'status' => 400, 
        'message' => 'Faltan parámetros (nombre o logo).']);
    exit;
}



        // --- 2. Manejar la subida del archivo (logo) ---
$logo_nombre = $_FILES['logo']['name'];
$logo_tmp = $_FILES['logo']['tmp_name'];
$logo_error = $_FILES['logo']['error'];

if ($logo_error !== UPLOAD_ERR_OK) {
    echo json_encode(['status' => 500, 
    'message' => 'Error al subir el archivo de logo.']);
    exit;
}

/* Definimos la carpeta de destino.
 * Según tu estructura ('parcial2025/la_tania/la_tania/api/'),
 * debemos "subir un nivel" (..) para llegar a 'la_tania/la_tania/'
 * y luego entrar a 'img/logos/'.
 */
$directorio_destino = '../img/logos/'; 

// Creamos la carpeta si no existe (buena práctica)
if (!is_dir($directorio_destino)) {
    mkdir($directorio_destino, 0755, true);
}

$ruta_destino_logo = $directorio_destino . basename($logo_nombre);

$conexion = mysqli_connect ($server_db, $usuario_db,$password_db)
        or die ("No se puede conectar con el servidor");
    mysqli_select_db ($conexion,$base_db)
        or die ("No se puede seleccionar base de datos");

$consulta_id = mysqli_query($conexion, "SELECT MAX(id_equipo) AS max_id FROM equipos");

if (!$consulta_id) {
     echo json_encode(['status' => 500, 'message' => 'Error en la consulta MAX(id): ' . mysqli_error($conexion)]);
     exit;
}

$resultado_id = mysqli_fetch_assoc($consulta_id);

// Manejamos el caso de que la tabla esté vacía (MAX(id) devuelve NULL)
if ($resultado_id['max_id'] === null) {
    $id = 1; // Es el primer registro
} else {
    $id = $resultado_id['max_id'] + 1;
}



// El parcial indica que los puntos iniciales son 0 (ver la_tania.sql)
$instruccion = "INSERT INTO equipos (id_equipo,nombre, logo, puntos) VALUES ($id,'$nombre', '$logo_nombre', 0)";
$consulta = mysqli_query($conexion, $instruccion);

// --- 5. Responder al JavaScript ---
if ($consulta) {
    $response = [
        'status' => 200,
        'message' => 'Equipo "' . $nombre . '" guardado con éxito.'
    ];
} else {
    $response = [
        'status' => 500,
        'message' => 'Fallo al guardar en la BD: ' . mysqli_error($conexion)
    ];
}

mysqli_close($conexion);
echo json_encode($response);
?>