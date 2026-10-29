<?php
/* CORRECCIÓN DE partidos.php */

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
    $filtros="where 1";
    if(isset($id_categoria))
        $filtros.=" and id_categoria=".$id_categoria;

     /* CORRECCIÓN: Faltaban las llaves { } en este 'if'.
        Sin llaves, solo la línea '$localia=...' se ejecutaba condicionalmente.
        La línea '$filtros.=...' se ejecutaba SIEMPRE, 
        lo que rompía la consulta SQL cuando no se pasaban los parámetros.
     */
     if(isset($id_equipo) and isset($localia))
     { // <-- LLAVE DE APERTURA
        $localia="id_equipo_".$localia;
        $filtros.=" and $localia=$id_equipo";
     } // <-- LLAVE DE CIERRE
    
       
    $instruccion = "select * from partidos_canicas ".$filtros;
   
    $consulta = mysqli_query ($conexion,$instruccion) 
        or die ("Fallo en la consulta: ".mysqli_error($conexion)); // Añadimos detalle del error
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
            // CORRECCIÓN: El enunciado usa 'productos' pero semánticamente
            // 'partidos' sería mejor. Lo dejamos como 'productos' 
            // para que coincida con tu JS.
            'productos'=>$data 
        ];
                    
        echo json_encode($datasuccess);
                

    }
    else
    {
        $datasuccess=[
                    'status'=>500,
                    'menssage'=>'No se encontraron partidos con esos filtros',
                    'query_ejecutada' => $instruccion // Ayuda para depurar
                ];

                echo json_encode($datasuccess);
        
    }

    mysqli_close($conexion);

?>