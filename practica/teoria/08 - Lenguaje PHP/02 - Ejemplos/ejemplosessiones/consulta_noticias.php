<?PHP
   session_start ();
?>
<HTML>

<HEAD>
   <TITLE>Gestión de noticias - Consulta de noticias</TITLE>
   <LINK REL="stylesheet" TYPE="text/css" HREF="estilo.css">

<?PHP
// Incluir bibliotecas de funciones
   include ("../lib/fecha.php");
?>

</HEAD>

<BODY>

<?PHP
  
    if (isset($_SESSION['usuario_valido']))
   {
?>

<H1>Gestión de noticias</H1>
<?PHP
   print ("<P>Usuario:". $_SESSION['usuario_valido']."</P>\n");
 ?>
<H2>Consulta de noticias</H2>

<?PHP

   // Conectar con el servidor de base de datos
      $conexion = mysqli_connect ("localhost", "root", "")
         or die ("No se puede conectar con el servidor");

   // Seleccionar base de datos
      mysqli_select_db ($conexion,"lindavista")
         or die ("No se puede seleccionar la base de datos");

   // Enviar consulta
      $instruccion = "select * from noticias order by fecha desc";
      $consulta = mysqli_query ($conexion,$instruccion)
         or die ("Fallo en la consulta");

   // Mostrar resultados de la consulta
      $nfilas = mysqli_num_rows ($consulta);
      if ($nfilas > 0)
      {
         print ("<TABLE>\n");
         print ("<TR>\n");
         print ("<TH>Título</TH>\n");
         print ("<TH>Texto</TH>\n");
         print ("<TH>Categoría</TH>\n");
         print ("<TH>Fecha</TH>\n");
         print ("<TH>Imagen</TH>\n");
         print ("</TR>\n");

         for ($i=0; $i<$nfilas; $i++)
         {
            $resultado = mysqli_fetch_array ($consulta);
            print ("<TR>\n");
            print ("<TD>" . $resultado['titulo'] . "</TD>\n");
            print ("<TD>" . $resultado['texto'] . "</TD>\n");
            print ("<TD>" . $resultado['categoria'] . "</TD>\n");
            print ("<TD>" . date2string($resultado['fecha']) . "</TD>\n");

            if ($resultado['imagen'] != "")
               print ("<TD><A TARGET='_blank' HREF='../db/img/" . $resultado['imagen'] .
                      "'><IMG BORDER='0' SRC='../db/img/ico-fichero.gif'></A></TD>\n");
            else
               print ("<TD>&nbsp;</TD>\n");

            print ("</TR>\n");
         }

         print ("</TABLE>\n");
      }
      else
         print ("No hay noticias disponibles");

// Cerrar conexión
   mysqli_close ($conexion);

?>

<P>[ <A HREF='login.php'>Menú principal</A> ]</P>

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
