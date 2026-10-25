<?PHP
   session_start ();
?>

<HTML>

<HEAD>
   <TITLE>Clase de PHP - Tema Sesiones - Ejercicio 1b</TITLE>
   <LINK REL="stylesheet" TYPE="text/css" HREF="estilo.css">
</HEAD>

<BODY>

<H1>Clase de PHP - Tema Sesiones - Ejercicio 1b</H1>

<H2>Paso 2: se accede a la variable de sesión almacenada y se destruye</H2>

<?PHP
   //print ("<P>Valor de la variable de sesión: $var</P>\n");
   print ("<P>Valor de la variable de sesión: ".$_SESSION['var']."</P>\n");
   //session_unregister ("var");
   unset($_SESSION['var']);
?>

<A HREF="ejercicio1c.php">Paso 3</A>.

</BODY>
</HTML>
