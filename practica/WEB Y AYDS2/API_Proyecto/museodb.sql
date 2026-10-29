-- Crear tabla con metadatos
CREATE TABLE imagenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta VARCHAR(255) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),
    autor VARCHAR(100),
    fecha DATE,
    descripcion TEXT,
    palabras_clave VARCHAR(255),
    fecha_subida DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO imagenes (nombre_archivo, ruta, titulo, categoria, autor, fecha, descripcion, palabras_clave) VALUES
('img1(dino).jpg', 'uploads/img1(dino).jpg', 'Fósil de dinosaurio pampeano', 'Paleontología', 'Equipo de Paleontología – Museo Provincial', '2023-03-15', 'Esqueleto parcial de un dinosaurio herbívoro del Cretácico tardío hallado en la provincia de La Pampa, Argentina.', 'dinosaurio, fósil, cretácico, paleontología'),

('img2(mano).jpg', 'uploads/img2(mano).jpg', 'Fósil de extremidad de mamífero prehistórico', 'Paleontología', 'Laboratorio de Paleontología – UNLPam', '2022-09-21', 'Restos óseos pertenecientes a la extremidad anterior de un mamífero terrestre extinto del Pleistoceno.', 'fósil, hueso, extremidad, paleontología'),

('img3(dino).jpg', 'uploads/img3(dino).jpg', 'Restauración de fósil de dinosaurio', 'Paleontología', 'Taller de Conservación – Museo Provincial', '2023-06-10', 'Proceso de restauración de un ejemplar fósil encontrado en excavaciones recientes en la Patagonia argentina.', 'dinosaurio, restauración, fósil, conservación'),

('img4(piedra).jpg', 'uploads/img4(piedra).jpg', 'Bloque fósil en proceso de extracción', 'Paleontología', 'Equipo de Campo – Museo de La Pampa', '2023-04-25', 'Bloque de sedimentos con fósiles en etapa de preparación para su estudio y conservación.', 'paleontología, fósil, excavación, preparación'),

('img5(tortuga).jpg', 'uploads/img5(tortuga).jpg', 'Caparazón de Glyptodon', 'Paleontología', 'Departamento de Paleontología', '2023-02-18', 'Fósil completo de un Glyptodon, mamífero acorazado del Pleistoceno, hallado en el centro de Argentina.', 'glyptodon, fósil, mamífero, pleistoceno'),

('img6(mushi).jpg', 'uploads/img6(mushi).jpg', 'Montaje de esqueleto de megafauna', 'Paleontología', 'Museo Provincial de Ciencias Naturales', '2023-07-03', 'Exhibición de un esqueleto reconstruido de megaterio y otros mamíferos de gran tamaño del Cuaternario.', 'megaterio, fósil, esqueleto, exposición'),

('img7(puma).jpg', 'uploads/img7(puma).jpg', 'Representación del puma prehistórico “Nawel Mapu”', 'Zoología / Paleontología', 'Área de Zoología', '2022-11-20', 'Reconstrucción artística del puma prehistórico conocido como Nawel Mapu, basada en hallazgos fósiles locales.', 'puma, felino, zoología, reconstrucción, fósil'),

('img7(vasija_rota).jpeg', 'uploads/img7(vasija_rota).jpeg', 'Vasija cerámica precolombina', 'Arqueología', 'Área de Arqueología – Museo Regional', '2021-08-09', 'Fragmentos de una vasija cerámica utilizada por comunidades originarias del centro de Argentina.', 'cerámica, arqueología, cultura originaria, vasija'),

('img8.jpg', 'uploads/img8.jpg', 'Cerámicas ranqueles “Tierra Ranquel”', 'Arqueología / Etnografía', 'Colectivo Tierra Ranquel', '2023-05-28', 'Colección de cerámicas artesanales inspiradas en técnicas tradicionales del pueblo ranquel.', 'ranquel, cerámica, arqueología, artesanía'),

('img9.jpg', 'uploads/img9.jpg', 'Exhibición de fósiles y materiales arqueológicos', 'Museografía', 'Museo de Ciencias Naturales de La Pampa', '2023-09-12', 'Vista general de una sala del museo donde se exhiben piezas fósiles y objetos arqueológicos.', 'museo, exhibición, fósiles, arqueología');


INSERT INTO imagenes (nombre_archivo, ruta, titulo, categoria, autor, fecha, descripcion, palabras_clave) VALUES
('img9(hoja).jpg', 'uploads/img9(hoja).jpg', 'Fósil de hoja del Mioceno', 'Paleobotánica', 'Área de Paleobotánica – Museo de La Pampa', '2023-01-14', 'Impresión fósil de una hoja perteneciente a una especie arbórea del Mioceno, hallada en depósitos sedimentarios de la región pampeana.', 'fósil, hoja, paleobotánica, mioceno, planta'),

