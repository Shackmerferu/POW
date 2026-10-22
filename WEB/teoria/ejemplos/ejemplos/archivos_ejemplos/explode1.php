<?php
$myfile = fopen("archivo.txt", "r") or die("Unable to open file!");
$contenido=fread($myfile,filesize("archivo.txt"));

//ahora obtengo la fila en una matriz
$filas=explode("\n",$contenido);
print(count($filas));
fclose($myfile);

print("<br>");
$texto="Esto es una cadena de Texto
rrrrrrr
rrrrrrrr";

print($texto); print($texto);print($texto);
print("<br>");
print(trim($texto));print(trim($texto));print(trim($texto));

print("<br>");
print(strlen($texto));
print(str_replace("f","d",$texto));
$arr1 = str_split($texto);
$arr2 = str_split($texto, 3);
print_r($arr1);
print_r($arr2);
?> 