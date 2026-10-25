<HTML>

<HEAD>
   <TITLE>Curso de PHP - Ejercicio 8</TITLE>
   <LINK REL="stylesheet" TYPE="text/css" HREF="estilo.css">

<?PHP
// Incluir bibliotecas de funciones
   include ("lib/fecha.php");
   include ("lib/fecha.js");
?>

<SCRIPT LANGUAGE='JavaScript'>
<!--
// Función que actualiza la lista desplegable de días en función
// del mes y el año seleccionados
   function actualizaDias (i)
   {
      mes = (document.forms.inserta[i+1]).selectedIndex+1;
      anyo = (document.forms.inserta[i+2]).selectedIndex+1999;
      ndias = diasMes (mes, anyo);
      (document.forms.inserta[i]).length = ndias;
      for (var j=0; j<ndias; j++)
         (document.forms.inserta[i]).options[j] = new Option(j+1);
   }
// -->
</SCRIPT>
</HEAD>

<BODY>

<?PHP
// Si se ha enviado el formulario
extract($_REQUEST);
   if (isset($enviar))
   {
   // Mostrar noticia
?>

<H1>Curso de PHP - Ejercicio 8. Resultados del formulario</H1>

<H2>Resultado de la inserción de nueva noticia</H2>

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
            $errores = $errores . "<LI>Se requiere el título de la noticia";
         if (trim($texto) == "")
            $errores = $errores . "<LI>Se requiere el texto de la noticia";

      // Subir fichero
         $copiarFichero = false;

      // Para PHP >= 4.1.0 poner $_FILES en lugar de $HTTP_POST_FILES

      // Copiar fichero en directorio de ficheros subidos
      // Se renombra para evitar que sobreescriba un fichero existente
      // Para garantizar la unicidad del nombre se añade una marca de tiempo
         if (is_uploaded_file ($_FILES['imagen']['tmp_name']))
         {
            $nombreDirectorio = "img/";
            $idUnico = time();
            $nombreFichero = $idUnico . "-" . $_FILES['imagen']['name'];
            $copiarFichero = true;
         }
      // No se ha introducido ningún fichero
         else if ($_FILES['imagen']['name'] == "")
            $nombreFichero = '';
      // El fichero introducido no se ha podido subir
         else
         {
            $errores = $errores . "<LI>No se ha podido subir el fichero\n";
            $nombreFichero = '';
         }

     // Mostrar errores encontrados
         if ($errores != "")
         {
            print ("No se ha podido realizar la inserción debido a los siguientes errores:");
            print ("<UL>");
            print ($errores );
            print ("</UL>");
            print ("[ <A HREF='javascript:history.back()'>Volver</A> ]");
            exit();
         }

      // Aquí vendría la inserción de la noticia en la Base de Datos

      // Mover fichero de imagen a su ubicación definitiva
         if ($copiarFichero)
            move_uploaded_file ($_FILES['imagen']['tmp_name'],
            $nombreDirectorio . $nombreFichero);

      // Mostrar datos introducidos
         print ("La noticia ha sido recibida correctamente:");
         print ("<UL>");
         print ("<LI>Título: $titulo\n");
         print ("<LI>Texto: $texto\n");
         print ("<LI>Categoría: $categoria\n");
         print ("<LI>Fecha: $dia de $mes de $anyo\n");
         print ("<LI>Imagen: <A TARGET='_blank' HREF='" . $nombreDirectorio . $nombreFichero . "'>" . $nombreFichero . "</A>");
         print ("</UL>");

         print ("<BR>");
         print ("[ <A HREF='ejercicio5.php'>Insertar otra noticia</A> ]");

?>

<?PHP
   }
   else
   {
   // Introducir noticia
?>

<H1>Curso de PHP - Ejercicio 8</H1>

<H2>Insertar nueva noticia</H2>

<FORM ACTION="ejercicio5.php" NAME="inserta" METHOD="POST" ENCTYPE="multipart/form-data">
<TABLE>

<!-- Título de la noticia -->
<TR><TD>Título: *</TD>
    <TD><INPUT TYPE="TEXT" NAME="titulo" SIZE="56" MAXLENGTH="50"></TD></TR>

<!-- Texto de la noticia-->
<TR VALIGN="TOP"><TD>Texto: *</TD>
<TD><TEXTAREA COLS="50" ROWS="5" NAME="texto"></TEXTAREA></TD></TR>

<!-- Categoría de la noticia-->
<TR><TD>Categoría:</TD>
    <TD><SELECT NAME="categoria">
           <OPTION SELECTED>promociones
           <OPTION>ofertas
           <OPTION>costas
        </SELECT></TD></TR>

<!-- Fecha de la noticia -->
<TR><TD>Fecha: *</TD>

<?PHP

            $hoy = today();
            $diaHoy = dayofdate ($hoy);
            $mesHoy = monthofdate ($hoy);
            $anyoHoy = yearofdate ($hoy);

            print ("<TD>\n");

            print ("<SELECT NAME='dia'>\n");
            for ($j=1; $j<=daysofMonth($mesHoy, $anyoHoy); $j++)
            {
               if ($j == $diaHoy)
                  print ("<OPTION SELECTED>" . $j . "\n");
               else
                  print ("<OPTION>" . $j . "\n");
            }
            print ("</SELECT> de\n");

            $ncampo = 3; // número de orden del campo 'dia' en el formulario
            print ("<SELECT NAME='mes' ONCHANGE='actualizaDias(" . $ncampo . ")'>\n");
            for ($j=0; $j<12; $j++)
            {
               if ($j == $mesHoy-1) // mesHoy va de 1 a 12, j va de 0 a 11
                  print ("<OPTION SELECTED>" . $meses[$j] . "\n");
               else
                  print ("<OPTION>" . $meses[$j] . "\n");
            }
            print ("</SELECT> de\n");

            print ("<SELECT NAME='anyo' ONCHANGE='actualizaDias(" . $ncampo . ")'>\n");
            for ($j=1999; $j<$anyoHoy; $j++)
               print ("<OPTION>" . $j . "\n");
            print ("<OPTION SELECTED>" . $j . "\n");
            print ("</SELECT>\n");

            print ("</TD></TR>\n\n");
?>


<!-- Imagen asociada a la noticia -->
<TR><TD>Imagen:</TD>
    <TD><INPUT TYPE="HIDDEN" NAME="MAX_FILE_SIZE" VALUE="102400">
        <INPUT TYPE="FILE" SIZE="44" NAME="imagen"></TD></TR>

<!-- Botones de envío y borrado -->
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
