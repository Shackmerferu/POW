-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 13-11-2025 a las 19:02:22
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
-- Base de datos: `la_tania`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipos`
--

CREATE TABLE `equipos` (
  `id_equipo` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `logo` varchar(200) NOT NULL,
  `puntos` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `equipos`
--

INSERT INTO `equipos` (`id_equipo`, `nombre`, `logo`, `puntos`) VALUES
(1, 'Central Argentino', 'cea.png', 0),
(2, 'La Tania', 'tania.png', 0),
(3, 'Ferro Carril Oeste ', 'fco.png', 0),
(4, 'Club All Boys ', 'alb.png', 0),
(5, 'Club Sportivo Independiente', 'csi.png', 0),
(6, 'Club A. River Plate', 'riv.png', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `item_menu`
--

CREATE TABLE `item_menu` (
  `id` int(11) NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `src` varchar(200) NOT NULL,
  `visible` varchar(4) NOT NULL,
  `id_categoria` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `item_menu`
--

INSERT INTO `item_menu` (`id`, `titulo`, `src`, `visible`, `id_categoria`) VALUES
(1, 'inico', './', 'SI', 0),
(2, 'quienes somos', 'about.html', 'NO', 0),
(3, 'canicas masculino', 'canicas_masculino.html', 'SI', 1),
(4, 'futbol Masculino', 'futbol_maculino.html', 'No', 2),
(5, 'mancha envenenada', 'mancha_envenenada.html', 'NO', 0),
(6, 'canicas femenino', 'canicas_femenino.html', 'SI', 3),
(7, 'futbol femenino', 'futbol_femenino.html', 'NO', 4),
(8, 'Hockey Femenino', 'hockey_femenino.html', 'NO', 5),
(9, 'Hockey Masculino', 'no_toy_html', 'NO', 6),
(10, 'Basquet Masculino', 'baquecitoM.html', 'NO', 7),
(11, 'Basquet Femenino', 'basquecito.html', 'NO', 8);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jugadores`
--

