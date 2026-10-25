<!-- Archivo procesa.php -->
<html>
<head>
<title>Ejemplo de PHP</title>
</head>
<body>
<?php
extract($_REQUEST);

$archivoNombre ='formulario.txt';
$contenido = $nombre;
// asegura que el archivo exista y se pueda escribir.
if (is_writable($archivoNombre)) {
    if (!$arch = fopen($archivoNombre, 'w')) {
         print "Cannot open file ($archivoNombre)";
         exit;
    }
    // Guardando $contenido en le archivo abierto.
    if (!fwrite($arch, $contenido)) {
        print "No puede escribir al archivo ($archivoNombre)";
        exit;
    }
    
     print "Exito, almacenó ($contenido) en el archivo ($archivoNombre)";
    
    fclose($arch);

} else {
    print "El archivo $archivoNombre no se puede escribir";
}
?>
<H1>Procesando formularion con PHP</H1>
<h2>El nombre que ha introducido es: <b><?php echo $nombre ?></b></h2> 
<br> 
</body>
</html>
