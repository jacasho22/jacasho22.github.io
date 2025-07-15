/**
 * Módulo para gestionar las animaciones de la aplicación
 * Incluye animaciones de scroll, transiciones y efectos visuales
 */

const Animations = (function() {
  // Configuración
  const config = {
    // Elementos que se animarán al hacer scroll
    scrollAnimationSelector: '.animate-on-scroll',
    // Clase que se añade cuando el elemento es visible
    visibleClass: 'is-visible',
    // Umbral de visibilidad (0-1, porcentaje del elemento que debe ser visible)
    threshold: 0.2,
    // Margen para activar la animación antes de que el elemento sea visible
    rootMargin: '0px 0px -100px 0px',
    // Duración de las animaciones en milisegundos
    duration: 800,
    // Retraso entre animaciones secuenciales en milisegundos
    staggerDelay: 100
  };
  
  // Elementos observados
  let observedElements = [];
  // Instancia del IntersectionObserver
  let observer;
  
  /**
   * Inicializa las animaciones
   */
  function init() {
    // Inicializar animaciones de scroll
    initScrollAnimations();
    
    // Inicializar animaciones de carga
    initLoadAnimations();
    
    // Inicializar animaciones de hover
    initHoverAnimations();
    
    // Inicializar animaciones de gráficos
    initChartAnimations();
    
    // Inicializar animaciones de datos
    initDataAnimations();
  }
  
  /**
   * Inicializa las animaciones activadas por scroll
   */
  function initScrollAnimations() {
    // Obtener todos los elementos que deben animarse al hacer scroll
    const elements = document.querySelectorAll(config.scrollAnimationSelector);
    
    if (elements.length === 0) return;
    
    // Configurar el IntersectionObserver
    observer = new IntersectionObserver(handleIntersection, {
      threshold: config.threshold,
      rootMargin: config.rootMargin
    });
    
    // Observar cada elemento
    elements.forEach((element, index) => {
      // Guardar el índice para animaciones escalonadas
      element.dataset.animationIndex = index;
      
      // Añadir a la lista de elementos observados
      observedElements.push(element);
      
      // Comenzar a observar
      observer.observe(element);
    });
  }
  
  /**
   * Maneja la intersección de elementos con el viewport
   * @param {IntersectionObserverEntry[]} entries - Entradas del observador
   */
  function handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const index = parseInt(element.dataset.animationIndex, 10) || 0;
        const delay = index * config.staggerDelay;
        
        // Aplicar retraso para animaciones escalonadas
        setTimeout(() => {
          element.classList.add(config.visibleClass);
          
          // Disparar evento personalizado
          element.dispatchEvent(new CustomEvent('animation:visible'));
          
          // Dejar de observar este elemento
          observer.unobserve(element);
        }, delay);
      }
    });
  }
  
  /**
   * Inicializa las animaciones que se ejecutan al cargar la página
   */
  function initLoadAnimations() {
    // Elementos que se animan al cargar la página
    const elements = document.querySelectorAll('.animate-on-load');
    
    elements.forEach((element, index) => {
      const delay = index * 100; // Retraso escalonado
      
      setTimeout(() => {
        element.classList.add('is-loaded');
      }, delay);
    });
    
    // Animación de carga de la página completa
    window.addEventListener('load', () => {
      document.body.classList.add('is-loaded');
      
      // Ocultar precargador si existe
      const preloader = document.querySelector('.preloader');
      if (preloader) {
        preloader.classList.add('is-hidden');
        
        // Eliminar el precargador después de la animación
        setTimeout(() => {
          preloader.remove();
        }, 500);
      }
    });
  }
  
  /**
   * Inicializa las animaciones activadas por hover
   */
  function initHoverAnimations() {
    // Elementos con animaciones de hover
    const elements = document.querySelectorAll('.animate-hover');
    
    elements.forEach(element => {
      // Animación al pasar el ratón por encima
      element.addEventListener('mouseenter', () => {
        element.classList.add('is-hovered');
      });
      
      // Animación al quitar el ratón
      element.addEventListener('mouseleave', () => {
        element.classList.remove('is-hovered');
      });
    });
  }
  
  /**
   * Inicializa las animaciones específicas para gráficos
   */
  function initChartAnimations() {
    // Verificar si Chart.js está disponible
    if (typeof Chart !== 'undefined') {
      // Configurar animaciones globales para Chart.js
      Chart.defaults.animation = {
        duration: config.duration,
        easing: 'easeOutQuart'
      };
      
      // Escuchar eventos de animación visible para iniciar gráficos
      document.querySelectorAll('.chart-container').forEach(container => {
        container.addEventListener('animation:visible', () => {
          // Buscar el canvas dentro del contenedor
          const canvas = container.querySelector('canvas');
          if (canvas && canvas.chart) {
            // Reiniciar la animación del gráfico
            canvas.chart.update();
          }
        });
      });
    }
  }
  
  /**
   * Inicializa las animaciones para datos y números
   */
  function initDataAnimations() {
    // Elementos con animación de contador
    const counters = document.querySelectorAll('.animate-counter');
    
    counters.forEach(counter => {
      const target = parseFloat(counter.dataset.target) || 0;
      const duration = parseInt(counter.dataset.duration, 10) || config.duration;
      const decimals = parseInt(counter.dataset.decimals, 10) || 0;
      const prefix = counter.dataset.prefix || '';
      const suffix = counter.dataset.suffix || '';
      
      // Configurar contador inicial
      counter.textContent = prefix + '0' + suffix;
      
      // Función para animar el contador cuando sea visible
      counter.addEventListener('animation:visible', () => {
        animateCounter(counter, target, duration, decimals, prefix, suffix);
      });
    });
  }
  
  /**
   * Anima un contador desde 0 hasta un valor objetivo
   * @param {HTMLElement} element - Elemento a animar
   * @param {number} target - Valor objetivo
   * @param {number} duration - Duración de la animación en ms
   * @param {number} decimals - Número de decimales
   * @param {string} prefix - Prefijo del valor (ej: '$')
   * @param {string} suffix - Sufijo del valor (ej: '%')
   */
  function animateCounter(element, target, duration, decimals, prefix, suffix) {
    const startTime = performance.now();
    const startValue = 0;
    
    function updateCounter(currentTime) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Función de easing (suavizado)
      const easedProgress = easeOutQuart(progress);
      
      // Calcular valor actual
      const currentValue = startValue + (target - startValue) * easedProgress;
      
      // Formatear valor con decimales
      const formattedValue = currentValue.toFixed(decimals);
      
      // Actualizar texto
      element.textContent = prefix + formattedValue + suffix;
      
      // Continuar animación si no ha terminado
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }
    
    requestAnimationFrame(updateCounter);
  }
  
  /**
   * Función de easing para suavizar animaciones
   * @param {number} x - Progreso de la animación (0-1)
   * @returns {number} Valor suavizado
   */
  function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
  }
  
  /**
   * Reinicia todas las animaciones
   */
  function reset() {
    // Detener el observador actual
    if (observer) {
      observer.disconnect();
    }
    
    // Reiniciar clases en elementos observados
    observedElements.forEach(element => {
      element.classList.remove(config.visibleClass);
    });
    
    // Reiniciar la lista de elementos
    observedElements = [];
    
    // Reiniciar animaciones
    init();
  }
  
  /**
   * Anima un elemento específico
   * @param {HTMLElement} element - Elemento a animar
   * @param {string} animationClass - Clase de animación a aplicar
   * @param {number} duration - Duración en ms
   */
  function animateElement(element, animationClass, duration = config.duration) {
    // Eliminar animaciones anteriores
    element.classList.remove('is-animated');
    
    // Forzar reflow para reiniciar la animación
    void element.offsetWidth;
    
    // Aplicar nueva animación
    element.classList.add(animationClass, 'is-animated');
    
    // Eliminar clase después de la animación
    setTimeout(() => {
      element.classList.remove(animationClass);
    }, duration);
  }
  
  /**
   * Anima la transición entre secciones
   * @param {HTMLElement} fromSection - Sección actual
   * @param {HTMLElement} toSection - Sección destino
   * @param {string} direction - Dirección de la transición ('left', 'right', 'up', 'down')
   */
  function animateTransition(fromSection, toSection, direction = 'right') {
    // Clases según dirección
    const exitClass = `exit-to-${direction}`;
    const enterClass = `enter-from-${direction}`;
    
    // Ocultar sección actual
    fromSection.classList.add(exitClass);
    
    // Preparar nueva sección
    toSection.classList.add(enterClass);
    toSection.style.display = 'block';
    
    // Forzar reflow
    void toSection.offsetWidth;
    
    // Iniciar animación de entrada
    toSection.classList.remove(enterClass);
    toSection.classList.add('is-visible');
    
    // Limpiar clases después de la transición
    setTimeout(() => {
      fromSection.classList.remove(exitClass);
      fromSection.style.display = 'none';
    }, config.duration);
  }
  
  // API pública
  return {
    init,
    reset,
    animateElement,
    animateTransition,
    animateCounter
  };
})();

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', Animations.init);