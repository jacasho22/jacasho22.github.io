// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar el modo oscuro
    initDarkMode();
    
    // Inicializar la demo si existe
    if (document.querySelector('.demo-nav-links')) {
        initDemo();
    }
    
    // Inicializar las animaciones de scroll
    initScrollAnimations();
    
    // Inicializar el formulario de contacto si existe
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
});

// Función para inicializar el modo oscuro
function initDarkMode() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const body = document.body;
    
    // Comprobar si el usuario ya ha establecido una preferencia
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // Aplicar el modo oscuro si está guardado en localStorage
    if (isDarkMode) {
        body.classList.add('dark-mode');
        updateDarkModeIcon(true);
    }
    
    // Escuchar el evento de clic en el botón de modo oscuro
    darkModeToggle.addEventListener('click', function() {
        // Alternar la clase dark-mode en el body
        body.classList.toggle('dark-mode');
        
        // Comprobar si el modo oscuro está activo
        const isDarkModeActive = body.classList.contains('dark-mode');
        
        // Guardar la preferencia en localStorage
        localStorage.setItem('darkMode', isDarkModeActive);
        
        // Actualizar el icono
        updateDarkModeIcon(isDarkModeActive);
    });
}

// Función para actualizar el icono del modo oscuro
function updateDarkModeIcon(isDarkMode) {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    
    if (isDarkMode) {
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

// Función para inicializar las pestañas de componentes
// Esta función ahora se llama desde el método afterRender de HomeComponent
function initComponentTabs() {
    const tabs = document.querySelectorAll('.component-tab');
    const contents = document.querySelectorAll('.component-content');
    
    if (tabs.length === 0 || contents.length === 0) return;
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Eliminar la clase active de todas las pestañas
            tabs.forEach(t => t.classList.remove('active'));
            
            // Añadir la clase active a la pestaña actual
            tab.classList.add('active');
            
            // Obtener el id del contenido a mostrar
            const contentId = tab.getAttribute('data-tab');
            
            // Ocultar todos los contenidos
            contents.forEach(content => content.classList.remove('active'));
            
            // Mostrar el contenido correspondiente
            document.getElementById(contentId).classList.add('active');
        });
    });
}

// Función para inicializar la demo
function initDemo() {
    const demoLinks = document.querySelectorAll('.demo-nav-links a');
    const demoViews = document.querySelectorAll('.demo-view');
    
    demoLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Eliminar la clase active de todos los enlaces
            demoLinks.forEach(l => l.classList.remove('active'));
            
            // Añadir la clase active al enlace actual
            link.classList.add('active');
            
            // Obtener el id de la vista a mostrar
            const viewId = link.getAttribute('data-view');
            
            // Ocultar todas las vistas
            demoViews.forEach(view => view.classList.remove('active'));
            
            // Mostrar la vista correspondiente
            document.getElementById(viewId).classList.add('active');
        });
    });
}

// Función para inicializar las animaciones de scroll
window.initScrollAnimations = function() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    if (fadeElements.length === 0) return;
    
    // Comprobar si IntersectionObserver está disponible
    if ('IntersectionObserver' in window) {
        // Crear un nuevo observador de intersección
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Si el elemento es visible
                if (entry.isIntersecting) {
                    // Añadir la clase visible
                    entry.target.classList.add('visible');
                    // Dejar de observar el elemento
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1 // El elemento se considera visible cuando el 10% está en el viewport
        });
        
        // Observar cada elemento
        fadeElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback para navegadores que no soportan IntersectionObserver
        // Función para comprobar si un elemento está en el viewport
        function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
                rect.bottom >= 0
            );
        }
        
        // Función para comprobar los elementos visibles
        function checkVisibility() {
            fadeElements.forEach(element => {
                if (isElementInViewport(element)) {
                    element.classList.add('visible');
                }
            });
        }
        
        // Comprobar la visibilidad al cargar la página
        checkVisibility();
        
        // Comprobar la visibilidad al hacer scroll
        window.addEventListener('scroll', checkVisibility);
    }
}

// Función para manejar el envío del formulario de contacto
function handleContactForm(event) {
    event.preventDefault();
    
    // Obtener los valores del formulario
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject') ? document.getElementById('subject').value : '';
    const message = document.getElementById('message').value;
    
    // Validar el formulario
    if (!name || !email || !message) {
        alert('Por favor, rellena todos los campos obligatorios.');
        return;
    }
    
    // Aquí se enviaría el formulario a un servidor
    // En este caso, solo mostraremos un mensaje de éxito
    const formContainer = document.querySelector('.contact-form-container');
    if (formContainer) {
        formContainer.innerHTML = `
            <div class="success-message">
                <i class="fas fa-check-circle"></i>
                <h3>¡Mensaje enviado con éxito!</h3>
                <p>Gracias ${name} por tu mensaje. Te responderemos lo antes posible.</p>
            </div>
        `;
    } else {
        alert(`Gracias ${name} por tu mensaje. Te responderemos lo antes posible.`);
        // Limpiar el formulario
        document.getElementById('contact-form').reset();
    }
}