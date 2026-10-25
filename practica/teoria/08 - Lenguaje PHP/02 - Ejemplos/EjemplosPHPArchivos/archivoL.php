<HTML>
	<HEAD>
	</HEAD>
	<BODY>
		<?php
		   // obtiene e contenido de un archivo y o pone en una variable string
		  $nombreArchivo = 'test.txt';
		  $arch = fopen ($nombreArchivo, "r");
		  $contenido = fread ($arch, filesize ($nombreArchivo));
		  print "El contenido del archivo es: $contenido";
		  fclose ($arch);
		?>


</BODY>
</HTML>