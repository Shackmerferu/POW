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
-- Se omite SET time_zone para que el script se importe en cualquier servidor.


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

--
-- Volcado de datos para la tabla `convenios`
--

-- DATOS FICTICIOS (TPI): todas las instituciones, personas y expedientes son
-- inventados para la demo. Las renovaciones y sustituciones se modelan como
-- instrumentos NUEVOS (código y ficha propios) vinculados por id_antecedente,
-- sin alterar el registro anterior (regla del enunciado).
INSERT INTO `convenios` (`id`, `codigo_unico`, `titulo`, `tipo`, `estado`, `objeto`, `marco_legal`, `confidencialidad`, `fecha_firma`, `fecha_inicio`, `fecha_vencimiento`, `dias_preaviso`, `id_unidad_responsable`, `id_antecedente`) VALUES
(1, 'UNLPAM-FI-2024-001', 'Marco de colaboración UNLPAM - Municipalidad de Santa Rosa', 'marco_colaboracion', 'firmado', 'Establecer el marco general de cooperación entre la Facultad de Ingeniería y la Municipalidad de Santa Rosa para proyectos conjuntos de extensión, investigación y desarrollo tecnológico.', 'Ordenanza Municipal N° 4210/24', 0, '2024-05-12', '2024-06-01', '2027-05-31', 60, 1, NULL),
(2, 'UNLPAM-FI-2024-002', 'Convenio específico de pasantías - TecnoLáctea S.A.', 'especifico_pasantia', 'firmado', 'Regular pasantías de estudiantes de Ingeniería en Informática y Electromecánica en el área de automatización de procesos de la empresa TecnoLáctea S.A.', 'Resolución CS UNLPAM N° 118/24', 0, '2024-08-20', '2024-09-01', '2026-08-31', 30, 1, NULL),
(3, 'UNLPAM-R-2024-003', 'Acuerdo de cooperación académica - Clínica Los Álamos', 'especifico_colaboracion', 'aprobado', 'Cooperación para prácticas supervisadas de estudiantes de Ingeniería en Sistemas de Salud y desarrollo de historias clínicas digitales.', 'Resolución Ministerial N° 512/24', 0, '2024-11-03', '2025-03-01', '2026-02-28', 45, 2, NULL),
(4, 'UNLPAM-FI-2025-001', 'Adenda al marco de colaboración con la Municipalidad de Santa Rosa', 'adenda', 'revision', 'Ampliar el marco de colaboración N° 1 para incluir el área de energías renovables y eficiencia energética en edificios municipales.', NULL, 0, '2025-04-18', '2025-05-01', '2027-05-31', 60, 1, 1),
(5, 'UNLPAM-R-2025-002', 'Marco de pasantías con el Ministerio de Infraestructura', 'marco_pasantia', 'firmado', 'Crear el marco reglamentario para pasantías de estudiantes en los proyectos de infraestructura pública que ejecuta el Ministerio en la provincia.', 'Resolución Ministerial N° 87/25', 0, '2025-02-14', '2025-03-01', '2028-02-29', 90, 2, NULL),
(6, 'UNLPAM-FI-2023-004', 'Convenio específico de colaboración - BioCom del Centro', 'especifico_colaboracion', 'rescindido', 'Desarrollo conjunto de sensores IoT para monitoreo de cultivos intensivos en la región pampeana.', 'Convenio Marco UNLPAM-INTA N° 23/22', 1, '2023-09-05', '2023-10-01', '2025-09-30', 30, 1, NULL),
(7, 'UNLPAM-FI-2026-001', 'Pasantía específica - Comisión Nacional de Energía Atómica', 'especifico_pasantia', 'borrador', 'Pasantías de estudiantes de Ingeniería Nuclear en el Centro Atómico Bariloche durante el ciclo lectivo 2026.', NULL, 0, NULL, NULL, NULL, NULL, 1, NULL),
(8, 'UNLPAM-FI-2026-002', 'Marco de colaboración UNLPAM - InnovaAgro S.R.L.', 'marco_colaboracion', 'firmado', 'Establecer el marco general de cooperación entre la Facultad de Ingeniería e InnovaAgro S.R.L. para proyectos conjuntos de agricultura de precisión, pasantías e investigación aplicada en la región pampeana.', 'Resolución CS UNLPAM N° 203/26', 0, '2026-03-10', '2026-04-01', '2028-03-31', 60, 1, NULL),
(9, 'UNLPAM-FI-2026-003', 'Convenio específico de colaboración - Proyecto de investigación con InnovaAgro (alta de integrantes)', 'especifico_colaboracion', 'firmado', 'Formalizar la incorporación de becarias, becarios e investigadores al proyecto de investigación "Monitoreo inteligente de suelos y cultivos mediante sensores de bajo costo", en el marco del convenio de colaboración con InnovaAgro S.R.L. Cada alta se documenta en el anexo de integrantes.', 'Resolución CD FI N° 172/26', 0, '2026-04-22', '2026-05-01', '2026-12-15', 60, 1, 8),
(10, 'UNLPAM-FI-2026-004', 'Convenio específico de pasantías - TecnoLáctea S.A. (renovación)', 'especifico_pasantia', 'aprobado', 'Renovar por un año el convenio específico de pasantías con TecnoLáctea S.A., manteniendo las condiciones de la versión anterior e incorporando el área de control de calidad de datos. Instrumento nuevo vinculado a su antecedente.', 'Resolución CS UNLPAM N° 118/24', 0, NULL, '2026-09-01', '2027-08-31', 30, 1, 2),
(11, 'UNLPAM-R-2026-002', 'Adenda al marco de pasantías con el Ministerio de Infraestructura', 'adenda', 'revision', 'Ampliar el marco de pasantías para incluir la carrera de Analista Programador Universitario y las tareas de relevamiento y digitalización de expedientes técnicos de los proyectos públicos provinciales.', NULL, 0, NULL, NULL, NULL, NULL, 2, 5),
(12, 'UNLPAM-FI-2026-005', 'Convenio específico de pasantías - Software del Sur S.R.L.', 'especifico_pasantia', 'borrador', 'Regular pasantías de estudiantes de Analista Programador Universitario en el área de desarrollo de aplicaciones web y móviles de Software del Sur S.R.L. Borrador inicial: faltan partes firmantes y fechas.', NULL, 0, NULL, NULL, NULL, NULL, 1, NULL),
(13, 'UNLPAM-FI-2025-003', 'Convenio específico de colaboración - BioCom del Centro (sustitución)', 'especifico_colaboracion', 'firmado', 'Sustituir al convenio específico rescindido, estableciendo un nuevo plan de trabajo para el desarrollo de sensores IoT con entregas trimestrales, garantía de soporte y esquema de pagos por hitos.', 'Convenio Marco UNLPAM-INTA N° 23/22', 1, '2025-10-20', '2025-11-01', '2027-09-30', 30, 1, 6),
(14, 'UNLPAM-FI-2022-002', 'Marco de colaboración UNLPAM - Cámara Empresaria del Este Pampeano', 'marco_colaboracion', 'archivado', 'Establecer el marco general de cooperación para acciones de extensión y capacitación en localidades del este provincial. Vencido el 31/12/2024 y sin renovación: se archivó con la trazabilidad correspondiente.', 'Resolución CD FI N° 088/22', 0, '2022-11-08', '2023-01-01', '2024-12-31', 60, 1, NULL);

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
  `carga_horaria` int(11) DEFAULT NULL,
  `periodo` varchar(60) DEFAULT NULL,
  `tutoria` varchar(150) DEFAULT NULL,
  `asignacion` varchar(50) DEFAULT NULL,
  `seguro` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `personas_pasantias`
