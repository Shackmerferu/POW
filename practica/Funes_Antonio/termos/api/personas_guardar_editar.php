<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Content-Type: application/json');
extract($_REQUEST);
    require("conexion.php");
    
    
   if(isset($id))
    {
        
        $conexion = mysqli_connect ($server_db, $usuario_db,$password_db)
            or die ("No se puede conectar con el servidor");
        mysqli_select_db ($conexion,$base_db)
            or die ("No se puede seleccionar base de datos");
        
         //  $id= $usuario=mysqli_real_escape_string($conexion,$id);

        $instruccion = "update personas set nombre='$nombre',apellido='$apellido',direccion='$direccion',ciudad='$ciudad',provincia='$provincia',email='$email',telefono='$telefono' where id='$id'";
        $consulta = mysqli_query ($conexion,$instruccion) 
            or die ("borro");
        $nfilas=mysqli_affected_rows($conexion);
        
        if($nfilas>0){
                    $datasuccess=[
                    'status'=>200,
                    'menssage'=>'Modificado'
                ];
                }
                else
                    {
                    $datasuccess=[
                    'status'=>505,
                    'menssage'=>'NO Modificado'
                ];
                }
                echo json_encode($datasuccess);
        
    }
    else //no esta el id
    {
        $datasuccess=[
                    'status'=>500,
                    'token'=>null,
                    'menssage'=>'no se envio el codigo o no pudeo actualizar nada, verifiquelo'
                ];

                echo json_encode($datasuccess);
        
    }




