// Componente About
class AboutComponent {
    constructor() {
        this.template = `
            <div class="about-view">
                <div class="about-header">
                    <h2>Sobre Nosotros</h2>
                    <p>Somos un equipo apasionado por el desarrollo web y las tecnologías modernas.</p>
                </div>
                
                <div class="about-content">
                    <div class="about-image">
                        <img src="img/about.svg" alt="Nuestro equipo" onerror="this.src='img/hero.svg'">
                    </div>
                    
                    <div class="about-text">
                        <div class="about-text-card">
                            <div class="about-text-icon">
                                <i class="fas fa-bullseye"></i>
                            </div>
                            <h3>Nuestra Misión</h3>
                            <p>Crear aplicaciones web modernas, eficientes y accesibles utilizando las mejores prácticas y tecnologías actuales.</p>
                        </div>
                        
                        <div class="about-text-card">
                            <div class="about-text-icon">
                                <i class="fas fa-eye"></i>
                            </div>
                            <h3>Nuestra Visión</h3>
                            <p>Ser referentes en el desarrollo de aplicaciones SPA que mejoren la experiencia del usuario y optimicen los procesos empresariales.</p>
                        </div>
                        
                        <div class="about-text-card">
                            <div class="about-text-icon">
                                <i class="fas fa-star"></i>
                            </div>
                            <h3>Nuestros Valores</h3>
                            <ul class="about-values-list">
                                <li><span class="value-icon"><i class="fas fa-lightbulb"></i></span><strong>Innovación:</strong> Buscamos constantemente nuevas formas de mejorar.</li>
                                <li><span class="value-icon"><i class="fas fa-check-circle"></i></span><strong>Calidad:</strong> Nos comprometemos con la excelencia en cada línea de código.</li>
                                <li><span class="value-icon"><i class="fas fa-users"></i></span><strong>Colaboración:</strong> Trabajamos juntos para lograr resultados excepcionales.</li>
                                <li><span class="value-icon"><i class="fas fa-book"></i></span><strong>Aprendizaje continuo:</strong> Nos mantenemos actualizados con las últimas tendencias.</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="team-section">
                    <div class="team-header">
                        <h3>Nuestro Equipo</h3>
                        <p>Conoce a los profesionales detrás de nuestros proyectos</p>
                    </div>
                    <div class="team-members">
                        <div class="team-member">
                            <div class="team-member-avatar">
                                <i class="fas fa-user"></i>
                            </div>
                            <h4>Ana Rodríguez</h4>
                            <p>Desarrolladora Frontend</p>
                            <div class="team-member-social">
                                <a href="#" class="social-icon"><i class="fab fa-linkedin"></i></a>
                                <a href="#" class="social-icon"><i class="fab fa-github"></i></a>
                                <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
                            </div>
                        </div>
                        
                        <div class="team-member">
                            <div class="team-member-avatar">
                                <i class="fas fa-user"></i>
                            </div>
                            <h4>Carlos Martínez</h4>
                            <p>Desarrollador Backend</p>
                            <div class="team-member-social">
                                <a href="#" class="social-icon"><i class="fab fa-linkedin"></i></a>
                                <a href="#" class="social-icon"><i class="fab fa-github"></i></a>
                                <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
                            </div>
                        </div>
                        
                        <div class="team-member">
                            <div class="team-member-avatar">
                                <i class="fas fa-user"></i>
                            </div>
                            <h4>Laura Sánchez</h4>
                            <p>Diseñadora UX/UI</p>
                            <div class="team-member-social">
                                <a href="#" class="social-icon"><i class="fab fa-linkedin"></i></a>
                                <a href="#" class="social-icon"><i class="fab fa-github"></i></a>
                                <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    render() {
        return this.template;
    }
    
    // Método que se ejecuta después de renderizar el componente
    afterRender() {
        // Inicializar las animaciones de scroll
        if (typeof window.initScrollAnimations === 'function') {
            window.initScrollAnimations();
        }
    }
}

// Exportar el componente
window.AboutComponent = AboutComponent;