-- Personas ficticias vinculadas a los instrumentos. La misma persona puede
-- figurar en más de un convenio (ej.: Sofía Robles en el convenio 2 y su
-- renovación 10): el conteo de "personas únicas" debe deduplicarla.
--

INSERT INTO `personas_pasantias` (`id`, `id_convenio`, `nombre_completo`, `rol`, `carrera`, `carga_horaria`, `periodo`, `tutoria`, `asignacion`, `seguro`) VALUES
(1, 2, 'Sofía Belén Robles', 'Pasante', 'Ingeniería en Sistemas', 20, '2025-09-01 a 2026-02-28', 'Ing. Hugo Aníbal Medina (TecnoLáctea S.A.)', '$96.000 mensual', 'ART Provincia Seguros - Seguro de vida obligatorio'),
(2, 2, 'Nicolás Iván Guerrero', 'Pasante', 'Analista Programador Universitario', 20, '2025-09-01 a 2026-02-28', 'Ing. Julián Ferreyra (tutor académico FI-UNLPam)', '$96.000 mensual', 'ART Provincia Seguros - Seguro de vida obligatorio'),
(3, 3, 'Joaquín Ezequiel Salas', 'Pasante', 'Ingeniería en Sistemas', 15, '2025-03-01 a 2025-08-31', 'Dra. Cecilia Beatriz Bravo (Clínica Los Álamos)', '$72.000 mensual', 'Cobertura de salud - Obra social universitaria'),
(4, 9, 'Mariana Soledad Ledesma', 'Becaria de investigación', 'Doctorado en Ciencias de la Computación', 10, '2026-05-01 a 2026-12-15', 'Ing. Sergio Alberto Villalba (dirección del proyecto)', '$115.000 mensual (beca)', 'Cobertura IOMA - Zona General Pico'),
(5, 9, 'Ramiro Andrés Sosa', 'Investigador', 'Ingeniería en Sistemas', 10, '2026-05-01 a 2026-12-15', 'Ing. Facundo Andrés Cabrera (contraparte InnovaAgro)', '—', 'Cobertura IOMA - Zona General Pico'),
(6, 10, 'Sofía Belén Robles', 'Pasante', 'Ingeniería en Sistemas', 20, '2026-09-01 a 2027-02-28', 'Ing. Hugo Aníbal Medina (TecnoLáctea S.A.)', '$102.000 mensual', 'ART Provincia Seguros - Seguro de vida obligatorio'),
(7, 10, 'Milagros del Valle Quiroga', 'Pasante', 'Analista Programador Universitario', 20, '2026-09-01 a 2027-02-28', 'Ing. Hugo Aníbal Medina (TecnoLáctea S.A.)', '$102.000 mensual', 'ART Provincia Seguros - Seguro de vida obligatorio');

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
  `dni` varchar(8) NOT NULL,
  `legajo` int(4) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `nombre_completo` varchar(150) NOT NULL,
  `rol` enum('administracion','gestion','revision','consulta') NOT NULL,
  `id_unidad` int(11) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `dni`, `legajo`, `contrasena`, `nombre_completo`, `rol`, `id_unidad`, `activo`) VALUES
