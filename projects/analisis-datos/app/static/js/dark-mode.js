/**
 * Módulo para gestionar el tema oscuro/claro de la aplicación
 * Permite cambiar entre temas y guardar la preferencia del usuario
 */

const DarkMode = (function() {
  // Elementos DOM
  let darkModeToggle;
  let darkModeIcon;
  let lightModeIcon;
  
  // Nombre de la clave en localStorage
  const STORAGE_KEY = 'analisis_datos_theme';
  
  // Clases CSS para el tema oscuro
  const DARK_MODE_CLASS = 'dark-mode';
  const LIGHT_MODE_CLASS = 'light-mode';
  
  /**
   * Inicializa el módulo de tema oscuro
   */
  function init() {
    // Obtener elementos del DOM
    darkModeToggle = document.getElementById('dark-mode-toggle');
    darkModeIcon = document.getElementById('dark-mode-icon');
    lightModeIcon = document.getElementById('light-mode-icon');
    
    if (!darkModeToggle) {
      console.warn('Elemento de alternancia de modo oscuro no encontrado');
      return;
    }
    
    // Cargar preferencia guardada o usar preferencia del sistema
    loadSavedTheme();
    
    // Agregar evento de clic al botón de alternancia
    darkModeToggle.addEventListener('click', toggleDarkMode);
    
    // Agregar evento para detectar cambios en la preferencia del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleSystemThemeChange);
  }
  
  /**
   * Carga el tema guardado o usa la preferencia del sistema
   */
  function loadSavedTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    
    if (savedTheme) {
      // Usar tema guardado
      setTheme(savedTheme === 'dark');
    } else {
      // Usar preferencia del sistema
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDarkMode);
    }
  }
  
  /**
   * Maneja cambios en la preferencia del tema del sistema
   * @param {MediaQueryListEvent} event - Evento de cambio de media query
   */
  function handleSystemThemeChange(event) {
    // Solo cambiar automáticamente si el usuario no ha establecido una preferencia
    if (!localStorage.getItem(STORAGE_KEY)) {
      setTheme(event.matches);
    }
  }
  
  /**
   * Alterna entre modo oscuro y claro
   */
  function toggleDarkMode() {
    const isDarkMode = document.body.classList.contains(DARK_MODE_CLASS);
    setTheme(!isDarkMode);
    
    // Guardar preferencia
    localStorage.setItem(STORAGE_KEY, !isDarkMode ? 'dark' : 'light');
  }
  
  /**
   * Establece el tema de la aplicación
   * @param {boolean} isDark - Verdadero para tema oscuro, falso para tema claro
   */
  function setTheme(isDark) {
    if (isDark) {
      document.body.classList.add(DARK_MODE_CLASS);
      document.body.classList.remove(LIGHT_MODE_CLASS);
      updateToggleButton(true);
      updateChartThemes('dark');
    } else {
      document.body.classList.add(LIGHT_MODE_CLASS);
      document.body.classList.remove(DARK_MODE_CLASS);
      updateToggleButton(false);
      updateChartThemes('light');
    }
    
    // Actualizar meta tag para el tema del navegador móvil
    updateMetaThemeColor(isDark);
  }
  
  /**
   * Actualiza la apariencia del botón de alternancia
   * @param {boolean} isDark - Verdadero para tema oscuro, falso para tema claro
   */
  function updateToggleButton(isDark) {
    if (!darkModeToggle) return;
    
    if (darkModeIcon && lightModeIcon) {
      // Si tenemos iconos separados para cada modo
      darkModeIcon.style.display = isDark ? 'none' : 'inline-block';
      lightModeIcon.style.display = isDark ? 'inline-block' : 'none';
    }
    
    // Actualizar texto del botón si es necesario
    if (darkModeToggle.tagName === 'BUTTON' || darkModeToggle.tagName === 'A') {
      darkModeToggle.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
      
      // Si el botón tiene texto, actualizarlo
      const textNode = Array.from(darkModeToggle.childNodes).find(node => 
        node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '');
      
      if (textNode) {
        textNode.textContent = isDark ? 'Modo Claro' : 'Modo Oscuro';
      }
    }
  }
  
  /**
   * Actualiza el color del tema en el meta tag para navegadores móviles
   * @param {boolean} isDark - Verdadero para tema oscuro, falso para tema claro
   */
  function updateMetaThemeColor(isDark) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#1A202C' : '#FFFFFF');
    } else {
      // Crear meta tag si no existe
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = isDark ? '#1A202C' : '#FFFFFF';
      document.head.appendChild(meta);
    }
  }
  
  /**
   * Actualiza los temas de los gráficos de Chart.js si están presentes
   * @param {string} theme - 'dark' o 'light'
   */
  function updateChartThemes(theme) {
    // Verificar si Chart.js está disponible
    if (typeof Chart !== 'undefined') {
      const textColor = theme === 'dark' ? '#E2E8F0' : '#2D3748';
      const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
      
      // Actualizar opciones globales de Chart.js
      Chart.defaults.color = textColor;
      Chart.defaults.scale.grid.color = gridColor;
      
      // Actualizar todos los gráficos existentes
      Chart.instances.forEach(chart => {
        // Actualizar colores de texto
        if (chart.options.plugins && chart.options.plugins.legend) {
          chart.options.plugins.legend.labels.color = textColor;
        }
        
        if (chart.options.plugins && chart.options.plugins.title) {
          chart.options.plugins.title.color = textColor;
        }
        
        // Actualizar colores de ejes
        if (chart.options.scales) {
          Object.keys(chart.options.scales).forEach(scaleKey => {
            const scale = chart.options.scales[scaleKey];
            if (scale.ticks) {
              scale.ticks.color = textColor;
            }
            if (scale.grid) {
              scale.grid.color = gridColor;
            }
          });
        }
        
        // Actualizar el gráfico
        chart.update();
      });
    }
  }
  
  /**
   * Comprueba si el modo oscuro está activo
   * @returns {boolean} Verdadero si el modo oscuro está activo
   */
  function isDarkModeActive() {
    return document.body.classList.contains(DARK_MODE_CLASS);
  }
  
  // API pública
  return {
    init,
    toggle: toggleDarkMode,
    setTheme,
    isDarkModeActive
  };
})();

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', DarkMode.init);