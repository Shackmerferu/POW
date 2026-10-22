<?php
    $fp = fopen("tabla.txt","r") or die ("no pudo abrirlo");
    $conexion= mysqli_connect("localhost","root","","noticias") or die ("no puedo conectarme");
    $instuccion="truncate table noticias.proveedores";
 //   $instuccion="delete * form proveedores";
    mysqli_query($conexion,$instuccion) or die ("no pudo borrar");
    //usando el fgets
   /* while(!feof($fp))
    {
       $fila= fgets($fp);
       $datos=explode("|",$fila);
       $instuccion="insert into proveedores (nombre, apellido, telefono,email,localidad) values ('$datos[1]','$datos[2]','$datos[3]','$datos[4]','$datos[5]')";
       mysqli_query($conexion,$instuccion) or die ("no pudo insertar");
       print($datos[0]." ".$datos[1]." ".$datos[2]." ".$datos[3]." ".$datos[4]." <br>" );
      
    }
    */

    //usando solo explode
    $contenido=fread($fp,filesize("tabla.txt"));
    $filas=explode("\n",$contenido);
    $cant=count($filas);
    print_r($filas);
    print($cant);
    for($i=0;$i<$cant;$i++)
    {
      //$fila= $filas[$i];
       $datos=explode("|",$filas[$i]);
       $instuccion="insert into proveedores (nombre, apellido, telefono,email,localidad) values ('".trim($datos[1])."','".trim($datos[2])."','$datos[3]','$datos[4]','$datos[5]')";
       mysqli_query($conexion,$instuccion) or die ("no pudo insertar");
       print($datos[0]." ".$datos[1]." ".$datos[2]." ".$datos[3]." ".$datos[4]." <br>" );
      

    }
   

    mysqli_close($conexion);
    fclose($fp);


?>