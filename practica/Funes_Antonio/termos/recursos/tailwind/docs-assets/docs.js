/**
 * Script interactivo para la Documentación Offline de Tailwind CSS v4
 * Genera bloques de código copiables, gestiona el buscador, el modo oscuro (.dark)
 * y la interactividad de los 24 componentes de interfaz construidos con utilidades Tailwind.
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Generar bloques de código HTML/Config automáticamente ANTES de manipular el DOM
  const formatSource = (html) => {
    const lines = html.replace(/\r\n/g, '\n').split('\n');
    while (lines.length && lines[0].trim() === '') lines.shift();
    while (lines.length && lines[lines.length - 1].trim() === '') lines.pop();
    const minIndent = lines
      .filter(line => line.trim().length > 0)
      .reduce((min, line) => {
        const match = line.match(/^(\s*)/);
        return Math.min(min, match ? match[1].length : 0);
      }, Infinity);
    const cleanIndent = Number.isFinite(minIndent) ? minIndent : 0;
    return lines.map(line => line.slice(cleanIndent)).join('\n');
  };

  document.querySelectorAll('.bd-example-snippet').forEach(snippet => {
    const exampleEl = snippet.querySelector('.bd-example');
    const customCodeEl = snippet.querySelector('.bd-custom-code');
    if (!exampleEl && !customCodeEl) return;

    const langLabel = customCodeEl ? (customCodeEl.getAttribute('data-lang') || 'Código') : 'HTML (Tailwind CSS)';
    const rawSource = customCodeEl ? customCodeEl.textContent : exampleEl.innerHTML;
    const formattedCode = formatSource(rawSource);

    const codeWrapper = document.createElement('div');
    codeWrapper.className = 'bd-code-wrapper';

    const toolbar = document.createElement('div');
    toolbar.className = 'bd-code-toolbar';
    toolbar.innerHTML = `
      <span class="font-mono font-semibold">${langLabel}</span>
      <button type="button" class="px-2.5 py-1 text-xs font-medium rounded border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer btn-copy-code">
        Copiar código
      </button>
    `;

    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.textContent = formattedCode;
    pre.appendChild(code);

    codeWrapper.appendChild(toolbar);
    codeWrapper.appendChild(pre);
    snippet.appendChild(codeWrapper);

    const copyBtn = toolbar.querySelector('.btn-copy-code');
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(formattedCode).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '¡Copiado!';
        copyBtn.classList.add('bg-emerald-600', 'text-white', 'border-emerald-600');
        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.classList.remove('bg-emerald-600', 'text-white', 'border-emerald-600');
        }, 1800);
      });
    });
  });

  // 2. Selector de Tema Claro / Oscuro (clase .dark en <html>)
  const htmlEl = document.documentElement;
  const themeBtn = document.getElementById('themeSwitcher');
  const themeLabel = document.getElementById('themeSwitcherLabel');

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      htmlEl.classList.add('dark');
    } else {
      htmlEl.classList.remove('dark');
    }
    localStorage.setItem('tw-offline-theme', theme);
    if (themeLabel) {
      themeLabel.textContent = theme === 'dark' ? 'Modo Oscuro' : 'Modo Claro';
    }
  };

  const savedTheme = localStorage.getItem('tw-offline-theme') || 'light';
  applyTheme(savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = htmlEl.classList.contains('dark') ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  document.querySelectorAll('[data-set-tw-theme]').forEach(btn => {
    btn.addEventListener('click', () => {
      applyTheme(btn.getAttribute('data-set-tw-theme'));
    });
  });

  // 3. Sidebar móvil
  const mobileSidebar = document.getElementById('twSidebar');
  const openSidebarBtn = document.getElementById('btnMobileSidebar');
  const closeSidebarBtn = document.getElementById('closeMobileSidebar');

  if (openSidebarBtn && mobileSidebar) {
    openSidebarBtn.addEventListener('click', () => {
      mobileSidebar.classList.remove('hidden');
      mobileSidebar.classList.add('fixed', 'inset-y-0', 'left-0', 'z-50', 'w-72', 'p-4', 'overflow-y-auto', 'shadow-2xl');
    });
  }
  if (closeSidebarBtn && mobileSidebar) {
    closeSidebarBtn.addEventListener('click', () => {
      mobileSidebar.classList.add('hidden');
      mobileSidebar.classList.remove('fixed', 'inset-y-0', 'left-0', 'z-50', 'w-72', 'p-4', 'overflow-y-auto', 'shadow-2xl');
    });
  }

  // 4. Buscador en tiempo real y filtros por categoría
  const searchInput = document.getElementById('sidebarSearch');
  const categoryBtns = document.querySelectorAll('[data-filter-category]');
  const sections = document.querySelectorAll('.doc-section');
  const sidebarLinks = document.querySelectorAll('.tw-links-nav .nav-link');
  const noResultsAlert = document.getElementById('noSearchResults');
  let activeCategory = 'all';

  const filterDocs = () => {
    const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
    let visibleCount = 0;

    sections.forEach(sec => {
      const secCat = sec.getAttribute('data-category') || '';
      const secText = sec.textContent.toLowerCase();
      const matchesCat = activeCategory === 'all' || secCat === activeCategory;
      const matchesQuery = !query || secText.includes(query);
      const isVisible = matchesCat && matchesQuery;

      sec.classList.toggle('hidden', !isVisible);
      if (isVisible) visibleCount++;

      const id = sec.getAttribute('id');
      if (id) {
        const navItem = document.querySelector(`.tw-links-nav .nav-link[href="#${id}"]`);
        if (navItem && navItem.parentElement) {
          navItem.parentElement.classList.toggle('hidden', !isVisible);
        }
      }
    });

    if (noResultsAlert) {
      noResultsAlert.classList.toggle('hidden', visibleCount > 0);
    }
  };

  if (searchInput) {
    searchInput.addEventListener('input', filterDocs);
  }

  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => {
        b.classList.remove('bg-sky-600', 'text-white');
        b.classList.add('bg-white', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-200');
      });
      btn.classList.add('bg-sky-600', 'text-white');
      btn.classList.remove('bg-white', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-200');
      activeCategory = btn.getAttribute('data-filter-category');
      filterDocs();
    });
  });

  // 5. Interactividad de componentes Tailwind CSS
  // 5a. Cerrar alertas descartables ([data-tw-dismiss="alert"])
  document.addEventListener('click', e => {
    const dismissBtn = e.target.closest('[data-tw-dismiss="alert"]');
    if (dismissBtn) {
      const alertBox = dismissBtn.closest('.tw-alert-box');
      if (alertBox) alertBox.remove();
    }
  });

  // 5b. Live Alert
  const liveAlertBtn = document.getElementById('twLiveAlertBtn');
  const liveAlertContainer = document.getElementById('twLiveAlertContainer');
  if (liveAlertBtn && liveAlertContainer) {
    liveAlertBtn.addEventListener('click', () => {
      const alertEl = document.createElement('div');
      alertEl.className = 'tw-alert-box flex items-center justify-between p-4 mb-3 text-sm text-emerald-800 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
      alertEl.innerHTML = `
        <div class="flex items-center gap-2">
          <span class="font-bold">¡Éxito!</span> Alerta generada dinámicamente con utilidades de Tailwind CSS v4.
        </div>
        <button type="button" data-tw-dismiss="alert" class="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 font-bold px-2 cursor-pointer">✕</button>
      `;
      liveAlertContainer.appendChild(alertEl);
    });
  }

  // 5c. Carousel
  const carouselTrack = document.getElementById('twCarouselTrack');
  if (carouselTrack) {
    const slides = carouselTrack.children;
    let currentSlide = 0;
    const goToSlide = (index) => {
      currentSlide = (index + slides.length) % slides.length;
      carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
      document.querySelectorAll('[data-tw-slide-to]').forEach((dot, idx) => {
        dot.classList.toggle('bg-white', idx === currentSlide);
        dot.classList.toggle('bg-white/50', idx !== currentSlide);
      });
    };
    document.querySelector('[data-tw-carousel-prev]')?.addEventListener('click', () => goToSlide(currentSlide - 1));
    document.querySelector('[data-tw-carousel-next]')?.addEventListener('click', () => goToSlide(currentSlide + 1));
    document.querySelectorAll('[data-tw-slide-to]').forEach(dot => {
      dot.addEventListener('click', () => goToSlide(Number(dot.getAttribute('data-tw-slide-to'))));
    });
  }

  // 5d. Collapse
  document.querySelectorAll('[data-tw-collapse]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(btn.getAttribute('data-tw-collapse'));
      if (target) target.classList.toggle('hidden');
    });
  });

  // 5e. Dropdowns
  document.querySelectorAll('[data-tw-dropdown]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const menu = document.querySelector(btn.getAttribute('data-tw-dropdown'));
      document.querySelectorAll('.tw-dropdown-menu').forEach(m => {
        if (m !== menu) m.classList.add('hidden');
      });
      if (menu) menu.classList.toggle('hidden');
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.tw-dropdown-menu').forEach(m => m.classList.add('hidden'));
  });

  // 5f. Modals
  document.querySelectorAll('[data-tw-modal-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = document.querySelector(btn.getAttribute('data-tw-modal-open'));
      if (modal) modal.classList.remove('hidden');
    });
  });
  document.querySelectorAll('[data-tw-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.tw-modal');
      if (modal) modal.classList.add('hidden');
    });
  });

  // 5g. Navbar móvil demo
  const navToggle = document.getElementById('twNavbarToggle');
  const navMenu = document.getElementById('twNavbarMenu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => navMenu.classList.toggle('hidden'));
  }

  // 5h. Tabs interactivos
  document.querySelectorAll('[data-tw-tab]').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      const targetSelector = tabBtn.getAttribute('data-tw-tab');
      const group = tabBtn.closest('[data-tw-tab-group]');
      if (!group) return;

      group.querySelectorAll('[data-tw-tab]').forEach(btn => {
        btn.classList.remove('border-sky-600', 'text-sky-600', 'dark:text-sky-400', 'dark:border-sky-400');
        btn.classList.add('border-transparent', 'text-slate-500');
      });
      tabBtn.classList.add('border-sky-600', 'text-sky-600', 'dark:text-sky-400', 'dark:border-sky-400');
      tabBtn.classList.remove('border-transparent', 'text-slate-500');

      document.querySelectorAll('.tw-tab-pane').forEach(pane => pane.classList.add('hidden'));
      const activePane = document.querySelector(targetSelector);
      if (activePane) activePane.classList.remove('hidden');
    });
  });

  // 5i. Offcanvas / Drawer
  document.querySelectorAll('[data-tw-drawer-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      const drawer = document.querySelector(btn.getAttribute('data-tw-drawer-open'));
      if (drawer) drawer.classList.remove('hidden');
    });
  });
  document.querySelectorAll('[data-tw-drawer-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const drawer = btn.closest('.tw-drawer');
      if (drawer) drawer.classList.add('hidden');
    });
  });

  // 5j. Popover
  document.querySelectorAll('[data-tw-popover]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const pop = document.querySelector(btn.getAttribute('data-tw-popover'));
      if (pop) pop.classList.toggle('hidden');
    });
  });

  // 5k. Scrollspy demo
  const spyContainer = document.getElementById('twScrollspyContainer');
  const spyLinks = document.querySelectorAll('[data-tw-spy-link]');
  if (spyContainer && spyLinks.length) {
    spyContainer.addEventListener('scroll', () => {
      const headings = spyContainer.querySelectorAll('[data-tw-spy-section]');
      let currentId = headings[0]?.id;
      headings.forEach(h => {
        if (spyContainer.scrollTop >= h.offsetTop - spyContainer.offsetTop - 40) {
          currentId = h.id;
        }
      });
      spyLinks.forEach(link => {
        const isCurrent = link.getAttribute('href') === `#${currentId}`;
        link.classList.toggle('bg-sky-600', isCurrent);
        link.classList.toggle('text-white', isCurrent);
      });
    });
  }

  // 5l. Live Toast
  const liveToastBtn = document.getElementById('twLiveToastBtn');
  const liveToastEl = document.getElementById('twLiveToast');
  if (liveToastBtn && liveToastEl) {
    liveToastBtn.addEventListener('click', () => {
      liveToastEl.classList.remove('hidden');
      setTimeout(() => liveToastEl.classList.add('hidden'), 4000);
    });
  }

  // 6. Prevenir salto de enlaces '#' de ejemplo
  document.querySelectorAll('.bd-example a[href="#"]').forEach(link => {
    link.addEventListener('click', e => e.preventDefault());
  });

  // 7. Resaltar enlace activo del Sidebar al hacer scroll
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        sidebarLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-80px 0px -70% 0px', threshold: 0 });

  sections.forEach(sec => observer.observe(sec));

  // 8. Botón volver arriba
  const btnBackToTop = document.getElementById('btnBackToTop');
  if (btnBackToTop) {
    window.addEventListener('scroll', () => {
      btnBackToTop.style.display = window.scrollY > 400 ? 'block' : 'none';
    });
    btnBackToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

