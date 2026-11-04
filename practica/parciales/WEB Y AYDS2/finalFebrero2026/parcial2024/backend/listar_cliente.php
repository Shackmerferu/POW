<?php
//http://localhost/Parcial2024/backend/listar_cliente.php?id_cliente=2
//http://localhost/Parcial2024/backend/listar_cliente.php?id_cliente=2
//http://localhost/Parcial2024/backend/listar_cliente.php?estado=P
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
	if ($result = $mysqli->query("SELECT * FROM clientes where estado='$estado'")) {
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
		if (isset($id_cliente))
		{
			if ($result = $mysqli->query("SELECT * FROM clientes where id='$id_cliente'")) {
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
		if ($result = $mysqli->query("SELECT * FROM clientes")) {
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