CREATE TABLE `jugadores` (
  `id_jugador` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(150) NOT NULL,
  `apodo` varchar(50) NOT NULL,
  `dni` varchar(40) NOT NULL,
  `biografia` text NOT NULL,
  `imagen` text NOT NULL,
  `id_categoria` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `jugadores`
--

INSERT INTO `jugadores` (`id_jugador`, `nombre`, `apellido`, `apodo`, `dni`, `biografia`, `imagen`, `id_categoria`) VALUES
(1, 'Albino', 'Blanco', 'Cañita Boladora', '1', 'nacio en un Viñedo de Mendoza', 'prof.jpg', 1),
(2, 'Rogelio', 'Gordillo', 'El Pibe Cabeza', '2', 'nacio en un Viñedo de Mendoza', 'prof1.jpg', 1),
(3, 'Cayetano ', ' Santos Godino', 'El Petizo Orejudo', '3', 'Cayetano Santos Godino (Buenos Aires; 31 de octubre de 1896 – penal de Ushuaia; 15 de noviembre de 1944), más conocido por su apodo El Petiso Orejudo,1? fue un joven asesino en serie, uno de los mayores sociópatas de la historia argentina, ya que a principios del siglo XX fue responsable de la muerte de cuatro niños, siete intentos de homicidio y el incendio de siete edificios.', 'prof3.jpg', 1),
(4, 'Rogelio', 'Gordillo', 'El Pibe Cabeza', '2', 'nacio en un Viñedo de Mendoza', 'prof1.jpg', 2),
(5, 'Cayetano ', ' Santos Godino', 'El Petizo Orejudo', '3', 'Cayetano Santos Godino (Buenos Aires; 31 de octubre de 1896 – penal de Ushuaia; 15 de noviembre de 1944), más conocido por su apodo El Petiso Orejudo,1? fue un joven asesino en serie, uno de los mayores sociópatas de la historia argentina, ya que a principios del siglo XX fue responsable de la muerte de cuatro niños, siete intentos de homicidio y el incendio de siete edificios.', 'prof3.jpg', 2),
(6, 'Segundo', ' David Peralta', 'Mate Cosido ', '4', 'Llegó a la provincia del Chaco hacia 1926 proveniente de Asunción y luego desde Corrientes. En prontuarios policiales de Tucumán, Córdoba y Santiago del Estero se registra a David Segundo Peralta, alias \"Mate Cosido\" (1916 a 1924).\r\n\r\n<p>Aunque a veces se confunde su apodo con el nombre de la infusión \"mate cocido\", el apodo real es \"mate cosido\", en referencia a una cicatriz que tenía en la cabeza, llamada \"mate\" en la jerga popular, sobre todo la norteña. Por supuesto, fonéticamente ambas explicaciones coinciden. ', 'prof5.jpg', 1),
(7, 'Juan ', 'Bautista Bairoletto', 'El Robin Hood de las Pampas', '5', 'Juan Bautista Bairoletto, conocido como \"el Robin Hood de Las Pampas\", fue un reconocido bandido rural y cuatrero argentino que apenas vivió 46 años. Tuvo un final trágico que todavía es recordado en la actualidad. Cómo fue su corta pero intensa vida, a qué se dedicó y por qué pasó a la fama en este país hace ya casi un siglo. Entre 1920 y el 14 de septiembre de 1941, cuando fue asesinado por la Policía, fue uno de los fugitivos más perseguidos por los efectivos de por lo menos tres provincias.\r\n\r\n<p>Si bien se mostraba como un justiciero que ayudaba a la mayoría de los trabajadores humildes, encabezaba una banda violenta y brutal que arreciaba las estancias más grandes de la época y allí no tenía piedad con sus víctimas poderosas y millonarias.', 'prof7.jpg', 1),
(8, 'Juan ', 'Bautista Bairoletto', 'El Robin Hood de las Pampas', '5', 'Juan Bautista Bairoletto, conocido como \"el Robin Hood de Las Pampas\", fue un reconocido bandido rural y cuatrero argentino que apenas vivió 46 años. Tuvo un final trágico que todavía es recordado en la actualidad. Cómo fue su corta pero intensa vida, a qué se dedicó y por qué pasó a la fama en este país hace ya casi un siglo. Entre 1920 y el 14 de septiembre de 1941, cuando fue asesinado por la Policía, fue uno de los fugitivos más perseguidos por los efectivos de por lo menos tres provincias.\r\n\r\n<p>Si bien se mostraba como un justiciero que ayudaba a la mayoría de los trabajadores humildes, encabezaba una banda violenta y brutal que arreciaba las estancias más grandes de la época y allí no tenía piedad con sus víctimas poderosas y millonarias.', 'prof7.jpg', 2),
(9, 'María de las Mercedes Bernardina', ' Bolla Aponte de Murano', 'Yiya Murano', '6', ' prestamista argentina acusada de al menos tres cargos de homicidio y estafa en 1979 en Argentina. Condenada por estos crímenes, estuvo presa durante dieciséis años. Su caso policial es uno de los más famosos en la historia criminalista argentina, tomando mucha repercusión y manteniéndose a lo largo de los años.1? Fue una asesina en serie organizada, motivada por el lucro.\r\n\r\n<p>Según el propio hijo de Murano, Martín Murano, su madre falleció sola en un geriátrico del barrio Belgrano, en Buenos Aires el 23 de junio de 2014, aunque su muerte pasó desapercibida en su momento ante los medios.2', 'prof4.jpg', 3),
(10, 'Haydée Luján ', 'Martínez', 'Gorda Matosa', '7', 'Reconocida simpatizante argentina del club de fútbol River Plate. Era la líder de la parcialidad millonaria hasta el surgimiento de los barrabravas, quienes en las últimas décadas del siglo XX se adueñaron de las tribunas.\r\n\r\n<p>Durante toda su vida se dedicó a vender lotería,1? motivo que le facilitaba seguir al club de sus amores en todas sus competencias. Sentía un gran rechazo hacia su eterno rival, Boca Juniors, y especialmente hacia Diego Armando Maradona, de quien decía que no era el mejor del mundo, y lo calificó de \"porquería\" cuando decidió firmar contrato con el club xeneize en lugar de hacerlo para River. Siempre intentó alejarse de los medios, aunque siempre se sintió el rumor de que cobraba dinero para dar entrevistas', 'prof6.jpg', 3),
(11, 'María de las Mercedes Bernardina', ' Bolla Aponte de Murano', 'Yiya Murano', '6', ' prestamista argentina acusada de al menos tres cargos de homicidio y estafa en 1979 en Argentina. Condenada por estos crímenes, estuvo presa durante dieciséis años. Su caso policial es uno de los más famosos en la historia criminalista argentina, tomando mucha repercusión y manteniéndose a lo largo de los años.1? Fue una asesina en serie organizada, motivada por el lucro.\r\n\r\n<p>Según el propio hijo de Murano, Martín Murano, su madre falleció sola en un geriátrico del barrio Belgrano, en Buenos Aires el 23 de junio de 2014, aunque su muerte pasó desapercibida en su momento ante los medios.2', 'prof4.jpg', 4),
(12, 'Haydée Luján ', 'Martínez', 'Gorda Matosa', '7', 'Reconocida simpatizante argentina del club de fútbol River Plate. Era la líder de la parcialidad millonaria hasta el surgimiento de los barrabravas, quienes en las últimas décadas del siglo XX se adueñaron de las tribunas.\r\n\r\n<p>Durante toda su vida se dedicó a vender lotería,1? motivo que le facilitaba seguir al club de sus amores en todas sus competencias. Sentía un gran rechazo hacia su eterno rival, Boca Juniors, y especialmente hacia Diego Armando Maradona, de quien decía que no era el mejor del mundo, y lo calificó de \"porquería\" cuando decidió firmar contrato con el club xeneize en lugar de hacerlo para River. Siempre intentó alejarse de los medios, aunque siempre se sintió el rumor de que cobraba dinero para dar entrevistas', 'prof6.jpg', 4),
(13, 'Rosa María Juana ', 'Martínez Suárez', 'Mirta Legrand', '8', 'Tenía dos hermanos, el mayor fue el director cinematográfico José A. Martínez Suárez (1925-2019)15? y su hermana gemela fue la actriz retirada Silvia Legrand (seudónimo de María Aurelia Martínez).2? Desde pequeñas se les atribuyó el apelativo de «Chiquita» a Rosa María Juana y de «Gordi» a María Aurelia, que luego sería modificado por «Goldi».16?\r\n\r\n<p>Las hermanas realizaron sus estudios primarios en la Escuela Fiscal n.º 178 de Santa Fe y durante su niñez estuvieron acompañadas por sus niñeras Elena y Bruna Ambrossi.17? Su hermana Silvia recordó en un testimonio a Néstor Montenegro: \"Chiquita siempre le pedía a Bruna, cuando la peinaba: \'Bruna, haceme el moño más grande a mí\'. Era muy coqueta, siempre quería lucir bien. Mamá nos vestía a las dos iguales, éramos un dibujito\".', 'profm.jpg', 3),
(14, 'Edmundo ', 'Dantes', 'El Conde de Montectristo', '9', 'Nacio en 1796 en Marsella.\r\n<br>Detenido el 24 de febrero de 1815, es juzgado sumariamente y enviado a la prisión del castillo de If. Desesperado hasta el punto de considerar el suicidio, languidece en una celda cercana a la de otro prisionero, el abate Faria, que lleva cinco años excavando un túnel para fugarse. Pero sus cálculos son erróneos, y el túnel lo conduce a la celda de Dantés. El abate se hace amigo del marino y le confía la existencia de un tesoro escondido en la isla de Montecristo. \r\n<br>El 28 de febrero de 1829, Faria muere en su celda tras un ataque cerebral fulminante. Edmundo aprovecha la ocasión: se introduce en el saco mortuorio y es arrojado al mar con el cadáver. Así consigue escaparse tras 14 años de cautividad .', 'dantes.jpg', 1),
(15, 'Arquimides Rafael', ' Puccio', 'El Loco de la Escoba', '10', '(Barracas, Ciudad de Buenos Aires, 14 de septiembre de 1929-General Pico, La Pampa, 4 de mayo de 2013) fue un secuestrador y asesino en serie argentino, líder de una banda criminal que aterrorizó a la Argentina a principios de la década de los 80. Puccio fue también contador, abogado,[1]? empresario, miembro de la SIDE e integrante de la Alianza Anticomunista Argentina. También integró el Batallón de Inteligencia 601[2]? y fue miembro del Movimiento Nacionalista Tacuara.[3]? Lideró y perpetró los secuestros y posteriores asesinatos de los empresarios Ricardo Manoukian, Eduardo Aulet y Emilio Naum. Puccio fue descubierto por la policía al momento de cobrar el rescate de la empresaria Nélida Bollini de Prado, gracias a la denuncia de los familiares de la víctima, quien logró sobrevivir.\r\n<br> murio en General Pico', 'arquimides.jpg', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `palmares`
--

CREATE TABLE `palmares` (
  `id` int(11) NOT NULL,
  `dni` varchar(12) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `anio` int(11) NOT NULL,
  `detalle` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `palmares`
--

INSERT INTO `palmares` (`id`, `dni`, `anio`, `detalle`) VALUES
(0, '10', 2010, 'Robo en una despensa del barrio'),
(1, '2', 2022, '1° puesto en el Campenato Zonal Cordobes'),
(2, '1', 2022, '1° puesto en el Campenato Zonal Cordobes'),
(3, '2', 1935, 'Salio Campeón en Rosario despues de dos años de disputar el torneo'),
(4, '2', 1999, 'Primer Puesto del 1° Campeonato Argentino de Corte de Pelo'),
(5, '2', 2021, 'Distinción al mejor estilista '),
(6, '3', 2017, 'sub campeön del torneo Los paradura de America'),
(7, '4', 2022, '1° puesto en el Campenato Zonal Cordobes'),
(8, '4', 2017, 'sub campeön del torneo Los paradura de America'),
(9, '5', 2001, '1 Puesto en el Baile de la Fiesta Provincial del Trigo. Eduardo Castex'),
(10, '5', 2221, '3° puesto en Doma. Jesus Maria'),
(11, '5', 2022, 'Premio Honorifico de Tiro a Pampa Traviesa'),
(12, '5', 2022, '1° puesto en el Campenato Zonal Cordobes'),
(13, '6', 1998, 'Primer premio de pasteleria argentina'),
(14, '6', 2020, 'Primer premio del campeonato de Masas Finas'),
(15, '6', 2018, 'Es invitada a la mesa de Mirta'),
(16, '7', 2018, 'Participo desde el mas alla a la desaparción de CABJ el 9/12/2019'),
(17, '7', 2019, 'Gana el premio Renault en el cual recibe los modelos historicos 9 - 12 - 18'),
(18, '8', 2022, 'Gano el premio de logevidad contra la Reina Isabel II'),
(19, '8', 1993, 'Gano Martin fierro de oro'),
(27, '9', 1915, 'Premio al juicio mas arreglado en la novela de Alejandro Dumas'),
(28, '9', 1829, 'Premio al mejor actor de reparto pasándose por muerto'),
(29, '10', 1973, '1 Puesto en ser acusado por el secuestro del empresario de Bonafide, Enrique Pels, en 1973.'),
(30, '10', 1982, '1 puesto en diarios por la desapareción de Ricardo Manoukian'),
(31, '10', 1983, 'Primicia en noticias porque el clan secuestró a Eduardo Aulet');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `partidos_canicas`
--

CREATE TABLE `partidos_canicas` (
  `id_partido` int(11) NOT NULL,
  `id_equipo_A` int(11) NOT NULL,
  `id_equipo_B` int(11) NOT NULL,
  `puntos_A` int(11) NOT NULL,
  `puntos_B` int(11) NOT NULL,
  `modalidad` varchar(10) NOT NULL,
  `id_categoria` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `partidos_canicas`
--

INSERT INTO `partidos_canicas` (`id_partido`, `id_equipo_A`, `id_equipo_B`, `puntos_A`, `puntos_B`, `modalidad`, `id_categoria`) VALUES
(1, 1, 2, 1, 2, 'C1', 1),
(2, 1, 2, 3, 7, 'C2', 1),
(3, 1, 3, 2, 5, 'C1', 1),
(4, 1, 3, 4, 2, 'C2', 1),
(5, 1, 4, 4, 2, 'C1', 1),
(6, 1, 4, 3, 2, 'C2', 1),
(7, 1, 5, 5, 2, 'C1', 1),
(8, 1, 5, 2, 2, 'C2', 1),
(9, 1, 6, 4, 8, 'C1', 1),
(10, 1, 6, 3, 3, 'C2', 1),
(11, 2, 3, 7, 2, 'C1', 1),
(12, 2, 3, 3, 3, 'C2', 1),
(13, 2, 4, 4, 2, 'C1', 1),
(14, 2, 4, 6, 2, 'C2', 1),
(15, 2, 5, 3, 3, 'C1', 1),
(16, 2, 5, 4, 2, 'C2', 1),
(17, 2, 6, 5, 3, 'C1', 1),
(18, 2, 6, 2, 1, 'C2', 1),
(19, 3, 4, 2, 2, 'C1', 1),
(20, 3, 4, 5, 1, 'C2', 1),
(21, 3, 5, 3, 3, 'C1', 1),
(22, 3, 5, 4, 2, 'C2', 1),
(23, 3, 6, 2, 3, 'C1', 1),
(24, 3, 6, 2, 7, 'C2', 1),
(25, 4, 5, 3, 3, 'C1', 1),
(26, 4, 5, 4, 4, 'C2', 1),
(27, 4, 6, 33, 2, 'C1', 1),
(28, 4, 6, 2, 3, 'C2', 1),
(29, 5, 6, 5, 5, 'C1', 1),
(30, 5, 6, 1, 0, 'C2', 1),
(31, 2, 1, 2, 2, 'C1', 1),
(32, 2, 1, 4, 3, 'C2', 1),
(33, 3, 1, 2, 2, 'C1', 1),
(34, 3, 1, 2, 2, 'C2', 1),
(35, 4, 1, 2, 3, 'C1', 1),
(36, 4, 1, 2, 2, 'C2', 1),
(37, 5, 1, 2, 1, 'C1', 1),
(38, 5, 1, 2, 2, 'C2', 1),
(39, 6, 1, 2, 2, 'C1', 1),
(40, 6, 1, 2, 2, 'C2', 1),
(41, 3, 2, 1, 4, 'C1', 1),
(42, 3, 2, 2, 4, 'C2', 1),
(43, 4, 2, 3, 5, 'C1', 1),
(44, 4, 2, 1, 1, 'C2', 1),
(45, 5, 2, 1, 1, 'C1', 1),
(46, 5, 2, 2, 2, 'C2', 1),
(47, 6, 2, 2, 4, 'C1', 1),
(48, 6, 2, 3, 3, 'C2', 1),
(49, 4, 3, 1, 1, 'C1', 1),
(50, 4, 3, 1, 1, 'C2', 1),
(51, 5, 3, 2, 1, 'C1', 1),
(52, 5, 3, 3, 3, 'C2', 1),
(53, 6, 3, 2, 2, 'C1', 1),
(54, 6, 3, 2, 2, 'C2', 1),
(55, 5, 4, 3, 2, 'C1', 1),
(56, 5, 4, 2, 3, 'C2', 1),
(57, 6, 3, 2, 1, 'C1', 1),
(58, 6, 3, 4, 2, 'C2', 1),
(59, 5, 4, 2, 2, 'C1', 1),
(60, 5, 4, 1, 1, 'C2', 1),
(61, 6, 4, 2, 1, 'C1', 1),
(62, 6, 6, 3, 6, 'C2', 1),
(63, 6, 5, 2, 2, 'C1', 1),
(64, 6, 5, 3, 23, 'C2', 1),
(101, 1, 2, 1, 2, 'C1', 3),
(102, 1, 2, 3, 7, 'C2', 3),
(103, 1, 3, 2, 5, 'C1', 3),
(104, 1, 3, 4, 2, 'C2', 3),
(105, 1, 4, 4, 2, 'C1', 3),
(106, 1, 4, 3, 2, 'C2', 3),
(107, 1, 5, 5, 2, 'C1', 3),
(108, 1, 5, 2, 2, 'C2', 3),
(109, 1, 6, 4, 8, 'C1', 3),
(110, 1, 6, 3, 3, 'C2', 3),
(111, 2, 3, 7, 2, 'C1', 3),
(112, 2, 3, 32, 3, 'C2', 3),
(113, 2, 4, 4, 2, 'C1', 3),
(114, 2, 4, 6, 2, 'C2', 3),
(115, 2, 5, 32, 3, 'C1', 3),
(116, 2, 5, 4, 2, 'C2', 3),
(117, 2, 6, 5, 3, 'C1', 3),
(118, 2, 6, 2, 1, 'C2', 3),
(119, 3, 4, 2, 2, 'C1', 3),
(120, 3, 4, 5, 1, 'C2', 3),
(121, 3, 5, 3, 3, 'C1', 3),
(122, 3, 5, 2, 2, 'C2', 3),
(123, 3, 6, 2, 3, 'C1', 3),
(124, 3, 6, 2, 7, 'C2', 3),
(125, 4, 5, 3, 3, 'C1', 3),
(126, 4, 5, 4, 4, 'C2', 3),
(127, 4, 6, 33, 2, 'C1', 3),
(128, 4, 6, 22, 3, 'C2', 3),
(129, 5, 6, 5, 5, 'C1', 3),
(130, 5, 6, 1, 0, 'C2', 3),
(131, 2, 1, 2, 2, 'C1', 3),
(132, 2, 1, 4, 32, 'C2', 3),
(133, 3, 1, 2, 2, 'C1', 3),
(134, 3, 1, 2, 2, 'C2', 3),
(135, 4, 1, 2, 3, 'C1', 3),
(136, 4, 1, 2, 2, 'C2', 3),
(137, 5, 1, 2, 1, 'C1', 3),
(138, 5, 1, 2, 2, 'C2', 3),
(139, 6, 1, 1, 2, 'C1', 3),
(140, 6, 1, 2, 2, 'C2', 3),
(141, 3, 2, 1, 4, 'C1', 3),
(142, 3, 2, 2, 2, 'C2', 3),
(143, 4, 2, 3, 5, 'C1', 3),
(144, 4, 2, 1, 1, 'C2', 3),
(145, 5, 2, 13, 1, 'C1', 3),
(146, 5, 2, 2, 12, 'C2', 3),
(147, 6, 2, 2, 4, 'C1', 3),
(148, 6, 2, 3, 3, 'C2', 3),
(149, 4, 3, 1, 1, 'C1', 3),
(150, 4, 3, 13, 1, 'C2', 3),
(151, 5, 3, 2, 1, 'C1', 3),
(152, 5, 3, 3, 3, 'C2', 3),
(153, 6, 3, 23, 2, 'C1', 3),
(154, 6, 3, 2, 2, 'C2', 3),
(155, 5, 4, 33, 2, 'C1', 3),
(156, 5, 4, 2, 3, 'C2', 3),
(157, 6, 3, 2, 1, 'C1', 3),
(158, 6, 3, 4, 2, 'C2', 3),
(159, 5, 4, 23, 2, 'C1', 3),
(160, 5, 4, 1, 1, 'C2', 3),
(161, 6, 4, 2, 1, 'C1', 3),
(162, 6, 6, 3, 6, 'C2', 3),
(163, 6, 5, 2, 2, 'C1', 3),
(164, 6, 5, 33, 23, 'C2', 3),
(166, 1, 2, 1, 1, 'C1', 2),
(167, 1, 2, 12, 3, 'C1', 2),
(168, 1, 2, 1, 1, 'C1', 2);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `equipos`
--
ALTER TABLE `equipos`
  ADD PRIMARY KEY (`id_equipo`);

--
-- Indices de la tabla `item_menu`
--
ALTER TABLE `item_menu`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `jugadores`
--
ALTER TABLE `jugadores`
  ADD PRIMARY KEY (`id_jugador`);

--
-- Indices de la tabla `palmares`
--
ALTER TABLE `palmares`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indices de la tabla `partidos_canicas`
--
ALTER TABLE `partidos_canicas`
  ADD PRIMARY KEY (`id_partido`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `equipos`
--
ALTER TABLE `equipos`
  MODIFY `id_equipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `item_menu`
--
ALTER TABLE `item_menu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `jugadores`
--
ALTER TABLE `jugadores`
  MODIFY `id_jugador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `partidos_canicas`
--
ALTER TABLE `partidos_canicas`
  MODIFY `id_partido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=169;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
