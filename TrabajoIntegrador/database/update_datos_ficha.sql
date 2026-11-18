-- DATOS DE FICHA para los convenios ya cargados (14 instrumentos del demo).
-- Completa las columnas agregadas por alter_campos_ficha.sql:
--   obligaciones, condiciones_rescision, condiciones_renovacion,
--   notas, resolucion, expediente.
--
-- IMPORTANTE:
--   · Ejecutar DESPUÉS de alter_campos_ficha.sql (crea las columnas).
--   · No se completa `alcance`: la columna no existe por decisión de diseño
--     (el término queda reservado al alcance por unidad del panel).
--   · Los instrumentos en borrador/revisión quedan con resolucion NULL:
--     todavía no tienen acto administrativo; así también lo refleja la ficha.
--   · fecha_actualizacion queda NULL: estos convenios no fueron modificados.

UPDATE `convenios` SET
  resolucion            = 'Resolución CS UNLPAM N° 208/24',
  expediente            = 'EX-2024-0123-—APM#FI',
  obligaciones          = 'La Facultad de Ingeniería aporta equipos de trabajo, estudiantes e investigación aplicada; la Municipalidad de Santa Rosa proporciona los casos de estudio, los espacios físicos y la financiación de los proyectos de extensión y desarrollo tecnológico que se acuerden por escrito.',
  condiciones_rescision = 'Rescisión por mutuo acuerdo o por incumplimiento de cualquiera de las partes, con preaviso escrito de 60 días.',
  condiciones_renovacion= 'Renovable por períodos sucesivos de dos años mediante acuerdo expreso antes del vencimiento.',
  notas                 = 'Proyectos en curso: huerta urbana tecnológica y semáforos inteligentes. La adenda de energías renovables se tramita por el instrumento UNLPAM-FI-2025-001.'
WHERE id = 1;

UPDATE `convenios` SET
  resolucion            = 'Resolución CS UNLPAM N° 118/24',
  expediente            = 'EX-2024-0187-—APM#FI',
  obligaciones          = 'TecnoLáctea S.A. ofrece plazas de pasantía de 20 horas semanales con asignación estímulo y seguro de vida; la Facultad designa tutor académico y verifica el cumplimiento del reglamento; la persona pasante cumple el plan de trabajo acordado.',
  condiciones_rescision = 'Rescisión sin penalidades con preaviso de 30 días; la empresa debe informar los motivos al tutor académico.',
  condiciones_renovacion= 'Renovable anualmente previo informe favorable del tutor y de la empresa, solicitado 30 días antes del vencimiento.',
  notas                 = 'Renovado por el instrumento UNLPAM-FI-2026-004, que agrega el área de control de calidad de datos.'
WHERE id = 2;

UPDATE `convenios` SET
  resolucion            = 'Resolución Ministerial N° 512/24',
  expediente            = 'EX-2024-0233-—APM#R',
  obligaciones          = 'La Clínica Los Álamos habilita salas de práctica y cede datos anonimizados para el desarrollo de historias clínicas digitales; la Facultad garantiza la supervisión docente y el secreto profesional de las prácticas.',
  condiciones_rescision = 'Rescisión con preaviso de 45 días o inmediata por razones sanitarias debidamente fundadas.',
  condiciones_renovacion= 'Renovable por pedido escrito presentado 45 días antes del vencimiento (vence el 28/02/2026).',
  notas                 = 'Prácticas supervisadas de Ingeniería en Sistemas de Salud administradas por Rectorado.'
WHERE id = 3;

UPDATE `convenios` SET
  resolucion            = NULL,
  expediente            = 'EX-2025-0311-—APM#FI',
  obligaciones          = 'Hereda las obligaciones del convenio marco UNLPAM-FI-2024-001 y agrega: la Municipalidad cede edificios municipales como casos de eficiencia energética y la Facultad aporta mediciones y propuestas de energías renovables.',
  condiciones_rescision = 'Hereda las condiciones de rescisión del convenio antecedente (preaviso de 60 días).',
  condiciones_renovacion= 'No corresponde: la adenda rige junto con la vigencia del instrumento antecedente.',
  notas                 = 'En revisión por la Secretaría de Relaciones Institucionales: falta el dictamen legal y la resolución de aprobación.'
