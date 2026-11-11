// Toda la lógica del panel vive en un único componente React.
import React, { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./dashboard.css";

import logoFacultad from "../../cosas/imagenes/logo.png";
import persona from "../../cosas/imagenes/persona.png";

import MenuLateral from "../../componentes/MenuLateral";
import TarjetaDato from "../../componentes/TarjetaDato";
import BloqueDistribucion from "../../componentes/BloqueDistribucion";
import Tabla from "../../componentes/Tabla";
import Paginacion from "../../componentes/Paginacion";
import FiltroBusqueda from "../../componentes/FiltroBusqueda";
import BotonExportar from "../../componentes/BotonExportar";
import FichaDetalle from "../../componentes/FichaDetalle";
import { EtiquetaEstado, EtiquetaTipo, EtiquetaRol } from "../../componentes/Etiqueta";

import { CONVENIOS, UNIDADES, USUARIOS, PERSONAS, MATRIZ_PERMISOS, contarPersonasUnicas } from "../../datos/datosPanel";
import { exportarCsv, exportarPdf } from "../../utils/exportaciones";
import {
  puedeTenerAlcanceGlobal,
  puedeVerConfiguracion,
  puedeVerPanel,
  rutaInicioPorRol,
} from "../../utils/permisos";
import { limpiarSesion, obtenerUsuario } from "../../utils/sesion";
import {
  calcularVigencia,
  formatoEntero,
  formatoFecha,
  hoyIso,
  nombreUnidad,
  recortarTexto,
  textoVigencia,
} from "../../utils/formatos";

const FILAS_POR_PAGINA = 8;

const ETIQUETA_PESTAÑA = {
  metricas: "Métricas",
  administracion: "Administración",
  roles: "Roles",
  vencimientos: "Vencimientos",
};

function Dashboard() {
  const navigate = useNavigate();

  const usuario = useMemo(() => {
    const data = obtenerUsuario();
    return data && data.rol ? data : null;
  }, []);

  const alcanceGlobal = puedeTenerAlcanceGlobal(usuario);

  const [pestaña, setPestaña] = useState("metricas");
  const [convenioFicha, setConvenioFicha] = useState(null);

  const [filtros, setFiltros] = useState({
    texto: "",
    tipo: "",
    estado: "",
    unidad: "",
    desde: "",
    hasta: "",
  });

  const [pagina, setPagina] = useState(1);

  const cambiarFiltro = (campo, valor) => {
    setFiltros((anterior) => ({ ...anterior, [campo]: valor }));
    setPagina(1); 
  };

  const conveniosAlcance = useMemo(() => {
    if (alcanceGlobal) return CONVENIOS;
    return CONVENIOS.filter(
      (c) => Number(c.id_unidad_responsable) === Number(usuario?.id_unidad)
    );
  }, [alcanceGlobal, usuario]);

  const conveniosFiltrados = useMemo(() => {
    const texto = filtros.texto.trim().toLowerCase();
    return conveniosAlcance.filter((c) => {
      if (texto && !(c.titulo || "").toLowerCase().includes(texto) && !(c.codigo_unico || "").toLowerCase().includes(texto)) return false;
      if (filtros.tipo && c.tipo !== filtros.tipo) return false;
      if (filtros.estado && c.estado !== filtros.estado) return false;
      if (filtros.unidad && String(c.id_unidad_responsable) !== filtros.unidad) return false;
      if (filtros.desde && (!c.fecha_firma || c.fecha_firma < filtros.desde)) return false;
      if (filtros.hasta && (!c.fecha_firma || c.fecha_firma > filtros.hasta)) return false;
      return true;
    });
  }, [conveniosAlcance, filtros]);

  const filasPagina = useMemo(() => {
    const inicio = (pagina - 1) * FILAS_POR_PAGINA;
    return conveniosFiltrados.slice(inicio, inicio + FILAS_POR_PAGINA);
  }, [conveniosFiltrados, pagina]);

  const totalPaginas = Math.max(1, Math.ceil(conveniosFiltrados.length / FILAS_POR_PAGINA));

  const metricas = useMemo(() => {
    const hoy = hoyIso();
    const firmados = conveniosAlcance.filter((c) => c.estado === "firmado");
    const vigentes = firmados.filter(
      (c) => !c.fecha_vencimiento || c.fecha_vencimiento >= hoy
    );
    const porEstado = {};
    const porTipo = {};
    const porUnidad = {};
    const porAño = {};

    conveniosAlcance.forEach((c) => {
      porEstado[c.estado] = (porEstado[c.estado] ?? 0) + 1;
      porTipo[c.tipo] = (porTipo[c.tipo] ?? 0) + 1;
      const unidad = nombreUnidad(UNIDADES, c.id_unidad_responsable);
      porUnidad[unidad] = (porUnidad[unidad] ?? 0) + 1;
      if (c.fecha_firma) {
        const año = c.fecha_firma.slice(0, 4);
        porAño[año] = (porAño[año] ?? 0) + 1;
      }
    });

    return {
      total: conveniosAlcance.length,
      firmados: firmados.length,
      vigentes: vigentes.length,
      personasUnicas: contarPersonasUnicas(new Set(conveniosAlcance.map((c) => c.id))),
      porEstado,
      porTipo,
      porUnidad,
      porAño,
    };
  }, [conveniosAlcance]);

  const vencimientos = useMemo(() => {
    const agrupado = {
      vencidos: [],
      proximos: [],
      sinVencimiento: [],
    };

    conveniosAlcance.forEach((c) => {
      const vigencia = calcularVigencia(c);
      const fila = { convenio: c, vigencia };
      if (vigencia.estado === "vencido") agrupado.vencidos.push(fila);
      else if (vigencia.estado === "proximo") agrupado.proximos.push(fila);
      else agrupado.sinVencimiento.push(fila);
    });

    agrupado.proximos.sort((a, b) => a.vigencia.diasRestantes - b.vigencia.diasRestantes);
    agrupado.vencidos.sort((a, b) => a.vigencia.diasRestantes - b.vigencia.diasRestantes);
    return agrupado;
  }, [conveniosAlcance]);

  const COLUMNAS_EXPORTAR = [
    { titulo: "Código", clave: "codigo_unico" },
    { titulo: "Título", clave: "titulo" },
    { titulo: "Tipo", clave: "tipo_etiqueta" },
    { titulo: "Estado", clave: "estado" },
    { titulo: "Unidad", clave: "unidad_nombre" },
    { titulo: "Fecha de firma", clave: "fecha_firma_texto" },
    { titulo: "Vencimiento", clave: "fecha_vencimiento_texto" },
  ];

  const filasParaExportar = useMemo(
    () =>
      conveniosFiltrados.map((c) => ({
        codigo_unico: c.codigo_unico,
        titulo: c.titulo,
        tipo_etiqueta: c.tipo,
        estado: c.estado,
        unidad_nombre: nombreUnidad(UNIDADES, c.id_unidad_responsable),
        fecha_firma_texto: formatoFecha(c.fecha_firma),
        fecha_vencimiento_texto: c.fecha_vencimiento
          ? formatoFecha(c.fecha_vencimiento)
          : "Sin vencimiento registrado",
      })),
    [conveniosFiltrados]
  );

  const exportarCsvFiltrado = () => {
    const alcanceTexto = alcanceGlobal
      ? "Alcance: global (todas las unidades)"
      : `Alcance: ${nombreUnidad(UNIDADES, usuario.id_unidad)}`;
    exportarCsv("convenios_filtrados", COLUMNAS_EXPORTAR, filasParaExportar);
    console.info(`Exportación CSV · ${alcanceTexto} · ${filasParaExportar.length} filas`);
  };

  const exportarPdfFiltrado = () => {
    const alcanceTexto = alcanceGlobal
      ? "Alcance: global (todas las unidades)"
      : `Alcance: ${nombreUnidad(UNIDADES, usuario.id_unidad)}`;
    exportarPdf(
      "Convenios filtrados",
      `${alcanceTexto} · Estado: ${filtros.estado || "todos"} · Tipo: ${filtros.tipo || "todos"}`,
      COLUMNAS_EXPORTAR,
      filasParaExportar
    );
  };

  const cerrarSesion = () => {
    limpiarSesion();
    navigate("/login", { replace: true });
  };

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Defensa extra: si un rol sin acceso al panel llega hasta acá, lo devolvemos
  // a su pantalla de inicio (por ejemplo, consulta -> /convenios).
  if (!puedeVerPanel(usuario)) {
    return <Navigate to={rutaInicioPorRol(usuario)} replace />;
  }

  return (
    <div className="dashboard">
      <header className="top-navigation">
        <div className="brand">
          <img
            className="brand__logo"
            src={logoFacultad}
            alt="Facultad de Ingeniería"
          />
          <p className="brand__title">SISTEMA CONVENIOS</p>

          <nav className="navigation" aria-label="Navegación principal">
            <div className="dropdown flex-direction-row">
              <button className="btn dropdown-toggle m-auto" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <img src={persona} className="pe-2" alt="Flecha indicativa Label" /> Mi Perfil
              </button>
              <ul className="dropdown-menu">
                <li><h6 className="dropdown-header">Menu</h6></li>
                <li><a className="dropdown-item" href="/convenios">Busqueda</a></li>
                {puedeVerPanel(usuario) && (
                <li><a className="dropdown-item" href="/dashboard">Panel Administrativo</a></li>
                )}
                {puedeVerConfiguracion(usuario) && (
                <li><a className="dropdown-item" href="/config">Configuración</a></li>
                )}
                <li>
                  <button
                    className="dropdown-item logout-button"
                    type="button"
                    onClick={cerrarSesion}
                  >
                    Cerrar sesión
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </header>

      <div className="dashboard__cuerpo">
        <MenuLateral
          pestañaActiva={pestaña}
          alSeleccionar={setPestaña}
          usuario={usuario}
          onCerrar={cerrarSesion}
        />

        <main className="dashboard__contenido">
          <header className="dashboard__encabezado">
            <h1>{ETIQUETA_PESTAÑA[pestaña]}</h1>
            <p className="dashboard__alcance">
              {alcanceGlobal
                ? "Alcance: global (todas las unidades)"
                : `Alcance: ${nombreUnidad(UNIDADES, usuario?.id_unidad)}`}
            </p>
          </header>

          {pestaña === "metricas" && (
            <Metricas metricas={metricas} />
          )}
          {pestaña === "administracion" && (
            <Administracion
              filas={filasPagina}
              total={conveniosFiltrados.length}
              pagina={pagina}
              totalPaginas={totalPaginas}
              cambiarPagina={setPagina}
              filtros={filtros}
              cambiarFiltro={cambiarFiltro}
              limpiarFiltros={() => {
                setFiltros({ texto: "", tipo: "", estado: "", unidad: "", desde: "", hasta: "" });
                setPagina(1);
              }}
              abrirFicha={setConvenioFicha}
              unidades={UNIDADES}
              exportarCsv={exportarCsvFiltrado}
              exportarPdf={exportarPdfFiltrado}
              deshabilitado={filasParaExportar.length === 0}
            />
          )}
          {pestaña === "roles" && (
            <Roles usuario={usuario} alcances={{ usoAlcance: alcanceGlobal }} />
          )}
          {pestaña === "vencimientos" && (
            <Vencimientos
              agrupado={vencimientos}
              abrirFicha={setConvenioFicha}
            />
          )}
        </main>
      </div>

      <FichaDetalle
        convenio={convenioFicha}
        convenios={CONVENIOS}
        unidades={UNIDADES}
        onCerrar={() => setConvenioFicha(null)}
      />
    </div>
  );
}

function Metricas({ metricas }) {
  const franjasDe = (mapa) =>
    Object.entries(mapa).map(([item, cantidad]) => ({ item, cantidad }));

  const distribucionUnidad = franjasDe(metricas.porUnidad).sort((a, b) => b.cantidad - a.cantidad);
  const distribucionAño = franjasDe(metricas.porAño).sort((a, b) => a.item.localeCompare(b.item));

  return (
    <div className="metricas">
      <section className="panel-seccion">
        <VistaSeccion
          titulo="Panel de estadísticas"
          ayuda="Cantidades por estado y tipo, firmados y vigentes, y personas únicas dentro del alcance."
        />
        <div className="panel-fichas panel-fichas--fila">
          <TarjetaDato titulo="Convenios en el alcance" cantidad={formatoEntero(metricas.total)} detalle="instrumentos visibles" />
          <TarjetaDato titulo="Firmados" cantidad={formatoEntero(metricas.firmados)} detalle="con firma efectiva" />
          <TarjetaDato titulo="Vigentes" cantidad={formatoEntero(metricas.vigentes)} detalle="firmados y en vigencia" />
          <TarjetaDato titulo="Personas únicas" cantidad={formatoEntero(metricas.personasUnicas)} detalle="dentro del alcance autorizado" />
        </div>
        <div className="panel-fichas panel-fichas--distribucion">
          <BloqueDistribucion titulo="Por estado" franjas={franjasDe(metricas.porEstado)} />
          <BloqueDistribucion titulo="Por tipo" franjas={franjasDe(metricas.porTipo)} />
          <BloqueDistribucion titulo="Distribución por unidad" franjas={distribucionUnidad} />
          <BloqueDistribucion titulo="Distribución por año de firma" franjas={distribucionAño} />
        </div>
      </section>
    </div>
  );
}

function Administracion({
  filas,
  total,
  pagina,
  totalPaginas,
  cambiarPagina,
  filtros,
  cambiarFiltro,
  limpiarFiltros,
  abrirFicha,
  unidades,
  exportarCsv,
  exportarPdf,
  deshabilitado,
}) {
  return (
    <div className="administracion">
      <section className="panel-seccion">
        <div className="panel-seccion__fila">
          <VistaSeccion
            titulo="Registro de convenios"
            ayuda="Búsqueda por texto, filtros y acceso a la ficha de detalle de cada instrumento."
          />
          <BotonExportar onCsv={exportarCsv} onPdf={exportarPdf} deshabilitado={deshabilitado} />
        </div>

        <FiltroBusqueda
          filtros={filtros}
          onChange={cambiarFiltro}
          unidades={unidades}
          onLimpiar={limpiarFiltros}
        />

        <Tabla
          columnas={[
            { titulo: "Código" },
            { titulo: "Título" },
            { titulo: "Tipo" },
            { titulo: "Estado" },
            { titulo: "Unidad" },
            { titulo: "Firma" },
            { titulo: "Ficha" },
          ]}
          filas={filas}
          mensajeVacio="Ningún convenio cumple con los filtros seleccionados."
          filaRender={(c) => (
            <tr key={c.id}>
              <td className="tabla__celda-principal">{c.codigo_unico}</td>
              <td className="tabla__celda">{recortarTexto(c.titulo, 55)}</td>
              <td><EtiquetaTipo tipo={c.tipo} /></td>
              <td><EtiquetaEstado estado={c.estado} /></td>
              <td className="tabla__celda-neutra">{nombreUnidad(unidades, c.id_unidad_responsable)}</td>
              <td className="tabla__celda-neutra">{formatoFecha(c.fecha_firma)}</td>
              <td>
                <button type="button" className="tabla__accion" onClick={() => abrirFicha(c)}>
                  Ficha
                </button>
              </td>
            </tr>
          )}
        />

        <div className="administracion__pie">
          <p className="administracion__total">{formatoEntero(total)} convenio(s) listo(s) en el alcance</p>
          <Paginacion pagina={pagina} totalPaginas={totalPaginas} onChange={cambiarPagina} />
        </div>
      </section>
    </div>
  );
}

function Roles({ usuario, alcances: { usoAlcance } }) {
  const codigoPorId = Object.fromEntries(
    CONVENIOS.map((c) => [c.id, c.codigo_unico])
  );

  return (
    <div className="roles">
      <section className="panel-seccion">
        <VistaSeccion
          titulo="Roles y alcance"
          ayuda="Cada usuario opera según su rol y su alcance: global o la unidad asignada."
        />

        <div className="panel-fichas panel-fichas--matriz">
          {MATRIZ_PERMISOS.map((permiso) => (
            <article className="panel-permiso" key={permiso.rol}>
              <header className="panel-permiso__encabezado">
                <EtiquetaRol rol={permiso.rol} />
                <span className="panel-permiso__alcance">{permiso.alcance}</span>
              </header>
              <p className="panel-permiso__descripcion">{permiso.descripcion}</p>
              <ul className="panel-permiso__permisos">
                {permiso.permisos.map((texto) => (
                  <li key={texto}>{texto}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="panel-seccion__fila panel-seccion__fila--explode">
          <p className="roles__nota">
            {usoAlcance
              ? "Tu usuario tiene alcance global: ves todas las unidades."
              : `Tu usuario (${usuario.rol}) solo consulta la unidad asignada.`}
          </p>
        </div>
      </section>

      <section className="panel-seccion">
        <VistaSeccion titulo="Usuarios y alcance" ayuda="Listado ficticio asociado a cada rol y su unidad." />
        <Tabla
          columnas={[
            { titulo: "Legajo" },
            { titulo: "Nombre y apellido" },
            { titulo: "Rol" },
            { titulo: "Alcance" },
          ]}
          filas={USUARIOS.filter((u) => {
            if (usoAlcance) return true;
            return u.legajo === usuario.legajo || u.id_unidad === usuario.id_unidad;
          })}
          mensajeVacio="Sin usuarios visibles dentro de tu alcance."
          filaRender={(u) => (
            <tr key={u.id}>
              <td className="tabla__celda-principal">{u.legajo}</td>
              <td>{u.nombre_completo}</td>
              <td><EtiquetaRol rol={u.rol} /></td>
              <td className="tabla__celda-neutra">
                {u.id_unidad === null ? "Global (todas las unidades)" : nombreUnidad(UNIDADES, u.id_unidad)}
              </td>
            </tr>
          )}
        />
      </section>

      <section className="panel-seccion">
        <VistaSeccion
          titulo="Personas y pasantías"
          ayuda="Personas vinculadas a los instrumentos del alcance, con rol, periodo y datos complementarios de las pasantías."
        />
        <Tabla
          columnas={[
            { titulo: "Persona" },
            { titulo: "Rol" },
            { titulo: "Convenio" },
            { titulo: "Carrera" },
            { titulo: "Carga horaria" },
            { titulo: "Periodo" },
            { titulo: "Tutoría" },
            { titulo: "Asignación" },
            { titulo: "Seguro" },
          ]}
          filas={PERSONAS}
          mensajeVacio="Sin personas vinculadas en tu alcance."
          filaRender={(persona) => (
            <tr key={persona.id}>
              <td className="tabla__celda-principal">{persona.nombre_completo}</td>
              <td><span className="etiqueta">{persona.rol}</span></td>
              <td className="tabla__celda-neutra">
                {codigoPorId[persona.id_convenio] ?? "—"}
              </td>
              <td className="tabla__celda-neutra">{persona.carrera}</td>
              <td className="tabla__celda-neutra">{persona.carga_horaria ? `${persona.carga_horaria} h` : "—"}</td>
              <td className="tabla__celda-neutra">{persona.periodo}</td>
              <td>{recortarTexto(persona.tutoria, 46)}</td>
              <td className="tabla__celda-neutra">{persona.asignacion}</td>
              <td className="tabla__celda-neutra">{persona.seguro}</td>
            </tr>
          )}
        />
        <p className="roles__nota roles__nota--pie">
          Datos ficticios para mostrar los campos complementarios de las pasantías.
        </p>
      </section>
    </div>
  );
}

function Vencimientos({ agrupado, abrirFicha }) {
  return (
    <div className="vencimientos">
      <section className="panel-seccion">
        <VistaSeccion
          titulo="Plazos de cada instrumento"
          ayuda="El vencimiento y el preaviso se calculan con los datos registrados."
        />

        <div className="panel-fichas panel-fichas--fila">
          <TarjetaDato titulo="Vencidos" cantidad={agrupado.vencidos.length} detalle="fecha ya pasada" />
          <TarjetaDato titulo="Próximos a vencer" cantidad={agrupado.proximos.length} detalle="dentro de 45 días" />
          <TarjetaDato titulo="Vigentes" cantidad={agrupado.sinVencimiento.filter((f) => f.vigencia.estado === "vigente").length} detalle="mas allá de 45 días" />
          <TarjetaDato titulo="Sin vencimiento" cantidad={agrupado.sinVencimiento.filter((f) => f.vigencia.estado === "sin_vencimiento").length} detalle="sin fecha final registrada" />
        </div>
      </section>

      <section className="panel-seccion">
        <VistaSeccion titulo="Próximos a vencer" ayuda="Preaviso calculado a partir de la fecha final y los días registrados." />
        <Tabla
          columnas={[
            { titulo: "Código" },
            { titulo: "Instrumento" },
            { titulo: "Vencimiento" },
            { titulo: "Preaviso" },
            { titulo: "Ficha" },
          ]}
          filas={agrupado.proximos}
          mensajeVacio="Nada próximo a vencer dentro de los próximos 45 días."
          filaRender={({ convenio: c, vigencia }) => (
            <tr key={c.id}>
              <td className="tabla__celda-principal">{c.codigo_unico}</td>
              <td className="tabla__celda">{recortarTexto(c.titulo, 50)}</td>
              <td className="tabla__celda-neutra">
                {formatoFecha(c.fecha_vencimiento)} · {textoVigencia(vigencia)}
              </td>
              <td className="tabla__celda-neutra">
                {vigencia.fechaPreaviso
                  ? `${formatoFecha(vigencia.fechaPreaviso)} (${vigencia.diasPreaviso} días)`
                  : "—"}
              </td>
              <td>
                <button type="button" className="tabla__accion" onClick={() => abrirFicha(c)}>
                  Ficha
                </button>
              </td>
            </tr>
          )}
        />
      </section>

      <section className="panel-seccion">
        <VistaSeccion titulo="Vencidos" ayuda="Instrumentos cuya fecha final ya pasó." />
        <Tabla
          columnas={[
            { titulo: "Código" },
            { titulo: "Instrumento" },
            { titulo: "Vencimiento" },
            { titulo: "Ficha" },
          ]}
          filas={agrupado.vencidos}
          mensajeVacio="Sin instrumentos vencidos en el alcance actual."
          filaRender={({ convenio: c, vigencia }) => (
            <tr key={c.id}>
              <td className="tabla__celda-principal">{c.codigo_unico}</td>
              <td className="tabla__celda">{recortarTexto(c.titulo, 55)}</td>
              <td className="tabla__celda-neutra">
                {formatoFecha(c.fecha_vencimiento)} · {textoVigencia(vigencia)}
              </td>
              <td>
                <button type="button" className="tabla__accion" onClick={() => abrirFicha(c)}>
                  Ficha
                </button>
              </td>
            </tr>
          )}
        />
      </section>

      <section className="panel-seccion">
        <VistaSeccion
          titulo="Sin vencimiento registrado"
          ayuda="Instrumentos sin fecha final registrada: se informa tal cual, sin inventar plazos."
        />
        <Tabla
          columnas={[
            { titulo: "Código" },
            { titulo: "Instrumento" },
            { titulo: "Estado" },
            { titulo: "Ficha" },
          ]}
          filas={agrupado.sinVencimiento}
          mensajeVacio="Todos los instrumentos del alcance tienen fecha final registrada."
          filaRender={({ convenio: c }) => (
            <tr key={c.id}>
              <td className="tabla__celda-principal">{c.codigo_unico}</td>
              <td className="tabla__celda">{recortarTexto(c.titulo, 55)}</td>
              <td className="tabla__celda-neutra">Sin vencimiento registrado</td>
              <td>
                <button type="button" className="tabla__accion" onClick={() => abrirFicha(c)}>
                  Ficha
                </button>
              </td>
            </tr>
          )}
        />
      </section>
    </div>
  );
}

function VistaSeccion({ titulo, ayuda }) {
  return (
    <div className="vista-seccion">
      <h2>{titulo}</h2>
      {ayuda && <p>{ayuda}</p>}
    </div>
  );
}

export default Dashboard;