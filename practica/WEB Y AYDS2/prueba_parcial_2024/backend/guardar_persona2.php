<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
//header('Content-Type: application/json');
extract($_REQUEST);
$mysqli = new mysqli('localhost', 'root', '', 'cordenate');
{
	$instruccion="insert into personas (apellido,nombre,celular,latitud,longitud,disponible,var_temp)value('$apellido','$nombre','$celular','$latitud','$longitud','$disponible','')";
    $consulta = $mysqli->query($instruccion);
	printf("<p>Guardo</p>");
    $mysqli->close();
}
?>