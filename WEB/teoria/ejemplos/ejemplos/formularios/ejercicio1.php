<HTML>

<HEAD>
   <TITLE>Curso de PHP - Ejercicio 1</TITLE>
   <LINK REL="stylesheet" TYPE="text/css" HREF="estilo.css">
</HEAD>

<BODY>

<H1>Curso de PHP - Ejercicio 4</H1>

<P>Introduzca sus datos:</P>

<FORM ACTION="ejercicio1-resultados.php" METHOD="POST">

<TABLE>
   <TR><TD>Nombre:</TD>
       <TD><INPUT TYPE="TEXT" NAME="nombre"></TD></TR>

   <TR><TD>Curso:</TD>
       <TD><INPUT TYPE="RADIO" NAME="curso" VALUE="1" CHECKED>Primero
           <INPUT TYPE="RADIO" NAME="curso" VALUE="2">Segundo
           <INPUT TYPE="RADIO" NAME="curso" VALUE="3">Tercero
           <INPUT TYPE="RADIO" NAME="curso" VALUE="4">Cuarto
           <INPUT TYPE="RADIO" NAME="curso" VALUE="5">Quinto</TD></TR>

   <TR><TD>T�tulo:</TD>
       <TD><SELECT NAME="titulacion">
              <OPTION SELECTED>Ingenier�a en Sistemas
              <OPTION>Ingenier�a Electromec�nica
              <OPTION>Analista Programador
           </SELECT></TD></TR>

   <TR><TD></TD>
       <TD><INPUT TYPE="SUBMIT" NAME="enviar" VALUE="enviar">
           <INPUT TYPE="RESET" VALUE="borrar datos"></TD></TR>
</TABLE>

</FORM>

</BODY>
</HTML>
