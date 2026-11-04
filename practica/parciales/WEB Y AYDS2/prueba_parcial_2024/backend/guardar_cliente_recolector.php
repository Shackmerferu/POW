<?php
//ejemplo de ejecucion
//guarda los datos de los recolectores
//no recibe json http://localhost/backend/guardar_cliente_recolector.php?id_cliente=1&id_recolector=11&estado=A

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Content-Type: application/json');
require("conexion.php");
extract($_REQUEST);
$conexion=mysqli_connect($server_db,$usuario_db,$password_db,$base_db)
or die ("No se puede conectar con el servidor");
{
	$instruccion="insert into cliente_recolector (id_cliente,id_recolector,estado)value('$id_cliente','$id_recolector','$estado')";
    $consulta=mysqli_query($conexion,$instruccion) or die ("no puede grabar, verifique envio de datos");
	
	if($consulta){
		$data = "guardo";
		$datasuccess=[
			'status'=>200,
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