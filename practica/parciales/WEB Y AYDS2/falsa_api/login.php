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
        or die ("No se puede seleccionar la base de datos");
    if(isset($usuario)&&isset($password))
    {
        $salt = substr ($usuario, 0, 2);
        
        $clave_crypt = crypt ($password, $salt);
        $usuario=mysqli_real_escape_string($conexion,$usuario);
        $password=mysqli_real_escape_string($conexion,$password);
        $instruccion = "select * from usuarios where usuario = '$usuario'" .
        " and password = '$clave_crypt'";
        $consulta = mysqli_query ($conexion,$instruccion)
        or die ("Fallo en la consulta");
        $nfilas = mysqli_num_rows ($consulta);

        /****comenzamos a amrar el json ****/


        $myArray = array(); //el primer array del json
        /****aqui ahroa recorremos las filas y las guardamos en un json */

        if($nfilas>0)
        {   
        //token
            //generamos token
            $token = bin2hex(random_bytes(32));

        //este token deberian lo guardamos al final de la consulta si existe el usaurio y el password
        //fin token
            $data=null;
            while( $row=mysqli_fetch_object($consulta))
            {
                $data[] = $row;
                //en este cason no devolvemos toda la data porque hay datos sensibles como la contraseña
                $nombre=$row->nombre;
                $apellido=$row->apellido;
                $id_usuario=$row->id_usuario;
            }
            
            $datasuccess=[
                'status'=>200,
                'token'=>$token,
                'nombre'=>$nombre,
                'apellido'=>$apellido,
                'id_usurio'=>$id_usuario
            //  'data'=>$data
            ];
            
            //ACTUALIZAMOS EL TOKEN EN LA BASE DE DATOS
        $instruccion = "update usuarios set token='$token' where usuario = '$usuario' and password = '$clave_crypt'";
            $consulta = mysqli_query ($conexion,$instruccion)
                or die ("Fallo en la consulta");
            //
            echo json_encode($datasuccess);
            
            
        
        }
        else
        {
        $datasuccess=[
                        'status'=>500,
                        'token'=>null,
                        'menssage'=>'usuario o contraseña erroneos'
                    ];

                    echo json_encode($datasuccess);
        
        }
        
        mysqli_close($conexion);
    }
    else //si no esta el usuario y/o password
    {
        $datasuccess=[
                    'status'=>500,
                    'token'=>null,
                    'menssage'=>'no se envio usuario o pasword'
                ];

                echo json_encode($datasuccess);
    }
?>