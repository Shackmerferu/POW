<?php
class Api {
    private $mysqli;

    function __construct(){
        $host = 'localhost';
        $user = 'root';
        $pass = '';
        $db   = 'paises';

        $this->mysqli = new mysqli($host, $user, $pass, $db);
        if ($this->mysqli->connect_errno) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'status' => 500,
                'message' => 'Error de conexión a la base de datos',
                'error' => $this->mysqli->connect_error
            ]);
            exit;
        }
        $this->mysqli->set_charset('utf8');
    }

    // helper para validar order/order_dir y limit
    private function normalizeOrder($order){
        $allowed = ['nombre','id','idPais','x','y']; // ajustá según tus columnas reales
        return in_array($order, $allowed) ? $order : 'nombre';
    }
    private function normalizeOrderDir($dir){
        return (strtolower($dir) === 'desc') ? 'DESC' : 'ASC';
    }
    private function normalizeLimit($limit){
        if (!isset($limit) || !is_numeric($limit)) return 5;
        $n = (int)$limit;
        return ($n > 0 && $n <= 1000) ? $n : 5;
    }

    function list_paises($limit = 5, $order = 'nombre', $order_dir = 'ASC'){
        $limit = $this->normalizeLimit($limit);
        $order = $this->normalizeOrder($order);
        $order_dir = $this->normalizeOrderDir($order_dir);

        // construimos la query con ORDER BY seguro (no se puede bindear columna/keyword)
        $sql = "SELECT * FROM pais LIMIT ?";
        $stmt = $this->mysqli->prepare($sql);
        if (!$stmt) {
            return ['status' => 500, 'message' => 'Error preparar consulta', 'error' => $this->mysqli->error];
        }
        $stmt->bind_param('i', $limit);
        if (!$stmt->execute()) {
            return ['status' => 500, 'message' => 'Error ejecutar consulta', 'error' => $stmt->error];
        }
        $res = $stmt->get_result();
        $data = $res->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        return ['status' => 200, 'paises' => $data];
    }

    function list_provincias($limit = 100, $order = 'nombre', $order_dir = 'ASC', $idPais = null){
        $limit = $this->normalizeLimit($limit);
        $order = $this->normalizeOrder($order);
        $order_dir = $this->normalizeOrderDir($order_dir);

        if ($idPais === null) {
            return ['status' => 400, 'message' => 'Falta idPais'];
        }

        $sql = "SELECT * FROM provincia WHERE idPais = ? ORDER BY {$order} {$order_dir} LIMIT ?";
        $stmt = $this->mysqli->prepare($sql);
        if (!$stmt) {
            return ['status' => 500, 'message' => 'Error preparar consulta', 'error' => $this->mysqli->error];
        }
        $id = (int)$idPais;
        $stmt->bind_param('ii', $id, $limit);
        if (!$stmt->execute()) {
            return ['status' => 500, 'message' => 'Error ejecutar consulta', 'error' => $stmt->error];
        }
        $res = $stmt->get_result();
        $data = $res->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        return ['status' => 200, 'data' => $data];
    }

    function list_localidades($limit = 100, $order = 'nombre', $order_dir = 'ASC', $idProvincia = null){
        $limit = $this->normalizeLimit($limit);
        $order = $this->normalizeOrder($order);
        $order_dir = $this->normalizeOrderDir($order_dir);

        if ($idProvincia === null) {
            return ['status' => 400, 'message' => 'Falta idProvincia'];
        }

        $sql = "SELECT * FROM localidad WHERE idProvincia = ? ORDER BY {$order} {$order_dir} LIMIT ?";
        $stmt = $this->mysqli->prepare($sql);
        if (!$stmt) {
            return ['status' => 500, 'message' => 'Error preparar consulta', 'error' => $this->mysqli->error];
        }
        $id = (int)$idProvincia;
        $stmt->bind_param('ii', $id, $limit);
        if (!$stmt->execute()) {
            return ['status' => 500, 'message' => 'Error ejecutar consulta', 'error' => $stmt->error];
        }
        $res = $stmt->get_result();
        $data = $res->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        return ['status' => 200, 'data' => $data];
    }
}
/*
    function insert(){
        try {			
            $query="insert into tortas (nombre,descripcion,precio) values(:pNombre,:pDescripcion,:pPrecio)";
            $sql = $this->connect->prepare($query);
            $sql->bindParam(':pNombre',$_POST['nombre'],PDO::PARAM_STR);
            $sql->bindParam(':pDescripcion',$_POST['descripcion'],PDO::PARAM_STR);
            $sql->bindParam(':pPrecio',$_POST['precio'],PDO::PARAM_INT);
            $ok= $sql->execute();
            if($ok){
                $datasuccess=[
                    'status'=>200
                ];
                return $datasuccess;
            }
            else{
                $datasuccess=[
                    'status'=>500,
                    'message'=>'error al ejecutar la consulta'
                ];
                return $datasuccess;
            }
        } catch (Exception $e) {
            $datasuccess[]=[
                'status'=>500,
                'menssage'=>'algo malo paso'
            ];
            return  $datasuccess;
        }
    }
	*/
?>


