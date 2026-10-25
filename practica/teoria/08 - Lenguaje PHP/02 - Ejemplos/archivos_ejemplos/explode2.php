<?php
$myfile = fopen("tabla.txt", "r") or die("Unable to open file!");
$contenido=fread($myfile,filesize("tabla.txt"));
print($contenido)."<br><br>";
//ahora obtengo la fila en una matriz
$filas=explode("\n",$contenido);
print($filas[0]."<br><br>");
print(count($filas)."<br><br>");
fclose($myfile);
print_r($filas."<br><br>");


//for($i=0;i<count($filas);i++)
{
    $fil=$filas[0];
    print($fil."<br><br>");
    $dato=explode("|",$filas[0]);
    print_r($dato);
}
?> 