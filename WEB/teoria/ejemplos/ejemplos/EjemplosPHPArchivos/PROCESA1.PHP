<!-- Archivo procesa.php -->
<html>
<head>
<title>Ejemplo de PHP</title>
</head>
<body>
<?php
$buffer="";
$fd = fopen ("test.txt", "r");
while (!feof($fd)) {
    $buffer = fgets($fd, 4096);
    printf("<p> $buffer") ;
}
fclose ($fd);
?>
</body>
</html>
