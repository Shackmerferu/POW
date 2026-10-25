<HTML>

<HEAD>
   <TITLE>Curso de PHP - Ejercicio 6</TITLE>
   <LINK REL="stylesheet" TYPE="text/css" HREF="estilo.css">
</HEAD>

<BODY>

<?PHP
extract($_REQUEST);
   if (isset($enviar))
   {
      print ("<H1>Curso de PHP - Ejercicio 3. Resultados del formulario</H1>\n");

      print ("<P>Estos son los datos introducidos:</P>\n");
      print ("<UL>\n");
      print ("<LI>Nombre: $nombre\n");
      print ("<LI>Curso: $curso\n");
      print ("<LI>Titulaci�n: $titulacion\n");
      print ("</UL>\n");
      print ("[ <A HREF='javascript:history.back()'>Volver</A> ]");
      header("dedddddd");
   }
   else
   {
?>

<H1>Curso de PHP - Ejercicio 6</H1>

<P>Introduzca sus datos:</P>

<FORM ACTION="ejercicio3.php" METHOD="POST">

<TABLE>
   <TR><TD>Nombre:</TD>
       <TD><INPUT TYPE="TEXT" NAME="nombre"></TD></TR>

   <TR><TD>Curso:</TD>
       <TD><INPUT TYPE="RADIO" NAME="curso" VALUE="1" CHECKED>Primero
           <INPUT TYPE="RADIO" NAME="curso" VALUE="2">Segundo
           <INPUT TYPE="RADIO" NAME="curso" VALUE="3">Tercero
           <INPUT TYPE="RADIO" NAME="curso" VALUE="4">Cuarto
           <INPUT TYPE="RADIO" NAME="curso" VALUE="5">Quinto</TD></TR>

   <TR><TD>Titulaci�n:</TD>
       <TD><SELECT NAME="titulacion">
              <OPTION SELECTED>Ingenier�a Inform�tica
              <OPTION>Ingenier�a T�cnica en Inform�tica de Gesti�n
              <OPTION>Ingenier�a T�cnica en Inform�tica de Sistemas
           </SELECT></TD></TR>

   <TR><TD></TD>
       <TD><INPUT TYPE="SUBMIT" NAME="enviar" VALUE="enviar">
           <INPUT TYPE="RESET" VALUE="borrar datos"></TD></TR>
</TABLE>

</FORM>

<?PHP
   }
?>

</BODY>
</HTML>
