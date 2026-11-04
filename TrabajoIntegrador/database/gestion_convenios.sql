-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-11-2026 a las 15:13:06
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
-- Base de datos: `gestion_convenios`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auditoria_observaciones`
--

CREATE TABLE `auditoria_observaciones` (
  `id` int(11) NOT NULL,
  `id_convenio` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `observacion` text DEFAULT NULL,
  `estado_previo` varchar(50) DEFAULT NULL,
  `estado_nuevo` varchar(50) DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `convenios`
--

CREATE TABLE `convenios` (
  `id` int(11) NOT NULL,
  `codigo_unico` varchar(50) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `tipo` enum('marco_colaboracion','especifico_colaboracion','marco_pasantia','especifico_pasantia','adenda') NOT NULL,
  `estado` enum('borrador','revision','aprobado','firmado','rescindido','archivado') DEFAULT 'borrador',
  `objeto` text NOT NULL,
  `marco_legal` text DEFAULT NULL,
  `confidencialidad` tinyint(1) DEFAULT 0,
  `fecha_firma` date DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_vencimiento` date DEFAULT NULL,
  `dias_preaviso` int(11) DEFAULT NULL,
  `id_unidad_responsable` int(11) NOT NULL,
  `id_antecedente` int(11) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `convenio_partes`
--

CREATE TABLE `convenio_partes` (
  `id_convenio` int(11) NOT NULL,
  `id_parte` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `documentos`
--

CREATE TABLE `documentos` (
  `id` int(11) NOT NULL,
  `id_convenio` int(11) NOT NULL,
  `tipo_documento` enum('principal','anexo','dictamen','resolucion','otro') NOT NULL,
  `ruta_archivo` varchar(255) NOT NULL,
  `hash_sha256` varchar(64) NOT NULL,
  `fecha_subida` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `partes_firmantes`
--

CREATE TABLE `partes_firmantes` (
  `id` int(11) NOT NULL,
  `nombre_institucion` varchar(255) NOT NULL,
  `representante_nombre` varchar(150) DEFAULT NULL,
  `representante_cargo` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personas_pasantias`
--

CREATE TABLE `personas_pasantias` (
  `id` int(11) NOT NULL,
  `id_convenio` int(11) NOT NULL,
  `nombre_completo` varchar(150) NOT NULL,
  `rol` varchar(100) DEFAULT NULL,
  `carrera` varchar(150) DEFAULT NULL,
  `carga_horaria` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `unidades_academicas`
--

CREATE TABLE `unidades_academicas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `unidades_academicas`
--

INSERT INTO `unidades_academicas` (`id`, `nombre`, `descripcion`) VALUES
(1, 'Facultad de Ingeniería', NULL),
(2, 'Rectorado', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `legajo` integer(4) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `nombre_completo` varchar(150) NOT NULL,
  `rol` enum('administracion','gestion','revision','consulta') NOT NULL,
  `id_unidad` int(11) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `legajo`, `contrasena`, `nombre_completo`, `rol`, `id_unidad`, `activo`) VALUES
(1, 'ADMIN-001', '123456', 'Germán (Admin Global)', 'administracion', NULL, 1),
(2, 'GEST-001', '123456', 'Tony (Gestor Ingeniería)', 'gestion', 1, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `auditoria_observaciones`
--
ALTER TABLE `auditoria_observaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_convenio` (`id_convenio`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `convenios`
--
ALTER TABLE `convenios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo_unico` (`codigo_unico`),
  ADD KEY `id_unidad_responsable` (`id_unidad_responsable`),
  ADD KEY `id_antecedente` (`id_antecedente`);

--
-- Indices de la tabla `convenio_partes`
--
ALTER TABLE `convenio_partes`
  ADD PRIMARY KEY (`id_convenio`,`id_parte`),
  ADD KEY `id_parte` (`id_parte`);

--
-- Indices de la tabla `documentos`
--
ALTER TABLE `documentos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_convenio` (`id_convenio`);

--
-- Indices de la tabla `partes_firmantes`
--
ALTER TABLE `partes_firmantes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `personas_pasantias`
--
ALTER TABLE `personas_pasantias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_convenio` (`id_convenio`);

--
-- Indices de la tabla `unidades_academicas`
--
ALTER TABLE `unidades_academicas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `legajo` (`legajo`),
  ADD KEY `id_unidad` (`id_unidad`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `auditoria_observaciones`
--
ALTER TABLE `auditoria_observaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `convenios`
--
ALTER TABLE `convenios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `documentos`
--
ALTER TABLE `documentos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `partes_firmantes`
--
ALTER TABLE `partes_firmantes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `personas_pasantias`
--
ALTER TABLE `personas_pasantias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `unidades_academicas`
--
ALTER TABLE `unidades_academicas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `auditoria_observaciones`
--
ALTER TABLE `auditoria_observaciones`
  ADD CONSTRAINT `auditoria_observaciones_ibfk_1` FOREIGN KEY (`id_convenio`) REFERENCES `convenios` (`id`),
  ADD CONSTRAINT `auditoria_observaciones_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `convenios`
--
ALTER TABLE `convenios`
  ADD CONSTRAINT `convenios_ibfk_1` FOREIGN KEY (`id_unidad_responsable`) REFERENCES `unidades_academicas` (`id`),
  ADD CONSTRAINT `convenios_ibfk_2` FOREIGN KEY (`id_antecedente`) REFERENCES `convenios` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `convenio_partes`
--
ALTER TABLE `convenio_partes`
  ADD CONSTRAINT `convenio_partes_ibfk_1` FOREIGN KEY (`id_convenio`) REFERENCES `convenios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `convenio_partes_ibfk_2` FOREIGN KEY (`id_parte`) REFERENCES `partes_firmantes` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `documentos`
--
ALTER TABLE `documentos`
  ADD CONSTRAINT `documentos_ibfk_1` FOREIGN KEY (`id_convenio`) REFERENCES `convenios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `personas_pasantias`
--
ALTER TABLE `personas_pasantias`
  ADD CONSTRAINT `personas_pasantias_ibfk_1` FOREIGN KEY (`id_convenio`) REFERENCES `convenios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_unidad`) REFERENCES `unidades_academicas` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
