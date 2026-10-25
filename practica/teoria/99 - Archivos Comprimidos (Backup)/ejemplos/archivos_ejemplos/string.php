<?php

$texto1="esto es un texto";
$texto2= "   esto es otro   ";
print($texto1.$texto1."<br><br>");
print($texto2.$texto2."<br><br>");
print(trim($texto2).trim($texto2)."<br><br>");

print(strlen($texto2)."<br><br>");
$arr1= str_split($texto1);
print_r($arr1);
print("<br><<br>");
$arr2= str_split($texto1,3);
print_r($arr2);
print(str_replace("o","e",$texto1));


$arr3=explode(" ",$texto1);
print("<br><<br>");
print_r($arr3);
?>