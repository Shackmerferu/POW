<?PHP
   session_start ();
   if($_SESSION['usuario_valido']=="")
      header("location:login.php");
   extract($_REQUEST);
   $errores[1]="";
   $errores[2]="";
   $errores[3]="";
?>
<HTML>

<HEAD>
   <TITLE>Gestión de noticias - Inserción de nueva noticia</TITLE>
   <LINK REL="stylesheet" TYPE="text/css" HREF="estilo.css">

<?PHP
// Incluir bibliotecas de funciones
   include ("../lib/fecha.php");
?>

</HEAD>

<BODY>

<?PHP
    if ($_SESSION['usuario_valido']!="")
   {
?>

<?PHP
   //////////////////////////////////////////////////////////////////////////
   // si el formulario ha sido enviado
   //    validar formulario
   // fsi
   // si el formulario ha sido enviado y los datos son correctos
   //    procesar formulario
   // si no
   //    mostrar formulario
   // fsi
   //////////////////////////////////////////////////////////////////////////
   
   $error = false;
   if (isset($insertar))
   {
   // Comprobar que se han introducido todos los datos obligatorios
   // Título
      if (trim($titulo) == "")
      {
         $errores[1] = "¡Debe introducir el título de la noticia!";
         $error = true;
      }
      else
         $errores[1] = "";
   // Texto
      if (trim($texto) == "")
      {
         $errores[2] = "¡Debe introducir el texto de la noticia!";
         $error = true;
      }
      else
         $errores[2] = "";

   // Subir fichero
      $copiarFichero = false;
      $nombreDirectorio = "../img/";

   // Para PHP >= 4.1.0 poner $_FILES en lugar de $HTTP_POST_FILES

   // Copiar fichero en directorio de ficheros subidos
   // Se renombra para evitar que sobreescriba un fichero existente
   // Para garantizar la unicidad del nombre se añade una marca de tiempo
      if (is_uploaded_file ($_FILES['imagen']['tmp_name']))
      {
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
         $errores[3] = "¡No se ha podido subir el fichero!";
         $error = true;
      }
   }

// Si los datos son correctos, procesar formulario
   if (isset($insertar) && $error==false)
   {

   // Insertar la noticia en la Base de Datos
      $conexion = mysqli_connect ("localhost", "root", "adminadmin")
         or die ("No se puede conectar con el servidor");
      mysqli_select_db ($conexion,"lindavista")
         or die ("No se puede seleccionar la base de datos");

      $fecha = date ("Y-m-d"); // Fecha actual
      $instruccion = "insert into noticias (titulo, texto, categoria, fecha, imagen) values ('$titulo', '$texto', '$categoria', '$fecha', '$nombreFichero')";
      $consulta = mysqli_query ($conexion,$instruccion)
         or die ("Fallo en la consulta");
      mysqli_close ($conexion);

   // Mover fichero de imagen a su ubicación definitiva
      if ($copiarFichero)
         move_uploaded_file ($_FILES['imagen']['tmp_name'],
         $nombreDirectorio . $nombreFichero);

   // Mostrar datos introducidos
      print ("<H1>Gestión de noticias</H1>\n");
      print ("<H2>Resultado de la inserción de nueva noticia</H2>\n");

      print ("La noticia ha sido recibida correctamente:");
      print ("<UL>");
      print ("<LI>Título: " . $titulo);
      print ("<LI>Texto: " . $texto);
      print ("<LI>Categoría: " . $categoria);
      print ("<LI>Fecha: " . date2string($fecha));
      if ($nombreFichero != "")
         print ("<LI>Imagen: <A TARGET='_blank' HREF='" . $nombreDirectorio . $nombreFichero . "'>" . $nombreFichero . "</A>");
      else
         print ("<LI>Imagen: (no hay)");
      print ("</UL>");

      print ("<BR>");
      print ("[ <A HREF='inserta_noticia.php'>Insertar otra noticia</A> | ");
      print ("<A HREF='login.php'>Menú principal</A> ]");

   }
   else
   {
?>

<H1>Gestión de noticias</H1>
<?PHP
   print ("<P>Usuario:". $_SESSION['usuario_valido']."</P>\n");
 ?>
<H2>Insertar nueva noticia</H2>

<FORM ACTION="inserta_noticia.php" NAME="inserta" METHOD="POST" ENCTYPE="multipart/form-data">
<TABLE>

<!-- Título de la noticia -->
<TR><TD>Título: *</TD>
    <TD><INPUT TYPE="TEXT" NAME="titulo" SIZE="56" MAXLENGTH="50"

<?PHP
   if (isset($insertar))
      print ("VALUE='$titulo'>\n");
   else
      print (">\n");
   if ($errores[1] != "")
      print ("<BR>$errores[1]");
?>

</TD></TR>

<!-- Texto de la noticia-->
<TR VALIGN="TOP"><TD>Texto: *</TD>
<TD><TEXTAREA COLS="50" ROWS="5" NAME="texto">
<?PHP
   if (isset($insertar))
      print ("$texto");
   print ("</TEXTAREA>");
   if ($errores[2] != "")
      print ("<BR>$errores[2]");
?>

</TD></TR>

<!-- Categoría de la noticia-->
<TR><TD>Categoría:</TD>
    <TD><SELECT NAME="categoria">
           <OPTION SELECTED>promociones
           <OPTION>ofertas
           <OPTION>costas
        </SELECT></TD></TR>

<!-- Imagen asociada a la noticia -->
<TR><TD>Imagen:</TD>
    <TD><INPUT TYPE="HIDDEN" NAME="MAX_FILE_SIZE" VALUE="102400">
        <INPUT TYPE="FILE" SIZE="44" NAME="imagen">

<?PHP
   if ($errores[3] != "")
      print ("<BR>$errores[3]");
?>
</TD></TR>

<!-- Botones de envío y borrado -->
<TR><TD></TD>
   <TD><INPUT TYPE="SUBMIT" NAME="insertar" VALUE="Insertar noticia">
       <INPUT TYPE="RESET" VALUE="Borrar formulario"></TD></TR>

</TABLE>
</FORM>

<P CLASS="font8pt">NOTA: los datos marcados con (*) deben ser rellenados
obligatoriamente</P>

<P>[ <A HREF='login.php'>Menú principal</A> ]</P>

<?PHP
   }
?>

<?PHP

   }
   else
   {
      print ("<BR><BR>\n");
      print ("<P ALIGN='CENTER'>Acceso no autorizado</P>\n");
      print ("<P ALIGN='CENTER'>[ <A HREF='login.php' TARGET='_top'>Conectar</A> ]</P>\n");
   }

?>

</BODY>
</HTML>
