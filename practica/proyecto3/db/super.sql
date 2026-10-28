CREATE DATABASE IF NOT EXISTS `bd_guia` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `bd_guia`;

CREATE TABLE IF NOT EXISTS `categorias` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS `productos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `codigo` INT NOT NULL UNIQUE,
  `nombre` VARCHAR(250) NOT NULL,
  `precio` DECIMAL(10,2) NOT NULL,
  `stock` INT NOT NULL,
  `id_categoria` INT NOT NULL,
  `imagen` VARCHAR(250) NULL,
  FOREIGN KEY (`id_categoria`) REFERENCES `categorias`(`id`)
);

INSERT INTO `categorias` (`id`, `nombre`) VALUES
(1, 'Almacén'),
(2, 'Bebidas'),
(3, 'Lácteos');

INSERT INTO `productos` (`codigo`, `nombre`, `precio`, `stock`, `id_categoria`, `imagen`) VALUES
(101, 'Aceite Girasol 1.5L', 1200.50, 20, 1, 'aceite.jpg'),
(102, 'Gaseosa Cola 2.25L', 1800.00, 15, 2, 'gaseosa.jpg'),
(103, 'Leche Entera 1L', 950.00, 8, 3, 'leche.jpg');