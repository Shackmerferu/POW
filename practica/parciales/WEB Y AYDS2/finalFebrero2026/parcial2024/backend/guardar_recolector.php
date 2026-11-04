<?php
//ejemplo de ejecucion
//guarda los datos de los recolectores
//no recibe json
//http://localhost/parcial2024/backend/guardar_recolector.php?apellido=1&nombre=11&celular=111&latitud=1111&longitud=11111&disponible=S

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Content-Type: application/json');
require("conexion.php");
extract($_REQUEST);
$conexion=mysqli_connect($server_db,$usuario_db,$password_db,$base_db)
or die ("No se puede conectar con el servidor");
{
	$instruccion="insert into recolector (apellido,nombre,celular,latitud,longitud,disponible,var_temp)value('$apellido','$nombre','$celular','$latitud','$longitud','$disponible',0)";
    $consulta=mysqli_query($conexion,$instruccion) or die ("no puede grabar, verifique envio de datos");
	
	if($consulta){
		$id_recolector=mysqli_insert_id($conexion);
		$data = "guardo";
		$datasuccess=[
			'status'=>200,
			'id_recolector'=>$id_recolector,
			'data'=>$data
		];
		//return $datasuccess;
	}
	else{
		$datasuccess=[
			'status'=>500,
			'message'=>'error al ejecutar la consulta'
		];
		
	}
	echo json_encode($datasuccess);
}
?>