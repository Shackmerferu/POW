<HTML>

<HEAD>
   <TITLE>Consulta de noticias</TITLE>
   <LINK REL="stylesheet" TYPE="text/css" HREF="estilo.css">

<?PHP
// Incluir bibliotecas de funciones
   include ("lib/fecha.php");
   extract($_REQUEST);
?>

</HEAD>

<BODY>

<H1>Consulta de noticias</H1>

<FORM NAME="selecciona" ACTION="consulta_noticias3.php" METHOD="POST">
<P>Mostrar noticias de la categor�a:
<SELECT NAME="categoria">
   <OPTION VALUE="Todas" SELECTED>Todas
   <OPTION VALUE="promociones">promociones
   <OPTION VALUE="ofertas">ofertas
   <OPTION VALUE="costas">costas
</SELECT>
<INPUT TYPE="submit" NAME="actualizar" VALUE="Actualizar"></P>
</FORM>

<?PHP

   // Conectar con el servidor de base de datos
      $conexion = mysqli_connect ("localhost", "root", "")
         or die ("No se puede conectar con el servidor");

   // Seleccionar base de datos
      mysqli_select_db ($conexion,"lindavista")
         or die ("No se puede seleccionar la base de datos");

   // Enviar consulta
      $instruccion = "select * from noticias";

      if (isset($actualizar) && $categoria != "Todas")
         $instruccion = $instruccion . " where categoria='$categoria'";

      $instruccion = $instruccion . " order by fecha desc";
      $consulta = mysqli_query ($conexion,$instruccion)
         or die ("Fallo en la consulta");

   // Mostrar resultados de la consulta
      $nfilas = mysqli_num_rows ($consulta);
      if ($nfilas > 0)
      {
         print ("<TABLE WIDTH='650'>\n");
         print ("<TR>\n");
         print ("<TH WIDTH='400'>T�tulo</TH>\n");
         print ("<TH WIDTH='100'>Categor�a</TH>\n");
         print ("<TH WIDTH='75'>Fecha</TH>\n");
         print ("<TH WIDTH='75'>Imagen</TH>\n");
         print ("</TR>\n");

         for ($i=0; $i<$nfilas; $i++)
         {
            $resultado = mysqli_fetch_array ($consulta);
            print ("<TR>\n");
            print ("<TD>" . $resultado['titulo'] . "</TD>\n");
            print ("<TD>" . $resultado['categoria'] . "</TD>\n");
            print ("<TD>" . date2string($resultado['fecha']) . "</TD>\n");

            if ($resultado['imagen'] != "")
               print ("<TD><A TARGET='_blank' HREF='img/" . $resultado['imagen'] .
                      "'><IMG BORDER='0' SRC='img/ico-fichero.gif'></A></TD>\n");
            else
               print ("<TD>&nbsp;</TD>\n");

            print ("</TR>\n");
         }

         print ("</TABLE>\n");
      }
      else
         print ("No hay noticias disponibles");
         
// Cerrar conexi�n
   mysqli_close ($conexion);

?>

</BODY>
</HTML>
