/**
 * DATOS DE PRUEBA DEL PANEL (ficticios, SOLO para visualización).
 *
 * Alcance: dos unidades → Facultad de Ingeniería (1) y Rectorado (2).
 * Fechas en ISO ("aaaa-mm-dd") como las guarda MySQL.
 * El panel no se conecta a la base: carga con estos datos y punto.
 *
 * Cada convenio Parametriza lo que se debe VER en la ficha:
 *   · código único, título, tipo
 *   · unidad responsable
 *   · objeto, alcance, obligaciones
 *   · condiciones de rescisión
 *   · marco legal, resolución, expediente o referencia
 *   · condiciones de renovación
 *   · confidencialidad, notas
 *   · fecha de firma, inicio, vencimiento y días de preaviso
 *   · partes firmantes con sus representantes (mínimo 2 para aprobar)
 *   · relaciones: marcos compatibles, instrumento modificado, antecedente
 */

// ---------------------------------------------------------------------------
// Unidades académicas
// ---------------------------------------------------------------------------
export const UNIDADES = [
  { id: 1, nombre: "Facultad de Ingeniería" },
  { id: 2, nombre: "Rectorado" },
];

// ---------------------------------------------------------------------------
// Usuarios (rol → administracion | gestion | revision | consulta)
// ---------------------------------------------------------------------------
export const USUARIOS = [
  { id: 1, legajo: "ADMIN-001", nombre_completo: "Lucía Belén Sánchez", rol: "administracion", id_unidad: null },
  { id: 2, legajo: "GEST-001", nombre_completo: "Tomás Antonio González", rol: "gestion", id_unidad: 1 },
  { id: 3, legajo: "REV-001", nombre_completo: "Marcos Ferreyra", rol: "revision", id_unidad: 2 },
  { id: 4, legajo: "CONS-001", nombre_completo: "Julia Mansilla", rol: "consulta", id_unidad: 1 },
  { id: 5, legajo: "GEST-002", nombre_completo: "Ramiro Duarte", rol: "gestion", id_unidad: 2 },
];

// ---------------------------------------------------------------------------
// Partes firmantes ficticias (tabla partes_firmantes)
// ---------------------------------------------------------------------------
const PARTE_UNLPAM = {
  nombre_institucion: "Universidad Nacional de La Pampa (Facultad de Ingeniería)",
  representante_nombre: "Facundo Oliva",
  representante_cargo: "Secretario de Extensión",
};
const PARTE_RECTORADO = {
  nombre_institucion: "Universidad Nacional de La Pampa (Rectorado)",
  representante_nombre: "Mirta Quintana",
  representante_cargo: "Prosecretaria de Asuntos Jurídicos",
};
const PARTE_MINISTERIO = {
  nombre_institucion: "Ministerio de Infraestructura",
  representante_nombre: "Carolina Ibáñez",
  representante_cargo: "Directora de Obras",
};
const PARTE_MUNICIPALIDAD = {
  nombre_institucion: "Municipalidad de Santa Rosa",
  representante_nombre: "Pablo Sarmiento",
  representante_cargo: "Secretario de Ambiente",
};
const PARTE_EMPRESA = {
  nombre_institucion: "TecnoLáctea S.A.",
  representante_nombre: "Analía Ferro",
  representante_cargo: "Gerente General",
};
const PARTE_CLINICA = {
  nombre_institucion: "Clínica Los Álamos",
  representante_nombre: "Dr. Hugo Lin",
  representante_cargo: "Director Médico",
};
const PARTE_CNEA = {
  nombre_institucion: "Comisión Nacional de Energía Atómica",
  representante_nombre: "Dra. Elena Aufmann",
  representante_cargo: "Jefa de Vinculación",
};
const PARTE_BIOCOM = {
  nombre_institucion: "BioCom del Centro",
  representante_nombre: "Sergio Muñoz",
  representante_cargo: "Socio Gerente",
};

