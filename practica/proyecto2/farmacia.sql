CREATE DATABASE IF NOT EXISTS farmacia_db;
USE farmacia_db;

CREATE TABLE IF NOT EXISTS medicamentos (
    codigo INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    cantidad INT NOT NULL,
    precio_costo DECIMAL(10,2) NOT NULL,
    cantidad_minima INT NOT NULL
);

INSERT INTO medicamentos (codigo, nombre, cantidad, precio_costo, cantidad_minima) VALUES
(101, 'Ibuprofeno 400mg', 50, 1500.00, 20),
(102, 'Paracetamol 500mg', 10, 800.00, 15),
(103, 'Amoxicilina 500mg', 30, 2500.00, 10),
(104, 'Loratadina 10mg', 5, 1200.00, 10),
(105, 'Omeprazol 20mg', 40, 1800.00, 15);