('img10(piramide).jpg', 'uploads/img10(piramide).jpg', 'Monolito grabado de cultura originaria', 'Arqueología', 'Sección de Arqueología – Museo Regional', '2022-10-09', 'Pieza lítica con grabados geométricos perteneciente a una cultura precolombina del centro de Argentina, utilizada con fines rituales o simbólicos.', 'arqueología, monolito, grabado, cultura originaria, piedra'),

('img11(ave).jpg', 'uploads/img11(ave).jpg', 'Ave pampeana taxidermizada', 'Ornitología', 'Equipo de Ornitología – Museo Provincial', '2023-03-22', 'Ejemplar taxidermizado de un ave típica de la región pampeana, exhibido en la colección permanente del museo.', 'ave, ornitología, taxidermia, fauna pampeana, exhibición');
-- Insertar ejemplos de colecciones del Museo de Ciencias Naturales
INSERT INTO imagenes (nombre_archivo, ruta, titulo, categoria, autor, fecha, descripcion, palabras_clave) VALUES
('femur_glyptodon.jpg', 'uploads/femur_glyptodon.jpg', 'Fémur de Glyptodon', 'Paleontología', 'Equipo de Paleontología – Museo de La Pampa', '2023-03-12', 'Fémur fosilizado perteneciente a un Glyptodon, un mamífero acorazado del Pleistoceno hallado en la región pampeana.', 'fósil, glyptodon, pleistoceno, paleontología'),
('craneo_puma_concolor.png', 'uploads/craneo_puma_concolor.png', 'Cráneo de Puma concolor', 'Zoología', 'Sección Zoología', '2022-11-05', 'Ejemplar de cráneo de Puma concolor (león americano) utilizado para estudios anatómicos comparativos.', 'puma, zoología, mamífero, carnívoro'),
('geoda_ametista.jpeg', 'uploads/geoda_ametista.jpeg', 'Geoda de Amatista', 'Mineralogía', 'Colección Geología', '2021-09-18', 'Geoda de amatista proveniente de las formaciones basálticas de Córdoba, Argentina. Presenta cristales de cuarzo violeta de alta pureza.', 'mineral, amatista, cuarzo, geología'),
('nido_fosilizado.jpg', 'uploads/nido_fosilizado.jpg', 'Nido de dinosaurio fosilizado', 'Paleontología', 'Expedición Patagonia 2020', '2020-12-03', 'Conjunto de huevos fosilizados pertenecientes a un saurópodo, encontrados en sedimentos de la Formación Allen.', 'dinosaurio, fósil, huevo, saurópodo'),
('aves_pampeanas.png', 'uploads/aves_pampeanas.png', 'Colección de aves pampeanas', 'Ornitología', 'Equipo de Ornitología', '2022-08-14', 'Muestras taxidermizadas de especies típicas de la llanura pampeana, entre ellas el tero, calandria y hornero.', 'aves, ornitología, taxidermia, fauna pampeana'),
('cristal_cuarzo_rosa.jpg', 'uploads/cristal_cuarzo_rosa.jpg', 'Cristal de cuarzo rosa', 'Mineralogía', 'Colección Geología', '2021-05-20', 'Ejemplar de cuarzo rosa con estructura hexagonal bien definida, utilizado en exhibiciones sobre minerales semipreciosos.', 'cuarzo, mineral, geología, rosa'),
('huella_fosilizada.jpg', 'uploads/huella_fosilizada.jpg', 'Huella fosilizada de ave gigante', 'Paleontología', 'Equipo de Campo – Museo La Pampa', '2023-02-01', 'Impresión fósil atribuida a un ave corredora prehistórica (Phorusrhacidae), hallada en sedimentos de la Formación Chapadmalal.', 'fósil, huella, ave, paleontología'),
('coleccion_insectos.jpg', 'uploads/coleccion_insectos.jpg', 'Colección de insectos pampeanos', 'Entomología', 'Área Entomología', '2022-10-25', 'Serie de insectos disecados representativos de ecosistemas pampeanos, utilizados con fines educativos y científicos.', 'insectos, entomología, biodiversidad, educación'),
('roca_volcanica.png', 'uploads/roca_volcanica.png', 'Roca volcánica basáltica', 'Geología', 'Sección Geología', '2021-11-11', 'Muestra de basalto con vesículas, utilizada para explicar los procesos de enfriamiento del magma y formación de rocas ígneas.', 'geología, basalto, roca, volcánica'),
('femur_megatherium.jpg', 'uploads/femur_megatherium.jpg', 'Fémur de Megatherium americanum', 'Paleontología', 'Departamento de Paleontología', '2023-04-02', 'Fémur de perezoso gigante encontrado en sedimentos cuaternarios de La Pampa.', 'megatherium, fósil, cuaternario, paleontología');