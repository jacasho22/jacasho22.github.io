document.addEventListener('DOMContentLoaded', function() {
    // Inicializar tabs
    initTabs();
    
    // Inicializar modo oscuro
    initDarkMode();
    
    // Inicializar formulario de contacto
    initContactForm();
    
    // Inicializar animaciones al hacer scroll
    initScrollAnimations();
});

/**
 * Inicializa el sistema de pestañas para la sección de diagramas
 */
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover clase active de todos los botones
            tabBtns.forEach(b => b.classList.remove('active'));
            
            // Añadir clase active al botón clickeado
            btn.classList.add('active');
            
            // Obtener el id del contenido a mostrar
            const tabId = btn.getAttribute('data-tab');
            
            // Ocultar todos los contenidos
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Mostrar el contenido correspondiente
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Activar la primera pestaña por defecto
    if (tabBtns.length > 0) {
        tabBtns[0].click();
    }
}

/**
 * Inicializa el modo oscuro y su toggle
 */
function initDarkMode() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const body = document.body;
    
    // Verificar si hay una preferencia guardada
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // Aplicar modo oscuro si está guardado
    if (isDarkMode) {
        body.classList.add('dark-mode');
    }
    
    // Manejar el toggle del modo oscuro
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            
            // Guardar preferencia en localStorage
            const currentMode = body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', currentMode);
            
            // Actualizar icono
            updateDarkModeIcon(currentMode);
        });
        
        // Inicializar icono
        updateDarkModeIcon(isDarkMode);
    }
}

/**
 * Actualiza el icono del toggle de modo oscuro
 * @param {boolean} isDarkMode - Si el modo oscuro está activado
 */
function updateDarkModeIcon(isDarkMode) {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.innerHTML = isDarkMode 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
    }
}

/**
 * Inicializa el formulario de contacto
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener valores del formulario
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Validar formulario
            if (!name || !email || !subject || !message) {
                showFormMessage('Por favor, complete todos los campos', 'error');
                return;
            }
            
            // Validar email
            if (!validateEmail(email)) {
                showFormMessage('Por favor, ingrese un email válido', 'error');
                return;
            }
            
            // Simulación de envío exitoso
            // En un caso real, aquí iría el código para enviar los datos al servidor
            setTimeout(() => {
                showFormMessage('¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.', 'success');
                contactForm.reset();
            }, 1000);
        });
    }
}

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean} - Si el email es válido
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Muestra un mensaje en el formulario
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de mensaje (success, error)
 */
function showFormMessage(message, type) {
    const formMessage = document.getElementById('form-message');
    
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        
        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            formMessage.textContent = '';
            formMessage.className = 'form-message';
        }, 5000);
    }
}

/**
 * Inicializa las animaciones al hacer scroll
 */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .zoom-in');
    
    // Opciones para el Intersection Observer
    const options = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% del elemento visible
    };
    
    // Callback para el Intersection Observer
    const callback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Dejar de observar una vez animado
            }
        });
    };
    
    // Crear el Intersection Observer
    const observer = new IntersectionObserver(callback, options);
    
    // Observar cada elemento
    elements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Inicializa el contador de estadísticas animado
 */
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // Velocidad de la animación
    
    // Opciones para el Intersection Observer
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    // Callback para el Intersection Observer
    const callback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                let count = 0;
                
                const updateCount = () => {
                    const increment = target / speed;
                    
                    if (count < target) {
                        count += increment;
                        counter.innerText = Math.ceil(count);
                        setTimeout(updateCount, 1);
                    } else {
                        counter.innerText = target;
                    }
                };
                
                updateCount();
                observer.unobserve(counter);
            }
        });
    };
    
    // Crear el Intersection Observer
    const observer = new IntersectionObserver(callback, options);
    
    // Observar cada contador
    counters.forEach(counter => {
        observer.observe(counter);
    });
}