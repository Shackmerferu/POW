// ======================================
// MENU HAMBURGUESA
// ======================================

const navToggle = document.getElementById("navToggle");
const navLinks = document.querySelector(".nav-links");

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  navToggle.classList.toggle("active");

  const menuAbierto = navLinks.classList.contains("open");

  navToggle.setAttribute("aria-expanded", menuAbierto);
});

// Cerrar menú al seleccionar una sección

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.classList.remove("active");

    navToggle.setAttribute("aria-expanded", "false");
  });
});

// ======================================
// CAMBIO DE TEMA
// ======================================

const toggle = document.getElementById("themeToggle");
const root = document.documentElement;

// Recuperar tema guardado

const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
  root.setAttribute("data-theme", savedTheme);
}

// Alternar tema

toggle.addEventListener("click", () => {
  const current = root.getAttribute("data-theme");

  const next = current === "dark" ? "light" : "dark";

  root.setAttribute("data-theme", next);

  localStorage.setItem("theme", next);
});

// ======================================
// ANIMACIONES AL DESPLAZARSE
// ======================================

const revealElements = document.querySelectorAll(
  ".project-card, .skill-card, .section-title, .about-grid, .contact-content",
);

// Agregar clase inicial de animación

revealElements.forEach((element) => {
  element.classList.add("reveal");
});

// Observar elementos visibles

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");

        observer.unobserve(entry.target);
      }
    });
  },

  {
    threshold: 0.1,
  },
);

// Registrar elementos para observar

revealElements.forEach((element) => {
  observer.observe(element);
});
