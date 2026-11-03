<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Content-Type: application/json');
extract($_REQUEST);
    require("conexion.php");
    $conexion = mysqli_connect ($server_db, $usuario_db,$password_db)
        or die ("No se puede conectar con el servidor");
    mysqli_select_db ($conexion,$base_db)
        or die ("No se puede seleccionar base de datos");
    
   // $instruccion = "insert into productos (codigo,nombre,cantidad,precio_costo,cantidad_minima) values ('$codigo','$nombre','$cantidad','$precio_costo','$cantidad_minima')";
    $instruccion="insert into personas (id,dni,apellido,nombre,direccion,ciudad,provincia,email,telefono)value(1,'$dni','$apellido','$nombre','$direccion','$ciudad',$provincia,'$email','$telefono')";
    $consulta = mysqli_query ($conexion,$instruccion) 
        or die ("Fallo en la consulta");
 $nfilas=mysqli_affected_rows($conexion);
 //signo id consecutivo
  	mysqli_query($conexion, "SET @n := 0");
	mysqli_query($conexion, "
    UPDATE personas
    SET id = (@n := @n + 1)
    
	");
//fin asigancion 

    if($nfilas>0)
    {   
            
        $datasuccess=[
            'status'=>200,
            'Mensaje'=>'Guardo'
        ];
                    
        echo json_encode($datasuccess);
     
    }
    else
    {
        $datasuccess=[
                    'status'=>500,
                    'menssage'=>'Algo malo paso , arreglelo'
                ];

                echo json_encode($datasuccess);
        
    }

    mysqli_close($conexion);