(1, '11111111', 9292, '$2b$10$11KrgBHL0VNr1aIvqtI0KOd.THJibmiq9AN8sB/E8v.3a/c/aMQp6', 'Gestor01', 'gestion', 1, 1),
(2, '42489167', 20, '$2b$10$CnC213Wt0PLLof9wuwJJquZ7z1y/F6qfl35Iok8gfPPXM8WOWfUt.', 'Antonio Funes', 'administracion', NULL, 1),
(3, '42755835', 10, '$2b$10$5DOlCraI9se2.9GPDhTlCeLn01B.YL0mFkUSmUS0ZASoMiJ63IrzC', 'German Dieser', 'administracion', NULL, 1),
(4, '45566115', 30, '$2b$10$gBr8nGRSlS8Ltaw0COFCm.WKOx4u.ZN.NYNYOsd2E9PHyobW84axq', 'Luciano Cayssials', 'administracion', NULL, 1),
(5, '40000001', 40, '$2b$10$qGp6mlkcKzkY43IJjR948e89D9PDlTyP.wiqSEAT.4f4lMZnFU.2W', 'Usuario Rectorado', 'revision', 2, 1),
(6, '40000002', 50, '$2b$10$zf7pdnCdfbimjNb.ha7wCekWOec313fkF9G1pgOx2dkjuLl9jTFTi', 'Usuario Consulta', 'consulta', 1, 1);

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
-- Volcado de datos para la tabla `auditoria_observaciones`
-- Trazabilidad del circuito: cada transición de estado con responsable,
-- fecha y fundamento. Incluye el ciclo completo de devolución por
-- observación (convenios 4 y 11) y las firmas registradas del convenio 9.
--

