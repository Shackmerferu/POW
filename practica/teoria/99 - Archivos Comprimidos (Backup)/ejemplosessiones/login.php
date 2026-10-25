<?PHP
   session_start();
   extract($_REQUEST);
// Iniciar sesión
   echo 'La sesión actual es: '.session_id();


// Si se ha enviado el formulario
   if (isset($usuario) && isset($clave))
   {

   // Comprobar que el usuario está autorizado a entrar
      $conexion = mysqli_connect ("localhost", "root", "adminadmin")
         or die ("No se puede conectar con el servidor");
      mysqli_select_db ($conexion,"lindavista")
         or die ("No se puede seleccionar la base de datos");
      $salt = substr ($usuario, 0, 2);
/* crypt es una función que encripta un string dado ($usuario) a partir de un substring
($salt) que lo toma como semilla de encriptación en este caso son dos caracteres*/
	  $clave_crypt = crypt ($clave, $salt);
    
      $instruccion = "select usuario, clave from usuarios where usuario = '$usuario'" .
         " and clave = '$clave_crypt'";
      $consulta = mysqli_query ($conexion,$instruccion)
         or die ("Fallo en la consulta");
      $nfilas = mysqli_num_rows ($consulta);

      mysqli_close ($conexion);

   // Los datos introducidos son correctos
      if ($nfilas > 0)
      {

         $usuario_valido = $usuario;
         //session_register ("usuario_valido");
		 $_SESSION['usuario_valido']=$usuario_valido; //donde se coloca cualquier valor, en este caso
		 //es un valor numerico
      }
   }
?>

<HTML>
<HEAD>
<TITLE>Gestión de noticias. Página de entrada</TITLE>
<LINK REL="stylesheet" TYPE="text/css" HREF="estilo.css">
</HEAD>

<BODY>

<?PHP
// Sesión iniciada
   if ($_SESSION["usuario_valido"]!="")
   {
?>

<H1>Gestión de noticias </H1>
<?PHP
   print ("<P>Usuario: ".$_SESSION["usuario_valido"]."</P>\n");
 ?>
<HR>

<UL>
   <LI><A HREF="consulta_noticias.php">Consultar noticias</A>
   <LI><A HREF="inserta_noticia.php">Insertar nueva noticia</A>
</UL>

<HR>

<P>[ <A HREF='logout.php'>Desconectar</A> ]</P>

<?PHP
   }

// Intento de entrada fallido
   else if (isset ($usuario))
   {
      print ("<BR><BR>\n");
      print ("<P ALIGN='CENTER'>Acceso no autorizado</P>\n");
      print ("<P ALIGN='CENTER'>[ <A HREF='login.php'>Conectar</A> ]</P>\n");
   }

// Sesión no iniciada
   else
   {
      print("<BR><BR>\n");
      print("<P ALIGN='CENTER'>Esta zona tiene el acceso restringido.<BR> " .
         " Para entrar debe identificarse</P>\n");

      print("<FORM NAME='login' ACTION='login.php' METHOD='POST'>\n");

      print("<TABLE ALIGN='CENTER' BORDER='1'>\n");
      print("<TR>\n");
      print("   <TD WIDTH='60'>Usuario:</TD>\n");
      print("   <TD><INPUT TYPE='TEXT' NAME='usuario' SIZE='15'></TD>\n");
      print("</TR>\n");
      print("<TR>\n");
      print("   <TD WIDTH='60'>Clave:</TD>\n");
      print("   <TD><INPUT TYPE='PASSWORD' NAME='clave' SIZE='15'></TD>\n");
      print("</TR>\n");
      print("</TABLE>\n");

      print("<BR>\n");
      print("<CENTER>\n");
      print("<INPUT TYPE='SUBMIT' VALUE='entrar'>\n");
      print("</CENTER>\n");

      print("</FORM>\n");

      print("<P ALIGN='CENTER'>NOTA: si no dispone de identificación o tiene problemas " .
         "para entrar<BR>póngase en contacto con el " .
         "<A HREF='MAILTO:lafuente@ing.unlpam.edu.ar'>administrador</A> del sitio</P>\n");
   }
?>

</BODY>
</HTML>
