-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 27-11-2026 a las 19:22:28
-- Versión del servidor: 10.11.16-MariaDB
-- Versión de PHP: 8.3.36

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
CREATE DATABASE IF NOT EXISTS `gestion_convenios` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `gestion_convenios`;

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

--
-- RELACIONES PARA LA TABLA `auditoria_observaciones`:
--   `id_convenio`
--       `convenios` -> `id`
--   `id_usuario`
--       `usuarios` -> `id`
--

--
-- Volcado de datos para la tabla `auditoria_observaciones`
--

INSERT INTO `auditoria_observaciones` (`id`, `id_convenio`, `id_usuario`, `observacion`, `estado_previo`, `estado_nuevo`, `fecha_registro`) VALUES
(1, 4, 5, 'Devuelto para corrección: falta precisar el alcance territorial del trabajo en energías renovables y las obligaciones de cada parte.', 'revision', 'borrador', '2025-05-02 12:20:00'),
(2, 4, 1, 'Se incorporó el alcance territorial y el detalle de obligaciones; se reenvía a revisión.', 'borrador', 'revision', '2025-05-06 14:45:00'),
(3, 9, 2, 'Aprobación administrativa del trámite en revisión.', 'revision', 'aprobado', '2026-04-24 13:10:00'),
(4, 9, 5, 'Primera firma registrada en la app móvil (equipo de revisión).', 'aprobado', 'firmado', '2026-04-25 11:55:00'),
(5, 9, 1, 'Segunda firma registrada en la app móvil (gestión). Instrumento firmado.', 'firmado', 'firmado', '2026-04-25 12:30:00'),
(6, 10, 5, 'Aprobado en revisión. Queda pendiente el registro de firmas.', 'revision', 'aprobado', '2026-09-04 15:00:00'),
(7, 11, 5, 'Devuelto para corrección: se solicita aclarar la vigencia de la adenda y su relación con el vencimiento del marco.', 'revision', 'borrador', '2026-10-08 18:10:00'),
(8, 11, 1, 'Se aclaró la vigencia de la adenda en el objeto; se reenvía a revisión.', 'borrador', 'revision', '2026-10-12 12:35:00'),
(9, 6, 2, 'Rescisión registrada por incumplimiento reiterado del cronograma de entregas.', 'firmado', 'rescindido', '2025-06-30 13:00:00'),
(10, 14, 2, 'Archivado por vencimiento sin renovación, con copia digital del expediente.', 'firmado', 'archivado', '2025-01-20 12:00:00'),
(11, 12, 1, 'Alta inicial del borrador; pendiente completar partes firmantes y fechas.', NULL, 'borrador', '2026-11-10 19:20:00'),
(12, 14, 4, 'Vista previa del documento (ID #27).', NULL, NULL, '2026-11-18 03:30:51'),
(13, 14, 4, 'Vista previa del documento (ID #27).', NULL, NULL, '2026-11-18 03:30:51'),
(14, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 03:31:20'),
(15, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 03:31:20'),
(16, 3, 4, 'Vista previa del documento (ID #16).', NULL, NULL, '2026-11-18 03:34:37'),
(17, 3, 4, 'Vista previa del documento (ID #16).', NULL, NULL, '2026-11-18 03:34:37'),
(18, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 03:37:10'),
(19, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 03:37:10'),
(20, 4, 4, 'Vista previa del documento (ID #17).', NULL, NULL, '2026-11-18 03:37:28'),
(21, 4, 4, 'Vista previa del documento (ID #17).', NULL, NULL, '2026-11-18 03:37:28'),
(22, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 03:37:41'),
(23, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 03:37:41'),
(24, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 03:37:49'),
(25, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 03:37:49'),
(26, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 03:41:09'),
(27, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 03:41:09'),
(28, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 03:41:11'),
(29, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 03:41:11'),
(30, 5, 4, 'Vista previa del documento (ID #18).', NULL, NULL, '2026-11-18 03:41:27'),
(31, 5, 4, 'Vista previa del documento (ID #18).', NULL, NULL, '2026-11-18 03:41:27'),
(32, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 03:41:42'),
(33, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 03:41:42'),
(34, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 04:50:49'),
(35, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 04:50:49'),
(36, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 04:50:53'),
(37, 1, 4, 'Descarga del documento \"principal\" (ID #14).', NULL, NULL, '2026-11-18 04:51:03'),
(38, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 04:58:56'),
(39, 9, 4, 'Vista previa del documento (ID #22).', NULL, NULL, '2026-11-18 05:12:24'),
(40, 9, 4, 'Vista previa del documento (ID #22).', NULL, NULL, '2026-11-18 05:12:24'),
(41, 9, 4, 'Vista previa del documento (ID #22).', NULL, NULL, '2026-11-18 05:31:54'),
(42, 15, 4, 'Alta del instrumento mediante el formulario web.', NULL, 'revision', '2026-11-18 06:04:37'),
(43, 3, 4, 'Vista previa del documento (ID #16).', NULL, NULL, '2026-11-18 06:09:25'),
(44, 3, 4, 'Vista previa del documento (ID #16).', NULL, NULL, '2026-11-18 06:09:25'),
(45, 3, 4, 'Vista previa del documento (ID #16).', NULL, NULL, '2026-11-18 06:10:17'),
(46, 9, 4, 'Vista previa del documento (ID #22).', NULL, NULL, '2026-11-18 06:10:17'),
(47, 9, 4, 'Vista previa del documento (ID #22).', NULL, NULL, '2026-11-18 06:10:17'),
(48, 3, 4, 'Vista previa del documento (ID #16).', NULL, NULL, '2026-11-18 06:11:34'),
(49, 9, 4, 'Vista previa del documento (ID #22).', NULL, NULL, '2026-11-18 06:11:34'),
(50, 9, 4, 'Vista previa del documento (ID #22).', NULL, NULL, '2026-11-18 06:24:03'),
(51, 9, 4, 'Vista previa del documento (ID #22).', NULL, NULL, '2026-11-18 06:24:03'),
(52, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 06:27:36'),
(53, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 06:27:36'),
(54, 16, 4, 'Alta del instrumento mediante el formulario web.', NULL, 'revision', '2026-11-18 06:29:00'),
(55, 14, 4, 'Vista previa del documento (ID #27).', NULL, NULL, '2026-11-18 06:29:15'),
(56, 14, 4, 'Vista previa del documento (ID #27).', NULL, NULL, '2026-11-18 06:29:15'),
(57, 14, 4, 'Vista previa del documento (ID #27).', NULL, NULL, '2026-11-18 06:29:43'),
(58, 14, 4, 'Vista previa del documento (ID #27).', NULL, NULL, '2026-11-18 06:29:43'),
(59, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 13:36:52'),
(60, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 13:36:52'),
(61, 16, 4, 'Vinculación de antecedente: instrumento #3.', NULL, NULL, '2026-11-18 13:53:24'),
(62, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 14:08:28'),
(63, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 14:08:28'),
(64, 1, 6, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 14:09:20'),
(65, 1, 6, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 14:09:20'),
(66, 1, 6, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 14:09:21'),
(67, 1, 6, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 14:18:38'),
(68, 1, 6, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 14:18:38'),
(69, 1, 6, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 14:18:44'),
(70, 1, 6, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 14:18:44'),
(71, 1, 6, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 14:19:31'),
(72, 1, 6, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 14:19:31'),
(73, 1, 6, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 14:23:41'),
(74, 1, 6, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 14:23:41'),
(75, 8, 6, 'Vista previa del documento (ID #21).', NULL, NULL, '2026-11-18 14:24:42'),
(76, 8, 6, 'Vista previa del documento (ID #21).', NULL, NULL, '2026-11-18 14:24:42'),
(77, 1, 6, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 14:25:32'),
(78, 1, 6, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 14:25:32'),
(79, 1, 6, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 14:38:50'),
(80, 1, 6, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 14:38:50'),
(81, 1, 6, 'Descarga del documento \"principal\" (ID #14).', NULL, NULL, '2026-11-18 14:38:53'),
(82, 1, 6, 'Descarga del documento \"principal\" (ID #14).', NULL, NULL, '2026-11-18 14:38:55'),
(83, 1, 6, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 14:38:58'),
(84, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 15:44:09'),
(85, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 15:44:09'),
(86, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 16:42:29'),
(87, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 16:42:29'),
(88, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 17:00:32'),
(89, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 17:00:32'),
(90, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 17:20:23'),
(91, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 17:20:23'),
(92, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 17:28:01'),
(93, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 17:28:01'),
(94, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 17:28:03'),
(95, 2, 4, 'Vista previa del documento (ID #15).', NULL, NULL, '2026-11-18 17:42:34'),
(96, 2, 4, 'Vista previa del documento (ID #15).', NULL, NULL, '2026-11-18 17:42:34'),
(97, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 17:43:43'),
(98, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 17:43:43'),
(99, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 17:58:56'),
(100, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 18:00:30'),
(101, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 18:00:30'),
(102, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 18:02:58'),
(103, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 18:02:58'),
(104, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 18:06:23'),
(105, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 18:06:23'),
(106, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 18:16:40'),
(107, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 18:16:40'),
(108, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 18:16:52'),
(109, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 18:16:52'),
(110, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 18:20:46'),
(111, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 18:23:25'),
(112, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 18:23:25'),
(113, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 18:23:32'),
(114, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 18:23:32'),
(115, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 18:31:35'),
(116, 1, 4, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 18:31:35'),
(117, 8, 6, 'Vista previa del documento (ID #21).', NULL, NULL, '2026-11-18 19:18:37'),
(118, 8, 6, 'Vista previa del documento (ID #21).', NULL, NULL, '2026-11-18 19:18:37'),
(119, 1, 6, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 19:24:48'),
(120, 1, 6, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 19:24:48'),
(121, 2, 6, 'Vista previa del documento (ID #15).', NULL, NULL, '2026-11-18 19:25:39'),
(122, 1, 6, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 19:27:38'),
(123, 1, 6, 'Vista previa del documento (ID #14).', NULL, NULL, '2026-11-18 19:27:38'),
(124, 8, 6, 'Vista previa del documento (ID #21).', NULL, NULL, '2026-11-18 19:27:44'),
(125, 8, 6, 'Vista previa del documento (ID #21).', NULL, NULL, '2026-11-18 19:27:44'),
(126, 2, 6, 'Vista previa del documento (ID #15).', NULL, NULL, '2026-11-18 19:27:47'),
(127, 2, 6, 'Vista previa del documento (ID #15).', NULL, NULL, '2026-11-18 19:27:47'),
(128, 3, 4, 'Firmado desde App Móvil (Huella + Firma manuscrita) el 2026-11-26 10:56:05 | Lat: -35.667819, Lon: -63.769455', 'aprobado', 'firmado', '2026-11-26 01:56:05'),
(129, 3, 4, 'Descarga del documento \"principal\" (ID #16).', NULL, NULL, '2026-11-26 01:56:30'),
(130, 3, 4, 'Descarga del documento \"principal\" (ID #16).', NULL, NULL, '2026-11-26 01:56:34'),
(131, 10, 4, 'Firmado desde App Móvil (Huella + Firma manuscrita) el 2026-11-26 11:09:56 | Lat: -35.667819, Lon: -63.769455', 'aprobado', 'firmado', '2026-11-26 02:09:56'),
(132, 10, 4, 'Descarga del documento \"principal\" (ID #23).', NULL, NULL, '2026-11-26 10:48:20');

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
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `obligaciones` text DEFAULT NULL,
  `condiciones_rescision` text DEFAULT NULL,
  `condiciones_renovacion` text DEFAULT NULL,
  `notas` text DEFAULT NULL,
  `resolucion` varchar(255) DEFAULT NULL,
  `expediente` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `convenios`:
--   `id_unidad_responsable`
--       `unidades_academicas` -> `id`
--   `id_antecedente`
--       `convenios` -> `id`
--

--
-- Volcado de datos para la tabla `convenios`
--

INSERT INTO `convenios` (`id`, `codigo_unico`, `titulo`, `tipo`, `estado`, `objeto`, `marco_legal`, `confidencialidad`, `fecha_firma`, `fecha_inicio`, `fecha_vencimiento`, `dias_preaviso`, `id_unidad_responsable`, `id_antecedente`, `fecha_creacion`, `fecha_actualizacion`, `obligaciones`, `condiciones_rescision`, `condiciones_renovacion`, `notas`, `resolucion`, `expediente`) VALUES
(1, 'UNLPAM-FI-2024-001', 'Marco de colaboración UNLPAM - Municipalidad de Santa Rosa', 'marco_colaboracion', 'firmado', 'Establecer el marco general de cooperación entre la Facultad de Ingeniería y la Municipalidad de Santa Rosa para proyectos conjuntos de extensión, investigación y desarrollo tecnológico.', 'Ordenanza Municipal N° 4210/24', 0, '2024-05-12', '2024-06-01', '2027-05-31', 60, 1, NULL, '2026-11-17 18:37:10', '2026-11-18 19:27:25', 'Las partes designarán referentes para coordinar las actividades; acordarán planes de trabajo para cada proyecto; facilitarán los recursos y la información necesarios; y documentarán los avances y resultados. Cada actividad quedará sujeta a aprobación y disponibilidad de ambas partes.', 'Como pauta de referencia, cualquiera de las partes podría solicitar la rescisión mediante notificación escrita y fundada, conforme al procedimiento y preaviso establecidos en el instrumento firmado. Deberán acordarse el cierre de las actividades en curso y la devolución o resguardo de la información.', 'La renovación deberá acordarse expresamente antes del vencimiento, mediante instrumento escrito aprobado por las partes. Revisar vigencia, responsables, alcance y planes de trabajo; no se presume renovación automática.', 'Coordinar las actividades mediante planes de trabajo acordados por ambas partes. Verificar la disponibilidad de recursos y responsables antes de iniciar cada proyecto.', 'Ordenanza Municipal N° 4210/24', 'EXP-UNLPAM-FI-2024-001'),
(2, 'UNLPAM-FI-2024-002', 'Convenio específico de pasantías - TecnoLáctea S.A.', 'especifico_pasantia', 'firmado', 'Regular pasantías de estudiantes de Ingeniería en Informática y Electromecánica en el área de automatización de procesos de la empresa TecnoLáctea S.A.', 'Resolución CS UNLPAM N° 118/24', 0, '2024-08-20', '2024-09-01', '2026-08-31', 30, 1, NULL, '2026-11-17 18:37:10', '2026-11-18 19:27:25', 'La universidad y la empresa designarán tutores; acordarán para cada pasantía el plan formativo, las tareas, la carga horaria y el seguimiento; brindarán orientación y condiciones adecuadas para su realización; y dejarán constancia de la evaluación final. La asignación de estudiantes se formalizará mediante los instrumentos correspondientes.', 'La finalización anticipada de una pasantía deberá comunicarse y documentarse por las partes, con intervención de los tutores y resguardo de la continuidad académica del estudiante. Aplicar los motivos, plazos y procedimiento previstos en el convenio y en la normativa vigente.', 'La continuidad de las pasantías después del vencimiento requiere revisar la vigencia del marco y formalizar las asignaciones o renovaciones individuales que correspondan antes de iniciar el nuevo período.', 'Cada pasantía debe contar con plan formativo, tutor asignado, carga horaria y evaluación documentados. Revisar la vigencia del instrumento antes de nuevas asignaciones.', 'Resolución CS UNLPam N° 118/24', 'EXP-UNLPAM-FI-2024-002'),
(3, 'UNLPAM-R-2024-003', 'Acuerdo de cooperación académica - Clínica Los Álamos', 'especifico_colaboracion', 'firmado', 'Cooperación para prácticas supervisadas de estudiantes de Ingeniería en Sistemas de Salud y desarrollo de historias clínicas digitales.', 'Resolución Ministerial N° 512/24', 0, '2026-11-26', '2025-03-01', '2026-02-28', 45, 2, NULL, '2026-11-17 18:37:10', '2026-11-26 01:56:05', 'La Facultad y la Clínica coordinarán las prácticas supervisadas y designarán responsables académicos e institucionales. Las actividades con información clínica deberán respetar las autorizaciones, normas de confidencialidad y medidas de protección aplicables. Los desarrollos digitales se realizarán según un plan de trabajo aprobado por ambas partes.', 'La suspensión o rescisión deberá notificarse y documentarse por las partes conforme al instrumento y la normativa aplicable. Ante una finalización, se deberán cerrar las prácticas y proteger o devolver la información clínica y los materiales recibidos.', 'El convenio figura aprobado y su fecha de vencimiento ya transcurrió. Verificar su estado y la existencia de una renovación formal antes de programar nuevas prácticas o actividades.', 'La fecha de vencimiento registrada es 28/02/2026. Confirmar si se formalizó una renovación y asegurar el resguardo de la información clínica utilizada en las prácticas.', 'Resolución Ministerial N° 512/24', 'EXP-UNLPAM-R-2024-003'),
(4, 'UNLPAM-FI-2025-001', 'Adenda al marco de colaboración con la Municipalidad de Santa Rosa', 'adenda', 'revision', 'Ampliar el marco de colaboración N° 1 para incluir el área de energías renovables y eficiencia energética en edificios municipales.', NULL, 0, '2025-04-18', '2025-05-01', '2027-05-31', 60, 1, 1, '2026-11-17 18:37:10', '2026-11-18 19:27:25', 'Las partes incorporarán al plan de trabajo actividades de energías renovables y eficiencia energética en edificios municipales; definirán alcance, responsables, cronograma y recursos antes de cada actividad; y registrarán los resultados. La adenda complementa el convenio marco antecedente y no reemplaza las obligaciones que continúan vigentes.', 'La rescisión de esta adenda deberá instrumentarse por escrito conforme a las condiciones del convenio marco antecedente y sin afectar automáticamente las cláusulas del marco que no hayan sido modificadas. Las actividades en curso deberán cerrarse de común acuerdo.', 'La adenda extiende su alcance dentro del marco antecedente hasta la fecha indicada en la ficha. Cualquier prórroga posterior deberá formalizarse por escrito y contar con la aprobación de ambas partes antes del vencimiento.', 'La auditoría registra observaciones sobre el alcance territorial y la distribución de obligaciones. Confirmar que esos puntos estén aclarados en la versión vigente de la adenda.', 'Pendiente de asignación', 'EXP-UNLPAM-FI-2025-001'),
(5, 'UNLPAM-R-2025-002', 'Marco de pasantías con el Ministerio de Infraestructura', 'marco_pasantia', 'firmado', 'Crear el marco reglamentario para pasantías de estudiantes en los proyectos de infraestructura pública que ejecuta el Ministerio en la provincia.', 'Resolución Ministerial N° 87/25', 0, '2025-02-14', '2025-03-01', '2028-02-29', 90, 2, NULL, '2026-11-17 18:37:10', '2026-11-18 19:27:25', 'La Universidad y el Ministerio coordinarán las prácticas, designarán tutores y aprobarán para cada estudiante un plan formativo con tareas, horarios, seguimiento y evaluación. El Ministerio facilitará las condiciones de trabajo y la información autorizada; la Universidad realizará el seguimiento académico. Cada incorporación deberá documentarse por separado.', 'La finalización anticipada del marco o de una pasantía deberá comunicarse por escrito y documentarse conforme al convenio y la normativa aplicable. Las partes deberán acordar el cierre ordenado de las actividades y la situación académica de los estudiantes involucrados.', 'La renovación o prórroga deberá acordarse por escrito antes del vencimiento, revisando la normativa de pasantías, la vigencia del marco y las condiciones aplicables a cada estudiante.', 'Verificar que las actividades de pasantía se correspondan con proyectos autorizados y que cada estudiante tenga tutor y plan de trabajo.', 'Resolución Ministerial N° 87/25', 'EXP-UNLPAM-R-2025-002'),
(6, 'UNLPAM-FI-2023-004', 'Convenio específico de colaboración - BioCom del Centro', 'especifico_colaboracion', 'rescindido', 'Desarrollo conjunto de sensores IoT para monitoreo de cultivos intensivos en la región pampeana.', 'Convenio Marco UNLPAM-INTA N° 23/22', 1, '2023-09-05', '2023-10-01', '2025-09-30', 30, 1, NULL, '2026-11-17 18:37:10', '2026-11-18 19:27:25', 'Las partes debían coordinar el diseño, desarrollo y evaluación de sensores IoT para monitoreo de cultivos, acordar especificaciones y cronograma, facilitar los recursos comprometidos y documentar entregas y resultados. El convenio figura rescindido; estas obligaciones se consignan como referencia histórica y no implican reactivación.', 'La rescisión fue registrada por incumplimiento reiterado del cronograma de entregas, según la auditoría del sistema. Conservar la constancia y verificar en el instrumento firmado el procedimiento aplicado y las obligaciones pendientes al momento del cierre.', 'No corresponde renovación mientras el convenio permanezca rescindido. Una nueva colaboración deberá tramitarse mediante un nuevo instrumento y aprobación de las partes.', 'El convenio figura rescindido por incumplimientos reiterados del cronograma. Mantener registro de las entregas pendientes y de las acciones de cierre realizadas.', 'Convenio Marco UNLPAM-INTA N° 23/22', 'EXP-UNLPAM-FI-2023-004'),
(7, 'UNLPAM-FI-2026-001', 'Pasantía específica - Comisión Nacional de Energía Atómica', 'especifico_pasantia', 'borrador', 'Pasantías de estudiantes de Ingeniería Nuclear en el Centro Atómico Bariloche durante el ciclo lectivo 2026.', NULL, 0, NULL, NULL, NULL, NULL, 1, NULL, '2026-11-17 18:37:10', '2026-11-18 19:27:25', 'Borrador: antes de iniciar una pasantía, las partes deberán definir y documentar el plan formativo, las tareas, tutores, carga horaria, período, cobertura y condiciones de seguridad. No asignar estudiantes ni iniciar actividades hasta completar esos datos y aprobar el instrumento.', 'Borrador: definir en el instrumento firmado las causales, el preaviso y el procedimiento de finalización anticipada. La interrupción de una pasantía deberá comunicarse a los tutores y documentarse.', 'Borrador: definir plazo y mecanismo de renovación en el instrumento, sujeto a evaluación de la pasantía, acuerdo de las partes y formalización antes del vencimiento.', 'Antes de avanzar, completar las partes firmantes, el período, los tutores, la carga horaria y las condiciones de cada pasantía.', 'Pendiente de asignación', 'EXP-UNLPAM-FI-2026-001'),
(8, 'UNLPAM-FI-2026-002', 'Marco de colaboración UNLPAM - InnovaAgro S.R.L.', 'marco_colaboracion', 'firmado', 'Establecer el marco general de cooperación entre la Facultad de Ingeniería e InnovaAgro S.R.L. para proyectos conjuntos de agricultura de precisión, pasantías e investigación aplicada en la región pampeana.', 'Resolución CS UNLPAM N° 203/26', 0, '2026-03-10', '2026-04-01', '2028-03-31', 60, 1, NULL, '2026-11-17 18:37:10', '2026-11-18 19:27:25', 'Las partes designarán referentes y acordarán planes de trabajo para proyectos de agricultura de precisión, investigación aplicada y pasantías; definirán recursos, cronograma y entregables; facilitarán la información necesaria con las autorizaciones correspondientes; y evaluarán los resultados de cada actividad.', 'Como pauta de referencia, cualquiera de las partes podría solicitar la rescisión mediante notificación escrita y fundada, según el procedimiento del convenio firmado. Prever el cierre de proyectos en curso y el tratamiento de la información y los resultados compartidos.', 'La renovación deberá formalizarse por escrito antes del 31/03/2028, previa evaluación de las actividades y acuerdo sobre alcance, responsables, recursos y vigencia. No se presume renovación automática.', 'Revisar periódicamente el avance de los proyectos y documentar los planes de trabajo, responsables y resultados acordados.', 'Resolución CS UNLPam N° 203/26', 'EXP-UNLPAM-FI-2026-002'),
(9, 'UNLPAM-FI-2026-003', 'Convenio específico de colaboración - Proyecto de investigación con InnovaAgro (alta de integrantes)', 'especifico_colaboracion', 'firmado', 'Formalizar la incorporación de becarias, becarios e investigadores al proyecto de investigación \"Monitoreo inteligente de suelos y cultivos mediante sensores de bajo costo\", en el marco del convenio de colaboración con InnovaAgro S.R.L. Cada alta se documenta en el anexo de integrantes.', 'Resolución CD FI N° 172/26', 0, '2026-04-22', '2026-05-01', '2026-12-15', 60, 1, 8, '2026-11-17 18:37:10', '2026-11-18 19:27:25', 'Las partes coordinarán el proyecto de monitoreo inteligente de suelos y cultivos; formalizarán cada alta de integrantes mediante el anexo correspondiente; definirán funciones, período y responsables; cumplirán el plan aprobado y documentarán avances y resultados. El acceso a datos y muestras deberá limitarse a los fines autorizados.', 'La finalización anticipada deberá notificarse y documentarse por las partes conforme al convenio marco, al instrumento específico y a sus anexos. Deberán determinarse las tareas pendientes, el cierre de la participación de cada integrante y el resguardo de los datos del proyecto.', 'El instrumento específico vence el 15/12/2026. Cualquier continuidad del proyecto o de las participaciones deberá aprobarse y documentarse antes de esa fecha, verificando también la vigencia del convenio marco antecedente.', 'Las altas de integrantes deben registrarse mediante el anexo correspondiente. Controlar que las tareas y los períodos coincidan con el proyecto aprobado.', 'Resolución CD FI N° 172/26', 'EXP-UNLPAM-FI-2026-003'),
(10, 'UNLPAM-FI-2026-004', 'Convenio específico de pasantías - TecnoLáctea S.A. (renovación)', 'especifico_pasantia', 'firmado', 'Renovar por un año el convenio específico de pasantías con TecnoLáctea S.A., manteniendo las condiciones de la versión anterior e incorporando el área de control de calidad de datos. Instrumento nuevo vinculado a su antecedente.', 'Resolución CS UNLPAM N° 118/24', 0, '2026-11-26', '2026-09-01', '2027-08-31', 30, 1, 2, '2026-11-17 18:37:10', '2026-11-26 02:09:56', 'La empresa y la Universidad designarán tutores y acordarán para cada pasantía el plan formativo, las tareas, la carga horaria y el seguimiento. Se incorporarán actividades vinculadas con control de calidad de datos. Cada asignación y evaluación deberá documentarse según el convenio y sus anexos.', 'La finalización anticipada deberá comunicarse y registrarse por las partes, con intervención de los tutores y previsión de la continuidad académica de los estudiantes. Aplicar el procedimiento y los plazos del convenio firmado y de la normativa de pasantías.', 'Esta ficha corresponde a una renovación vinculada al convenio antecedente. Toda extensión posterior deberá acordarse por escrito antes del vencimiento, revisando tutores, plan formativo y condiciones de las nuevas pasantías.', 'La ficha no informa fecha de firma. Confirmar la formalización de la renovación antes de considerar habilitadas nuevas pasantías.', 'Resolución CS UNLPam N° 118/24', 'EXP-UNLPAM-FI-2026-004'),
(11, 'UNLPAM-R-2026-002', 'Adenda al marco de pasantías con el Ministerio de Infraestructura', 'adenda', 'revision', 'Ampliar el marco de pasantías para incluir la carrera de Analista Programador Universitario y las tareas de relevamiento y digitalización de expedientes técnicos de los proyectos públicos provinciales.', NULL, 0, NULL, NULL, NULL, NULL, 2, 5, '2026-11-17 18:37:10', '2026-11-18 19:27:25', 'Las partes deberán incorporar al marco de pasantías las actividades vinculadas con la carrera de Analista Programador Universitario y el relevamiento y digitalización de expedientes técnicos; acordarán tareas, responsables, cronograma, acceso autorizado a la documentación y medidas de confidencialidad. La adenda complementa el convenio antecedente.', 'La rescisión de esta adenda deberá formalizarse por escrito conforme al marco antecedente y no alterará las cláusulas no modificadas. Antes del cierre, las partes deberán tratar las actividades y expedientes en curso de acuerdo con las reglas de acceso y resguardo aplicables.', 'La renovación de la adenda o del marco deberá formalizarse por escrito antes del vencimiento, con aprobación de ambas partes y revisión de las carreras, tareas y condiciones incorporadas.', 'La auditoría solicita aclarar la vigencia de la adenda y su relación con el vencimiento del convenio marco. Confirmar ese punto antes de aprobar.', 'Pendiente de asignación', 'EXP-UNLPAM-R-2026-002'),
(12, 'UNLPAM-FI-2026-005', 'Convenio específico de pasantías - Software del Sur S.R.L.', 'especifico_pasantia', 'borrador', 'Regular pasantías de estudiantes de Analista Programador Universitario en el área de desarrollo de aplicaciones web y móviles de Software del Sur S.R.L. Borrador inicial: faltan partes firmantes y fechas.', NULL, 0, NULL, NULL, NULL, NULL, 1, NULL, '2026-11-17 18:37:10', '2026-11-18 19:27:25', 'Borrador: la Universidad y Software del Sur deberán definir tutores, plan formativo, tareas, carga horaria, período, asignación y cobertura de cada pasantía. También deberán acordar las condiciones de acceso a sistemas y datos. Completar esos datos y las partes firmantes antes de remitir a revisión.', 'Borrador: establecer causales, preaviso y procedimiento de finalización anticipada conforme a la normativa de pasantías. Registrar cualquier interrupción y comunicarla a los tutores y al estudiante.', 'Borrador: definir plazo y mecanismo de renovación. Cualquier continuidad deberá estar sujeta a evaluación, acuerdo de las partes y formalización previa al vencimiento.', 'El borrador indica que faltan partes firmantes y fechas. Completar esos datos y definir tutores y condiciones antes de enviarlo a revisión.', 'Pendiente de asignación', 'EXP-UNLPAM-FI-2026-005'),
(13, 'UNLPAM-FI-2025-003', 'Convenio específico de colaboración - BioCom del Centro (sustitución)', 'especifico_colaboracion', 'firmado', 'Sustituir al convenio específico rescindido, estableciendo un nuevo plan de trabajo para el desarrollo de sensores IoT con entregas trimestrales, garantía de soporte y esquema de pagos por hitos.', 'Convenio Marco UNLPAM-INTA N° 23/22', 1, '2025-10-20', '2025-11-01', '2027-09-30', 30, 1, 6, '2026-11-17 18:37:10', '2026-11-18 19:27:25', 'Las partes ejecutarán el nuevo plan de trabajo para desarrollar sensores IoT; acordarán entregas trimestrales, criterios de aceptación y responsables; brindarán el soporte previsto y documentarán los hitos y pagos que correspondan según el instrumento firmado. El convenio sustituye al antecedente indicado en la ficha.', 'La finalización deberá documentarse por escrito conforme al instrumento firmado. Las partes deberán dejar constancia del estado de los entregables, el soporte pendiente, los hitos cumplidos y la liquidación que corresponda según el acuerdo.', 'Cualquier prórroga deberá formalizarse por escrito antes del 30/09/2027, con acuerdo de las partes y revisión del plan, las entregas, el soporte y las condiciones económicas.', 'Controlar el cumplimiento de las entregas trimestrales, las condiciones de soporte y la documentación de los hitos acordados.', 'Convenio Marco UNLPAM-INTA N° 23/22', 'EXP-UNLPAM-FI-2025-003'),
(14, 'UNLPAM-FI-2022-002', 'Marco de colaboración UNLPAM - Cámara Empresaria del Este Pampeano', 'marco_colaboracion', 'archivado', 'Establecer el marco general de cooperación para acciones de extensión y capacitación en localidades del este provincial. Vencido el 31/12/2024 y sin renovación: se archivó con la trazabilidad correspondiente.', 'Resolución CD FI N° 088/22', 0, '2022-11-08', '2023-01-01', '2024-12-31', 60, 1, NULL, '2026-11-17 18:37:10', '2026-11-18 19:27:25', 'Las partes debían coordinar actividades de extensión y capacitación en localidades del este provincial, definir responsables, destinatarios y cronogramas, y documentar las acciones realizadas. El convenio está archivado por vencimiento sin renovación; esta descripción no implica vigencia actual.', 'El convenio venció el 31/12/2024 y fue archivado sin renovación, según la ficha y la auditoría. No se deben iniciar nuevas actividades bajo este instrumento; cualquier continuidad requiere un nuevo instrumento vigente.', 'No corresponde renovación automática: el convenio está vencido y archivado. La continuidad requiere un nuevo instrumento aprobado y firmado por las partes.', 'El convenio venció el 31/12/2024 y figura archivado sin renovación. No utilizarlo para iniciar nuevas actividades.', 'Resolución CD FI N° 088/22', 'EXP-UNLPAM-FI-2022-002'),
(15, 'UNLPAM-FI-2026-015', 'Convenio de Pasantias ArgoTecnico', 'marco_pasantia', 'revision', 'Convenio de pasantia que compromete a los alumnos a participar de una pasantia en ArgoTecnico', NULL, 0, NULL, '2026-11-18', '2026-11-30', 20, 1, NULL, '2026-11-18 06:04:37', '2026-11-18 19:27:25', 'Borrador en revisión: antes del inicio, precisar el plan formativo, las tareas de los estudiantes, los tutores de ambas partes, la carga horaria, el período, la asignación y la cobertura. La descripción disponible no especifica esas condiciones.', 'Borrador en revisión: definir causales, preaviso y procedimiento de finalización anticipada. Documentar la decisión y comunicarla a los responsables académicos e institucionales.', 'Borrador en revisión: completar el plazo y definir si se admite renovación, bajo qué evaluación y con qué aprobación. Formalizar cualquier extensión antes del vencimiento.', 'Precisar la contraparte, las tareas, los tutores y las condiciones de la pasantía. Confirmar también el período y la fecha de vencimiento.', 'Pendiente de asignación', 'EXP-UNLPAM-FI-2026-015'),
(16, 'UNLPAM-FI-2026-016', 'Convenio de Pasantias ArgoTecnico 2', 'marco_colaboracion', 'revision', 'Colaboracion y pasantia', NULL, 0, NULL, '2026-11-18', '2026-12-31', 60, 1, 3, '2026-11-18 06:29:00', '2026-11-18 19:27:25', 'Borrador en revisión: precisar si el instrumento corresponde a un marco de colaboración, a pasantías o a ambos; definir actividades, responsabilidades, responsables, recursos y cronograma. Si incluye pasantías, completar además el plan formativo y las condiciones individuales antes de aprobarlo.', 'Borrador en revisión: definir causales, preaviso y procedimiento de finalización, distinguiendo las reglas aplicables a la colaboración y a las pasantías si ambas forman parte del instrumento.', 'Borrador en revisión: completar y validar el tipo de instrumento, la vigencia y el vínculo con el antecedente. Definir la renovación según las actividades finalmente acordadas y formalizarla por escrito.', 'Revisar la clasificación del instrumento: figura como marco de colaboración, aunque el título y el objeto mencionan pasantías. Confirmar también su vínculo con el convenio antecedente #3.', 'Pendiente de asignación', 'EXP-UNLPAM-FI-2026-016'),
(17, 'UNLPAM-FI-2026-006', 'Convenio específico de pasantías - TechPam Solutions S.A.', 'especifico_pasantia', 'aprobado', 'Regular pasantías para estudiantes de Ingeniería en Informática y APU en el área de desarrollo de software móvil y soluciones cloud.', 'Resolución CS UNLPAM N° 305/26', 0, NULL, '2026-12-01', '2027-11-30', 30, 1, NULL, '2026-11-26 03:57:52', '2026-11-26 03:57:52', 'TechPam Solutions S.A. otorga plazas de pasantía de 20hs semanales con asignación estímulo; la Facultad designa tutor académico.', 'Rescisión sin penalidades con preaviso escrito de 30 días.', 'Renovable por períodos de un año mediante acuerdo previo entre las partes.', NULL, 'Resolución CS UNLPAM N° 305/26', 'EX-2026-0210-—APM#FI'),
(18, 'UNLPAM-R-2026-003', 'Marco de colaboración UNLPAM - Fundación Ciencia y Desarrollo Pampeano', 'marco_colaboracion', 'aprobado', 'Establecer el marco general de cooperación técnica para proyectos de innovación educativa y transferencia tecnológica en la provincia.', 'Resolución CS UNLPAM N° 312/26', 0, NULL, '2026-12-15', '2029-12-14', 60, 2, NULL, '2026-11-26 03:57:52', '2026-11-26 03:57:52', 'Cooperación mutua en difusión científica, gestión de becas y organización de seminarios tecnológicos.', 'Rescisión por acuerdo mutuo o por notificación previa de 60 días.', 'Renovable automáticamente previo informe de la comisión de seguimiento.', NULL, 'Resolución CS UNLPAM N° 312/26', 'EX-2026-0245-—APM#R');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `convenio_partes`
--

CREATE TABLE `convenio_partes` (
  `id_convenio` int(11) NOT NULL,
  `id_parte` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `convenio_partes`:
--   `id_convenio`
--       `convenios` -> `id`
--   `id_parte`
--       `partes_firmantes` -> `id`
--

--
-- Volcado de datos para la tabla `convenio_partes`
--

INSERT INTO `convenio_partes` (`id_convenio`, `id_parte`) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 3),
(3, 4),
(3, 9),
(4, 1),
(4, 2),
(5, 5),
(5, 9),
(6, 1),
(6, 6),
(7, 1),
(8, 1),
(8, 7),
(9, 1),
(9, 7),
(10, 1),
(10, 3),
(11, 5),
(11, 9),
(12, 1),
(13, 1),
(13, 6),
(14, 1),
(14, 10),
(17, 15),
(18, 16);

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

--
-- RELACIONES PARA LA TABLA `documentos`:
--   `id_convenio`
--       `convenios` -> `id`
--

--
-- Volcado de datos para la tabla `documentos`
--

INSERT INTO `documentos` (`id`, `id_convenio`, `tipo_documento`, `ruta_archivo`, `hash_sha256`, `fecha_subida`) VALUES
(14, 1, 'principal', 'Convenio 01 - UNLPAM-FI-2024-001 (Marco Municipalidad de Santa Rosa).pdf', '3bd278373a8eefb8b7aad60b1b7fa7ab8cddc9c21a2a749e7bbb8faea68dc33a', '2026-11-17 21:10:33'),
(15, 2, 'principal', 'Convenio 02 - UNLPAM-FI-2024-002 (Específico Pasantías TecnoLáctea).pdf', 'cb2d6b124bc76008e8d1544324f32558e7dc8777d15956af6a2fe1eba20e1b94', '2026-11-17 21:10:33'),
(16, 3, 'principal', 'Convenio 03 - UNLPAM-R-2024-003 (Específico Colaboración Clínica Los Álamos).pdf', '9841e70f4de6aeb979db233de57cff281465459f13aacd06f095a1d35459ed82', '2026-11-17 21:10:33'),
(17, 4, 'principal', 'Convenio 04 - UNLPAM-FI-2025-001 (Adenda Municipalidad de Santa Rosa).pdf', '09653ad71f82c1947793d2e4e7ca1ee52dd9ef59dd25ddbe0472ed8d9d882fb1', '2026-11-17 21:10:33'),
(18, 5, 'principal', 'Convenio 05 - UNLPAM-R-2025-002 (Marco Pasantías Ministerio de Infraestructura).pdf', '7f4e9b6d9196a4cb15fcdccd151725868960a44d1823c5868e1d79365eaccdb7', '2026-11-17 21:10:33'),
(19, 6, 'principal', 'Convenio 06 - UNLPAM-FI-2023-004 (Específico Colaboración BioCom del Centro).pdf', '7ed6c4d1b4104817869a07b3afc6c54df00bfba026d491f87f07f7148ff2e835', '2026-11-17 21:10:33'),
(20, 7, 'principal', 'Convenio 07 - UNLPAM-FI-2026-001 (Específico Pasantías CNEA).pdf', '1bdaaf7a0e62fd245ec33a611434f61e1d182f65673ba6b0951e256d683cc263', '2026-11-17 21:10:33'),
(21, 8, 'principal', 'Convenio 08 - UNLPAM-FI-2026-002 (Marco Colaboración InnovaAgro).pdf', '06b6edfe50345f4f2d6ae47caa277cb94b78087a19457602439c94ff0ab8ef2a', '2026-11-17 21:10:33'),
(22, 9, 'principal', 'Convenio 09 - UNLPAM-FI-2026-003 (Específico Investigación InnovaAgro).pdf', '62b3e84eda21c745e10739be0bbc6dce6a147a1fb236c83a2d17117c4c7f4c3b', '2026-11-17 21:10:33'),
(23, 10, 'principal', 'Convenio 10 - UNLPAM-FI-2026-004 (Renovación Pasantías TecnoLáctea).pdf', 'b2816e355bef268332209e545922e8313b4941e257bef57d5f5b8f4cb15ceaaa', '2026-11-17 21:10:33'),
(24, 11, 'principal', 'Convenio 11 - UNLPAM-R-2026-002 (Adenda Ministerio de Infraestructura).pdf', '4208be5579181acf8e0e8e1b443eb0882ad71ce387c2b468d3a593da3a696302', '2026-11-17 21:10:33'),
(25, 12, 'principal', 'Convenio 12 - UNLPAM-FI-2026-005 (Específico Pasantías Software del Sur).pdf', '80af5a28499d5df1e00f11b5c335fd2bd803efbb0b51d2d31a59ca9b1724418f', '2026-11-17 21:10:33'),
(26, 13, 'principal', 'Convenio 13 - UNLPAM-FI-2025-003 (Sustitución Colaboración BioCom).pdf', '1271a2bc0207c42a2297dbef2809a72fd5c74f6d12bdeeb2d52fb66ef7fe5da6', '2026-11-17 21:10:33'),
(27, 14, 'principal', 'Convenio 14 - UNLPAM-FI-2022-002 (Marco Cámara Empresaria del Este).pdf', '19ab427b86ce642dd8093c9ddf4980559ee3aa2e6176b4da38c241bfc3af0657', '2026-11-17 21:10:33');

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

--
-- RELACIONES PARA LA TABLA `partes_firmantes`:
--

--
-- Volcado de datos para la tabla `partes_firmantes`
--

INSERT INTO `partes_firmantes` (`id`, `nombre_institucion`, `representante_nombre`, `representante_cargo`) VALUES
(1, 'Universidad Nacional de La Pampa - Facultad de Ingeniería', 'Ing. Sergio Alberto Villalba', 'Decano'),
(2, 'Municipalidad de Santa Rosa', 'Arq. Romina Beatriz Cardozo', 'Secretaria de Obras y Servicios Públicos'),
(3, 'TecnoLáctea S.A.', 'Lic. Hugo Aníbal Medina', 'Gerente de Planta'),
(4, 'Clínica Los Álamos', 'Dra. Cecilia Beatriz Bravo', 'Directora Médica'),
(5, 'Ministerio de Infraestructura de La Pampa', 'Arq. Damián Esteban Rosales', 'Subsecretario de Planificación Técnica'),
(6, 'BioCom del Centro S.A.', 'Lic. Paula Daniela Ferreiro', 'Gerenta General'),
(7, 'InnovaAgro S.R.L.', 'Ing. Facundo Andrés Cabrera', 'Socio Gerente'),
(8, 'Software del Sur S.R.L.', 'Lic. Valeria Soledad Ortiz', 'Gerenta de Desarrollo'),
(9, 'Universidad Nacional de La Pampa - Rectorado', 'Lic. Norberto Fabián Aguilar', 'Secretario General'),
(10, 'Cámara Empresaria del Este Pampeano', 'Sr. Claudio Daniel Ibarra', 'Presidente'),
(15, 'TechPam Solutions S.A.', 'Ing. Carlos Alberto Mendoza', 'Director General'),
(16, 'Fundación Ciencia y Desarrollo Pampeano', 'Dra. Elena Beatriz Morales', 'Presidenta');

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
  `carga_horaria` int(11) DEFAULT NULL,
  `periodo` varchar(60) DEFAULT NULL,
  `tutoria` varchar(150) DEFAULT NULL,
  `asignacion` varchar(50) DEFAULT NULL,
  `seguro` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `personas_pasantias`:
--   `id_convenio`
--       `convenios` -> `id`
--

--
-- Volcado de datos para la tabla `personas_pasantias`
--

INSERT INTO `personas_pasantias` (`id`, `id_convenio`, `nombre_completo`, `rol`, `carrera`, `carga_horaria`, `periodo`, `tutoria`, `asignacion`, `seguro`) VALUES
(1, 2, 'Sofía Belén Robles', 'Pasante', 'Ingeniería en Sistemas', 20, '2025-09-01 a 2026-02-28', 'Ing. Hugo Aníbal Medina (TecnoLáctea S.A.)', '$96.000 mensual', 'ART Provincia Seguros - Seguro de vida obligatorio'),
(2, 2, 'Nicolás Iván Guerrero', 'Pasante', 'Analista Programador Universitario', 20, '2025-09-01 a 2026-02-28', 'Ing. Julián Ferreyra (tutor académico FI-UNLPam)', '$96.000 mensual', 'ART Provincia Seguros - Seguro de vida obligatorio'),
(3, 3, 'Joaquín Ezequiel Salas', 'Pasante', 'Ingeniería en Sistemas', 15, '2025-03-01 a 2025-08-31', 'Dra. Cecilia Beatriz Bravo (Clínica Los Álamos)', '$72.000 mensual', 'Cobertura de salud - Obra social universitaria'),
(4, 9, 'Mariana Soledad Ledesma', 'Becaria de investigación', 'Doctorado en Ciencias de la Computación', 10, '2026-05-01 a 2026-12-15', 'Ing. Sergio Alberto Villalba (dirección del proyecto)', '$115.000 mensual (beca)', 'Cobertura IOMA - Zona General Pico'),
(5, 9, 'Ramiro Andrés Sosa', 'Investigador', 'Ingeniería en Sistemas', 10, '2026-05-01 a 2026-12-15', 'Ing. Facundo Andrés Cabrera (contraparte InnovaAgro)', '—', 'Cobertura IOMA - Zona General Pico'),
(6, 10, 'Sofía Belén Robles', 'Pasante', 'Ingeniería en Sistemas', 20, '2026-09-01 a 2027-02-28', 'Ing. Hugo Aníbal Medina (TecnoLáctea S.A.)', '$102.000 mensual', 'ART Provincia Seguros - Seguro de vida obligatorio'),
(7, 10, 'Milagros del Valle Quiroga', 'Pasante', 'Analista Programador Universitario', 20, '2026-09-01 a 2027-02-28', 'Ing. Hugo Aníbal Medina (TecnoLáctea S.A.)', '$102.000 mensual', 'ART Provincia Seguros - Seguro de vida obligatorio'),
(8, 17, 'Lucas Mateo Benítez', 'Pasante', 'Ingeniería en Sistemas', 20, '2026-12-01 a 2027-05-31', 'Ing. Carlos Alberto Mendoza (TechPam Solutions S.A.)', '$120.000 mensual', 'ART Provincia Seguros - Cobertura Integral');

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
-- RELACIONES PARA LA TABLA `unidades_academicas`:
--

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
  `dni` varchar(8) NOT NULL,
  `legajo` int(4) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `nombre_completo` varchar(150) NOT NULL,
  `rol` enum('administracion','gestion','revision','consulta') NOT NULL,
  `id_unidad` int(11) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `usuarios`:
--   `id_unidad`
--       `unidades_academicas` -> `id`
--

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `dni`, `legajo`, `contrasena`, `nombre_completo`, `rol`, `id_unidad`, `activo`) VALUES
(1, '11111111', 9292, '.SWChHlPufutvjBH5k.8hy9a4OcXH8keX2xzVZj3T.AW2w0GAC', 'Gestor01', 'gestion', 1, 1),
(2, '42489167', 20, '$2b$10$CnC213Wt0PLLof9wuwJJquZ7z1y/F6qfl35Iok8gfPPXM8WOWfUt.', 'Antonio Funes', 'administracion', NULL, 1),
(3, '42755835', 10, '$2b$10$5DOlCraI9se2.9GPDhTlCeLn01B.YL0mFkUSmUS0ZASoMiJ63IrzC', 'German Dieser', 'administracion', NULL, 1),
(4, '45566115', 30, '$2b$10$gBr8nGRSlS8Ltaw0COFCm.WKOx4u.ZN.NYNYOsd2E9PHyobW84axq', 'Luciano Cayssials', 'administracion', NULL, 1),
(5, '40000001', 40, '$2b$10$qGp6mlkcKzkY43IJjR948e89D9PDlTyP.wiqSEAT.4f4lMZnFU.2W', 'Usuario Rectorado', 'revision', 2, 1),
(6, '40000002', 50, '$2b$10$zf7pdnCdfbimjNb.ha7wCekWOec313fkF9G1pgOx2dkjuLl9jTFTi', 'Usuario Consulta', 'consulta', 1, 1),
(7, '25987654', 60, '$2b$10$nem9p2WcYinJ1xlZwV3kSesPHeEc2MHqol33Y9o3SVGrHO7EF5XFu', 'Gestor02', 'gestion', 1, 1);

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
  ADD UNIQUE KEY `dni_unico` (`dni`),
  ADD UNIQUE KEY `legajo` (`legajo`),
  ADD KEY `id_unidad` (`id_unidad`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `auditoria_observaciones`
--
ALTER TABLE `auditoria_observaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=133;

--
-- AUTO_INCREMENT de la tabla `convenios`
--
ALTER TABLE `convenios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `documentos`
--
ALTER TABLE `documentos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT de la tabla `partes_firmantes`
--
ALTER TABLE `partes_firmantes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `personas_pasantias`
--
ALTER TABLE `personas_pasantias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `unidades_academicas`
--
ALTER TABLE `unidades_academicas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
