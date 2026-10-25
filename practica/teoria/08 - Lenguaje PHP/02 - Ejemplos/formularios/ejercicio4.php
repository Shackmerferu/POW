<HTML>

<HEAD>
   <TITLE>Curso de PHP - Ejercicio 7</TITLE>
   <LINK REL="stylesheet" TYPE="text/css" HREF="estilo.css">
</HEAD>

<BODY>

<?PHP
extract($_REQUEST);
// Si se ha enviado el formulario
   if (isset($enviar))
   {
   // Mostrar noticia
?>

<H1>Curso de PHP - Ejercicio 7. Resultados del formulario</H1>

<H2>Resultado de la inserci�n de nueva noticia</H2>

<?PHP

      // Obtener datos introducidos desde el formulario
      // >>>>>>>>>>> FUNCIONA CON register_globals off <<<<<<<<<<<
      //   $titulo = $_REQUEST['titulo'];
      //   $texto = $_REQUEST['texto'];
      //   $categoria = $_REQUEST['categoria'];
      //   $imagen = $_REQUEST['imagen'];

      // Comprobar que se han introducido todos los datos obligatorios
         $errores = "";
         if (trim($titulo) == "")
            $errores = $errores . "<LI>Se requiere el t�tulo de la noticia";
         if (trim($texto) == "")
            $errores = $errores . "<LI>Se requiere el texto de la noticia";

      // Subir fichero
         $copiarFichero = false;

      // Para PHP >= 4.1.0 poner $_FILES en lugar de $HTTP_POST_FILES

      // Copiar fichero en directorio de ficheros subidos
      // Se renombra para evitar que sobreescriba un fichero existente
      // Para garantizar la unicidad del nombre se a�ade una marca de tiempo
         if (is_uploaded_file ($_FILES['imagen']['tmp_name']))
         {
            $nombreDirectorio = "img/";
            $idUnico = time();
            $nombreFichero = $idUnico . "-" . $_FILES['imagen']['name'];
            $copiarFichero = true;
         }
      // No se ha introducido ning�n fichero
         else if ($_FILES['imagen']['name'] == "")
            $nombreFichero = '';
      // El fichero introducido no se ha podido subir
         else
         {
            $errores = $errores . "<LI>No se ha podido subir el archivo\n";
            $nombreFichero = '';
         }

     // Mostrar errores encontrados
         if ($errores != "")
         {
            print ("No se ha podido realizar la inserci�n debido a los siguientes errores:");
            print ("<UL>");
            print ($errores );
            print ("</UL>");
            print ("[ <A HREF='javascript:history.back()'>Volver</A> ]");
            exit();
         }

      // Aqu� vendr�a la inserci�n de la noticia en la Base de Datos

      // Mover fichero de imagen a su ubicaci�n definitiva
         if ($copiarFichero)
            move_uploaded_file ($_FILES['imagen']['tmp_name'],
            $nombreDirectorio . $nombreFichero);

      // Mostrar datos introducidos
         print ("La noticia ha sido recibida correctamente:");
         print ("<UL>");
         print ("<LI>T�tulo: $titulo\n");
         print ("<LI>Texto: $texto\n");
         print ("<LI>Categor�a: $categoria\n");
         print ("<LI>Imagen: <A TARGET='_blank' HREF='" . $nombreDirectorio . $nombreFichero . "'>" . $nombreFichero . "</A>");
         print ("</UL>");

         print ("<BR>");
         print ("[ <A HREF='ejercicio4.php'>Insertar otra noticia</A> ]");

?>

<?PHP
   }
   else
   {
   // Introducir noticia
?>

<H1>Curso de PHP - Ejercicio 7</H1>

<H2>Insertar nueva noticia</H2>

<FORM ACTION="ejercicio4.php" METHOD="POST" ENCTYPE="multipart/form-data">
<TABLE>

<!-- T�tulo de la noticia -->
<TR><TD>T�tulo: *</TD>
    <TD><INPUT TYPE="TEXT" NAME="titulo" SIZE="56" MAXLENGTH="50"></TD></TR>

<!-- Texto de la noticia-->
<TR VALIGN="TOP"><TD>Texto: *</TD>
<TD><TEXTAREA COLS="50" ROWS="5" NAME="texto"></TEXTAREA></TD></TR>

<!-- Categor�a de la noticia-->
<TR><TD>Categor�a:</TD>
    <TD><SELECT NAME="categoria">
           <OPTION SELECTED>promociones
           <OPTION>ofertas
           <OPTION>costas
        </SELECT></TD></TR>

<!-- Imagen asociada a la noticia -->
<TR><TD>Imagen:</TD>
    <TD><INPUT TYPE="HIDDEN" NAME="MAX_FILE_SIZE" VALUE="1024000">
        <INPUT TYPE="FILE" SIZE="44" NAME="imagen"></TD></TR>

<!-- Botones de env�o y borrado -->
<TR><TD></TD>
   <TD><INPUT TYPE="SUBMIT" NAME="enviar" VALUE="Insertar noticia">
       <INPUT TYPE="RESET" VALUE="Borrar formulario"></TD></TR>

</TABLE>
</FORM>

<P CLASS="font8pt">NOTA: los datos marcados con (*) deben ser rellenados
obligatoriamente</P>

<?PHP
   }
?>

</BODY>
</HTML>
