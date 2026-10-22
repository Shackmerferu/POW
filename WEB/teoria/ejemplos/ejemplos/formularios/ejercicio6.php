<HTML>

<HEAD>
   <TITLE>Curso de PHP - Ejercicio 6</TITLE>
   <LINK REL="stylesheet" TYPE="text/css" HREF="estilo.css">
</HEAD>

<BODY>

<?PHP
   //////////////////////////////////////////////////////////////////////////
   // si el formulario ha sido enviado
   //    validar formulario
   // fsi
   // si el formulario ha sido enviado y los datos son correctos
   //    procesar formulario
   // si no
   //    mostrar formulario
   // fsi
   //////////////////////////////////////////////////////////////////////////
   extract($_REQUEST);
   $errores[1]="";
   $errores[2]="";
   $errores[3]="";
   $error = false;
   if (isset($enviar))
   {
   
   // Comprobar errores
   // Nombre
      if (trim($nombre) == "")
      {
         $errores[1] = "¡Debe introducir el nombre!";
         $error = true;
      }
      else
         $errores[1] = "";
   // Apellidos
      if (trim($apellidos) == "")
      {
         $errores[2] = "¡Debe introducir los apellidos!";
         $error = true;
      }
      else
         $errores[2] = "";
   }

// Si los datos son correctos, procesar formulario
   if (isset($enviar) && $error==false)
   {
      print ("<H1>Curso de PHP - Ejercicio 6. Resultados del formulario</H1>\n");
      print ("<P>Estos son los datos introducidos:</P>\n");
      print ("<UL>\n");
      print ("<LI>Nombre: $nombre\n");
      print ("<LI>Apellidos: $apellidos\n");
      print ("<LI>Curso: $curso\n");
      print ("<LI>Titulación: $titulacion\n");
      print ("</UL>\n");
      print ("[ <A HREF='javascript:history.back()'>Volver</A> ]");
   }
   else
   {
?>

<H1>Curso de PHP - Ejercicio 9</H1>

<P>Introduzca sus datos:</P>

<FORM ACTION="ejercicio6.php" METHOD="POST">

<TABLE>
   <TR><TD>Nombre:</TD>
       <TD><INPUT TYPE="TEXT" NAME="nombre"

<?PHP
   if (isset($enviar))
      print ("VALUE='$nombre'>\n");
   else
      print (">\n");
   if ($errores[1] != "")
      print ("<BR>$errores[1]");
?>

</TD></TR>

   <TR><TD>Apellidos:</TD>
       <TD><INPUT TYPE="TEXT" NAME="apellidos"

<?PHP
   if (isset($enviar))
      print ("VALUE='$apellidos'>\n");
   else
      print (">\n");
   if ($errores[2] != "")
      print ("<BR>$errores[2]");
?>

</TD></TR>

   <TR><TD>Curso:</TD>
       <TD><INPUT TYPE="RADIO" NAME="curso" VALUE="1" CHECKED>Primero
           <INPUT TYPE="RADIO" NAME="curso" VALUE="2">Segundo
           <INPUT TYPE="RADIO" NAME="curso" VALUE="3">Tercero
           <INPUT TYPE="RADIO" NAME="curso" VALUE="4">Cuarto
           <INPUT TYPE="RADIO" NAME="curso" VALUE="5">Quinto</TD></TR>

   <TR><TD>Titulación:</TD>
       <TD><SELECT NAME="titulacion">
              <OPTION SELECTED>Ingeniería Informática
              <OPTION>Ingeniería Técnica en Informática de Gestión
              <OPTION>Ingeniería Técnica en Informática de Sistemas
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
