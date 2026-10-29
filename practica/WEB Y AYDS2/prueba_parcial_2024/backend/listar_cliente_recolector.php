<?php
//http://localhost/parcial2024/backend/listar_cliente_recolector.php
//http://localhost/parcial2024/backend/listar_cliente_recolector.php?estado=P
//http://localhost/parcial2024/backend/listar_cliente_recolector.php?id_recolector=11
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Content-Type: application/json');
extract($_REQUEST);
require("conexion.php");
$mysqli = new mysqli($server_db,$usuario_db,$password_db,$base_db);
$mysqli->set_charset("utf8mb4");
$myArray = array();
if (isset($estado))
{
	if ($result = $mysqli->query("SELECT * FROM cliente_recolector where estado='$estado'")) {
		$tempArray = array();
		while ($row = $result->fetch_object()) {
			$tempArray = $row;
			array_push($myArray, $tempArray);
		}
		echo json_encode($myArray);
	}
	$result->close();
}
else 
	{
		if (isset($id_recolector))
		{
			if ($result = $mysqli->query("SELECT * FROM cliente_recolector where id_recolector='$id_recolector'")) {
				$tempArray = array();
				while ($row = $result->fetch_object()) {
					$tempArray = $row;
					array_push($myArray, $tempArray);
				}
				echo json_encode($myArray);
			}
			$result->close();
		}
		else {

		if ($result = $mysqli->query("SELECT * FROM cliente_recolector")) {
			$tempArray = array();
			while ($row = $result->fetch_object()) {
				$tempArray = $row;
				array_push($myArray, $tempArray);
			}
			echo json_encode($myArray);
		}
		$result->close();
	}
}


$mysqli->close();
?>