<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Content-Type: application/json');
extract($_REQUEST);
require("conexion.php");

//debe venir el token 
// verificamos que este en la base de datos

        //verificamos si viene accion sino por defecto listar
        if(!isset($action)) $action="listar";
         
         switch($action)
         {
            case "listar":  listar();break;
            case "modificar":  modificar();break;
            case "borrar":  borrar();break;
            case "insertar":  insertar();break;
            defalut:{
                        $datasuccess=[
                            'status'=>500,
                            'token'=>null,
                            'menssage'=>'accion incorrecta (listar/modificar/borrar/insertar'
                        ];

                        echo json_encode($datasuccess);
            }
         }
    


///////////////
////funciones//
///////////////


//incio listar///
function listar()
{
    extract($_REQUEST);
    require("conexion.php");
    
  
    $filtros="";
    
    if(isset($id))
            $filtros.=" where id='$id'";
    if(isset($codigo))
            $filtros.=" where id='$codigo'";

    $conexion = mysqli_connect ($server_db, $usuario_db,$password_db)
        or die ("No se puede conectar con el servidor");
    mysqli_select_db ($conexion,$base_db)
        or die ("No se puede seleccionar base de datos");
    $instruccion = "select * from productos";
    $instruccion .=$filtros;
    $consulta = mysqli_query ($conexion,$instruccion) 
        or die ("Fallo en la consulta");
    $nfilas = mysqli_num_rows ($consulta);

    /****comenzamos a amrar el json ****/


    
    /****aqui ahroa recorremos las filas y las guardamos en un json */

    if($nfilas>0)
    {   
        $data=null;
        while( $row=mysqli_fetch_object($consulta))
        {
            $data[] = $row;
            
        }
        
        $datasuccess=[
            'status'=>200,
            'cantidad'=>$nfilas,
            'productos'=>$data
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
}

////fin listar////

//inicio Modificar

function modificar()
{
    
   extract($_REQUEST);
    require("conexion.php");
    if(isset($codigo))
    {
        
        $conexion = mysqli_connect ($server_db, $usuario_db,$password_db)
            or die ("No se puede conectar con el servidor");
        mysqli_select_db ($conexion,$base_db)
            or die ("No se puede seleccionar base de datos");
        
         //  $id= $usuario=mysqli_real_escape_string($conexion,$id);

        $instruccion = "update productos set codigo='$codigo',nombre='$nombre',precio_costo='$precio_costo',cantidad='$cantidad',cantidad_minima='$cantidad_minima' where codigo='$codigo'";
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

    
    
}
//fin modificar

//inicio borrar


function borrar()
{
    
   extract($_REQUEST);
    require("conexion.php");
    if(isset($codigo))
    {
        
        $conexion = mysqli_connect ($server_db, $usuario_db,$password_db)
            or die ("No se puede conectar con el servidor");
        mysqli_select_db ($conexion,$base_db)
            or die ("No se puede seleccionar base de datos");
        
           $codigo= $usuario=mysqli_real_escape_string($conexion,$codigo);

        $instruccion = "delete from productos where codigo='$codigo'";
        $consulta = mysqli_query ($conexion,$instruccion) 
            or die ("borro");
       // $nfilas=mysqli_affected_rows($conexion);
        
                    $datasuccess=[
                    'status'=>200,
                    'menssage'=>'borrado'
                ];

                echo json_encode($datasuccess);
        
    }
    else //no esta el id
    {
        $datasuccess=[
                    'status'=>500,
                    'token'=>null,
                    'menssage'=>'no se envio el codigo o no pudeo eliminar nada, verifiquelo'
                ];

                echo json_encode($datasuccess);
        
    }

    
    
    
} 

//insertar
function insertar()
{
    extract($_REQUEST);
    require("conexion.php");
    $conexion = mysqli_connect ($server_db, $usuario_db,$password_db)
        or die ("No se puede conectar con el servidor");
    mysqli_select_db ($conexion,$base_db)
        or die ("No se puede seleccionar base de datos");
    
    $instruccion = "insert into productos (codigo,nombre,cantidad,precio_costo,cantidad_minima) values ('$codigo','$nombre','$cantidad','$precio_costo','$cantidad_minima')";
    
    $consulta = mysqli_query ($conexion,$instruccion) 
        or die ("Fallo en la consulta");
 $nfilas=mysqli_affected_rows($conexion);
//print($nfilas);
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
}

////fin listar////


?>