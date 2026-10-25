<HTML>

<HEAD>
   <TITLE>Curso de PHP - Ejercicio 2</TITLE>
   <LINK REL="stylesheet" TYPE="text/css" HREF="estilo.css">
</HEAD>

<BODY>

<?PHP
extract($_REQUEST);
   if (isset($enviar))
   {
      print ("<H1>Curso de PHP - Ejercicio 2. Resultados de la votaci�n</H1>\n");

   // Conectar con la base de datos
      $conexion = mysqli_connect ("localhost", "root", "")
         or die ("No se puede conectar al servidor");
      mysqli_select_db ($conexion,"lindavista")
         or die ("No se puede seleccionar BD");

   // Obtener votos actuales
      $instruccion = "select votos1, votos2 from votos";
      $consulta = mysqli_query ($conexion,$instruccion)
         or die ("Fallo en la selecci�n");
      $resultado = mysqli_fetch_array ($consulta);

  // Actualizar votos
     $votos1 = $resultado["votos1"];
     $votos2 = $resultado["votos2"];
     if ($voto == "si")
        $votos1 = $votos1 + 1;
     else if ($voto == "no")
        $votos2 = $votos2 + 1;
     $instruccion = "update votos set votos1=$votos1, votos2=$votos2";
     $actualizacion = mysqli_query ($conexion, $instruccion)
        or die ("Fallo en la modificaci�n");

   // Desconectar
      mysqli_close ($conexion);

   // Mostrar mensaje de agradecimiento
      print ("<P>Su voto ha sido registrado. Gracias por participar</P>\n");
      print ("<A HREF='ejercicio2-resultados.php'>Ver resultados</A>\n");
   }
   else
   {
?>

<H1>Curso de PHP - Ejercicio 2</H1>

<P>�Cree ud. que el precio de la vivienda seguir� subiendo al ritmo actual?</P>

<FORM ACTION="ejercicio2.php" METHOD="POST">
   <INPUT TYPE="RADIO" NAME="voto" VALUE="si" CHECKED>S�<BR>
   <INPUT TYPE="RADIO" NAME="voto" VALUE="no">No<BR><BR>
   <INPUT TYPE="SUBMIT" NAME="enviar" VALUE="votar">
</FORM>

<A HREF="ejercicio2-resultados.php">Ver resultados</A>

<?PHP
   }
?>

</BODY>
</HTML>