// ---------------------------------------------------------------------------
// CONVENIOS
//   tipo   → marco_colaboracion | especifico_colaboracion |
//            marco_pasantia | especifico_pasantia | adenda
//   estado → borrador | revision | aprobado | firmado | rescindido | archivado
//   rel    → id_marcos_compatibles (específicos), id_instrumento_modificado
//            (adendas), id_antecedente (renovaciones/sustituciones)
// ---------------------------------------------------------------------------
export const CONVENIOS = [
  {
    id: 1,
    codigo_unico: "CONV-2021-FI-0001",
    titulo: "Marco de colaboración Facultad de Ingeniería – Ministerio de Infraestructura",
    tipo: "marco_colaboracion",
    estado: "firmado",
    unidad_responsable: "Facultad de Ingeniería",
    id_unidad_responsable: 1,
    objeto: "Marco general de colaboración para proyectos de infraestructura universitaria y transferencia técnica.",
    alcance: "Proyectos de obra y asistencia técnica en el campus y la región.",
    obligaciones:
      "La Facultad aporta equipos y estudiantes avanzados; el Ministerio financia materiales y aporta informes técnicos trimestrales.",
    condiciones_rescision: "Incumplimiento grave de obligaciones, ruptura del diálogo o pedido formal de cualquiera de las partes con 90 días de anticipación.",
    marco_legal: "Ley 24.521 – Ley de Educación Superior",
    resolucion: "Res. CSu N° 081/2021",
    expediente: "EX-2021-348-GDE",
    condiciones_renovacion: "Renovación automática por lapsos de 2 años si ambas partes lo piden por escrito antes del preaviso.",
    confidencialidad: false,
    notas: "Primer marco general de la Facultad; sirve de techo para otros convenios.",
    fecha_firma: "2021-03-15",
    fecha_inicio: "2021-04-01",
    fecha_vencimiento: "2026-04-01", // ya vencido
    dias_preaviso: 90,
    partes: [PARTE_UNLPAM, PARTE_MINISTERIO],
    documentos: [
      { id: 101, tipo_documento: "principal", nombre_archivo: "convenio_marco_firmado.pdf", ruta_archivo: "/docs/CONV-2021-FI-0001/convenio_marco_firmado.pdf", tamano_kb: 842, version: 1, hash_sha256: "a3f00c92b1d2", fecha_subida: "2021-03-18", subido_por: "Gestión Ingeniería" },
      { id: 102, tipo_documento: "resolucion", nombre_archivo: "resolucion_csu_081.pdf", ruta_archivo: "/docs/CONV-2021-FI-0001/resolucion_csu_081.pdf", tamano_kb: 214, version: 1, hash_sha256: "11e4ba7f2209", fecha_subida: "2021-03-10", subido_por: "Mesa de entradas" },
    ],
    id_marcos_compatibles: [],
    id_instrumento_modificado: null,
    id_antecedente: null,
  },
  {
    id: 2,
    codigo_unico: "CONV-2023-FI-0005",
    titulo: "Transporte urbano sostenible – Marco de colaboración con la Municipalidad de Santa Rosa",
    tipo: "marco_colaboracion",
    estado: "firmado",
    unidad_responsable: "Facultad de Ingeniería",
    id_unidad_responsable: 1,
    objeto: "Apoyo técnico al plan de transporte urbano sostenible y extensión universitaria en la ciudad.",
    alcance: "Estudios de impacto, avenidas seleccionadas y paradas de micro en el radio urbano.",
    obligaciones:
      "La Facultad modela la red y entrega informes semestrales; la Municipalidad comparte sus datos de frecuencia de uso.",
    condiciones_rescision: "Desistimiento de la línea de trabajo por cualquiera de las partes, comunicando con 60 días de anticipación.",
    marco_legal: "Ordenanza Municipal N° 5277",
    resolucion: "Res. CD N° 114/2023",
    expediente: "EX-2023-771-GDE",
    condiciones_renovacion: "Renovable por ejercicio anual a fin de cada ciclo académico si persiste la línea de trabajo.",
    confidencialidad: false,
    notas: "Sustituye, con mejoras, al marco de infraestructura de 2021.",
    fecha_firma: "2023-08-12",
    fecha_inicio: "2023-09-01",
    fecha_vencimiento: "2026-12-02",
    dias_preaviso: 60,
    partes: [PARTE_UNLPAM, PARTE_MUNICIPALIDAD],
    documentos: [
      { id: 107, tipo_documento: "principal", nombre_archivo: "marco_transporte.pdf", ruta_archivo: "/docs/CONV-2023-FI-0005/marco_transporte.pdf", tamano_kb: 745, version: 1, hash_sha256: "b7e19d44ac08", fecha_subida: "2023-08-14", subido_por: "Gestión Ingeniería" },
    ],
    id_marcos_compatibles: [],
    id_instrumento_modificado: null,
    id_antecedente: 1,
  },
  {
    id: 3,
    codigo_unico: "PASN-2023-FI-0008",
    titulo: "Programa de pasantías profesionales – TecnoLáctea S.A.",
    tipo: "especifico_pasantia",
    estado: "firmado",
    unidad_responsable: "Facultad de Ingeniería",
    id_unidad_responsable: 1,
    objeto: "Pasantías profesionales para estudiantes de Ingeniería en Informática y Mecánica dentro del área de producción.",
    alcance: "Hasta 6 pasantes simultáneos, reducción según demanda",
    obligaciones:
      "La empresa asigna un tutor externo y abona el estipendio mensual; la Universidad da el marco académico y el seguro.",
    condiciones_rescision: "Incumplimiento del cronograma de pasantías, mala conducta del pasante o riesgo laboral declarado.",
    marco_legal: "Res. CSu 035/2023 – Ley de Pasantías",
    resolucion: "Res. CD N° 217/2023",
    expediente: "EX-2023-2050-GDE",
    condiciones_renovacion: "Renovable por ciclos anuales si la evaluación del programa es positiva.",
    confidencialidad: false,
    notas: "Con anexo de póliza de seguro cargado en el expediente.",
    fecha_firma: "2023-09-28",
    fecha_inicio: "2023-10-10",
    fecha_vencimiento: "2026-11-25", // proximo a vencer
    dias_preaviso: 45,
    partes: [PARTE_UNLPAM, PARTE_EMPRESA],
    documentos: [
      { id: 103, tipo_documento: "principal", nombre_archivo: "pasantia_tecnolactea_v2.pdf", ruta_archivo: "/docs/PASN-2023-FI-0008/pasantia_tecnolactea_v2.pdf", tamano_kb: 1120, version: 2, hash_sha256: "77ac0dfe1092", fecha_subida: "2023-10-02", subido_por: "Gestión Ingeniería" },
      { id: 104, tipo_documento: "anexo", nombre_archivo: "anexo_poliza_seguro.pdf", ruta_archivo: "/docs/PASN-2023-FI-0008/anexo_poliza_seguro.pdf", tamano_kb: 305, version: 1, hash_sha256: "9001ab77cd10", fecha_subida: "2023-10-05", subido_por: "Mesa de entradas" },
    ],
    id_marcos_compatibles: [1, 2],
    id_instrumento_modificado: null,
    id_antecedente: null,
  },
  {
    id: 4,
    codigo_unico: "PASN-2022-FI-0004",
    titulo: "Estancias de práctica supervisada – Clínica Los Álamos",
    tipo: "especifico_pasantia",
    estado: "firmado",
    unidad_responsable: "Facultad de Ingeniería",
    id_unidad_responsable: 1,
    objeto: "Estancia de práctica supervisada para estudiantes de Bioingeniería en el área de atención clínica.",
    alcance: "2 pasantes simultáneos, guarda rotativa",
    obligaciones:
      "La clínica provee el equipo y el acompañamiento clínico; la Universidad supervisa el registro de prácticas.",
    condiciones_rescision: "Baja voluntaria del pasante sin reemplazo dentro de 30 días.",
    marco_legal: "Res. CD 098/2022 – Facultad de Ingeniería",
    resolucion: "Res. CD N° 512/2022",
    expediente: "EX-2022-188-GDE",
    condiciones_renovacion: "Renovable por semestre a partir de la nota de evaluación final.",
    confidencialidad: false,
    notas: "Pasantía precedida de un marco general a nivel institucional.",
    fecha_firma: "2022-07-05",
    fecha_inicio: "2022-08-01",
    fecha_vencimiento: "2026-11-18", // proximo a vencer (13 días)
    dias_preaviso: 30,
    partes: [PARTE_UNLPAM, PARTE_CLINICA],
    id_marcos_compatibles: [1],
    id_instrumento_modificado: null,
    id_antecedente: null,
  },
  {
    id: 5,
    codigo_unico: "CONV-2024-RE-0002",
    titulo: "Marco de cooperación institucional – Rectorado",
    tipo: "marco_colaboracion",
    estado: "firmado",
    unidad_responsable: "Rectorado",
    id_unidad_responsable: 2,
    objeto: "Marco general de cooperación con organismos públicos de ciencia, arte y tecnología en la región.",
    alcance: "Toda unidad académica que adhiera mediante su propio específico",
    obligaciones:
      "Cada unidad académica concreta sus propios acuerdos bajo este marco; el Rectorado acompasa el trámite.",
    condiciones_rescision: "No tiene rescisión: el marco se extinguió cuando la agenda universitaria cambia de rumbo.",
    marco_legal: "Res. CSu 052/2024",
    resolucion: "Res. CSu N° 052/2024",
    expediente: "EX-2024-011-GDE",
    condiciones_renovacion: "Sin fecha de vencimiento; se revisa anualmente en el Consejo Superior.",
    confidencialidad: false,
    notas: "No registra fecha final: el plazo queda «sin vencimiento registrado».",
    fecha_firma: "2024-02-20",
    fecha_inicio: "2024-03-01",
    fecha_vencimiento: null,
    dias_preaviso: null,
    partes: [PARTE_RECTORADO, PARTE_CNEA],
    id_marcos_compatibles: [],
    id_instrumento_modificado: null,
    id_antecedente: null,
  },
  {
    id: 6,
    codigo_unico: "ADEN-2025-FI-0008-a1",
    titulo: "Adenda N° 1 — Ampliación del plan de pasantías TecnoLáctea",
    tipo: "adenda",
    estado: "firmado",
    unidad_responsable: "Facultad de Ingeniería",
    id_unidad_responsable: 1,
    objeto: "Renueva y amplía el plan de pasantías con un nuevo perfil para pasantes de producción.",
    alcance: "Completa la pasantía específica PASN-2023-FI-0008",
    obligaciones: "Sin obligaciones propias: hereda las del instrumento que modificó.",
    condiciones_rescision: "Vigencia única hasta la extinción del convenio modificado.",
    marco_legal: "Res. CD 020/2025 – Facultad de Ingeniería",
    resolucion: "Res. CD N° 020/2025",
    expediente: "EX-2025-0912-GDE",
    condiciones_renovacion: "Sin renovación propia: la adenda vale mientras siga vigente el convenio que modificó.",
    confidencialidad: false,
    notas: "Modifica al instrumento PASN-2023-FI-0008 (id 3).",
    fecha_firma: "2025-03-14",
    fecha_inicio: "2025-04-01",
    fecha_vencimiento: "2026-12-30",
    dias_preaviso: 30,
    partes: [PARTE_UNLPAM, PARTE_EMPRESA],
    id_marcos_compatibles: [2],
    id_instrumento_modificado: 3,
    id_antecedente: null,
  },
  {
    id: 7,
    codigo_unico: "PASN-2025-FI-0016",
    titulo: "Prácticas preprofesionales en gestión industrial – TecnoLáctea S.A.",
    tipo: "especifico_pasantia",
    estado: "firmado",
    unidad_responsable: "Facultad de Ingeniería",
    id_unidad_responsable: 1,
    objeto: "Prácticas preprofesionales en el área de planeamiento de la producción y gestión de calidad.",
    alcance: "3 pasantes simultáneos",
    obligaciones:
      "La empresa paga el estipendio y provee el plan de trabajo; la Universidad valida el plan de estudios.",
    condiciones_rescision: "Incumplimiento del plan de trabajo o baja del estudiante de la pasantía.",
    marco_legal: "Res. CD 041/2023 – Facultad de Ingeniería",
    resolucion: "Res. CD N° 078/2025",
    expediente: "EX-2025-1224-GDE",
    condiciones_renovacion: "Renovable 1 año más respecto de la evaluación final.",
    confidencialidad: false,
    notas: "Se apoya en el marco de infraestructura 2021 y en el de transporte 2023.",
    fecha_firma: "2025-11-08",
    fecha_inicio: "2025-12-01",
    fecha_vencimiento: "2027-11-30",
    dias_preaviso: 45,
    partes: [PARTE_UNLPAM, PARTE_EMPRESA],
    id_marcos_compatibles: [1, 2],
    id_instrumento_modificado: null,
    id_antecedente: 3,
  },
  {
    id: 8,
    codigo_unico: "PASN-2024-RE-0010",
    titulo: "Marco de pasantía para el laboratorio central – Rectorado",
    tipo: "marco_pasantia",
    estado: "firmado",
    unidad_responsable: "Rectorado",
    id_unidad_responsable: 2,
    objeto: "Marco de pasantía para estudiantes del Rectorado en el laboratorio central de la universidad.",
    alcance: "Todo pasante propuesto por una unidad académica adherida",
    obligaciones:
      "El Rectorado ofrece la plaza del laboratorio; las unidades académicas proponen a los pasantes.",
    condiciones_rescision: "Se cancela si se cierra el laboratorio central.",
    marco_legal: "Res. CSu 099/2024",
    resolucion: "Res. CSu N° 099/2024",
    expediente: "EX-2024-062-GDE",
    condiciones_renovacion: "Renovable por 3 años si persiste la demanda de plazas.",
    confidencialidad: false,
    notas: "Cada específico bajo este marco lleva su propia ficha y su propio código.",
    fecha_firma: "2024-06-15",
    fecha_inicio: "2024-07-01",
    fecha_vencimiento: "2027-06-30",
    dias_preaviso: 90,
    partes: [PARTE_RECTORADO, PARTE_CNEA],
    id_marcos_compatibles: [],
    id_instrumento_modificado: null,
    id_antecedente: null,
  },
  {
    id: 9,
    codigo_unico: "CONV-2019-FI-0002",
    titulo: "Servicios de apoyo a la gestión académica – Específico",
    tipo: "especifico_colaboracion",
    estado: "archivado", // cumplió su ciclo y se archivó
    unidad_responsable: "Facultad de Ingeniería",
    id_unidad_responsable: 1,
    objeto: "Servicios de apoyo a la gestión académica y administrativa entre las partes firmantes.",
    alcance: "Servicios internos y administrativos de la Facultad",
    obligaciones: "La parte contratista a proveer el servicio y la Universidad el acceso a sus sistemas.",
    condiciones_rescision: "Cerrado por decisión administrativa una vez finalizados los servicios contratados.",
    marco_legal: "Res. CSu 071/2018",
    resolucion: "Res. CD N° 233/2019",
    expediente: "EX-2019-0401-GDE",
    condiciones_renovacion: "No nuevo.",
    confidencialidad: false,
    notas: "Archivado por finalización de ciclo y cierre administrativo.",
    fecha_firma: "2019-04-10",
    fecha_inicio: "2019-05-01",
    fecha_vencimiento: "2022-04-30",
    dias_preaviso: 30,
    partes: [PARTE_UNLPAM, PARTE_MINISTERIO],
    id_marcos_compatibles: [1],
    id_instrumento_modificado: null,
    id_antecedente: null,
  },
  {
    id: 10,
    codigo_unico: "CONV-2025-FI-0012",
    titulo: "Gestión de residuos del campus – Rescindido",
    tipo: "marco_colaboracion",
    estado: "rescindido", // firmado pero cancelado
    unidad_responsable: "Facultad de Ingeniería",
    id_unidad_responsable: 1,
    objeto: "Marco general de colaboración para la gestión integral de residuos en el sector universitario.",
    alcance: "Todos los edificios del campus universitario",
    obligaciones:
      "La Municipalidad retira los residuos en vacíos programados; la Facultad coordina la separación en origen.",
    condiciones_rescision: "Rescindido por nota del organismo en 2026: se declara la imposibilidad de sostener el calendario.",
    marco_legal: "Res. CSu 118/2019",
    resolucion: "Res. CD N° 089/2025",
    expediente: "EX-2025-0301-GDE",
    condiciones_renovacion: "Puede retomarse con un nuevo marco si la agenda ambiental vuelve a priorizarse.",
    confidencialidad: false,
    notas: "Nota de rescisión incluida como documento asociado.",
    fecha_firma: "2025-01-27",
    fecha_inicio: "2025-02-10",
    fecha_vencimiento: "2026-09-01",
    dias_preaviso: 60,
    partes: [PARTE_UNLPAM, PARTE_MUNICIPALIDAD],
    documentos: [
      { id: 105, tipo_documento: "principal", nombre_archivo: "marco_residuos.pdf", ruta_archivo: "/docs/CONV-2025-FI-0012/marco_residuos.pdf", tamano_kb: 690, version: 1, hash_sha256: "10ffcc991100", fecha_subida: "2025-01-30", subido_por: "Gestión Ingeniería" },
      { id: 106, tipo_documento: "otro", nombre_archivo: "nota_rescision.pdf", ruta_archivo: "/docs/CONV-2025-FI-0012/nota_rescision.pdf", tamano_kb: 156, version: 1, hash_sha256: "cc00ffee99", fecha_subida: "2026-08-20", subido_por: "Asuntos Jurídicos" },
    ],
    id_marcos_compatibles: [],
    id_instrumento_modificado: null,
    id_antecedente: null,
  },
  {
    id: 11,
    codigo_unico: "CONV-2025-RE-0018",
    titulo: "Convenio marco con BioCom del Centro – En revisión",
    tipo: "marco_colaboracion",
    estado: "revision",
    unidad_responsable: "Rectorado",
    id_unidad_responsable: 2,
    objeto: "Marco de colaboración en revisión por la Dirección de Asuntos Jurídicos del Rectorado.",
    alcance: "A definir al momento de la firma",
    obligaciones: "En construcción: faltan obligaciones y alcance definitivo.",
    condiciones_rescision: "Por definir",
    marco_legal: "En elaboración",
    resolucion: "—",
    expediente: "EX-2025-1102-GDE",
    condiciones_renovacion: "Por definir",
    confidencialidad: false,
    notas: "Dictamen legal cargado; faltan ajustes de cláusulas.",
    fecha_firma: null,
    fecha_inicio: null,
    fecha_vencimiento: null,
    dias_preaviso: 60,
    partes: [PARTE_RECTORADO, PARTE_BIOCOM],
    id_marcos_compatibles: [],
    id_instrumento_modificado: null,
    id_antecedente: 5,
  },
  {
    id: 12,
    codigo_unico: "PASN-2025-FI-0019",
    titulo: "Programa de pasantías informáticas versión 2025 – Aprobado",
    tipo: "especifico_pasantia",
    estado: "aprobado", // aprobado administrativamente; aún sin firmar
    unidad_responsable: "Facultad de Ingeniería",
    id_unidad_responsable: 1,
    objeto: "Ampliación del programa de pasantías al equipo de desarrollo de la empresa asociada.",
    alcance: "Hasta 4 pasantes simultáneos",
    obligaciones: "La empresa paga el estipendio y designa tutor externo; la Universidad valida horarios.",
    condiciones_rescision: "Seguirá las mismas condiciones que la pasantía de 2023.",
    marco_legal: "Res. CD 033/2025",
    resolucion: "Res. CD N° 033/2025",
    expediente: "EX-2025-1488-GDE",
    condiciones_renovacion: "Renovable por ciclo académico sobre evaluación del programa.",
    confidencialidad: false,
    notas: "La aprobación administrativa no equivale a firma digital; falta la firma para que esté vigente.",
    fecha_firma: null,
    fecha_inicio: null,
    fecha_vencimiento: null,
    dias_preaviso: null,
    partes: [PARTE_UNLPAM, PARTE_EMPRESA],
    id_marcos_compatibles: [1, 2],
    id_instrumento_modificado: null,
    id_antecedente: 3,
  },
  {
    id: 13,
    codigo_unico: "CONV-2026-RE-0022",
    titulo: "Convenio marco de colaboración en ciencia y arte – Borrador",
    tipo: "marco_colaboracion",
    estado: "borrador",
    unidad_responsable: "Rectorado",
    id_unidad_responsable: 2,
    objeto: "Borrador en construcción: marco de colaboración en los sectores de ciencia, arte y tecnología.",
    alcance: "Por definir",
    obligaciones: "Sin obligaciones cargadas: borrador en curso.",
    condiciones_rescision: "Sin definir",
    marco_legal: "—",
    resolucion: "—",
    expediente: "EX-2026-0031-GDE",
    condiciones_renovacion: "Sin definir",
    confidencialidad: false,
    notas: "Tiene una única parte cargada: antes de aprobar, deben existir al menos dos partes firmantes.",
    fecha_firma: null,
    fecha_inicio: null,
    fecha_vencimiento: null,
    dias_preaviso: null,
    partes: [PARTE_RECTORADO],
    id_marcos_compatibles: [],
    id_instrumento_modificado: null,
    id_antecedente: null,
  },
];

