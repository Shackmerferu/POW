<HTML>

<HEAD>
   <TITLE>Curso de PHP - Ejercicio 2. Resultados de la encuesta</TITLE>
   <LINK REL="stylesheet" TYPE="text/css" HREF="estilo.css">
</HEAD>

<BODY>

<H1>Curso de PHP - Ejercicio 2. Resultados de la encuesta</H1>

<?PHP
extract($_REQUEST);
   // Conectar con la base de datos
      $conexion = mysqli_connect ("localhost", "root", "")
         or die ("No se puede conectar al servidor");
      mysqli_select_db ($conexion,"lindavista")
         or die ("No se puede seleccionar BD");

   // Obtener datos actuales de la votaci�n
      $instruccion = "select * from votos";
      $consulta = mysqli_query ($conexion,$instruccion)
         or die ("Fallo en la selecci�n");
      $resultado = mysqli_fetch_array ($consulta);

      $votos1 = $resultado["votos1"];
      $votos2 = $resultado["votos2"];
      $totalVotos = $votos1 + $votos2;

   // Mostrar resultados
      print ("<TABLE>\n");

      $porcentaje = round (($votos1/$totalVotos)*100,2);
      print ("<TR><TD>S�</TD>\n");
      print ("<TD>$votos1 ($porcentaje%)</TD>\n");
      print ("<TD><IMG SRC='img/punto.gif' HEIGHT='10' WIDTH='" . $porcentaje*4 . "'></TD></TR>\n");

      $porcentaje = round (($votos2/$totalVotos)*100,2);
      print ("<TR><TD>No</TD>\n");
      print ("<TD>$votos2 ($porcentaje%)</TD>\n");
      print ("<TD><IMG SRC='img/punto.gif' HEIGHT='10' WIDTH='" . $porcentaje*4 . "'></TD></TR>\n");

      print ("</TABLE>\n");

      print ("<P>N�mero total de votos emitidos: $totalVotos </P>\n");

      print ("<P><A HREF='ejercicio2.php'>P�gina de votaci�n</A></P>\n");

   // Desconectar
      mysqli_close ($conexion);

?>

</BODY>
</HTML>
