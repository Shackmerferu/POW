<?php
session_start();
require("conexion.php");
//var_dump($_REQUEST);
extract($_REQUEST);
$conexion = mysqli_connect($server_db,$user_db,$pass_db,$base_db) or die("Error en la conexion a la base de datos");

$usuario = mysqli_real_escape_string($conexion, $usuario);
$password = mysqli_real_escape_string($conexion, $password);
$salt = substr($usuario,0,2);
$password = crypt($password,$salt);
//echo $password;
$sql = "SELECT * FROM usuario WHERE usuario='$usuario' AND password='$password' LIMIT 1";
//var_dump($sql);
//exit;
$result = mysqli_query($conexion, $sql) or die("Error en la consulta de usuarios");
if(mysqli_num_rows($result) > 0){
    $data= mysqli_fetch_array($result);
    $_SESSION['usuario'] = $usuario;
    $_SESSION['apellido'] = $data['apellido'];
    $_SESSION['nombre'] = $data['nombre'];
    $_SESSION['id_usuario'] = $data['id_usuario'];
    $mensaje = "Bienvenido al sistema";
}else{
    $mensaje = "usuario o password incorrecto";
}
header("Location: index.php?mensaje=$mensaje");
?>