<HTML>

<HEAD>
   <TITLE>Consulta de noticias</TITLE>
   <LINK REL="stylesheet" TYPE="text/css" HREF="estilo.css">

<?PHP
// Incluir bibliotecas de funciones
   include ("lib/fecha.php");
   extract($_REQUEST);
?>

<SCRIPT LANGUAGE='JavaScript'>
<!--
// Funci�n que actualiza la p�gina al cambiar la categor�a de noticia
   function actualizaPagina ()
   {
      i = document.forms.selecciona.categoria.selectedIndex;
      categoria = document.forms.selecciona.categoria.options[i].value;
      window.location = 'consulta_noticias4.php?categoria=' + categoria;
   }
// -->
</SCRIPT>

</HEAD>

<BODY>

<H1>Consulta de noticias</H1>

<?PHP

   // Conectar con el servidor de base de datos
      $conexion = mysqli_connect ("localhost", "root", "")
         or die ("No se puede conectar con el servidor");

   // Seleccionar base de datos
      mysqli_select_db ($conexion,"lindavista")
         or die ("No se puede seleccionar la base de datos");

   // Mostrar formulario con elemento SELECT para seleccionar categor�a de noticia
      print ("<FORM NAME='selecciona' ACTION='consulta_noticias4.php' METHOD='POST'>\n");
      print ("<P>Mostrar noticias de la categor�a:\n");
      print ("<SELECT NAME='categoria' ONCHANGE='actualizaPagina()'>\n");

   // Obtener los valores del tipo enumerado
      $instruccion = "SHOW columns FROM noticias LIKE 'categoria'";
      $consulta = mysqli_query ($conexion,$instruccion);
      $row = mysqli_fetch_array ($consulta);

   // Pasar los valores a una tabla y a�adir el valor "Todas" al principio
      $lis = strstr ($row[1], "(");
      $lis = ltrim ($lis, "(");
      $lis = rtrim ($lis, ")");
      $lis = "'Todas'," . $lis;
      $lista = explode (",", $lis);

   // Mostrar cada valor en un elemento OPTION
      if (isset($categoria))
         $selected = $categoria;
      else
         $selected = "Todas";
      for ($i=0; $i<count($lista); $i++)
      {
         $cad = trim ($lista[$i], "'");
         if ($cad == $selected)
            print ("   <OPTION VALUE='$cad' SELECTED>$cad\n");
         else
            print ("   <OPTION VALUE='$cad'>$cad\n");
      }

      print ("</SELECT></P>\n");
      print ("</FORM>\n");

   // Enviar consulta
      $instruccion = "select * from noticias";

      if (isset($categoria) && $categoria != "Todas")
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
