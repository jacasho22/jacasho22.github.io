// Componente Home
class HomeComponent {
    constructor() {
        this.template = `
            <div class="home-view">
                <!-- Sección Hero -->
                <section class="hero">
                    <div class="hero-content">
                        <div class="hero-text">
                            <h1>Aplicación <span>SPA</span> con Vue.js</h1>
                            <p>Experimenta la fluidez y velocidad de una aplicación de página única desarrollada con Vue.js, JavaScript y API REST.</p>
                            <a href="#" class="btn" onclick="router.navigate('/services'); return false;">Explorar servicios</a>
                            <a href="#" class="btn btn-outline" onclick="router.navigate('/about'); return false;">Conocer más</a>
                        </div>
                        
                        <div class="hero-image">
                            <img src="img/hero.svg" alt="SPA Hero Image">
                        </div>
                    </div>
                </section>
                
                <!-- Sección de características -->
                <section class="features">
                    <div class="section-title">
                        <h2>Características</h2>
                        <p>Descubre las ventajas de nuestra aplicación SPA</p>
                    </div>
                    
                    <div class="features-container">
                        <div class="feature-card fade-in">
                            <div class="feature-icon">
                                <i class="fas fa-bolt"></i>
                            </div>
                            <h3>Rápida y Eficiente</h3>
                            <p>Carga una sola vez y actualiza solo el contenido necesario, proporcionando una experiencia fluida y rápida.</p>
                        </div>
                        
                        <div class="feature-card fade-in">
                            <div class="feature-icon">
                                <i class="fas fa-mobile-alt"></i>
                            </div>
                            <h3>Diseño Responsivo</h3>
                            <p>Adaptada a cualquier dispositivo, desde móviles hasta pantallas de escritorio, con una experiencia óptima.</p>
                        </div>
                        
                        <div class="feature-card fade-in">
                            <div class="feature-icon">
                                <i class="fas fa-code"></i>
                            </div>
                            <h3>Tecnología Moderna</h3>
                            <p>Desarrollada con Vue.js, JavaScript y API REST, utilizando las mejores prácticas y patrones de diseño.</p>
                        </div>
                    </div>
                </section>
                
                <!-- Sección de componentes -->
                <section class="components">
                    <div class="section-title">
                        <h2>Componentes</h2>
                        <p>Explora los diferentes componentes de nuestra aplicación</p>
                    </div>
                    
                    <div class="components-container">
                        <div class="component-tabs">
                            <button class="component-tab active" data-tab="component-1">Navegación</button>
                            <button class="component-tab" data-tab="component-2">Formularios</button>
                            <button class="component-tab" data-tab="component-3">Tarjetas</button>
                            <button class="component-tab" data-tab="component-4">Animaciones</button>
                        </div>
                        
                        <div id="component-1" class="component-content active">
                            <h3>Componente de Navegación</h3>
                            <p>Nuestro sistema de navegación permite moverse entre diferentes vistas sin recargar la página, proporcionando una experiencia fluida y rápida.</p>
                            <div class="component-preview">
                                <div class="demo-nav">
                                    <div class="demo-logo">Logo</div>
                                    <ul class="demo-nav-links">
                                        <li><a href="#" class="active">Inicio</a></li>
                                        <li><a href="#">Nosotros</a></li>
                                        <li><a href="#">Servicios</a></li>
                                        <li><a href="#">Contacto</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <div id="component-2" class="component-content">
                            <h3>Componente de Formularios</h3>
                            <p>Formularios interactivos con validación en tiempo real y feedback visual para el usuario.</p>
                            <div class="component-preview">
                                <div class="form-group">
                                    <label for="demo-name">Nombre</label>
                                    <input type="text" id="demo-name" class="form-control" placeholder="Tu nombre">
                                </div>
                                <div class="form-group">
                                    <label for="demo-email">Email</label>
                                    <input type="email" id="demo-email" class="form-control" placeholder="Tu email">
                                </div>
                                <button class="btn">Enviar</button>
                            </div>
                        </div>
                        
                        <div id="component-3" class="component-content">
                            <h3>Componente de Tarjetas</h3>
                            <p>Tarjetas flexibles y responsivas para mostrar información de manera clara y atractiva.</p>
                            <div class="component-preview">
                                <div style="display: flex; gap: 1rem;">
                                    <div style="flex: 1; background-color: var(--white); padding: 1rem; border-radius: var(--border-radius); box-shadow: var(--shadow);">
                                        <h4>Tarjeta 1</h4>
                                        <p>Contenido de ejemplo</p>
                                    </div>
                                    <div style="flex: 1; background-color: var(--white); padding: 1rem; border-radius: var(--border-radius); box-shadow: var(--shadow);">
                                        <h4>Tarjeta 2</h4>
                                        <p>Contenido de ejemplo</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div id="component-4" class="component-content">
                            <h3>Componente de Animaciones</h3>
                            <p>Animaciones suaves y elegantes para mejorar la experiencia del usuario.</p>
                            <div class="component-preview">
                                <button class="btn" onclick="this.classList.toggle('btn-animate'); return false;" style="transition: transform 0.3s ease;">
                                    Hover o Click
                                </button>
                                <style>
                                    .btn-animate {
                                        transform: scale(1.1);
                                    }
                                </style>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        `;
    }
    
    render() {
        return this.template;
    }
    
    // Método que se ejecuta después de renderizar el componente
    afterRender() {
        // Inicializar las pestañas de componentes
        this.initComponentTabs();
        
        // Inicializar las animaciones de scroll
        if (typeof window.initScrollAnimations === 'function') {
            window.initScrollAnimations();
        }
    }
    
    // Método para inicializar las pestañas de componentes
    initComponentTabs() {
        const tabs = document.querySelectorAll('.component-tab');
        const contents = document.querySelectorAll('.component-content');
        
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
}

// Exportar el componente
window.HomeComponent = HomeComponent;