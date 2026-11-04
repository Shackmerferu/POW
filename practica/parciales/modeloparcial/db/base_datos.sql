CREATE DATABASE IF NOT EXISTS termo_store
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE termo_store;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('cliente', 'admin') NOT NULL DEFAULT 'cliente'
);

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    imagen VARCHAR(500),
    categoria ENUM('termo', 'mate') NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    activo TINYINT(1) NOT NULL DEFAULT 1
);

INSERT INTO productos
(nombre, descripcion, precio, imagen, categoria, stock)
VALUES
('Termo acero inoxidable', 'Termo de 1 litro.', 35000,
 'https://placehold.co/600x400?text=Termo', 'termo', 15),
('Termo clásico', 'Termo para bebidas calientes.', 28000,
 'https://placehold.co/600x400?text=Termo+clasico', 'termo', 10),
('Mate de madera', 'Mate tradicional de madera.', 12000,
 'https://placehold.co/600x400?text=Mate', 'mate', 20),
('Mate de acero', 'Mate de acero inoxidable.', 18000,
 'https://placehold.co/600x400?text=Mate+acero', 'mate', 12);