INSERT INTO `auditoria_observaciones` (`id`, `id_convenio`, `id_usuario`, `observacion`, `estado_previo`, `estado_nuevo`, `fecha_registro`) VALUES
(1, 4, 5, 'Devuelto para corrección: falta precisar el alcance territorial del trabajo en energías renovables y las obligaciones de cada parte.', 'revision', 'borrador', '2025-05-02 09:20:00'),
(2, 4, 1, 'Se incorporó el alcance territorial y el detalle de obligaciones; se reenvía a revisión.', 'borrador', 'revision', '2025-05-06 11:45:00'),
(3, 9, 2, 'Aprobación administrativa del trámite en revisión.', 'revision', 'aprobado', '2026-04-24 10:10:00'),
(4, 9, 5, 'Primera firma registrada en la app móvil (equipo de revisión).', 'aprobado', 'firmado', '2026-04-25 08:55:00'),
(5, 9, 1, 'Segunda firma registrada en la app móvil (gestión). Instrumento firmado.', 'firmado', 'firmado', '2026-04-25 09:30:00'),
(6, 10, 5, 'Aprobado en revisión. Queda pendiente el registro de firmas.', 'revision', 'aprobado', '2026-09-04 12:00:00'),
(7, 11, 5, 'Devuelto para corrección: se solicita aclarar la vigencia de la adenda y su relación con el vencimiento del marco.', 'revision', 'borrador', '2026-10-08 15:10:00'),
(8, 11, 1, 'Se aclaró la vigencia de la adenda en el objeto; se reenvía a revisión.', 'borrador', 'revision', '2026-10-12 09:35:00'),
(9, 6, 2, 'Rescisión registrada por incumplimiento reiterado del cronograma de entregas.', 'firmado', 'rescindido', '2025-06-30 10:00:00'),
(10, 14, 2, 'Archivado por vencimiento sin renovación, con copia digital del expediente.', 'firmado', 'archivado', '2025-01-20 09:00:00'),
(11, 12, 1, 'Alta inicial del borrador; pendiente completar partes firmantes y fechas.', NULL, 'borrador', '2026-11-10 16:20:00');

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
-- Volcado de datos para la tabla `convenio_partes`
-- Regla del enunciado: todo convenio aprobado o firmado necesita al menos
-- dos partes. Los borradores 7 y 12 están incompletos a propósito, para
-- validar ese caso en el circuito.
--

INSERT INTO `convenio_partes` (`id_convenio`, `id_parte`) VALUES
(1, 1), (1, 2),
(2, 1), (2, 3),
(3, 9), (3, 4),
(4, 1), (4, 2),
(5, 9), (5, 5),
(6, 1), (6, 6),
(7, 1),
(8, 1), (8, 7),
(9, 1), (9, 7),
(10, 1), (10, 3),
(11, 9), (11, 5),
(12, 1),
(13, 1), (13, 6),
(14, 1), (14, 10);

--
-- Indices de la tabla `documentos`
--
ALTER TABLE `documentos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_convenio` (`id_convenio`);

--
-- Volcado de datos para la tabla `documentos`
-- PDF ficticios (hasta 20 MB) con hash SHA-256 de integridad. Los archivos
-- no existen: las rutas ilustran cómo se organizarían en el servidor.
--

