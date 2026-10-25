<?PHP
   session_start ();
?>

<HTML>

<HEAD>
   <TITLE>Clase de PHP - Tema Sesiones - Ejercicio 1c</TITLE>
   <LINK REL="stylesheet" TYPE="text/css" HREF="estilo.css">
</HEAD>

<BODY>

<H1>Clase de PHP - Tema Sesiones - Ejercicio 1c</H1>

<H2>Paso 3: la variable ya ha sido destruida y su valor se ha perdido</H2>

<?PHP
	if(isset($_SESSION['var']))
		print ("<P>Valor de la variable de sesión: ".$_SESSION['var']."</P>\n");
    else
		print("ya no existe var");
   session_destroy ();
?>

<A HREF="ejercicio1.php">Volver al paso 1</A>.

</BODY>
</HTML>
