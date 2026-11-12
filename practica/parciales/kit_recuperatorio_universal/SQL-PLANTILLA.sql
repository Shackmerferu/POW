-- SQL del kit universal. Importable tal cual desde phpMyAdmin o consola:
--   CREATE DATABASE parcial; luego ejecutar este archivo completo.
-- En el parcial, reemplazar entidad y columnas por las del dominio del enunciado.
CREATE DATABASE IF NOT EXISTS parcial CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE parcial;

CREATE TABLE IF NOT EXISTS entidad (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  descripcion TEXT NOT NULL,
  valor DECIMAL(10,2) DEFAULT 0,
  categoria VARCHAR(100) NULL,
  imagen VARCHAR(255) NULL,
  texto_alternativo VARCHAR(255) NULL,
  titulo_imagen VARCHAR(120) NULL,
  descripcion_larga TEXT NULL
);

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(80) NOT NULL UNIQUE,
  clave VARCHAR(255) NOT NULL,
  token VARCHAR(255) NULL
);

-- Usuario de prueba: admin / admin123 (hash generado con password_hash).
INSERT INTO usuarios (usuario, clave) VALUES
  ('admin', '$2y$12$KUE4/GJ7Unbd12FuJA1hWemSvgUwVyplkA.3jL8lIAnpWiDVMpgB6');

INSERT INTO entidad (nombre, descripcion, valor, categoria) VALUES
  ('Registro de ejemplo 1', 'Primer registro de prueba', 10.50, 'general'),
  ('Registro de ejemplo 2', 'Segundo registro de prueba', 25.00, 'general'),
  ('Registro de ejemplo 3', 'Tercer registro de prueba', 7.25, 'especial');
