// JavaScript para el proyecto Buceo React

document.addEventListener('DOMContentLoaded', function() {
    // Animación de aparición para elementos al hacer scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature-card, .project-image, .tech-stack, .code-snippet, .project-conclusion');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    };
    
    // Inicializar animación al cargar la página
    animateOnScroll();
    
    // Añadir evento de scroll para animaciones
    window.addEventListener('scroll', animateOnScroll);
    
    // Simular carga de código en el ejemplo
    const codeSnippet = document.querySelector('.code-snippet code');
    if (codeSnippet) {
        const codeLines = codeSnippet.textContent.split('\n');
        codeSnippet.innerHTML = '';
        
        let lineIndex = 0;
        const typeCode = setInterval(() => {
            if (lineIndex < codeLines.length) {
                codeSnippet.innerHTML += codeLines[lineIndex] + '\n';
                lineIndex++;
                codeSnippet.scrollTop = codeSnippet.scrollHeight;
            } else {
                clearInterval(typeCode);
            }
        }, 100);
    }
    
    // Añadir efecto hover a las tarjetas de características
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.feature-icon').style.transform = 'scale(1.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('.feature-icon').style.transform = 'scale(1)';
        });
    });
    
    // Simular interacción con el componente React
    const reactDemo = function() {
        // Esto es solo una simulación visual, no React real
        const courseHeader = document.createElement('div');
        courseHeader.className = 'course-detail';
        courseHeader.innerHTML = `
            <div class="course-header">
                <h1>Curso Open Water Diver</h1>
                <span class="course-level">Principiante</span>
            </div>
            
            <div class="course-content">
                <div class="course-image">
                    <img src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="Open Water Diver">
                </div>
                
                <div class="course-info">
                    <p class="course-description">Aprende los fundamentos del buceo y obtén tu primera certificación. Este curso te permitirá bucear hasta 18 metros de profundidad en cualquier parte del mundo.</p>
                    
                    <div class="course-meta">
                        <div class="meta-item">
                            <i class="fas fa-clock"></i>
                            <span>4 días</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-euro-sign"></i>
                            <span>350€</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-users"></i>
                            <span>8 personas máx.</span>
                        </div>
                    </div>
                    
                    <h3>Instructor</h3>
                    <div class="instructor-card">
                        <div class="instructor-avatar">
                            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Instructor">
                        </div>
                        <div class="instructor-info">
                            <h4>Carlos Martínez</h4>
                            <p>Instructor PADI con más de 2000 inmersiones</p>
                            <div class="instructor-rating">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star-half-alt"></i>
                                <span>(4.5/5)</span>
                            </div>
                        </div>
                    </div>
                    
                    <h3>Reserva este curso</h3>
                    <div class="booking-form">
                        <div class="form-group">
                            <label>Selecciona una fecha:</label>
                            <div class="date-picker">
                                <div class="date-option">15 Jun</div>
                                <div class="date-option">22 Jun</div>
                                <div class="date-option selected">29 Jun</div>
                                <div class="date-option">6 Jul</div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="participants">Número de participantes:</label>
                            <select id="participants" class="form-control">
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                            </select>
                        </div>
                        <button class="btn-primary">Reservar ahora</button>
                    </div>
                </div>
            </div>
        `;
        
        // Añadir el demo después de la sección de implementación
        const implementationSection = document.querySelector('.project-implementation');
        if (implementationSection) {
            implementationSection.after(courseHeader);
            
            // Añadir interactividad a las fechas
            const dateOptions = document.querySelectorAll('.date-option');
            dateOptions.forEach(option => {
                option.addEventListener('click', function() {
                    dateOptions.forEach(opt => opt.classList.remove('selected'));
                    this.classList.add('selected');
                });
            });
            
            // Añadir efecto al botón de reserva
            const bookButton = document.querySelector('.btn-primary');
            if (bookButton) {
                bookButton.addEventListener('click', function() {
                    this.textContent = 'Reservado ✓';
                    this.style.backgroundColor = 'var(--success)';
                    setTimeout(() => {
                        this.textContent = 'Reservar ahora';
                        this.style.backgroundColor = '';
                    }, 2000);
                });
            }
        }
    };
    
    // Ejecutar la demo después de 1 segundo para simular carga de React
    setTimeout(reactDemo, 1000);
});

// Añadir estilos para animaciones
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .feature-card, .project-image, .tech-stack, .code-snippet, .project-conclusion {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .feature-card.visible, .project-image.visible, .tech-stack.visible, .code-snippet.visible, .project-conclusion.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .feature-icon {
        transition: transform 0.3s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .course-detail {
        animation: fadeIn 0.8s ease forwards;
    }
`;
document.head.appendChild(styleSheet);