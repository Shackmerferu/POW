<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Content-Type: application/json');
extract($_REQUEST);
require("conexion.php");

if(!isset($action)) $action="listar";

switch($action) {
    case "listar": listar(); break;
    case "modificar": modificar(); break;
    case "borrar": borrar(); break;
    case "insertar": insertar(); break;
    default: {
        $datasuccess=[
            'status'=>500,
            'token'=>null,
            'menssage'=>'accion incorrecta (listar/modificar/borrar/insertar)'
        ];
        echo json_encode($datasuccess);
    }
}

function listar() {
    extract($_REQUEST);
    require("conexion.php");
    
    $filtros="";
    if(isset($codigo)) $filtros.=" where codigo='$codigo'";

    $conexion = mysqli_connect($server_db, $usuario_db, $password_db) or die ("No se puede conectar con el servidor");
    mysqli_select_db($conexion, $base_db) or die ("No se puede seleccionar base de datos");
    
    $instruccion = "select * from medicamentos" . $filtros;
    $consulta = mysqli_query($conexion, $instruccion) or die ("Fallo en la consulta");
    $nfilas = mysqli_num_rows($consulta);

    if($nfilas > 0) {   
        $data = [];
        while($row = mysqli_fetch_object($consulta)) {
            $data[] = $row;
        }
        $datasuccess=[
            'status'=>200,
            'cantidad'=>$nfilas,
            'productos'=>$data
        ];
        echo json_encode($datasuccess);
    } else {
        $datasuccess=[
            'status'=>500,
            'menssage'=>'No se encontraron registros'
        ];
        echo json_encode($datasuccess);
    }
    mysqli_close($conexion);
}

function modificar() {
    extract($_REQUEST);
    require("conexion.php");

    if(isset($codigo)) {
        $conexion = mysqli_connect($server_db, $usuario_db, $password_db) or die ("No se puede conectar con el servidor");
        mysqli_select_db($conexion, $base_db) or die ("No se puede seleccionar base de datos");
        
        $codigo = mysqli_real_escape_string($conexion, $codigo);
        
        $instruccion = "update medicamentos set nombre='$nombre', precio_costo='$precio_costo', cantidad='$cantidad', cantidad_minima='$cantidad_minima' where codigo='$codigo'";
        $consulta = mysqli_query($conexion, $instruccion) or die ("Fallo en la consulta");
        $nfilas = mysqli_affected_rows($conexion);
        
        if($nfilas > 0) {
            $datasuccess = ['status'=>200, 'menssage'=>'Modificado'];
        } else {
            $datasuccess = ['status'=>505, 'menssage'=>'NO Modificado'];
        }
        echo json_encode($datasuccess);
    } else {
        $datasuccess = ['status'=>500, 'token'=>null, 'menssage'=>'No se envio el codigo'];
        echo json_encode($datasuccess);
    }
}

function borrar() {
    extract($_REQUEST);
    require("conexion.php");

    if(isset($codigo)) {
        $conexion = mysqli_connect($server_db, $usuario_db, $password_db) or die ("No se puede conectar con el servidor");
        mysqli_select_db($conexion, $base_db) or die ("No se puede seleccionar base de datos");
        
        $codigo = mysqli_real_escape_string($conexion, $codigo);
        
        $instruccion = "delete from medicamentos where codigo='$codigo'";
        $consulta = mysqli_query($conexion, $instruccion) or die ("Fallo en la consulta");
        
        $datasuccess = ['status'=>200, 'menssage'=>'borrado'];
        echo json_encode($datasuccess);
    } else {
        $datasuccess = ['status'=>500, 'token'=>null, 'menssage'=>'No se envio el codigo'];
        echo json_encode($datasuccess);
    }
} 

function insertar() {
    extract($_REQUEST);
    require("conexion.php");

    $conexion = mysqli_connect($server_db, $usuario_db, $password_db) or die ("No se puede conectar con el servidor");
    mysqli_select_db($conexion, $base_db) or die ("No se puede seleccionar base de datos");
    
    $instruccion = "insert into medicamentos (codigo, nombre, cantidad, precio_costo, cantidad_minima) values ('$codigo','$nombre','$cantidad','$precio_costo','$cantidad_minima')";
    $consulta = mysqli_query($conexion, $instruccion) or die ("Fallo en la consulta");
    $nfilas = mysqli_affected_rows($conexion);

    if($nfilas > 0) {   
        $datasuccess = ['status'=>200, 'Mensaje'=>'Guardo'];
        echo json_encode($datasuccess);
    } else {
        $datasuccess = ['status'=>500, 'menssage'=>'Error al guardar'];
        echo json_encode($datasuccess);
    }
    mysqli_close($conexion);
}
?>