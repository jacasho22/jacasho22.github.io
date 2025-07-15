document.addEventListener('DOMContentLoaded', function() {
    // Inicializar tooltips y popovers de Bootstrap
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Inicializar tabs
    var tabElms = document.querySelectorAll('button[data-bs-toggle="tab"]');
    tabElms.forEach(function(tabElm) {
        tabElm.addEventListener('shown.bs.tab', function (event) {
            // Aquí puedes agregar lógica cuando se cambia de tab
        });
    });

    // Animaciones al hacer scroll
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    function checkScroll() {
        const triggerBottom = window.innerHeight * 0.8;
        
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < triggerBottom) {
                element.classList.add('show');
            }
        });
    }
    
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Verificar elementos visibles al cargar la página

    // Cambio de tema (modo oscuro/claro)
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    
    // Verificar si hay una preferencia guardada
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // Aplicar modo oscuro si está guardado
    if (isDarkMode) {
        body.classList.add('dark-mode');
        updateDarkModeIcon(true);
    }
    
    // Función para cambiar el icono del botón
    function updateDarkModeIcon(isDark) {
        if (isDark) {
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }
    
    // Evento para cambiar el tema
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            
            // Guardar preferencia
            localStorage.setItem('darkMode', isDark);
            
            // Actualizar icono
            updateDarkModeIcon(isDark);
        });
    }

    // Filtros de cursos
    const filterButtons = document.querySelectorAll('.filter-btn');
    const courseCards = document.querySelectorAll('.course-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover clase activa de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Agregar clase activa al botón clickeado
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Mostrar/ocultar cursos según el filtro
            courseCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                } else {
                    const cardCategory = card.getAttribute('data-category');
                    if (cardCategory === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });

    // Búsqueda de cursos
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = searchInput.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                // Si la búsqueda está vacía, mostrar todos los cursos
                courseCards.forEach(card => {
                    card.style.display = 'block';
                });
                return;
            }
            
            // Filtrar cursos según término de búsqueda
            courseCards.forEach(card => {
                const title = card.querySelector('.course-title').textContent.toLowerCase();
                const description = card.querySelector('.course-description')?.textContent.toLowerCase() || '';
                const instructor = card.querySelector('.instructor-name').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm) || instructor.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Contador de estadísticas animado
    const statElements = document.querySelectorAll('.stat-count');
    let counted = false;
    
    function animateStats() {
        if (counted) return;
        
        const statsSection = document.querySelector('.stats');
        if (!statsSection) return;
        
        const sectionTop = statsSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.8) {
            statElements.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count'));
                const duration = 2000; // 2 segundos
                const increment = target / (duration / 16); // 60fps
                let current = 0;
                
                const timer = setInterval(() => {
                    current += increment;
                    stat.textContent = Math.floor(current);
                    
                    if (current >= target) {
                        stat.textContent = target;
                        clearInterval(timer);
                    }
                }, 16);
            });
            
            counted = true;
        }
    }
    
    window.addEventListener('scroll', animateStats);
    animateStats(); // Verificar al cargar la página

    // Reproductor de video para lecciones
    const videoTriggers = document.querySelectorAll('.lesson-item[data-video]');
    const videoModal = document.getElementById('videoModal');
    const videoPlayer = document.getElementById('videoPlayer');
    
    if (videoModal && videoPlayer) {
        const bsVideoModal = new bootstrap.Modal(videoModal);
        
        videoTriggers.forEach(trigger => {
            trigger.addEventListener('click', function() {
                const videoSrc = this.getAttribute('data-video');
                videoPlayer.src = videoSrc;
                bsVideoModal.show();
            });
        });
        
        // Detener video al cerrar modal
        videoModal.addEventListener('hidden.bs.modal', function() {
            videoPlayer.pause();
            videoPlayer.currentTime = 0;
        });
    }

    // Progreso del curso
    const progressBar = document.getElementById('courseProgress');
    const lessonCheckboxes = document.querySelectorAll('.lesson-checkbox');
    
    function updateProgress() {
        if (!progressBar || lessonCheckboxes.length === 0) return;
        
        const total = lessonCheckboxes.length;
        const completed = Array.from(lessonCheckboxes).filter(checkbox => checkbox.checked).length;
        const percentage = (completed / total) * 100;
        
        progressBar.style.width = percentage + '%';
        progressBar.setAttribute('aria-valuenow', percentage);
        
        // Actualizar texto de progreso
        const progressText = document.getElementById('progressText');
        if (progressText) {
            progressText.textContent = `${completed} de ${total} lecciones completadas (${Math.round(percentage)}%)`;
        }
    }
    
    lessonCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Guardar progreso en localStorage
            const lessonId = this.getAttribute('data-lesson-id');
            localStorage.setItem(`lesson_${lessonId}`, this.checked);
            
            updateProgress();
        });
        
        // Cargar estado guardado
        const lessonId = checkbox.getAttribute('data-lesson-id');
        const isCompleted = localStorage.getItem(`lesson_${lessonId}`) === 'true';
        checkbox.checked = isCompleted;
    });
    
    updateProgress(); // Actualizar al cargar la página

    // Formulario de contacto
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Aquí iría la lógica para enviar el formulario por AJAX
            // Por ahora, solo simulamos una respuesta exitosa
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
            
            setTimeout(() => {
                // Mostrar mensaje de éxito
                const alertBox = document.createElement('div');
                alertBox.className = 'alert alert-success mt-3';
                alertBox.innerHTML = '<i class="fas fa-check-circle me-2"></i> Tu mensaje ha sido enviado correctamente. Nos pondremos en contacto contigo pronto.';
                
                contactForm.appendChild(alertBox);
                
                // Resetear formulario
                contactForm.reset();
                
                // Restaurar botón
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                
                // Ocultar alerta después de 5 segundos
                setTimeout(() => {
                    alertBox.remove();
                }, 5000);
            }, 1500);
        });
    }

    // Inicializar carrusel de testimonios si existe
    const testimonialsCarousel = document.getElementById('testimonialsCarousel');
    if (testimonialsCarousel) {
        new bootstrap.Carousel(testimonialsCarousel, {
            interval: 5000,
            wrap: true
        });
    }

    // Inicializar tooltips en la página de curso
    const courseTabs = document.getElementById('courseTabs');
    if (courseTabs) {
        courseTabs.addEventListener('shown.bs.tab', function (event) {
            // Reinicializar tooltips en el tab activo
            const activeTab = document.querySelector(event.target.getAttribute('data-bs-target'));
            const tabTooltips = activeTab.querySelectorAll('[data-bs-toggle="tooltip"]');
            
            tabTooltips.forEach(el => {
                new bootstrap.Tooltip(el);
            });
        });
    }

    // Función para mostrar notificaciones
    window.showNotification = function(message, type = 'info') {
        const notificationContainer = document.getElementById('notificationContainer');
        
        if (!notificationContainer) {
            // Crear contenedor si no existe
            const container = document.createElement('div');
            container.id = 'notificationContainer';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'warning') icon = 'exclamation-triangle';
        if (type === 'error') icon = 'times-circle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <p>${message}</p>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        const container = document.getElementById('notificationContainer');
        container.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Configurar cierre automático
        const timeout = setTimeout(() => {
            closeNotification(notification);
        }, 5000);
        
        // Botón de cierre
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(timeout);
            closeNotification(notification);
        });
        
        function closeNotification(notif) {
            notif.classList.remove('show');
            setTimeout(() => {
                notif.remove();
            }, 300);
        }
    };

    // Ejemplo de uso de notificaciones (descomentar para probar)
    // setTimeout(() => {
    //     window.showNotification('¡Bienvenido a nuestra plataforma de aprendizaje!', 'success');
    // }, 1000);
});