// ---------------------------------------------------------------------------
// Personas vinculadas (datos ficticios; mismas columnas "visibles"):
//   nombre_completo, rol, carrera, carga_horaria + tutoría, asignación,
//   seguro y periodo de vinculación.
// ---------------------------------------------------------------------------
export const PERSONAS = [
  {
    id: 1,
    id_convenio: 3,
    nombre_completo: "Bruno Arbo",
    rol: "Pasante",
    carrera: "Ingeniería en Informática",
    carga_horaria: 480,
    periodo: "2025-09-01 → 2026-02-28",
    tutoria: "Tutor académico: Ing. Marcelo Chávez · Externo: Ing. Ramón Etcheverry",
    asignacion: "Estipendio mensual $ 380.000",
    seguro: "Póliza N° 774-WC · AsegurPampa",
  },
  {
    id: 2,
    id_convenio: 4,
    nombre_completo: "Sabrina Cortez",
    rol: "Pasante",
    carrera: "Bioingeniería",
    carga_horaria: 420,
    periodo: "2025-11-01 → 2026-04-30",
    tutoria: "Tutora académica: Lic. Jimena Panza · Externa: Dra. Sofía Norton",
    asignacion: "Estipendio mensual $ 340.000",
    seguro: "Póliza N° 1023-MN · AsegurPampa",
  },
  {
    id: 3,
    id_convenio: 7,
    nombre_completo: "Diego Benítez",
    rol: "Pasante",
    carrera: "Ingeniería Industrial",
    carga_horaria: 500,
    periodo: "2026-03-01 → 2026-09-30",
    tutoria: "Tutora académica: Ing. Silvia Roldán · Externo: Lic. Diego Ponce",
    asignacion: "Estipendio mensual $ 360.000",
    seguro: "Póliza N° 445-DS · AsegurPampa",
  },
  {
    id: 4,
    id_convenio: 8,
    nombre_completo: "Lucía Ávila",
    rol: "Pasante",
    carrera: "Licenciatura en Bioquímica",
    carga_horaria: 300,
    periodo: "2025-04-01 → 2026-06-30",
    tutoria: "Tutor académico: Bioq. Ramiro Penza · Externa: Dra. Elena Aufmann",
    asignacion: "Estipendio mensual $ 290.000",
    seguro: "Póliza N° 88-LF · Seguros del Centro",
  },
  {
    id: 5,
    id_convenio: 3,
    nombre_completo: "Ing. Marcelo Chávez",
    rol: "Tutor académico",
    carrera: "Profesor de la Facultad de Ingeniería",
    carga_horaria: 6,
    periodo: "2025-09-01 → 2026-02-28",
    tutoria: "Tutela del pasante Bruno Arbo (2 charlas técnicas)",
    asignacion: "—",
    seguro: "—",
  },
  {
    id: 6,
    id_convenio: 4,
    nombre_completo: "Lic. Jimena Panza",
    rol: "Tutora académica",
    carrera: "Profesora de la Facultad de Ingeniería",
    carga_horaria: 5,
    periodo: "2025-11-01 → 2026-04-30",
    tutoria: "Tutela de la pasante Sabrina Cortez",
    asignacion: "—",
    seguro: "—",
  },
  {
    id: 7,
    id_convenio: 3,
    nombre_completo: "Analía Ferro",
    rol: "Referente externo",
    carrera: "Gerente General – TecnoLáctea S.A.",
    carga_horaria: null,
    periodo: "2023-10-10 → 2026-11-25",
    tutoria: "Supervisa el área de producción donde se realizan las pasantías",
    asignacion: "—",
    seguro: "—",
  },
  {
    id: 8,
    id_convenio: 1,
    nombre_completo: "Facundo Oliva",
    rol: "Firmante institucional",
    carrera: "Secretario de Extensión – UNLPam",
    carga_horaria: null,
    periodo: "2021-03-15 → 2026-04-01",
    tutoria: "—",
    asignacion: "—",
    seguro: "—",
  },
  {
    id: 9,
    id_convenio: 5,
    nombre_completo: "Dra. Elena Aufmann",
    rol: "Referente institucional",
    carrera: "Jefa de Vinculación – CNEA",
    carga_horaria: null,
    periodo: "2024-03-01 → vigente",
    tutoria: "—",
    asignacion: "—",
    seguro: "—",
  },
  {
    id: 10,
    id_convenio: 5,
    nombre_completo: "Valeria Paredes",
    rol: "Referente de unidad",
    carrera: "Personal del Rectorado",
    carga_horaria: null,
    periodo: "2024-03-01 → vigente",
    tutoria: "—",
    asignacion: "—",
    seguro: "—",
  },
  {
    id: 11,
    id_convenio: 4,
    nombre_completo: "Hernán Lin",
    rol: "Pasante",
    carrera: "Ingeniería Mecánica",
    carga_horaria: 450,
    periodo: "2025-08-01 → 2026-01-31",
    tutoria: "Tutor académico: Ing. Mario Sánchez · Externo: Dr. Hugo Lin",
    asignacion: "Estipendio mensual $ 350.000",
    seguro: "Póliza N° 510-RB · AsegurPampa",
  },
  {
    id: 12,
    id_convenio: 6,
    nombre_completo: "Marcos Duval",
    rol: "Pasante",
    carrera: "Ingeniería en Informática",
    carga_horaria: 480,
    periodo: "2026-05-01 → 2026-10-31",
    tutoria: "Tutor académico: Ing. Marcelo Chávez · Externa: Lic. Romina Paredes",
    asignacion: "Estipendio mensual $ 400.000",
    seguro: "Póliza N° 901-CL · Seguros del Centro",
  },
];

