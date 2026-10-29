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
        
         //para que anden estos controles la conexion y la seleccion de la base de datos deberia estar aqui arriba
    /*
    $id= $usuario=mysqli_real_escape_string($conexion,$id);
    $min= $usuario=mysqli_real_escape_string($conexion,$min);
    $max= $usuario=mysqli_real_escape_string($conexion,$max);
    $ord_campo= $usuario=mysqli_real_escape_string($conexion,$ord_campo);
    $ord_orientacion= $usuario=mysqli_real_escape_string($conexion,$ord_orientacion);
    //$like= $usuario=mysqli_real_escape_string($conexion,$like);
*/
        $filtros="";
        if(isset($max)||isset($min)||isset($ord_campo)||isset($ord_orientacion)||isset($id))
            $filtros.=" where 1 ";
        
        if(isset($id))
             $filtros.=" and id='$id'";
        if(!isset($ord_orientacion))
             $ord_orientacion="asc"; //por defecto en caso de no venir la orientacion
        if(isset($ord_campo))
             $filtros.="  order by ".$ord_campo." ".$ord_orientacion." ";

        if(isset($max)&&isset($min))
            $filtros.="  limit ".$min.",".$max." ";
        
   

        $conexion = mysqli_connect ($server_db, $usuario_db,$password_db)
            or die ("No se puede conectar con el servidor");
        mysqli_select_db ($conexion,$base_db)
            or die ("No se puede seleccionar base de datos");
        $instruccion = "select * from proveedores";
        $instruccion .=$filtros;
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