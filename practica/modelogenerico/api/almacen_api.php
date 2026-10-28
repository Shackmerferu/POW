<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Content-Type: application/json');
extract($_REQUEST);
require("conexion.php");

// En las peticiones multipart (subida de imagen) los datos llegan por $_POST.
if (!isset($action) && isset($_POST['action'])) {
    $action = $_POST['action'];
}

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
    // Los datos del formulario con imagen llegan por POST (multipart/form-data).
    $_REQUEST = array_merge($_REQUEST, $_POST);
    extract($_REQUEST);

    require("conexion.php");
    $conexion = mysqli_connect ($server_db, $usuario_db,$password_db)
        or die ("No se puede conectar con el servidor");
    mysqli_select_db ($conexion,$base_db)
        or die ("No se puede seleccionar base de datos");

    // Carpeta destino de las imágenes subidas.
    $directorio = __DIR__ . '/imagenes/';
    if (!is_dir($directorio)) {
        mkdir($directorio, 0777, true);
    }

    $imagen = null;
    $destino = null;

    // Si se envió una imagen, se valida y se guarda en el servidor.
    if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] !== UPLOAD_ERR_NO_FILE) {
        $archivo = $_FILES['imagen'];

        if ($archivo['error'] !== UPLOAD_ERR_OK) {
            echo json_encode([
                'status' => 500,
                'menssage' => 'Error al subir la imagen'
            ]);
            return;
        }

        if ($archivo['size'] > 5 * 1024 * 1024) {
            echo json_encode([
                'status' => 500,
                'menssage' => 'La imagen supera el tamaño máximo de 5 MB'
            ]);
            return;
        }

        $infoImagen = @getimagesize($archivo['tmp_name']);
        $tiposPermitidos = [
            'image/jpeg' => 'jpg',
            'image/png'  => 'png',
            'image/gif'  => 'gif',
            'image/webp' => 'webp'
        ];

        if ($infoImagen === false || !isset($tiposPermitidos[$infoImagen['mime']])) {
            echo json_encode([
                'status' => 500,
                'menssage' => 'El archivo no es una imagen válida (jpg, png, gif o webp)'
            ]);
            return;
        }

        $extension = $tiposPermitidos[$infoImagen['mime']];
        $nombreArchivo = uniqid('prod_', true) . '.' . $extension;
        $destino = $directorio . $nombreArchivo;

        if (!move_uploaded_file($archivo['tmp_name'], $destino)) {
            echo json_encode([
                'status' => 500,
                'menssage' => 'No se pudo guardar la imagen en el servidor'
            ]);
            return;
        }

        $imagen = $nombreArchivo;
    }

    $codigo = isset($codigo) ? (int) $codigo : 0;
    $cantidad = isset($cantidad) ? (int) $cantidad : 0;
    $precio_costo = isset($precio_costo) ? (float) $precio_costo : 0;
    $cantidad_minima = isset($cantidad_minima) ? (int) $cantidad_minima : 0;
    $nombre = isset($nombre) ? mysqli_real_escape_string($conexion, $nombre) : '';

    $imagenSql = $imagen === null
        ? 'NULL'
        : "'" . mysqli_real_escape_string($conexion, $imagen) . "'";

    $instruccion = "insert into productos (codigo,nombre,cantidad,precio_costo,cantidad_minima,imagen) values ('$codigo','$nombre','$cantidad','$precio_costo','$cantidad_minima',$imagenSql)";

    $consulta = mysqli_query($conexion, $instruccion);

    if (!$consulta) {
        if ($destino !== null && file_exists($destino)) {
            unlink($destino);
        }

        mysqli_close($conexion);
        echo json_encode([
            'status' => 500,
            'menssage' => 'Fallo en la consulta'
        ]);
        return;
    }

    $nfilas = mysqli_affected_rows($conexion);

    if ($nfilas > 0) {
        $datasuccess = [
            'status' => 200,
            'Mensaje' => 'Guardo'
        ];
    } else {
        if ($destino !== null && file_exists($destino)) {
            unlink($destino);
        }

        $datasuccess = [
            'status' => 500,
            'menssage' => 'Algo malo paso , arreglelo'
        ];
    }

    echo json_encode($datasuccess);
    mysqli_close($conexion);
}

////fin listar////


?>