// ---------------------------------------------------------------------------
// Matriz de permisos (roles y alcance)
// ---------------------------------------------------------------------------
export const MATRIZ_PERMISOS = [
  {
    rol: "administracion",
    descripcion: "Administración total del sistema: alta, cierre y gestión de usuarios.",
    alcance: "Global (todas las unidades)",
    permisos: ["Alta, edición y cierre de convenios", "Gestión de usuarios y roles", "Exportación completa"],
  },
  {
    rol: "gestion",
    descripcion: "Gestión de instrumentos dentro de su unidad asignada.",
    alcance: "Unidad asignada",
    permisos: ["Alta y edición de convenios de su unidad", "Carga de documentos", "Exportación dentro del alcance"],
  },
  {
    rol: "revision",
    descripcion: "Revisa y dictamina instrumentos antes de su aprobación.",
    alcance: "Unidad asignada",
    permisos: ["Lectura completa", "Dictámenes y observaciones", "Exportación de lectura"],
  },
  {
    rol: "consulta",
    descripcion: "Consulta información dentro de la unidad asignada, sin modificarla.",
    alcance: "Unidad asignada",
    permisos: ["Solo lectura", "Exportación de lo visible"],
  },
];

/** Personas únicas vinculadas a los convenios del alcance indicado. */
export function contarPersonasUnicas(idConvenios) {
  const ids = new Set();
  PERSONAS.forEach((p) => {
    if (idConvenios.has(p.id_convenio)) ids.add(p.id);
  });
  return ids.size;
}
