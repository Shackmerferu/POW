// Preferencias de accesibilidad del usuario (WCAG 2.1 aplicadas al sistema).
// Se guardan en localStorage y se aplican como clases sobre <html>, así
// afectan a toda la aplicación sin importar la página.
//
//   accesibilidad-texto-pequeno    → tipografía base al 100% (tamaño anterior "normal")
//   accesibilidad-texto-normal     → tipografía base al 110%
//   accesibilidad-texto-grande     → tipografía base al 125%
//   accesibilidad-contraste        → paleta de alto contraste
//   accesibilidad-sin-animaciones  → reduce animaciones y transiciones

const CLAVE_ALMACEN = "accesibilidad";

// Única fuente de verdad para las opciones de tamaño de texto: la UI de
// /config y las clases CSS usan estos mismos valores.
export const TAMANOS_TEXTO = {
  pequeno: { etiqueta: "Pequeño (100%)", clase: "accesibilidad-texto-pequeno" },
  normal: { etiqueta: "Normal (110%)", clase: "accesibilidad-texto-normal" },
  grande: { etiqueta: "Grande (125%)", clase: "accesibilidad-texto-grande" },
};

export const PREFS_POR_DEFECTO = {
  tamanoTexto: "normal",
  contrasteAlto: false,
  animacionesReducidas: false,
};

export function leerPreferencias() {
  try {
    const guardadas = JSON.parse(localStorage.getItem(CLAVE_ALMACEN)) ?? {};
    const preferencias = { ...PREFS_POR_DEFECTO, ...guardadas };

    // Migración del formato anterior (textoGrande: true/false): el "normal"
    // viejo equivalía al 100%, que ahora es la opción "pequeño".
    if (!TAMANOS_TEXTO[preferencias.tamanoTexto]) {
      preferencias.tamanoTexto =
        guardadas.textoGrande === true ? "grande" : "pequeno";
    }
    delete preferencias.textoGrande;

    return preferencias;
  } catch {
    return { ...PREFS_POR_DEFECTO };
  }
}

export function aplicarPreferencias(preferencias) {
  const raiz = document.documentElement;
  const tamano = TAMANOS_TEXTO[preferencias.tamanoTexto]
    ? preferencias.tamanoTexto
    : PREFS_POR_DEFECTO.tamanoTexto;

  Object.entries(TAMANOS_TEXTO).forEach(([clave, opcion]) => {
    raiz.classList.toggle(opcion.clase, clave === tamano);
  });

  raiz.classList.toggle(
    "accesibilidad-contraste",
    Boolean(preferencias.contrasteAlto),
  );
  raiz.classList.toggle(
    "accesibilidad-sin-animaciones",
    Boolean(preferencias.animacionesReducidas),
  );
}

export function guardarPreferencias(preferencias) {
  localStorage.setItem(CLAVE_ALMACEN, JSON.stringify(preferencias));
  aplicarPreferencias(preferencias);
}

/** Se llama una vez al arrancar la app para restablecer lo que el usuario
 *  configuró en su sesión anterior. */
export function inicializarAccesibilidad() {
  aplicarPreferencias(leerPreferencias());
}