INSERT INTO `documentos` (`id`, `id_convenio`, `tipo_documento`, `ruta_archivo`, `hash_sha256`, `fecha_subida`) VALUES
(1, 1, 'principal', 'uploads/convenios/1/marco_municipalidad_santa_rosa.pdf', '3f8a9c2e7b4d1f6a0c5e8b2d7f4a1c9e6b3d8f2a5c7e0b9d4f1a8c3e6b9d2f5a', '2024-05-12 10:15:00'),
(2, 1, 'anexo', 'uploads/convenios/1/anexo_plan_de_acciones.pdf', 'a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90', '2024-05-12 10:20:00'),
(3, 2, 'principal', 'uploads/convenios/2/especifico_tecnolactea.pdf', '9d8c7b6a5f4e3d2c1b0a99887766554433221100ffeeddccbbaa998877665544', '2024-08-20 09:30:00'),
(4, 2, 'resolucion', 'uploads/convenios/2/resolucion_cs_118_24.pdf', '77aa11bb22cc33dd44ee55ff66aa77bb88cc99dd00ee11ff22aa33bb44cc55dd', '2024-08-20 09:35:00'),
(5, 3, 'principal', 'uploads/convenios/3/especifico_clinica_alamos.pdf', 'f0e1d2c3b4a5968778695a4b3c2d1e0f0099887766554433221100aabbccddeeff', '2024-11-03 11:00:00'),
(6, 3, 'dictamen', 'uploads/convenios/3/dictamen_area_legales.pdf', '12ff34ee56dd78cc90bb01aa23cc45dd56ee67ff78aa89bb00cc11dd22ee33ff44', '2024-11-02 16:40:00'),
(7, 5, 'principal', 'uploads/convenios/5/marco_ministerio_infraestructura.pdf', '4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b', '2025-02-14 10:05:00'),
(8, 9, 'principal', 'uploads/convenios/9/especifico_proyecto_innovaagro.pdf', 'ab12cd34ef56aa78bb90cd12ef34aa56bb78cd90ef12aa34bb56cd78ef90aa12', '2026-04-22 09:12:00'),
(9, 9, 'resolucion', 'uploads/convenios/9/resolucion_cd_172_26_alta_integrantes.pdf', '5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5', '2026-04-22 09:15:00'),
(10, 9, 'anexo', 'uploads/convenios/9/anexo_alta_de_integrantes.pdf', 'c0c1c2c3c4c5c6c7c8c9cacbcccdcecfd0d1d2d3d4d5d6d7d8d9dadbdcdddedf', '2026-04-22 09:18:00'),
(11, 10, 'principal', 'uploads/convenios/10/renovacion_especifico_tecnolactea.pdf', '8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c', '2026-08-28 10:02:00'),
(12, 11, 'principal', 'uploads/convenios/11/proyecto_de_adenda_marco_pasantias.pdf', '99887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa', '2026-10-05 14:30:00'),
(13, 13, 'principal', 'uploads/convenios/13/sustitucion_especifico_biocom.pdf', 'd4d5d6d7d8d9dadbdcdddedfe0e1e2e3e4e5e6e7e8e9eaebecedeeefe0e1e2e3', '2025-10-20 09:40:00');

--
-- Indices de la tabla `partes_firmantes`
--
ALTER TABLE `partes_firmantes`
  ADD PRIMARY KEY (`id`);

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
(10, 'Cámara Empresaria del Este Pampeano', 'Sr. Claudio Daniel Ibarra', 'Presidente');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `convenios`
--
ALTER TABLE `convenios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `documentos`
--
ALTER TABLE `documentos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `partes_firmantes`
--
ALTER TABLE `partes_firmantes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `personas_pasantias`
--
ALTER TABLE `personas_pasantias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `unidades_academicas`
--
ALTER TABLE `unidades_academicas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
