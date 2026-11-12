<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Content-Type: application/json');
extract($_REQUEST);
require("conexion.php");
require("funciones.php"); //aqui esta la de verificar_token
//debe venir el token 
// verificamos que este en la base de datos
if(!isset($token))$token=""; //si no esta token lo ponemos vacio para que no de erro la api
$token_ok=verificar_token($token); //devuelve true o false
 if(!$token_ok)
    {
        //si token es incorrecto o no esta pasado
        $datasuccess=[
            'status'=>500,
            'token'=>null,
            'menssage'=>'Desautorizado',
            'menssage_error'=>'token invalido'
        ];

        echo json_encode($datasuccess);  
    }else
    {
       
        $conexion = mysqli_connect ($server_db, $usuario_db,$password_db)
            or die ("No se puede conectar con el servidor");
        mysqli_select_db ($conexion,$base_db)
            or die ("No se puede seleccionar base de datos");
        $instruccion = "select * from productos";
        $consulta = mysqli_query ($conexion,$instruccion) 
            or die ("Fallo en la consulta");
        $nfilas = mysqli_num_rows ($consulta);

        /****comenzamos a amrar el json ****/

        if($nfilas>0)
        {   
            $data=null;
            while( $row=mysqli_fetch_object($consulta))
            {
                $data[] = $row;
                
            }
            
            $datasuccess=[
                'status'=>200,
              //  'token'=>$token,
                'data'=>$data
            ];
                        
            echo json_encode($datasuccess);
                   

        }
        else
        {
            $datasuccess=[
                        'status'=>500,
                        'token'=>null,
                        'menssage'=>'algo malo paso'
                    ];

                    echo json_encode($datasuccess);
            
        }

        mysqli_close($conexion);



    }



?>