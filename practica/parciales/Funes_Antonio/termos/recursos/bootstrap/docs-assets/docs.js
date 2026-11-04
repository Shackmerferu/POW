/**
 * Script interactivo para la Documentación Offline de Bootstrap 5.3.8
 * Inicializa todos los componentes JS de Bootstrap, genera bloques de código copiables,
 * gestiona el buscador en tiempo real y el cambio de tema Claro/Oscuro (data-bs-theme).
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializar Tooltips de Bootstrap
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el));

  // 2. Inicializar Popovers de Bootstrap
  const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
  [...popoverTriggerList].map(el => new bootstrap.Popover(el));

  // 3. Inicializar Checkbox Indeterminado (sección Checks & Radios)
  const indeterminateCheck = document.getElementById('flexCheckIndeterminate');
  if (indeterminateCheck) {
    indeterminateCheck.indeterminate = true;
  }

  // 4. Demo de Live Alert (sección Alerts)
  const alertPlaceholder = document.getElementById('liveAlertPlaceholder');
  const appendAlert = (message, type) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>',
      '</div>'
    ].join('');
    alertPlaceholder.append(wrapper);
  };

  const alertTrigger = document.getElementById('liveAlertBtn');
  if (alertTrigger && alertPlaceholder) {
    alertTrigger.addEventListener('click', () => {
      appendAlert('¡Genial! Has activado esta alerta dinámica en vivo con Bootstrap 5.3.8.', 'success');
    });
  }

  // 5. Demo de Live Toast (sección Toasts)
  const toastTrigger = document.getElementById('liveToastBtn');
  const toastLiveExample = document.getElementById('liveToast');
  if (toastTrigger && toastLiveExample) {
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastTrigger.addEventListener('click', () => {
      toastBootstrap.show();
    });
  }

  // 6. Demo de Modal dinámico con data-bs-whatever (sección Modal)
  const varyingModal = document.getElementById('exampleModalVarying');
  if (varyingModal) {
    varyingModal.addEventListener('show.bs.modal', event => {
      const button = event.relatedTarget;
      if (!button) return;
      const recipient = button.getAttribute('data-bs-whatever') || '@usuario';
      const modalTitle = varyingModal.querySelector('.modal-title');
      const modalBodyInput = varyingModal.querySelector('.modal-body input');
      if (modalTitle) modalTitle.textContent = `Nuevo mensaje para ${recipient}`;
      if (modalBodyInput) modalBodyInput.value = recipient;
    });
  }

  // 7. Validación de formularios de Bootstrap (.needs-validation)
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      event.stopPropagation();
      form.classList.add('was-validated');
    }, false);
  });

  // 8. Prevenir navegación de enlaces '#' vacíos dentro de demos
  document.querySelectorAll('.bd-example a[href="#"]').forEach(link => {
    link.addEventListener('click', e => {
      if (!link.hasAttribute('data-bs-toggle')) {
        e.preventDefault();
      }
    });
  });

  // 9. Generar bloques de código HTML automáticamente para cada .bd-example-snippet
  const formatHtmlSource = (html) => {
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

  document.querySelectorAll('.bd-example-snippet').forEach((snippet, idx) => {
    const exampleEl = snippet.querySelector('.bd-example');
    const customCodeEl = snippet.querySelector('.bd-custom-code');
    if (!exampleEl && !customCodeEl) return;

    const rawSource = customCodeEl ? customCodeEl.textContent : exampleEl.innerHTML;
    const formattedCode = formatHtmlSource(rawSource);

    const codeWrapper = document.createElement('div');
    codeWrapper.className = 'bd-code-wrapper';

    const toolbar = document.createElement('div');
    toolbar.className = 'bd-code-toolbar';
    toolbar.innerHTML = `
      <span class="font-monospace fw-semibold">HTML</span>
      <div class="d-flex gap-2">
        <button type="button" class="btn btn-sm btn-outline-secondary py-0 px-2 btn-copy-code" title="Copiar al portapapeles">
          Copiar código
        </button>
      </div>
    `;

    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.className = 'language-html';
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
        copyBtn.classList.replace('btn-outline-secondary', 'btn-success');
        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.classList.replace('btn-success', 'btn-outline-secondary');
        }, 1800);
      });
    });
  });

  // 10. Selector de Tema Claro / Oscuro (data-bs-theme de Bootstrap 5.3)
  const htmlEl = document.documentElement;
  const themeBtn = document.getElementById('themeSwitcher');
  const themeLabel = document.getElementById('themeSwitcherLabel');

  const applyTheme = (theme) => {
    htmlEl.setAttribute('data-bs-theme', theme);
    localStorage.setItem('bd-offline-theme', theme);
    if (themeLabel) {
      themeLabel.textContent = theme === 'dark' ? 'Modo Oscuro' : 'Modo Claro';
    }
  };

  const savedTheme = localStorage.getItem('bd-offline-theme') || 'light';
  applyTheme(savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = htmlEl.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(current);
    });
  }

  // Botones de demostración en la sección Color Modes
  document.querySelectorAll('[data-set-bs-theme]').forEach(btn => {
    btn.addEventListener('click', () => {
      applyTheme(btn.getAttribute('data-set-bs-theme'));
    });
  });

  // 11. Buscador en tiempo real y filtro por categoría
  const searchInput = document.getElementById('sidebarSearch');
  const categoryBtns = document.querySelectorAll('[data-filter-category]');
  const sections = document.querySelectorAll('.doc-section');
  const sidebarLinks = document.querySelectorAll('.bd-links-nav .nav-link');
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

      sec.classList.toggle('d-none', !isVisible);
      if (isVisible) visibleCount++;

      // Sincronizar enlace correspondiente en el sidebar
      const id = sec.getAttribute('id');
      if (id) {
        const navItem = document.querySelector(`.bd-links-nav .nav-link[href="#${id}"]`);
        if (navItem && navItem.parentElement) {
          navItem.parentElement.classList.toggle('d-none', !isVisible);
        }
      }
    });

    if (noResultsAlert) {
      noResultsAlert.classList.toggle('d-none', visibleCount > 0);
    }
  };

  if (searchInput) {
    searchInput.addEventListener('input', filterDocs);
  }

  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-filter-category');
      filterDocs();
    });
  });

  // 12. Resaltar sección activa en el Sidebar al hacer scroll
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

  // 13. Botón volver arriba
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

