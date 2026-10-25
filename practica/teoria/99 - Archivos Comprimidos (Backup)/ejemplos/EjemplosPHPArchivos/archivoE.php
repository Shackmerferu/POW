<HTML>
<HEAD>
</HEAD>
<BODY>

<?php
$archivoNombre = 'almacen.txt';
$contenido = "almacena esto en el archivo\n";
// asegura que el archivo exista y se pueda escribir.
if (is_writable($archivoNombre)) {
    
    if (!$arch = fopen($archivoNombre, 'a')) {
         print "No puede abrir el archivo ($archivoNombre)";
         exit;
    }
    // Guardando $contenido en le archivo abierto.
    if (!fwrite($arch, $contenido)) {
        print "No puede escribir al archivo ($archivoNombre)";
        exit;
    }
    
    print "Exito, almacen� ($contenido) en el archivo ($archivoNombre)";
    
    fclose($arch);

} else {
    print "El archivo $archivoNombre no se puede escribir";
}
?>
</BODY>
</HTML>