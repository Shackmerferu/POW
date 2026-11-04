<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Content-Type: application/json');
extract($_REQUEST);
require("conexion.php");

extract($_POST);

if(!isset($dni) || !isset($detalle) || empty(trim($detalle))){
    echo json_encode([
        'status' => 400,
        'message' => 'Faltan datos obligatorios: dni o detalle'
    ]);
    exit;
}

$conexion = mysqli_connect ($server_db, $usuario_db,$password_db)
        or die ("No se puede conectar con el servidor");
    mysqli_select_db ($conexion,$base_db)
        or die ("No se puede seleccionar base de datos");
$anio = date("Y");
//////para el id de re mierda ese ///////
// 3. CORRECCIÓN: Calcular el nuevo ID
// Asegúrate de que el nombre 'palmares' esté bien escrito aquí.
$consulta_id = mysqli_query($conexion, "SELECT MAX(id) AS max_id FROM palmares");

if (!$consulta_id) {
     echo json_encode(['status' => 500, 'message' => 'Error en la consulta MAX(id): ' . mysqli_error($conexion)]);
     exit;
}

$resultado_id = mysqli_fetch_assoc($consulta_id);

// Manejamos el caso de que la tabla esté vacía (MAX(id) devuelve NULL)
if ($resultado_id['max_id'] === null) {
    $nuevo_id = 1; // Es el primer registro
} else {
    $nuevo_id = $resultado_id['max_id'] + 1;
}
////////////////////////////////////////////   
$instruccion = "insert into palmares(id, dni, anio, detalle) values ($nuevo_id,'$dni', $anio, '$detalle')";
$consulta = mysqli_query($conexion, $instruccion);

if ($consulta) {
    $response = ['status' => 200, 'message' => 'Palmarés guardado.'];
} else {
    $response = ['status' => 500, 'message' => 'Fallo al guardar en BD: ' . mysqli_error($conexion)];
}

mysqli_close($conexion);
echo json_encode($response);
?>