WHERE id = 4;

UPDATE `convenios` SET
  resolucion            = 'Resolución Ministerial N° 87/25',
  expediente            = 'EX-2025-0064-—APM#R',
  obligaciones          = 'El Ministerio de Infraestructura habilita proyectos de obra pública para pasantías, cubre el seguro de accidentes y designa un referente por proyecto; la Facultad selecciona pasantes y controla el cumplimiento académico.',
  condiciones_rescision = 'Rescisión por incumplimiento con preaviso de 90 días; concluidas las obras del proyecto, el marco se cierra automáticamente.',
  condiciones_renovacion= 'Vigencia hasta el 29/02/2028; renovable con nota escrita 90 días antes del vencimiento.',
  notas                 = 'Marco que habilita las adendas por carrera (véase UNLPAM-R-2026-002).'
WHERE id = 5;

UPDATE `convenios` SET
  resolucion            = 'Resolución CD FI N° 071/23',
  expediente            = 'EX-2023-0987-—APM#FI',
  obligaciones          = 'Desarrollo conjunto de sensores IoT para cultivos intensivos: BioCom del Centro aporta el acceso a los campos piloto y la Facultad el diseño, prototipado e informes trimestrales. Documentación confidencial (cláusulas comerciales).',
  condiciones_rescision = 'Rescindido el 12/05/2025 por incumplimiento reiterado de las entregas trimestrales; acto administrativo N° 2025-0447-CG-UNLPAM.',
  condiciones_renovacion= 'Sin renovación: instrumento rescindido.',
  notas                 = 'Sustituido por el convenio UNLPAM-FI-2025-003. Se conserva la trazabilidad completa del trámite de rescisión.'
WHERE id = 6;

UPDATE `convenios` SET
  resolucion            = NULL,
  expediente            = 'EX-2026-0058-—APM#FI',
  obligaciones          = 'Borrador: obligaciones a negociar con la CNEA (duración de la pasantía, seguros y plan de trabajo en el Centro Atómico Bariloche durante el ciclo lectivo 2026).',
  condiciones_rescision = 'A definir en la versión a firmar.',
  condiciones_renovacion= 'A definir en la versión a firmar.',
  notas                 = 'Borrador inicial: sin partes firmantes, fechas ni resolución. Requiere revisión de la Oficina de Pasantías.'
WHERE id = 7;

UPDATE `convenios` SET
  resolucion            = 'Resolución CS UNLPAM N° 203/26',
  expediente            = 'EX-2026-0102-—APM#FI',
  obligaciones          = 'InnovaAgro S.R.L. aporta campos piloto, datos agronómicos y cofinanciamiento de pasantías; la Facultad de Ingeniería aporta investigación aplicada, estudiantes e infraestructura de laboratorio.',
  condiciones_rescision = 'Rescisión por mutuo acuerdo o incumplimiento, con preaviso de 60 días.',
  condiciones_renovacion= 'Renovable por períodos de dos años previa evaluación de los proyectos conjuntos.',
  notas                 = 'Marco del que dependen el proyecto de investigación (UNLPAM-FI-2026-003) y las pasantías asociadas.'
WHERE id = 8;

UPDATE `convenios` SET
  resolucion            = 'Resolución CD FI N° 172/26',
  expediente            = 'EX-2026-0140-—APM#FI',
  obligaciones          = 'Cada alta de becaria, becario o investigador se documenta en un anexo de integrantes con plan de trabajo, dedicación y responsable; InnovaAgro aporta el financiamiento del monitoreo inteligente de suelos y cultivos.',
  condiciones_rescision = 'La rescisión de una alta individual no afecta al proyecto: se regula por el anexo correspondiente.',
  condiciones_renovacion= 'Vigente hasta el 15/12/2026; las renovaciones de altas se registran como anexos nuevos.',
  notas                 = 'Proyecto de monitoreo inteligente de suelos y cultivos mediante sensores de bajo costo, en el marco del convenio con InnovaAgro (UNLPAM-FI-2026-002).'
