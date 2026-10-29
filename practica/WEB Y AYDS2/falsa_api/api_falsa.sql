-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 14-10-2025 a las 05:31:38
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `api_falsa`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `Id` int(11) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `apellido` varchar(30) NOT NULL,
  `telefono` varchar(30) NOT NULL,
  `email` varchar(60) NOT NULL,
  `ciudad` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedores`
--

INSERT INTO `proveedores` (`Id`, `nombre`, `apellido`, `telefono`, `email`, `ciudad`) VALUES
(1, '   Juan    ', '   Pérez     ', '  555-123-4567 ', '  juan.perez@example.com     ', '  Ciudad A   '),
(2, '   María   ', '   García    ', '  555-987-6543 ', '  maria.garcia@example.com   ', '  Ciudad B   '),
(3, '   Pedro   ', '   López     ', '  555-234-5678 ', '  pedro.lopez@example.com    ', '  Ciudad C   '),
(4, '  Ana      ', '   Rodríguez ', '  555-876-5432 ', '  ana.rodriguez@example.com  ', '  Ciudad D   '),
(5, '   Luis    ', '   Martínez  ', '  555-345-6789 ', '  luis.martinez@example.com  ', '  Ciudad E   '),
(6, '   Laura   ', '   Hernández ', '  555-765-4321 ', '  laura.hernandez@example.com', '  Ciudad F   '),
(7, '   Carlos  ', '   González  ', '  555-456-7890 ', '  carlos.gonzalez@example.com', '  Ciudad G   '),
(8, '   Sofia   ', '   Díaz      ', '  555-654-3210 ', '  sofia.diaz@example.com     ', '  Ciudad H   '),
(9, '   Andrés  ', '   Pérez     ', '  555-987-1234 ', '  andres.perez@example.com   ', '  Ciudad I   '),
(10, '   Julia   ', '   Smith     ', '  555-234-5678 ', '  julia.smith@example.com    ', '  Ciudad J   '),
(11, '   Diego   ', '   Johnson   ', '  555-876-5432 ', '  diego.johnson@example.com  ', '  Ciudad K   '),
(12, '   Carla   ', '   Williams  ', '  555-345-6789 ', '  carla.williams@example.com ', '  Ciudad L   '),
(13, '   Miguel  ', '   Brown     ', '  555-654-3210 ', '  miguel.brown@example.com   ', '  Ciudad M   '),
(14, '   Marta   ', '   Davis     ', '  555-987-1234 ', '  marta.davis@example.com    ', '  Ciudad N   '),
(15, '   Pablo   ', '   Martinez  ', '  555-234-5678 ', '  pablo.martinez@example.com ', '  Ciudad O   '),
(16, '   Elena   ', '   Johnson   ', '  555-876-5432 ', '  elena.johnson@example.com  ', '  Ciudad P   '),
(17, '   Sergio  ', '   Miller    ', '  555-345-6789 ', '  sergio.miller@example.com  ', '  Ciudad Q   '),
(18, '   Andrea  ', '   Taylor    ', '  555-654-3210 ', '  andrea.taylor@example.com  ', '  Ciudad R   '),
(19, '   Raúl    ', '   Anderson  ', '  555-987-1234 ', '  raul.anderson@example.com  ', '  Ciudad S   '),
(20, '   Sofía   ', '   Jackson   ', '  555-234-5678 ', '  sofia.jackson@example.com  ', '  Ciudad T   '),
(21, '   Marcelo ', '   White     ', '  555-876-5432 ', '  marcelo.white@example.com  ', '  Ciudad U   '),
(28, 'wewq', 'eqweq', 'eqweqw', 'eqweqw', 'qweeqw');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `apellido` varchar(30) NOT NULL,
  `usuario` varchar(30) NOT NULL,
  `password` varchar(30) NOT NULL,
  `token` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `apellido`, `usuario`, `password`, `token`) VALUES
(1, 'Gustavo', 'Lafuente', 'guillermo', 'guE1pk/6waGK2', '75c6dc634ae06635f882a8a3d4efa05bda804452c2429dffbd73f8dab060bf1b');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`Id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
