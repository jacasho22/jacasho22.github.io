/**
 * ui.js - Funciones para manejar la interfaz de usuario
 * Gestiona interacciones, animaciones y comportamientos de la UI
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar todos los componentes de la UI
  initNavbar();
  initTabs();
  initTooltips();
  initScrollAnimations();
  initFormValidation();
  initDarkModeToggle();
});

/**
 * Inicializa el comportamiento de la barra de navegación
 */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const navbarToggler = document.querySelector('.navbar-toggler');
  
  if (!navbar || !navbarToggler) return;
  
  // Manejar el scroll para cambiar el estilo de la navbar
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  });
  
  // Cerrar el menú móvil al hacer clic en un enlace
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarCollapse.classList.contains('show')) {
        navbarToggler.click();
      }
    });
  });
}

/**
 * Inicializa el sistema de pestañas
 */
function initTabs() {
  const tabLinks = document.querySelectorAll('[data-bs-toggle="tab"]');
  
  tabLinks.forEach(tabLink => {
    tabLink.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Obtener el target del tab
      const targetId = this.getAttribute('href');
      if (!targetId) return;
      
      // Desactivar todos los tabs y contenidos
      const tabContainer = this.closest('.nav-tabs, .nav-pills');
      if (!tabContainer) return;
      
      const contentContainer = document.querySelector(tabContainer.getAttribute('data-bs-target') || '.tab-content');
      if (!contentContainer) return;
      
      // Desactivar todos los tabs
      tabContainer.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
      });
      
      // Desactivar todos los contenidos
      contentContainer.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('show', 'active');
      });
      
      // Activar el tab seleccionado
      this.classList.add('active');
      
      // Activar el contenido seleccionado
      const targetPane = document.querySelector(targetId);
      if (targetPane) {
        targetPane.classList.add('show', 'active');
        
        // Disparar evento para notificar cambio de tab
        const tabChangeEvent = new CustomEvent('tabChanged', {
          detail: {
            tabId: targetId.replace('#', ''),
            tabElement: targetPane
          }
        });
        document.dispatchEvent(tabChangeEvent);
      }
    });
  });
  
  // Activar el primer tab si ninguno está activo
  document.querySelectorAll('.nav-tabs, .nav-pills').forEach(tabContainer => {
    if (!tabContainer.querySelector('.nav-link.active')) {
      const firstTab = tabContainer.querySelector('.nav-link');
      if (firstTab) firstTab.click();
    }
  });
}

/**
 * Inicializa los tooltips
 */
function initTooltips() {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltipTriggerList.forEach(tooltipTriggerEl => {
    new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

/**
 * Inicializa las animaciones de scroll
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  if (animatedElements.length === 0) return;
  
  // Función para verificar si un elemento está en el viewport
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
      rect.bottom >= 0
    );
  }
  
  // Función para animar elementos visibles
  function animateVisibleElements() {
    animatedElements.forEach(element => {
      if (isElementInViewport(element) && !element.classList.contains('animated')) {
        element.classList.add('animated');
      }
    });
  }
  
  // Ejecutar al cargar la página
  animateVisibleElements();
  
  // Ejecutar al hacer scroll
  window.addEventListener('scroll', animateVisibleElements);
}

/**
 * Inicializa la validación de formularios
 */
function initFormValidation() {
  const forms = document.querySelectorAll('.needs-validation');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      
      form.classList.add('was-validated');
    }, false);
    
    // Validación en tiempo real
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        // Validar solo este campo
        if (this.checkValidity()) {
          this.classList.remove('is-invalid');
          this.classList.add('is-valid');
        } else {
          this.classList.remove('is-valid');
          this.classList.add('is-invalid');
        }
      });
    });
  });
}

/**
 * Inicializa el toggle de modo oscuro
 */
function initDarkModeToggle() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (!darkModeToggle) return;
  
  // Verificar preferencia guardada
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  
  // Aplicar modo oscuro si está guardado
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true;
  }
  
  // Cambiar modo al hacer clic en el toggle
  darkModeToggle.addEventListener('change', function() {
    if (this.checked) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'false');
    }
    
    // Actualizar gráficos si existen
    if (window.Chart && Chart.instances) {
      Chart.instances.forEach(chart => {
        chart.update();
      });
    }
  });
}

/**
 * Muestra un mensaje de alerta
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de alerta (success, danger, warning, info)
 * @param {number} duration - Duración en milisegundos
 */
function showAlert(message, type = 'info', duration = 3000) {
  // Crear el elemento de alerta
  const alertEl = document.createElement('div');
  alertEl.className = `alert alert-${type} alert-dismissible fade show custom-alert`;
  alertEl.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  
  // Añadir al contenedor de alertas o al body
  const alertContainer = document.getElementById('alertContainer') || document.body;
  alertContainer.appendChild(alertEl);
  
  // Configurar auto-cierre
  if (duration > 0) {
    setTimeout(() => {
      alertEl.classList.remove('show');
      setTimeout(() => alertEl.remove(), 300);
    }, duration);
  }
  
  // Configurar cierre manual
  const closeBtn = alertEl.querySelector('.btn-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      alertEl.classList.remove('show');
      setTimeout(() => alertEl.remove(), 300);
    });
  }
  
  return alertEl;
}

/**
 * Carga datos de forma asíncrona
 * @param {string} url - URL para cargar los datos
 * @param {Object} params - Parámetros para la petición
 * @returns {Promise} Promesa con los datos
 */
async function loadData(url, params = {}) {
  try {
    // Construir URL con parámetros
    const queryParams = new URLSearchParams(params).toString();
    const fullUrl = queryParams ? `${url}?${queryParams}` : url;
    
    // Realizar la petición
    const response = await fetch(fullUrl);
    
    // Verificar si la respuesta es correcta
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    // Parsear la respuesta como JSON
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error cargando datos:', error);
    showAlert(`Error cargando datos: ${error.message}`, 'danger');
    throw error;
  }
}

/**
 * Exporta datos a diferentes formatos
 * @param {string} url - URL para exportar los datos
 * @param {string} format - Formato de exportación (csv, excel, json)
 * @param {Object} params - Parámetros adicionales
 */
function exportData(url, format = 'csv', params = {}) {
  // Añadir formato a los parámetros
  const exportParams = { ...params, format };
  const queryParams = new URLSearchParams(exportParams).toString();
  const fullUrl = `${url}?${queryParams}`;
  
  // Crear un enlace temporal y simular clic
  const link = document.createElement('a');
  link.href = fullUrl;
  link.target = '_blank';
  link.download = `datos_exportados.${format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Exportar funciones
window.uiUtils = {
  showAlert,
  loadData,
  exportData
};