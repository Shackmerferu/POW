-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-11-2024 a las 19:08:57
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
-- Base de datos: `tortuga`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `apellido` varchar(30) NOT NULL,
  `telefono` varchar(30) NOT NULL,
  `email` varchar(100) NOT NULL,
  `latlong` text NOT NULL,
  `deuda` double NOT NULL,
  `estado` varchar(3) NOT NULL,
  `var_temp` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id`, `nombre`, `apellido`, `telefono`, `email`, `latlong`, `deuda`, `estado`, `var_temp`) VALUES
(2, 'Juan', 'Pérez', '555-123-4567', 'juan.perez@example.com', '-35.65837926902961, -63.73111900439994', 0, 'P', NULL),
(3, 'María', 'Garcia', '555-987-6543', 'maria.garcia@example.com', '-35.64526743913113, -63.75532325694152', 0, 'P', NULL),
(4, 'Pedro', 'López', '555-234-5678', 'pedro.lopez@example.com', '-35.65014975495358, -63.76364883317037', 0, 'P', NULL),
(5, 'Ana', 'Rodríguez', '555-876-5432', 'ana.rodriguez@example.com', '-35.65977401788321, -63.76313384907374', 0, 'P', NULL),
(6, 'Luis', 'Martínez', '555-345-6789', 'luis.martinez@example.com', '-35.674208237590776, -63.73995956472542', 0, 'P', NULL),
(7, 'Laura', 'Hernández', '555-765-4321', 'laura.hernandez@example.com', '-35.66514357355034, -63.781673278155495', 0, 'P', NULL),
(8, 'Carlos', 'González', '555-456-7890', 'carlos.gonzalez@example.com', '-35.67511464740259, -63.77369102465774', 0, 'P', NULL),
(9, 'Sofia', 'Díaz', '555-654-3210', 'sofia.diaz@example.com', '-35.65600814009342, -63.77429183943714', 0, 'P', NULL),
(10, 'Andrés', 'Pérez', '555-987-1234', 'andres.perez@example.com', '-35.652521057856625, -63.761588898386954', 0, 'P', NULL),
(11, 'Julia', 'Smith', '555-234-5678', 'julia.smith@example.com', '-35.64108235921984, -63.793432082528135', 0, 'P', NULL),
(12, 'Diego', 'Johnson', '555-876-5432', 'diego.johnson@example.com', '-35.646243925864184, -63.77600845392551', 0, 'P', NULL),
(13, 'Carla', 'Williams', '555-345-6789', 'carla.williams@example.com', '-35.68940667195667, -63.744251099657', 0, 'P', NULL),
(14, 'Miguel', 'Brown', '555-654-3210', 'miguel.brown@example.com', '-35.671628400123005, -63.744766083753625', 0, 'P', NULL),
(15, 'Marta', 'Davis', '555-987-1234', 'marta.davis@example.com', '-35.644918690842744, -63.73395141769588', 0, 'P', NULL),
(16, 'Pablo', 'Martinez', '555-234-5678', 'pablo.martinez@example.com', '-35.64917331563265, -63.75291999858839', 0, 'P', NULL),
(17, 'Elena', 'Johnson', '555-876-5432', 'elena.johnson@example.com', '-35.661866095709954, -63.77386268619444', 0, 'P', NULL),
(18, 'Sergio', 'Miller', '555-345-6789', 'sergio.miller@example.com', '-35.63731560025345, -63.75566658239961', 0, 'P', NULL),
(19, 'Andrea', 'Taylor', '555-654-3210', 'andrea.taylor@example.com', '-35.64784812884152, -63.76776870810561', 0, 'P', NULL),
(20, 'Raúl', 'Anderson', '555-987-1234', 'raul.anderson@example.com', '-35.65579891957204, -63.756009902974206', 0, 'P', NULL),
(21, 'Sofía', 'Jackson', '555-234-5678', 'sofia.jackson@example.com', '-35.67441741010959, -63.77017196528351', 0, 'P', NULL),
(22, 'Marcelo', 'White', '555-876-5432', 'marcelo.white@example.com', '-35.65949507017642, -63.73240646486403', 0, 'P', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente_recolector`
--

CREATE TABLE `cliente_recolector` (
  `id` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `id_recolector` int(11) NOT NULL,
  `estado` varchar(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recolector`
--

CREATE TABLE `recolector` (
  `id_recolector` int(11) NOT NULL,
  `apellido` text NOT NULL,
  `nombre` text NOT NULL,
  `celular` text NOT NULL,
  `latitud` text NOT NULL,
  `longitud` text NOT NULL,
  `disponible` varchar(2) NOT NULL,
  `var_temp` int(11) DEFAULT NULL,
  `km_recorrido` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `cliente_recolector`
--
ALTER TABLE `cliente_recolector`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `recolector`
--
ALTER TABLE `recolector`
  ADD PRIMARY KEY (`id_recolector`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `cliente_recolector`
--
ALTER TABLE `cliente_recolector`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `recolector`
--
ALTER TABLE `recolector`
  MODIFY `id_recolector` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
