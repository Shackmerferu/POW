-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-12-2025 a las 06:01:45
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
-- Base de datos: `helicopter`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aeronaves`
--

CREATE TABLE `aeronaves` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `detalle` text NOT NULL,
  `imagen` varchar(200) NOT NULL,
  `valor_hora_vuelo` int(11) NOT NULL,
  `cantidad_pasajeros` int(11) NOT NULL,
  `velocidad_media_km_h` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `aeronaves`
--

INSERT INTO `aeronaves` (`id`, `nombre`, `detalle`, `imagen`, `valor_hora_vuelo`, `cantidad_pasajeros`, `velocidad_media_km_h`) VALUES
(1, 'Robinson R66', 'El mayor de los Robinsons, R66, es más amplia y comodidad a un precio asequible. R66 es ideal para vuelos panorámicos y cortas, incluyendo aquellos a los lugares de difícil acceso. La velocidad media de crucero está en el puesto 204 kmh - más que su predecesor ya la par con otra de un solo motor helicopters.Although mirada del avión por igual en el exterior, el R66 es realmente una evolución de su modelo más antiguo. Un motor turbo hace que sea más potente y ágil, una ventana ofrece la línea de bajada hacia adelante sin precedentes y la visibilidad hacia abajo, y una cabina más amplia con espacio adicional para un pasajero más, con capacidad para un total de 4 pasajeros y un piloto. Pero la mejora más importante desde el R44 es un compartimiento de equipaje externa, con capacidad para palos de golf o maletas de equipaje duro. Gracias a la 0.51m³ (18ft³) compartimiento de equipaje trasero combinado con el bajo asiento equipaje de espacio para el equipaje, ahora puede tomar hasta 3 casos de tamaño medio y 3 bolsas blandas para su escapada de fin de semana.', 'Robinson_R66.png', 780, 6, 180),
(2, 'JetRanger III', 'El JetRanger III (Bell 206B) es un helicóptero ligero, monomotor de turbina, muy popular y fiable, diseñado por Bell Helicopter, conocido por su versatilidad en roles como entrenamiento, vigilancia, transporte VIP y rescate, con capacidad para piloto y hasta cinco pasajeros, destacando por su excelente visibilidad y robustez en operaciones civiles y militares', 'JetRanger_III.png', 1000, 3, 213),
(3, 'Agusta A109A MkII', 'El A109 Mk II es una versión actualizada del popular modelo A109. Ofrece un entorno empresarial ideal para traslados VIP y está considerado como uno de los helicópteros más modernos para transporte corporativo y vuelos de ocio. El diseño típico incluye una configuración ejecutiva de cuatro a seis asientos en cuero claro u oscuro con moqueta, revestimiento de puertas y techo de alta calidad. El avión está equipado con una cabina de bajo nivel de ruido y vibración, auriculares Bose y aire acondicionado. Un maletero accesible desde el exterior tiene una capacidad de 0,9 m³ (32 ft³), apto para 3 maletas medianas y 3 bolsos para portátiles.', 'Agusta_A109A_MkII.png', 1500, 6, 222),
(4, 'Agusta A109E Power', '', 'Agusta_A109E_Power.png', 1800, 7, 211),
(5, 'Bell 407 GXP', 'El modelo insignia de Bell modelo refinado está equipado con los últimos aviónica, que ofrece un mayor nivel de seguridad de primera clase. La cabina baja vibración, grandes ventanales, y el interior de lujo de gama alta que sea la opción preferida de los clientes VIP más exigentes. Esta evolución se estiró y más potente del monomotor de Bell modelos ofrece cómodas club asientos para 5 pasajeros, con un asiento delantero sexto adicional. El compartimiento de equipaje lado es de dimensiones relativamente pequeñas (0.56m³ o 20ft³) y puede contener hasta 3 casos de tamaño medio o 5 bolsas blandas, de 15 kg cada uno; tenga en cuenta la profundidad máxima de 45 cm en la parte trasera del compartimento. Los interiores de cuero se complementan con pequeños detalles, como portavasos y una alfombra de felpa. El avión está equipado con aire acondicionado y los auriculares con cancelación de ruido.', 'Bell_407_GXP.png', 2800, 6, 222),
(6, 'Agusta AW139', 'El AW139, líder del mercado en su clase, incorpora las características distintivas de elegancia, estilo y sofisticación, supera a todos los demás helicópteros intermedios en capacidad, velocidad y calidad de viaje.\r\n\r\nSu cabina grande y sin obstrucciones es capaz de transportar cómodamente hasta 10 pasajeros y es fácilmente accesible a través de un peldaño que se despliega automáticamente. También ofrece un amplio espacio para accesorios, que incluye telecomunicaciones, sistemas de entretenimiento, espacio de trabajo, área de refrigerios y bodega.', 'Agusta_AW139.png', 7000, 7, 306);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `localidades_la_pampa`
--

CREATE TABLE `localidades_la_pampa` (
  `id` int(11) NOT NULL,
  `nombre_ciudad` varchar(100) DEFAULT NULL,
  `latitud` decimal(9,6) DEFAULT NULL,
  `longitud` decimal(9,6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `localidades_la_pampa`
--

INSERT INTO `localidades_la_pampa` (`id`, `nombre_ciudad`, `latitud`, `longitud`) VALUES
(1, 'Santa Rosa', -36.620000, -64.290000),
(2, 'General Pico', -35.650000, -63.750000),
(3, 'General Acha', -37.383300, -64.616700),
(4, 'Eduardo Castex', -35.883300, -64.066700),
(5, 'Realicó', -35.033300, -64.266700),
(6, 'Intendente Alvear', -35.233300, -63.583300),
(7, 'Veinticinco de Mayo', -36.783300, -67.716700),
(8, 'Victorica', -36.216700, -65.433300),
(9, 'Guatraché', -37.666700, -63.583300),
(10, 'Macachín', -37.133300, -63.666700),
(11, 'Ingeniero Luiggi', -35.416700, -64.466700),
(12, 'Quemú Quemú', -35.750000, -63.566700),
(13, 'Catriló', -36.466700, -63.866700),
(14, 'Rancul', -35.066700, -64.683300),
(15, 'Trenel', -35.866700, -63.733300),
(16, 'Colonia Barón', -35.666700, -63.833300),
(17, 'Winifreda', -35.933300, -64.216700),
(18, 'General San Martín', -37.983300, -63.566700),
(19, 'Jacinto Arauz', -38.066700, -63.433300),
(20, 'Abramo', -37.883330, -63.850000),
(21, 'Adolfo Van Praet', -35.016670, -64.050000),
(22, 'Agustoni', -35.783330, -63.400000),
(23, 'Algarrobo del Águila', -36.433330, -67.150000),
(24, 'Alpachiri', -37.366670, -63.766670),
(25, 'Alta Italia', -35.366670, -64.133330),
(26, 'Anguil', -36.516670, -64.016670),
(27, 'Arata', -35.633330, -64.333330),
(28, 'Ataliva Roca', -37.016670, -64.283330),
(29, 'Bernasconi', -37.883330, -63.883330),
(30, 'Caleufú', -35.900000, -64.566670),
(31, 'Carro Quemado', -36.316670, -65.016670),
(32, 'Chacharramendi', -37.266670, -66.016670),
(33, 'Colonia Santa María', -37.883330, -63.716670),
(34, 'Doblas', -36.616670, -63.816670),
(35, 'Embajador Martini', -35.383330, -64.266670),
(36, 'La Adela', -39.466670, -63.366670),
(37, 'La Humada', -36.966670, -67.933330),
(38, 'Metileo', -35.716670, -63.716670),
(39, 'Pichi Huinca', -35.666670, -64.566670),
(40, 'Quehué', -37.566670, -64.600000);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `aeronaves`
--
ALTER TABLE `aeronaves`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `localidades_la_pampa`
--
ALTER TABLE `localidades_la_pampa`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `aeronaves`
--
ALTER TABLE `aeronaves`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `localidades_la_pampa`
--
ALTER TABLE `localidades_la_pampa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
