<?PHP
   session_start ();
?>

<HTML>

<HEAD>
   <TITLE>Clase de PHP - Tema Sesiones - Ejercicio 1</TITLE>
   <LINK REL="stylesheet" TYPE="text/css" HREF="estilo.css">
</HEAD>

<BODY>

<H1>Clase de PHP - Tema Sesiones - Ejercicio 1</H1>

<H2>Paso 1: se crea la variable de sesión y se almacena</H2>

<?PHP
   $var = "Soledad";
   //session_register ("var");
  $_SESSION['var']=$var;
   print ("<P>Valor de la variable de sesión: $var</P>\n");
?>

<A HREF="ejercicio1b.php">Paso 2</A>.

</BODY>
</HTML>
