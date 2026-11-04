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
    //http://localhost/la_tania/api/partidos_api.php?id_partido=167
    //http://localhost/la_tania/api/partidos_api.php?id_categoria=1&modalidad=C1&id_equipo_A=1&id_equipo_B=2
    //http://localhost/la_tania/api/partidos_api.php?action=listar&id_categoria=1&modalidad=C1&id_equipo_A=1&id_equipo_B=2

    extract($_REQUEST);
    require("conexion.php");
    
  
    $filtros="";
    
    if(isset($id_partido)||isset($id_equipo)||isset($localia)||isset($id_equipo_A)||isset($id_equipo_b)||isset($modalidad)||isset($id_categoria))
        $filtros=" where 1 ";
     if(isset($id_categoria))
        $filtros.=" and id_categoria=".$id_categoria;
    if(isset($id_partido))
            $filtros.=" and id_partido='$id_partido'";
    if(isset($id_equipo) and isset($localia))
     {
        $localia="id_equipo_".$localia;
        $filtros.=" and $localia=$id_equipo";
     }
    if(isset($id_equipo_A))
            $filtros.=" and id_equipo_A=$id_equipo_A";
    if(isset($id_equipo_B))
            $filtros.=" and id_equipo_B=$id_equipo_B";
    if(isset($modalidad))
            $filtros.=" and modalidad='$modalidad'";
    
    $conexion = mysqli_connect ($server_db, $usuario_db,$password_db)
        or die ("No se puede conectar con el servidor");
    mysqli_select_db ($conexion,$base_db)
        or die ("No se puede seleccionar base de datos");
    
    $instruccion = "select * from partidos_canicas";
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
            'partidos'=>$data
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
    if(isset($id_partido))
    {
        
        $conexion = mysqli_connect ($server_db, $usuario_db,$password_db)
            or die ("No se puede conectar con el servidor");
        mysqli_select_db ($conexion,$base_db)
            or die ("No se puede seleccionar base de datos");
        
         //  $id= $usuario=mysqli_real_escape_string($conexion,$id);

        $instruccion = "update partidos_canicas set puntos_A='$puntos_A',puntos_B='$puntos_B' where id_partido='$id_partido'";
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
                    'menssage'=>'NO Modificado. envio los mismos puntos'
                ];
                }
                echo json_encode($datasuccess);
        
    }
    else //no esta el id
    {
        $datasuccess=[
                    'status'=>500,
                    'token'=>null,
                    'menssage'=>'no se envio el id_partido o no pudo actualizar nada, verifiquelo'
                ];

                echo json_encode($datasuccess);
        
    }

    
    
}
//fin modificar

//inicio borrar


function borrar()
{
   //http://localhost/la_tania/api/partidos_api.php?action=borrar&id_partido=165 
   extract($_REQUEST);
    require("conexion.php");
    if(isset($id_partido))
    {
        
        $conexion = mysqli_connect ($server_db, $usuario_db,$password_db)
            or die ("No se puede conectar con el servidor");
        mysqli_select_db ($conexion,$base_db)
            or die ("No se puede seleccionar base de datos");
        
           $id_partido= mysqli_real_escape_string($conexion,$id_partido);

        $instruccion = "delete from partidos_canicas where id_partido='$id_partido'";
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
    //http://localhost/la_tania/api/partidos_api.php?action=insertar&id_categoria=2&modalidad=C1&id_equipo_A=1&id_equipo_B=2&puntos_A=1&puntos_B=1

    extract($_REQUEST);
    require("conexion.php");
    $conexion = mysqli_connect ($server_db, $usuario_db,$password_db)
        or die ("No se puede conectar con el servidor");
    mysqli_select_db ($conexion,$base_db)
        or die ("No se puede seleccionar base de datos");
    
    $instruccion = "insert into partidos_canicas (id_equipo_A,id_equipo_B,puntos_A,puntos_B,modalidad,id_categoria) values ('$id_equipo_A','$id_equipo_B','$puntos_A','$puntos_B','$modalidad','$id_categoria')";
    
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