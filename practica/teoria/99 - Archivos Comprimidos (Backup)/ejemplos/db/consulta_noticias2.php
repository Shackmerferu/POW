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

<?PHP

   // Conectar con el servidor de base de datos
      $conexion = mysqli_connect ("localhost", "root", "")
         or die ("No se puede conectar con el servidor");

   // Seleccionar base de datos
      mysqli_select_db ($conexion,"lindavista")
         or die ("No se puede seleccionar la base de datos");

   // Establecer el n�mero de filas por p�gina y la fila inicial
      $num = 5; // n�mero de filas por p�gina
      if (!isset($comienzo)) $comienzo = 0;

   // Calcular el n�mero total de filas de la tabla
      $instruccion = "select * from noticias";
      $consulta = mysqli_query ($conexion,$instruccion)
         or die ("Fallo en la consulta");
      $nfilas = mysqli_num_rows ($consulta);

      if ($nfilas > 0)
      {

      // Mostrar n�meros inicial y final de las filas a mostrar
         print ("<TABLE WIDTH='650'>\n");
         print ("<TR><TD CLASS='blanco' ALIGN='LEFT'>");
         print ("Mostrando noticias " . ($comienzo + 1) . " a ");
         if (($comienzo + $num) < $nfilas)
            print ($comienzo + $num);
         else
            print ($nfilas);
         print (" de un total de $nfilas\n");
         print ("</TD>\n");

      // Mostrar botones anterior y siguiente
         print ("<TD CLASS='blanco' ALIGN='RIGHT'>");
         if ($nfilas > $num)
         {
            if ($comienzo > 0)
               print ("[ <A HREF='consulta_noticias2.php?comienzo=" . ($comienzo - $num) . "'>Anterior</A> | ");
            else
               print ("[ Anterior | ");
            if ($nfilas > ($comienzo + $num))
               print ("<A HREF='consulta_noticias2.php?comienzo=" . ($comienzo + $num) . "'>Siguiente</A> ]\n");
            else
               print ("Siguiente ]\n");
         }
         print ("</TD></TR>\n");
         print ("</TABLE><BR>\n");
      }

   // Enviar consulta
      $instruccion = "select * from noticias order by fecha desc limit $comienzo, $num";
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
