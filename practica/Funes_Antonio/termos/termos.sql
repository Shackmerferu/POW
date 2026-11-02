-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-10-2026 a las 19:41:28
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
-- Base de datos: `termos`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `localidades_la_pampa`
--

CREATE TABLE `localidades_la_pampa` (
  `id` int(11) NOT NULL,
  `nombre_ciudad` varchar(100) DEFAULT NULL,
  `id_provincia` int(11) NOT NULL,
  `latitud` decimal(9,6) DEFAULT NULL,
  `longitud` decimal(9,6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `localidades_la_pampa`
--

INSERT INTO `localidades_la_pampa` (`id`, `nombre_ciudad`, `id_provincia`, `latitud`, `longitud`) VALUES
(1, 'Santa Rosa', 5, -36.620000, -64.290000),
(2, 'General Pico', 5, -35.650000, -63.750000),
(3, 'General Acha', 5, -37.383300, -64.616700),
(4, 'Eduardo Castex', 5, -35.883300, -64.066700),
(5, 'Realicó', 5, -35.033300, -64.266700),
(6, 'Intendente Alvear', 5, -35.233300, -63.583300),
(7, 'Veinticinco de Mayo', 5, -36.783300, -67.716700),
(8, 'Victorica', 5, -36.216700, -65.433300),
(9, 'Guatraché', 5, -37.666700, -63.583300),
(10, 'Macachín', 5, -37.133300, -63.666700),
(11, 'Ingeniero Luiggi', 5, -35.416700, -64.466700),
(12, 'Quemú Quemú', 5, -35.750000, -63.566700),
(13, 'Catriló', 5, -36.466700, -63.866700),
(14, 'Rancul', 5, -35.066700, -64.683300),
(15, 'Trenel', 5, -35.866700, -63.733300),
(16, 'Colonia Barón', 5, -35.666700, -63.833300),
(17, 'Winifreda', 5, -35.933300, -64.216700),
(18, 'General San Martín', 5, -37.983300, -63.566700),
(19, 'Jacinto Arauz', 5, -38.066700, -63.433300),
(20, 'Abramo', 5, -37.883330, -63.850000),
(21, 'Adolfo Van Praet', 5, -35.016670, -64.050000),
(22, 'Agustoni', 5, -35.783330, -63.400000),
(23, 'Algarrobo del Águila', 5, -36.433330, -67.150000),
(24, 'Alpachiri', 5, -37.366670, -63.766670),
(25, 'Alta Italia', 5, -35.366670, -64.133330),
(26, 'Anguil', 5, -36.516670, -64.016670),
(27, 'Arata', 5, -35.633330, -64.333330),
(28, 'Ataliva Roca', 5, -37.016670, -64.283330),
(29, 'Bernasconi', 5, -37.883330, -63.883330),
(30, 'Caleufú', 5, -35.900000, -64.566670),
(31, 'Carro Quemado', 5, -36.316670, -65.016670),
(32, 'Chacharramendi', 5, -37.266670, -66.016670),
(33, 'Colonia Santa María', 5, -37.883330, -63.716670),
(34, 'Doblas', 5, -36.616670, -63.816670),
(35, 'Embajador Martini', 5, -35.383330, -64.266670),
(36, 'La Adela', 5, -39.466670, -63.366670),
(37, 'La Humada', 5, -36.966670, -67.933330),
(38, 'Metileo', 5, -35.716670, -63.716670),
(39, 'Pichi Huinca', 5, -35.666670, -64.566670),
(40, 'Quehué', 5, -37.566670, -64.600000);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personas`
--

CREATE TABLE `personas` (
  `dni` int(11) NOT NULL,
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `direccion` varchar(150) NOT NULL,
  `ciudad` int(11) NOT NULL,
  `provincia` int(11) NOT NULL,
  `email` varchar(200) NOT NULL,
  `telefono` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `personas`
--

INSERT INTO `personas` (`dni`, `id`, `nombre`, `apellido`, `direccion`, `ciudad`, `provincia`, `email`, `telefono`) VALUES
(10123458, 1, 'Lucas', 'Morales', 'Av. Belgrano 101', 12, 5, 'lucas.morales41@mail.com', '2302-500041'),
(10234567, 2, 'Juan', 'Pérez', 'Calle Mitre 123', 5, 5, 'juan.perez1@mail.com', '2302-400001'),
(11234569, 3, 'Mariana', 'Paredes', 'Calle Sarmiento 202', 7, 5, 'mariana.paredes42@mail.com', '2302-500042'),
(11345678, 4, 'María', 'Gómez', 'Av. San Martín 456', 12, 5, 'maria.gomez2@mail.com', '2302-400002'),
(12345670, 5, 'Hernán', 'Roldán', 'Av. Roca 303', 25, 5, 'hernan.roldan43@mail.com', '2302-500043'),
(12456789, 6, 'Carlos', 'López', 'Belgrano 789', 27, 5, 'carlos.lopez3@mail.com', '2302-400003'),
(13456781, 7, 'Claudia', 'Méndez        ', 'Mitre 404        ', 3, 5, 'claudia.mendez44@mail.com        ', '2302-500044'),
(14567892, 8, 'Esteban', 'Iglesias', 'Italia 505', 18, 5, 'esteban.iglesias45@mail.com', '2302-500045'),
(14678901, 9, 'Luis', 'Fernández', '9 de Julio 654', 19, 5, 'luis.fernandez5@mail.com', '2302-400005'),
(15678903, 10, 'Lorena', 'Soto', 'España 606', 30, 5, 'lorena.soto46@mail.com', '2302-500046'),
(15789012, 11, 'Lucía', 'Rodríguez', 'España 852', 40, 5, 'lucia.rodriguez6@mail.com', '2302-400006'),
(16789014, 12, 'Pablo', 'Cáceres', 'Uruguay 707', 1, 5, 'pablo.caceres47@mail.com', '2302-500047'),
(16890123, 13, 'Diego', 'Sánchez', 'Italia 741', 8, 5, 'diego.sanchez7@mail.com', '2302-400007'),
(17890125, 14, 'Verónica', 'Bustos', 'Chile 808', 14, 5, 'veronica.bustos48@mail.com', '2302-500048'),
(17901234, 15, 'Paula', 'Romero', 'Uruguay 963', 14, 5, 'paula.romero8@mail.com', '2302-400008'),
(18123456, 16, 'Martín', 'Suárez', 'Chile 147', 22, 5, 'martin.suarez9@mail.com', '2302-400009'),
(18901236, 17, 'Ricardo', 'Arias', 'Perú 909', 9, 5, 'ricardo.arias49@mail.com', '2302-500049'),
(19012347, 18, 'Carla', 'Zárate', 'Bolivia 111', 21, 5, 'carla.zarate50@mail.com', '2302-500050'),
(19234567, 19, 'Florencia', 'Molina', 'Paraguay 258', 1, 5, 'florencia.molina10@mail.com', '2302-400010'),
(20123458, 20, 'Sergio', 'Villalba', 'México 222', 6, 5, 'sergio.villalba51@mail.com', '2302-500051'),
(20345678, 21, 'Javier', 'Castro', 'Perú 369', 16, 5, 'javier.castro11@mail.com', '2302-400011'),
(21234569, 22, 'Natalia', 'Carrizo', 'Brasil 333', 27, 5, 'natalia.carrizo52@mail.com', '2302-500052'),
(21456789, 23, 'Sofía', 'Ortiz', 'Bolivia 951', 30, 5, 'sofia.ortiz12@mail.com', '2302-400012'),
(22345670, 24, 'Marcos', 'Perdomo', 'Colombia 444', 34, 5, 'marcos.perdomo53@mail.com', '2302-500053'),
(22567890, 25, 'Pablo', 'Ramos', 'México 753', 10, 5, 'pablo.ramos13@mail.com', '2302-400013'),
(23456781, 26, 'Andrea', 'Ferreyra', 'Venezuela 555', 11, 5, 'andrea.ferreyra54@mail.com', '2302-500054'),
(23678901, 27, 'Valeria', 'Acosta', 'Brasil 852', 7, 5, 'valeria.acosta14@mail.com', '2302-400014'),
(24567892, 28, 'Gustavo', 'Barrios', 'Ecuador 666', 19, 5, 'gustavo.barrios55@mail.com', '2302-500055'),
(24789012, 29, 'Nicolás', 'Benítez', 'Colombia 456', 35, 5, 'nicolas.benitez15@mail.com', '2302-400015'),
(25678903, 30, 'Paola', 'Quiñones', 'Paraguay 777', 4, 5, 'paola.quinones56@mail.com', '2302-500056'),
(25890123, 31, 'Camila', 'Herrera', 'Venezuela 159', 18, 5, 'camila.herrera16@mail.com', '2302-400016'),
(26789014, 32, 'Alejandro', 'Ojeda', 'Cuba 888', 38, 5, 'alejandro.ojeda57@mail.com', '2302-500057'),
(26901234, 33, 'Federico', 'Aguirre', 'Ecuador 357', 24, 5, 'federico.aguirre17@mail.com', '2302-400017'),
(27123456, 34, 'Agustina', 'Ponce', 'Cuba 951', 11, 5, 'agustina.ponce18@mail.com', '2302-400018'),
(27890125, 35, 'Silvina', 'Villarreal', 'Panamá 999', 16, 5, 'silvina.villarreal58@mail.com', '2302-500058'),
(28234567, 36, 'Matías', 'Navarro', 'Haití 258', 29, 5, 'matias.navarro19@mail.com', '2302-400019'),
(28901236, 37, 'Cristian', 'Funes', 'Honduras 121', 22, 5, 'cristian.funes59@mail.com', '2302-500059'),
(29012347, 38, 'Romina', 'Salas', 'Nicaragua 232', 8, 5, 'romina.salas60@mail.com', '2302-500060'),
(29345678, 39, 'Julieta', 'Vega', 'Panamá 654', 6, 5, 'julieta.vega20@mail.com', '2302-400020'),
(30123458, 40, 'Emanuel', 'Toledo', 'Costa Rica 343', 29, 5, 'emanuel.toledo61@mail.com', '2302-500061'),
(30456789, 41, 'Andrés', 'Silva', 'Honduras 741', 33, 5, 'andres.silva21@mail.com', '2302-400021'),
(31234569, 42, 'Florencia', 'Moya', 'Guatemala 454', 2, 5, 'florencia.moya62@mail.com', '2302-500062'),
(31567890, 43, 'Carolina', 'Godoy', 'Nicaragua 369', 21, 5, 'carolina.godoy22@mail.com', '2302-400022'),
(32345670, 44, 'Iván', 'Palacios', 'El Salvador 565', 20, 5, 'ivan.palacios63@mail.com', '2302-500063'),
(32678901, 45, 'Bruno', 'Correa', 'Costa Rica 123', 15, 5, 'bruno.correa23@mail.com', '2302-400023'),
(33456781, 46, 'Agustina', 'Luján', 'Surinam 676', 33, 5, 'agustina.lujan64@mail.com', '2302-500064'),
(33789012, 47, 'Micaela', 'Ibarra', 'El Salvador 456', 2, 5, 'micaela.ibarra24@mail.com', '2302-400024'),
(34567892, 48, 'Federico', 'Escobar', 'Guyana 787', 10, 5, 'federico.escobar65@mail.com', '2302-500065'),
(34890123, 49, 'Sebastián', 'Campos', 'Guatemala 789', 17, 5, 'sebastian.campos25@mail.com', '2302-400025'),
(35678903, 50, 'Daniela', 'Vázquez', 'Trinidad 898', 31, 5, 'daniela.vazquez66@mail.com', '2302-500066'),
(35901234, 51, 'Natalia', 'Ríos', 'Surinam 321', 9, 5, 'natalia.rios26@mail.com', '2302-400026'),
(36123456, 52, 'Gonzalo', 'Peralta', 'Guyana 654', 38, 5, 'gonzalo.peralta27@mail.com', '2302-400027'),
(36789014, 53, 'Brenda', 'Pinto', 'Jamaica 909', 13, 5, 'brenda.pinto67@mail.com', '2302-500067'),
(37234567, 54, 'Rocío', 'Figueroa', 'Trinidad 852', 13, 5, 'rocio.figueroa28@mail.com', '2302-400028'),
(37890125, 55, 'Matías', 'Coronel', 'Barbados 212', 24, 5, 'matias.coronel68@mail.com', '2302-500068'),
(38345678, 56, 'Leandro', 'Luna', 'Jamaica 963', 26, 5, 'leandro.luna29@mail.com', '2302-400029'),
(38901236, 57, 'Rocío', 'Leiva', 'Bahamas 323', 28, 5, 'rocio.leiva69@mail.com', '2302-500069'),
(39012347, 58, 'Leonardo', 'Miranda', 'Antigua 434', 17, 5, 'leonardo.miranda70@mail.com', '2302-500070'),
(39456789, 59, 'Melina', 'Prieto', 'Barbados 147', 32, 5, 'melina.prieto30@mail.com', '2302-400030'),
(40123458, 60, 'Cintia', 'Benítez', 'Dominica 545', 36, 5, 'cintia.benitez71@mail.com', '2302-500071'),
(40567890, 61, 'Ezequiel', 'Bravo', 'Bahamas 258', 20, 5, 'ezequiel.bravo31@mail.com', '2302-400031'),
(40678903, 62, 'Ramón', 'Córdoba', 'San Vicente 101', 23, 5, 'ramon.cordoba76@mail.com', '2302-500076'),
(41123456, 63, 'Marina', 'Ojeda', 'Aruba 456', 28, 5, 'marina.ojeda36@mail.com', '2302-400036'),
(41234569, 64, 'Nicolás', 'Reinoso', 'Granada 656', 5, 5, 'nicolas.reinoso72@mail.com', '2302-500072'),
(41345670, 65, 'Mónica', 'Velázquez', 'San José 999', 3, 5, 'monica.velazquez93@mail.com', '2302-500093'),
(41456781, 66, 'Franco', 'Paz', 'Anguila 909', 27, 5, 'franco.paz84@mail.com', '2302-500084'),
(41678901, 67, 'Daniela', 'Cabrera', 'Antigua 369', 4, 5, 'daniela.cabrera32@mail.com', '2302-400032'),
(41789014, 68, 'Eliana', 'Bustamante', 'Santa Lucía 202', 39, 5, 'eliana.bustamante77@mail.com', '2302-500077'),
(41789015, 69, 'Lorena', 'Villagra', 'San Carlos 454', 12, 5, 'lorena.villagra97@mail.com', '2302-500097'),
(41890125, 70, 'Raúl', 'Ocampo', 'San Martín 444', 8, 5, 'raul.ocampo88@mail.com', '2302-500088'),
(42123458, 71, 'Vanesa', 'Cuello', 'Islas Caimán 606', 11, 5, 'vanesa.cuello81@mail.com', '2302-500081'),
(42234567, 72, 'Tomás', 'Reyes', 'Curazao 159', 31, 5, 'tomas.reyes37@mail.com', '2302-400037'),
(42345670, 73, 'Miriam', 'López', 'Belice 767', 26, 5, 'miriam.lopez73@mail.com', '2302-500073'),
(42456781, 74, 'Ariel', 'Torres', 'San Miguel 121', 25, 5, 'ariel.torres94@mail.com', '2302-500094'),
(42567892, 75, 'Débora', 'Medina', 'Martinica 111', 14, 5, 'debora.medina85@mail.com', '2302-500085'),
(42789012, 76, 'Iván', 'Soria', 'Dominica 951', 37, 5, 'ivan.soria33@mail.com', '2302-400033'),
(42890125, 77, 'Oscar', 'Saavedra', 'San Cristóbal 303', 32, 5, 'oscar.saavedra78@mail.com', '2302-500078'),
(42890126, 78, 'Pablo', 'Moreno', 'San Benito 565', 20, 5, 'pablo.moreno98@mail.com', '2302-500098'),
(42901236, 79, 'Lourdes', 'Vera', 'San Eustaquio 555', 1, 5, 'lourdes.vera89@mail.com', '2302-500089'),
(43012347, 80, 'Marcelo', 'Gaitán', 'San Pedro 666', 30, 5, 'marcelo.gaitan90@mail.com', '2302-500090'),
(43234569, 81, 'Ignacio', 'Rivero', 'Islas Turcas 707', 6, 5, 'ignacio.rivero82@mail.com', '2302-500082'),
(43345678, 82, 'Cecilia', 'Ledesma', 'San Vicente 357', 23, 5, 'cecilia.ledesma38@mail.com', '2302-400038'),
(43456781, 83, 'Hugo', 'Montenegro', 'Aruba 878', 15, 5, 'hugo.montenegro74@mail.com', '2302-500074'),
(43567892, 84, 'Gabriela', 'Herrero', 'San Rafael 232', 9, 5, 'gabriela.herrero95@mail.com', '2302-500095'),
(43678903, 85, 'Joaquín', 'Nieto', 'Guadalupe 222', 34, 5, 'joaquin.nieto86@mail.com', '2302-500086'),
(43890123, 86, 'Noelia', 'Paz', 'Granada 753', 25, 5, 'noelia.paz34@mail.com', '2302-400034'),
(43901236, 87, 'Maribel', 'Quiroga', 'Barbuda 404', 35, 5, 'maribel.quiroga79@mail.com', '2302-500079'),
(43901237, 88, 'Carolina', 'Álvarez', 'San Isidro 676', 28, 5, 'carolina.alvarez99@mail.com', '2302-500099'),
(44012347, 89, 'Adrián', 'Linares', 'Montserrat 505', 40, 5, 'adrian.linares80@mail.com', '2302-500080'),
(44123458, 90, 'Yamila', 'Navarrete', 'San Pablo 777', 22, 5, 'yamila.navarrete91@mail.com', '2302-500091'),
(44345670, 91, 'Paula', 'Rivas', 'Islas Vírgenes 808', 18, 5, 'paula.rivas83@mail.com', '2302-500083'),
(44456789, 92, 'Facundo', 'Meza', 'Santa Lucía 951', 36, 5, 'facundo.meza39@mail.com', '2302-400039'),
(44567892, 93, 'Patricia', 'Almada', 'Curazao 989', 37, 5, 'patricia.almada75@mail.com', '2302-500075'),
(44678903, 94, 'Mauricio', 'Silvestre', 'San Juan 343', 31, 5, 'mauricio.silvestre96@mail.com', '2302-500096'),
(44789014, 95, 'Yesica', 'Serrano', 'San Bartolomé 333', 19, 5, 'yesica.serrano87@mail.com', '2302-500087'),
(44901234, 96, 'Ramiro', 'Quiroga', 'Belice 852', 34, 5, 'ramiro.quiroga35@mail.com', '2302-400035'),
(45000001, 97, 'Matilde', 'Ramos', 'San Vicente 787', 16, 5, 'matilde.ramos100@mail.com', '2302-500100'),
(45234569, 98, 'Fabián', 'Cruz', 'San Andrés 888', 17, 5, 'fabian.cruz92@mail.com', '2302-500092'),
(45500000, 99, 'Belén', 'Arce', 'San Cristóbal 258', 39, 5, 'belen.arce40@mail.com', '2302-400040');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `titulo` text NOT NULL,
  `titulo_imagen` text NOT NULL,
  `descripcion` text NOT NULL,
  `texto_alternativo` text NOT NULL,
  `descripcion_larga` text NOT NULL,
  `imagen` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `titulo`, `titulo_imagen`, `descripcion`, `texto_alternativo`, `descripcion_larga`, `imagen`) VALUES
(1, 'Hudson Termo Hudson Acero Pulido De Acero Inoxidable 1 Litro', 'Hudson Termo Hudson Acero Pulido De Acero Inoxidable 1 Litro', 'Disfrutá tus bebidas siempre a la temperatura ideal con el Termo de Acero Inoxidable 1 Litro. Este termo combina diseño elegante y máxima durabilidad, ideal para compartir mates, café o infusiones en cualquier lugar. Su acabado en acero pulido le otorga un brillo sofisticado y fácil de limpiar, convirtiéndolo en el compañero perfecto para el hogar, la oficina o tus aventuras al aire libre.\r\n\r\nElaborado íntegramente en acero inoxidable, este termo garantiza una excelente conservación de la temperatura, manteniendo tus bebidas calientes o frías por horas. Su tapón hermético evita derrames y facilita el servido preciso, mientras que la boca ancha permite una limpieza sencilla y el llenado cómodo.', 'Termo Hudson Acero Pulido De Acero Inoxidable 1 Litro', 'Ficha Técnica\r\n\r\n    Capacidad: 1 litro\r\n    Material: Acero inoxidable\r\n    Acabado: Pulido brillante\r\n    Aislación térmica: Doble pared\r\n    Tapón: Rosca hermética antigoteo\r\n    Apto para: Líquidos calientes y fríos\r\n    Boca: Ancha para fácil llenado y limpieza\r\n    Origen: China\r\n\r\nUso correcto y cuidados\r\n\r\n    Antes de usar por primera vez, lavar con agua tibia y detergente suave.\r\n    Para mantener la temperatura por más tiempo, precalentá con agua caliente o enfriá con agua fría según la bebida a consumir.\r\n    Verté la bebida deseada hasta 1 cm por debajo del borde de la boca.\r\n    Cerrá bien el tapón para evitar fugas.\r\n    No utilices productos abrasivos ni limpiadores metálicos para evitar rayaduras.\r\n    No apto para microondas ni lavavajillas. Lavar a mano y secar bien antes de guardar.\r\n    No almacenar bebidas carbonatadas o lácteos por períodos prolongados.', '1793211908-3.jpg'),
(20, 'Hudson Termo Hudson Acero Negro De Acero Inoxidable 750 Ml', 'Hudson Termo Hudson Acero Negro De Acero Inoxidable 750 Ml', 'Descubrí el Termo Negro de Acero Inoxidable de 750 ml: tu compañero confiable para cada momento\r\n\r\nSi buscás un termo resistente, elegante y práctico para tu rutina diaria, el Termo de Acero Negro es la elección ideal. Su diseño sofisticado en color negro y construcción en acero inoxidable lo convierten en el aliado perfecto para mantener tus bebidas calientes o frías durante horas, ya sea en casa, en la oficina o al aire libre.', 'Termo Hudson Acero Negro De Acero Inoxidable 750 Ml', 'Características destacadas\r\n\r\n    Conservación térmica superior: Gracias a su doble pared de acero inoxidable, mantiene la temperatura de tus bebidas calientes por varias horas.\r\n    Diseño moderno y funcional: El acabado negro mate le otorga un estilo distinguido, combinando perfectamente con cualquier entorno.\r\n    Capacidad ideal: Con 750 ml, es el tamaño perfecto para acompañarte en tus actividades diarias, viajes o encuentros con amigos.\r\n    Cierre hermético: Su tapa a rosca evita derrames, garantizando un transporte seguro.\r\n    Material seguro: Libre de BPA, pensado para el consumo de bebidas sin alterar su sabor.\r\n\r\nFicha Técnica\r\n\r\n    Capacidad: 750 ml\r\n    Material: Acero inoxidable de alta calidad (doble pared)\r\n    Color: Negro mate\r\n    Aislación: Térmica, doble pared al vacío\r\n    Cierre: Tapa a rosca hermética\r\n    Libre de BPA: Sí\r\n    Apto para lavavajillas: No (lavado manual recomendado)\r\n    Origen: China\r\n\r\nRecomendaciones de uso y cuidados\r\n\r\n    Antes del primer uso: Lavar el termo con agua tibia y detergente suave.\r\n    Para mantener la temperatura: Precalentar o enfriar el termo con agua caliente o fría antes de colocar la bebida.\r\n    Limpieza: Lavar a mano con esponja suave, evitando el uso de productos abrasivos.\r\n    No apto para microondas ni freezer.\r\n    Secar bien antes de guardar para evitar olores y conservar la calidad del acero.\r\n\r\nDisfrutá de tus bebidas preferidas a la temperatura ideal en cualquier lugar. Elegí calidad, diseño y practicidad con el Termo Hudson Acero Negro de Acero Inoxidable 750 ml.', '1793257608-10.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `apellido` varchar(30) NOT NULL,
  `usuario` varchar(30) NOT NULL,
  `password` varchar(50) NOT NULL,
  `token` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `apellido`, `usuario`, `password`, `token`) VALUES
(2, 'Gaston', 'Hudson', 'gaston', '12345', 'e0df58f541ff606a7eef55d3ee3a90e0fa3eec685e490961b881e79ecf522346');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `localidades_la_pampa`
--
ALTER TABLE `localidades_la_pampa`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `personas`
--
ALTER TABLE `personas`
  ADD PRIMARY KEY (`dni`),
  ADD KEY `dni` (`dni`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `localidades_la_pampa`
--
ALTER TABLE `localidades_la_pampa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
