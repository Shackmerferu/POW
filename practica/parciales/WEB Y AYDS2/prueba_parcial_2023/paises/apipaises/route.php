<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Content-Type: application/json;charset=utf-8');

include('api.php');
$api = new Api();

// obtenemos option con fallback
$option = isset($_GET['option']) ? $_GET['option'] : '';

switch ($option) {
    case 'list_paises':
        $limit = $_GET['limit'] ?? 100;
        $order = $_GET['order'] ?? 'nombre';
        $order_dir = $_GET['order_dir'] ?? 'ASC';
        $data = $api->list_paises($limit, $order, $order_dir);
        break;
    case 'list_provincias':
        $limit = $_GET['limit'] ?? 100;
        $order = $_GET['order'] ?? 'nombre';
        $order_dir = $_GET['order_dir'] ?? 'ASC';
        $idPais = $_GET['idPais'] ?? null;
        $data = $api->list_provincias($limit, $order, $order_dir, $idPais);
        break;
    case 'list_localidades':
        $limit = $_GET['limit'] ?? 100;
        $order = $_GET['order'] ?? 'nombre';
        $order_dir = $_GET['order_dir'] ?? 'ASC';
        $idProvincia = $_GET['idProvincia'] ?? null;
        $data = $api->list_localidades($limit, $order, $order_dir, $idProvincia);
        break;
    default:
        $data = ['status' => 400, 'message' => 'Option no válida'];
}

echo json_encode($data);
