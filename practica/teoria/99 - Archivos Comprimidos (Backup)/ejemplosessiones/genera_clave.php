<HTML>
<HEAD>
   <TITLE>Inserción de usuario</TITLE>
</HEAD>

<BODY>

<?PHP
// Escribir aquí el nombre y la clave del usuario que se desea crear
   $usuario="gustavo";
   $clave="gustavo";
   
   $conexion = mysql_connect ("localhost", "root", "admin")
      or die ("No se puede conectar con el servidor");
   mysql_select_db ("lindavista")
      or die ("No se puede seleccionar la base de datos");
   $salt = substr ($usuario, 0, 2);
   $clave_crypt = crypt ($clave, $salt);
   $instruccion = "insert into usuarios (usuario, clave) values ('$usuario', '$clave_crypt')";
   $consulta = mysql_query ($instruccion, $conexion)
      or die ("Fallo en la inserción");
   mysql_close ($conexion);
   print ("Usuario $usuario insertado con éxito\n");
?>

</BODY>
</HTML>
