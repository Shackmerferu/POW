<HTML>
<HEAD>
   <TITLE>Inserción de usuario</TITLE>
</HEAD>

<BODY>

<?PHP
// Escribir aquí el nombre y la clave del usuario que se desea crear
   $usuario="gustavo";
   $clave="gustavo";
   
   $conexion = mysqli_connect ("localhost", "root", "adminadmin")
      or die ("No se puede conectar con el servidor");
   mysqli_select_db ($conexion,"lindavista")
      or die ("No se puede seleccionar la base de datos");
   $salt = substr ($usuario, 0, 2);
   $clave_crypt = crypt ($clave, $salt);
   $instruccion = "insert into usuarios (usuario, clave) values ('$usuario', '$clave_crypt')";
   $consulta = mysqli_query ($conexion,$instruccion)
      or die ("Fallo en la inserción");
   mysqli_close ($conexion);
   print ("Usuario $usuario insertado con éxito\n");
?>

</BODY>
</HTML>
