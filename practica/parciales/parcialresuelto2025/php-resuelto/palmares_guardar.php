<?php
/* ============================================================
   palmares_guardar.php  —  VERSIÓN RESUELTA (funcionalidad "A")
   ------------------------------------------------------------
   El archivo original estaba vacío. Acá se completa para que
   GUARDE un nuevo palmarés en la base de datos.

   Parámetros esperados (por GET o POST):
     - dni     : dni del jugador
     - anio    : año del logro (opcional, por defecto año actual)
     - detalle : texto del logro

   Respuesta: JSON { status, mensaje, id }
   ============================================================ */

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Content-Type: application/json');

extract($_REQUEST);            // crea $dni, $anio, $detalle
require("conexion.php");

$conexion = mysqli_connect($server_db, $usuario_db, $password_db)
    or die(json_encode(['status' => 500, 'mensaje' => 'No se puede conectar con el servidor']));

mysqli_select_db($conexion, $base_db)
    or die(json_encode(['status' => 500, 'mensaje' => 'No se puede seleccionar base de datos']));

// --- Validaciones mínimas ---
if (!isset($dni) || $dni === '') {
    echo json_encode(['status' => 500, 'mensaje' => 'Falta el dni del jugador']);
    exit;
}

if (!isset($detalle) || trim($detalle) === '') {
    echo json_encode(['status' => 500, 'mensaje' => 'El detalle no puede estar vacío']);
    exit;
}

// --- Escapado de datos (evita errores e inyección SQL) ---
$dni     = mysqli_real_escape_string($conexion, $dni);
$detalle = mysqli_real_escape_string($conexion, $detalle);
$anio    = isset($anio) ? (int) $anio : (int) date('Y');

// --- INSERT ---
$instruccion = "INSERT INTO palmares (dni, anio, detalle)
                VALUES ('$dni', $anio, '$detalle')";

if (mysqli_query($conexion, $instruccion)) {
    echo json_encode([
        'status'  => 200,
        'mensaje' => 'Palmarés guardado correctamente',
        'id'      => mysqli_insert_id($conexion),
    ]);
} else {
    echo json_encode([
        'status'  => 500,
        'mensaje' => 'No se pudo guardar: ' . mysqli_error($conexion),
    ]);
}

mysqli_close($conexion);
?>
