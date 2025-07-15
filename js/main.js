document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    const header = document.querySelector('header');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const contactForm = document.getElementById('contactForm');
    const scrollProgress = document.querySelector('.scroll-progress');
    const lazyImages = document.querySelectorAll('.lazy-load');

    // Navegación móvil
    burger.addEventListener('click', () => {
        // Toggle nav
        nav.classList.toggle('active');
        
        // Animación del burger
        burger.classList.toggle('active');
        
        // Animación de los links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
    });

    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            burger.classList.remove('active');
            navLinks.forEach(link => {
                link.style.animation = '';
            });
        });
    });

    // Cambiar estilo del header al hacer scroll y actualizar barra de progreso
    window.addEventListener('scroll', () => {
        // Cambiar estilo del header
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Actualizar barra de progreso
        const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / scrollTotal) * 100;
        scrollProgress.style.width = `${scrolled}%`;
    });

    // Filtro de proyectos
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover clase active de todos los botones
            filterBtns.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Agregar clase active al botón clickeado
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            // Filtrar proyectos
            projectCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 100);
                } else if (card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Animación de habilidades al hacer scroll
    const skillLevels = document.querySelectorAll('.skill-level');
    const skillSection = document.querySelector('.skills');
    
    function checkSkills() {
        const triggerBottom = window.innerHeight / 5 * 4;
        const skillTop = skillSection.getBoundingClientRect().top;
        
        if (skillTop < triggerBottom) {
            skillLevels.forEach(level => {
                level.style.width = level.getAttribute('style').split(':')[1];
            });
        }
    }
    
    window.addEventListener('scroll', checkSkills);

    // Formulario de contacto con validación mejorada para Formspree
    if (contactForm) {
        const formInputs = contactForm.querySelectorAll('input:not([name="_gotcha"]):not([name="_subject"]):not([name="_next"]), textarea');
        const formSuccess = document.getElementById('formSuccess');
        
        // Validación en tiempo real
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });
            
            input.addEventListener('input', function() {
                if (this.parentElement.classList.contains('error')) {
                    validateInput(this);
                }
            });
        });
        
        // Función para validar un campo
        function validateInput(input) {
            const formGroup = input.parentElement;
            
            if (!input.checkValidity()) {
                formGroup.classList.add('error');
                return false;
            } else {
                formGroup.classList.remove('error');
                return true;
            }
        }
        
        // Validación al enviar el formulario
        contactForm.addEventListener('submit', function(e) {
            // No prevenimos el evento por defecto para permitir que Formspree procese el formulario
            // Solo validamos los campos antes de enviar
            
            let isValid = true;
            
            // Validar todos los campos
            formInputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                return false;
            }
            
            // Si llegamos aquí, el formulario es válido y se enviará a Formspree
            // Formspree se encargará de procesar el formulario y redirigir según la configuración
            
            // Podemos mostrar el mensaje de éxito si estamos en desarrollo local
            // En producción, Formspree redirigirá según la configuración de _next
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                e.preventDefault();
                
                // Simulación de envío exitoso en desarrollo local
                const formData = new FormData(contactForm);
                const formValues = {};
                
                formData.forEach((value, key) => {
                    formValues[key] = value;
                });
                
                console.log('Formulario enviado (desarrollo local):', formValues);
                
                // Mostrar mensaje de éxito
                formSuccess.classList.add('show');
                
                // Ocultar mensaje después de 5 segundos
                setTimeout(() => {
                    formSuccess.classList.remove('show');
                }, 5000);
                
                // Limpiar formulario
                contactForm.reset();
            }
            
            // En producción, Formspree manejará el envío y la redirección
        });
    }

    // Animación de scroll suave para los enlaces de navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Ajuste para el header fijo
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animación de elementos al hacer scroll
    const fadeElements = document.querySelectorAll('.fade-in');
    
    function checkFade() {
        const triggerBottom = window.innerHeight / 5 * 4;
        
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < triggerBottom) {
                element.classList.add('visible');
            }
        });
    }
    
    window.addEventListener('scroll', checkFade);
    checkFade(); // Verificar elementos visibles al cargar la página

    // Inicializar AOS (Animate On Scroll) si está disponible
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }
    
    // Implementar lazy loading para imágenes
    const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });
    
    lazyImages.forEach(image => {
        lazyLoadObserver.observe(image);
    });

    // Funcionalidad del modal del CV
    const viewCvBtn = document.getElementById('view-cv-btn');
    const cvModal = document.getElementById('cv-modal');
    const closeModal = document.querySelector('.close-modal');

    if (viewCvBtn && cvModal) {
        // Abrir modal al hacer clic en el botón
        viewCvBtn.addEventListener('click', function(e) {
            e.preventDefault();
            cvModal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Evitar scroll en el body
        });

        // Cerrar modal al hacer clic en la X
        if (closeModal) {
            closeModal.addEventListener('click', function() {
                cvModal.classList.remove('show');
                document.body.style.overflow = 'auto'; // Restaurar scroll
            });
        }

        // Cerrar modal al hacer clic fuera del contenido
        cvModal.addEventListener('click', function(e) {
            if (e.target === cvModal) {
                cvModal.classList.remove('show');
                document.body.style.overflow = 'auto'; // Restaurar scroll
            }
        });

        // Cerrar modal con la tecla ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && cvModal.classList.contains('show')) {
                cvModal.classList.remove('show');
                document.body.style.overflow = 'auto'; // Restaurar scroll
            }
        });
    }
    
    // La funcionalidad para mostrar/ocultar la aplicación de Análisis de Datos ha sido eliminada
    // ya que ahora la aplicación se abre en una ventana separada
});