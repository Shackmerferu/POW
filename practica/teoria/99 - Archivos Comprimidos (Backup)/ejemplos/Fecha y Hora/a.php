<?php 
    print("mostando metodo get como array<br>");
var_dump($_GET);

print("<br><br>-----------------<br> Mostando array <br>");
$b = array(1, 2, 3, 4,5);
var_dump($b);

print("<br><br>-----------------<br> Mostando array de arra <br>");
$a = array(1, 2, array("a", "b", "c"));
var_dump($a);
print("<br> usando print_r");
print_r($a);

print("<br><br>-----------------<br> Mostando valores de variables <br>  <br> Las variables NO deben ser declaradas con var <br> ");
$c=8.1;
$d=true;
var_dump($c, $d);

if(is_array($a))
    print("si");
?>  
