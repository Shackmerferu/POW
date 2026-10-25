<?php
$conexion=mysqli_connect("localhost","gustavo","adminadmin","diariodb") or die ("No se puede conectar");
$instruccion="truncate table diariodb.proveedores";
mysqli_query($conexion,$instruccion);

$archivo=fopen("tabla.txt","r") or die("No puedo abrir archivo");
//$contenido=fread($archivo,filesize("tabla.txt"));

//metodo fgets
/*while(!feof($archivo))
{
    $fila=fgets($archivo);
    $datos=explode("|",$fila);
    print_r($datos);
    
    print("<br>");
    $instruccion="insert into proveedores (nombre,apellido,telefono,email,ciudad) values ('$datos[1]','$datos[2]','$datos[3]','$datos[4]','$datos[5]')";
    mysqli_query($conexion,$instruccion);
}
*/
$contenido=fread($archivo,filesize("tabla.txt"));
$filas=explode("\n",$contenido);
$cant=count($filas);
for($i=0;$i<$cant;$i++)
{
    $datos=explode("|",$filas[$i]);
    print_r($datos);
    
    print("<br>");
    $instruccion="insert into proveedores (nombre,apellido,telefono,email,ciudad) values ('$datos[1]','$datos[2]','$datos[3]','$datos[4]','$datos[5]')";
    mysqli_query($conexion,$instruccion);

}
fclose($archivo);
mysqli_close($conexion);
?>