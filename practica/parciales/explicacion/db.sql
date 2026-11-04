CREATE DATABASE IF NOT EXISTS tienda_examen;
USE tienda_examen;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50),
    clave VARCHAR(50),
    token VARCHAR(100)
);

-- Insertamos nuestro usuario de prueba con un token inventado en la DB
INSERT INTO usuarios (usuario, clave, token) VALUES ('admin', '1234', 'TOKEN_SECRETO_V.I.P_999');