WHERE id = 9;

UPDATE `convenios` SET
  resolucion            = NULL,
  expediente            = 'EX-2026-0176-—APM#FI',
  obligaciones          = 'Hereda las obligaciones del antecedente UNLPAM-FI-2024-002 (asignación estímulo, seguro y tutores) e incorpora el área de control de calidad de datos con el mismo régimen horario de 20 horas.',
  condiciones_rescision = 'Hereda las condiciones del antecedente (preaviso de 30 días).',
  condiciones_renovacion= 'Próxima renovación sujeta al informe anual del tutor y de la empresa.',
  notas                 = 'Aprobado, pendiente de firma; vence el 31/08/2027. Sofía Belén Robles continúa en el área de calidad de datos.'
WHERE id = 10;

UPDATE `convenios` SET
  resolucion            = NULL,
  expediente            = 'EX-2026-0213-—APM#R',
  obligaciones          = 'Amplía las tareas del marco UNLPAM-R-2025-002 con relevamiento y digitalización de expedientes técnicos de obras públicas provinciales, incorporando pasantes de Analista Programador Universitario.',
  condiciones_rescision = 'Hereda las condiciones de rescisión del convenio antecedente (preaviso de 90 días).',
  condiciones_renovacion= 'No corresponde: adenda vinculada a la vigencia del marco antecedente.',
  notas                 = 'En revisión: pendiente el visto bueno legal del Ministerio de Infraestructura.'
WHERE id = 11;

UPDATE `convenios` SET
  resolucion            = NULL,
  expediente            = NULL,
  obligaciones          = 'Borrador: pasantías de estudiantes de Analista Programador Universitario en desarrollo de aplicaciones web y móviles; tareas, horarios y asignación estímulo a acordar con Software del Sur S.R.L.',
  condiciones_rescision = 'A definir en la versión a firmar.',
  condiciones_renovacion= 'A definir en la versión a firmar.',
  notas                 = 'Borrador inicial: faltan partes firmantes, fechas y documento principal. Al aprobarse se completan resolución y vigencia.'
WHERE id = 12;

UPDATE `convenios` SET
  resolucion            = 'Resolución CD FI N° 141/25',
  expediente            = 'EX-2025-0288-—APM#FI',
  obligaciones          = 'Plan de trabajo con entregas trimestrales de sensores IoT, garantía de soporte por 12 meses y esquema de pagos por hitos certificados. Documentación confidencial (cláusulas comerciales).',
  condiciones_rescision = 'Rescisión por incumplimiento de dos hitos consecutivos o por mutuo acuerdo, con preaviso de 30 días.',
  condiciones_renovacion= 'Renovable por acuerdo expreso antes del 30/09/2027.',
  notas                 = 'Sustituye al convenio rescindido UNLPAM-FI-2023-004; conserva el marco legal UNLPAM-INTA N° 23/22.'
WHERE id = 13;

UPDATE `convenios` SET
  resolucion            = 'Resolución CD FI N° 088/22',
  expediente            = 'EX-2022-0455-—APM#FI',
  obligaciones          = 'Acciones de extensión y capacitación en localidades del este provincial; la Cámara Empresaria convoca a las empresas participantes y la Facultad provee capacitadores y material didáctico.',
  condiciones_rescision = 'Vencido el 31/12/2024 sin renovación: cierre por vencimiento del plazo.',
  condiciones_renovacion= 'Sin renovación: la Cámara informó la descontinuación del programa en 2025.',
  notas                 = 'Archivado con la trazabilidad correspondiente (auditoría del convenio). Expediente enviado a archivo central.'
WHERE id = 14;
