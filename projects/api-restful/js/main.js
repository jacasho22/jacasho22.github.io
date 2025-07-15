document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos DOM
    const header = document.querySelector('.header');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const endpointItems = document.querySelectorAll('.endpoint-item');
    const responseBody = document.querySelector('.response-body');
    const themeToggle = document.getElementById('theme-toggle');
    const counterElements = document.querySelectorAll('.counter');
    const contactForm = document.getElementById('contact-form');
    
    // Inicialización
    initScrollEvents();
    initMobileMenu();
    initApiDemo();
    initThemeToggle();
    initAnimations();
    initCounters();
    initContactForm();
    
    // Función para manejar eventos de scroll
    function initScrollEvents() {
        window.addEventListener('scroll', function() {
            // Header scroll effect
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Animación de elementos al hacer scroll
            animateOnScroll();
        });
    }
    
    // Función para inicializar el menú móvil
    function initMobileMenu() {
        if (mobileToggle) {
            mobileToggle.addEventListener('click', function() {
                navMenu.classList.toggle('active');
                mobileToggle.classList.toggle('active');
            });
        }
    }
    
    // Función para inicializar la demo de API
    function initApiDemo() {
        if (endpointItems.length > 0) {
            // Activar el primer endpoint por defecto
            endpointItems[0].classList.add('active');
            showEndpointResponse(endpointItems[0].getAttribute('data-endpoint'));
            
            // Añadir event listeners a los endpoints
            endpointItems.forEach(item => {
                item.addEventListener('click', function() {
                    // Remover clase activa de todos los items
                    endpointItems.forEach(el => el.classList.remove('active'));
                    
                    // Añadir clase activa al item clickeado
                    this.classList.add('active');
                    
                    // Mostrar la respuesta correspondiente
                    showEndpointResponse(this.getAttribute('data-endpoint'));
                });
            });
        }
    }
    
    // Función para mostrar la respuesta de un endpoint
    function showEndpointResponse(endpoint) {
        if (!responseBody) return;
        
        // Simular carga
        responseBody.innerHTML = '<div class="loading">Cargando respuesta...</div>';
        
        // Simular delay de red
        setTimeout(() => {
            let response;
            
            switch(endpoint) {
                case 'get-users':
                    response = {
                        status: 200,
                        data: [
                            { id: 1, username: "usuario1", email: "usuario1@ejemplo.com", role: "admin" },
                            { id: 2, username: "usuario2", email: "usuario2@ejemplo.com", role: "user" }
                        ]
                    };
                    break;
                    
                case 'get-user':
                    response = {
                        status: 200,
                        data: {
                            id: 1,
                            username: "usuario1",
                            email: "usuario1@ejemplo.com",
                            firstName: "Juan",
                            lastName: "Pérez",
                            role: "admin",
                            createdAt: "2023-01-15T10:30:00Z",
                            lastLogin: "2023-06-20T08:45:22Z"
                        }
                    };
                    break;
                    
                case 'create-user':
                    response = {
                        status: 201,
                        message: "Usuario creado exitosamente",
                        data: {
                            id: 3,
                            username: "nuevo_usuario",
                            email: "nuevo@ejemplo.com",
                            role: "user",
                            createdAt: "2023-06-21T14:22:10Z"
                        }
                    };
                    break;
                    
                case 'get-products':
                    response = {
                        status: 200,
                        data: [
                            { id: 1, name: "Producto 1", price: 29.99, category: "electrónica" },
                            { id: 2, name: "Producto 2", price: 49.99, category: "hogar" },
                            { id: 3, name: "Producto 3", price: 19.99, category: "electrónica" }
                        ]
                    };
                    break;
                    
                case 'get-product':
                    response = {
                        status: 200,
                        data: {
                            id: 1,
                            name: "Producto 1",
                            description: "Descripción detallada del producto 1",
                            price: 29.99,
                            category: "electrónica",
                            tags: ["gadget", "tecnología", "nuevo"],
                            stock: 45,
                            rating: 4.5,
                            createdAt: "2023-01-10T08:15:30Z",
                            updatedAt: "2023-06-15T11:20:45Z"
                        }
                    };
                    break;
                    
                case 'login':
                    response = {
                        status: 200,
                        message: "Inicio de sesión exitoso",
                        data: {
                            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoidXN1YXJpbzEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2ODcyNzM0NTAsImV4cCI6MTY4NzM1OTg1MH0",
                            user: {
                                id: 1,
                                username: "usuario1",
                                role: "admin"
                            }
                        }
                    };
                    break;
                    
                default:
                    response = {
                        status: 404,
                        error: "Endpoint no encontrado"
                    };
            }
            
            // Formatear la respuesta como JSON con indentación
            const formattedResponse = JSON.stringify(response, null, 2);
            
            // Mostrar la respuesta
            responseBody.innerHTML = `
                <div class="response-status">
                    <span class="status-code ${response.status < 300 ? 'success' : 'error'}">Status: ${response.status}</span>
                </div>
                <pre class="code-block language-json">${formattedResponse}</pre>
            `;
            
            // Aplicar resaltado de sintaxis si está disponible highlight.js
            if (window.hljs) {
                document.querySelectorAll('pre.code-block').forEach(block => {
                    hljs.highlightElement(block);
                });
            }
        }, 800);
    }
    
    // Función para inicializar el toggle de tema (claro/oscuro)
    function initThemeToggle() {
        if (themeToggle) {
            // Verificar si hay un tema guardado en localStorage
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark-theme') {
                document.body.classList.add('dark-theme');
                themeToggle.checked = true;
            } else if (savedTheme === 'light-theme') {
                document.body.classList.remove('dark-theme');
                themeToggle.checked = false;
            } else {
                // Si no hay tema guardado, verificar preferencia del sistema
                const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDarkScheme) {
                    document.body.classList.add('dark-theme');
                    themeToggle.checked = true;
                    localStorage.setItem('theme', 'dark-theme');
                }
            }
            
            // Event listener para cambiar el tema
            themeToggle.addEventListener('change', function() {
                if (this.checked) {
                    document.body.classList.add('dark-theme');
                    localStorage.setItem('theme', 'dark-theme');
                } else {
                    document.body.classList.remove('dark-theme');
                    localStorage.setItem('theme', 'light-theme');
                }
                
                // Disparar un evento personalizado para notificar el cambio de tema
                document.dispatchEvent(new CustomEvent('themeChanged', {
                    detail: { isDark: this.checked }
                }));
            });
        }
    }
    
    // Función para inicializar animaciones
    function initAnimations() {
        // Añadir clase para elementos que deben animarse al hacer scroll
        const animatedElements = document.querySelectorAll('.feature-card, .section-title, .doc-section');
        animatedElements.forEach(el => {
            el.classList.add('animate-on-scroll');
        });
        
        // Ejecutar una vez para elementos visibles al cargar
        animateOnScroll();
    }
    
    // Función para animar elementos al hacer scroll
    function animateOnScroll() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                el.classList.add('animated');
            }
        });
    }
    
    // Función para inicializar contadores
    function initCounters() {
        if (counterElements.length > 0) {
            const options = {
                threshold: 0.5
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const counter = entry.target;
                        const target = parseInt(counter.getAttribute('data-target'));
                        const duration = 2000; // ms
                        const step = Math.ceil(target / (duration / 16)); // 60fps
                        
                        let current = 0;
                        const timer = setInterval(() => {
                            current += step;
                            counter.textContent = current;
                            
                            if (current >= target) {
                                counter.textContent = target;
                                clearInterval(timer);
                            }
                        }, 16);
                        
                        // Desconectar el observer después de animar
                        observer.unobserve(counter);
                    }
                });
            }, options);
            
            counterElements.forEach(counter => {
                observer.observe(counter);
            });
        }
    }
    
    // Función para inicializar el formulario de contacto
    function initContactForm() {
        if (contactForm) {
            // Añadir validación en tiempo real
            const formInputs = contactForm.querySelectorAll('input, textarea');
            
            formInputs.forEach(input => {
                // Añadir clase para estilizar el estado de foco
                input.addEventListener('focus', function() {
                    this.parentElement.classList.add('focused');
                });
                
                input.addEventListener('blur', function() {
                    this.parentElement.classList.remove('focused');
                    
                    // Validar el campo cuando pierde el foco
                    validateField(this);
                });
                
                // Validar mientras escribe (después de un breve retraso)
                input.addEventListener('input', debounce(function() {
                    validateField(this);
                }, 500));
            });
            
            // Manejar el envío del formulario
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Validar todos los campos antes de enviar
                let isValid = true;
                formInputs.forEach(input => {
                    if (!validateField(input)) {
                        isValid = false;
                    }
                });
                
                if (!isValid) return;
                
                // Simular envío de formulario
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                submitBtn.disabled = true;
                
                // Añadir clase de animación al formulario
                contactForm.classList.add('submitting');
                
                setTimeout(() => {
                    // Mostrar mensaje de éxito con animación
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    successMessage.innerHTML = '<i class="fas fa-check-circle"></i> ¡Mensaje enviado con éxito! Te responderemos pronto.';
                    
                    // Resetear el formulario y añadir el mensaje
                    contactForm.reset();
                    contactForm.classList.remove('submitting');
                    contactForm.appendChild(successMessage);
                    
                    // Restaurar el botón
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // Añadir clase para animar la entrada del mensaje
                    setTimeout(() => {
                        successMessage.classList.add('show');
                    }, 10);
                    
                    // Eliminar mensaje después de un tiempo
                    setTimeout(() => {
                        successMessage.classList.remove('show');
                        setTimeout(() => {
                            successMessage.remove();
                        }, 300);
                    }, 5000);
                }, 1500);
            });
        }
    }
    
    // Función para validar un campo del formulario
    function validateField(field) {
        const parent = field.parentElement;
        const errorElement = parent.querySelector('.error-message') || document.createElement('div');
        
        if (!field.value.trim()) {
            errorElement.textContent = 'Este campo es obligatorio';
            errorElement.className = 'error-message';
            if (!parent.querySelector('.error-message')) {
                parent.appendChild(errorElement);
            }
            field.classList.add('invalid');
            return false;
        }
        
        // Validación específica para email
        if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
            errorElement.textContent = 'Por favor, introduce un email válido';
            errorElement.className = 'error-message';
            if (!parent.querySelector('.error-message')) {
                parent.appendChild(errorElement);
            }
            field.classList.add('invalid');
            return false;
        }
        
        // Si pasa la validación, eliminar mensaje de error
        if (parent.querySelector('.error-message')) {
            parent.removeChild(errorElement);
        }
        field.classList.remove('invalid');
        return true;
    }
    
    // Función debounce para limitar la frecuencia de ejecución
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
});

// Función para copiar código al portapapeles
function copyToClipboard(element) {
    const codeBlock = element.parentElement.nextElementSibling;
    const textToCopy = codeBlock.textContent;
    
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            // Cambiar el texto del botón temporalmente
            const originalText = element.textContent;
            element.textContent = '¡Copiado!';
            
            setTimeout(() => {
                element.textContent = originalText;
            }, 2000);
        })
        .catch(err => {
            console.error('Error al copiar: ', err);
        });
}

// Función para cambiar entre pestañas en la documentación
function switchTab(event, tabId) {
    // Ocultar todos los contenidos de pestañas
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => {
        tab.style.display = 'none';
    });
    
    // Desactivar todos los botones de pestañas
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Mostrar el contenido de la pestaña seleccionada
    document.getElementById(tabId).style.display = 'block';
    
    // Activar el botón de la pestaña seleccionada
    event.currentTarget.classList.add('active');
}