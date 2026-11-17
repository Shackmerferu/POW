// Preferencias de accesibilidad del usuario (WCAG 2.1 aplicadas al sistema).
// Se guardan en localStorage y se aplican como clases sobre <html>, así
// afectan a toda la aplicación sin importar la página.
//
//   accesibilidad-texto-grande     → agranda la tipografía base
//   accesibilidad-contraste        → paleta de alto contraste
//   accesibilidad-sin-animaciones  → reduce animaciones y transiciones

const CLAVE_ALMACEN = "accesibilidad";

export const PREFS_POR_DEFECTO = {
  textoGrande: false,
  contrasteAlto: false,
  animacionesReducidas: false,
};

export function leerPreferencias() {
  try {
    const guardadas = JSON.parse(localStorage.getItem(CLAVE_ALMACEN));
    return { ...PREFS_POR_DEFECTO, ...guardadas };
  } catch {
    return { ...PREFS_POR_DEFECTO };
  }
}

export function aplicarPreferencias(preferencias) {
  const raiz = document.documentElement;
  raiz.classList.toggle(
    "accesibilidad-texto-grande",
    Boolean(preferencias.textoGrande),
  );
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
