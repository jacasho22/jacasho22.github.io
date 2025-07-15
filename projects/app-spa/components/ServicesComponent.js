// Componente Services
class ServicesComponent {
    constructor() {
        this.template = `
            <div class="services-view">
                <h2>Nuestros Servicios</h2>
                <p>Ofrecemos soluciones digitales adaptadas a tus necesidades.</p>
                
                <div class="services-grid">
                    <div class="service-card fade-in">
                        <div class="service-icon">
                            <i class="fas fa-laptop-code"></i>
                        </div>
                        <h3>Desarrollo Web</h3>
                        <p>Creamos sitios web modernos, responsivos y optimizados para buscadores.</p>
                        <ul class="service-features">
                            <li>Diseño personalizado</li>
                            <li>Optimización SEO</li>
                            <li>Integración con CMS</li>
                            <li>Mantenimiento continuo</li>
                        </ul>
                        <a href="#" class="btn btn-outline" onclick="alert('Servicio seleccionado: Desarrollo Web'); return false;">Más información</a>
                    </div>
                    
                    <div class="service-card fade-in">
                        <div class="service-icon">
                            <i class="fas fa-mobile-alt"></i>
                        </div>
                        <h3>Aplicaciones Móviles</h3>
                        <p>Desarrollamos aplicaciones nativas y multiplataforma para iOS y Android.</p>
                        <ul class="service-features">
                            <li>Experiencia de usuario intuitiva</li>
                            <li>Rendimiento optimizado</li>
                            <li>Integración con APIs</li>
                            <li>Actualizaciones periódicas</li>
                        </ul>
                        <a href="#" class="btn btn-outline" onclick="alert('Servicio seleccionado: Aplicaciones Móviles'); return false;">Más información</a>
                    </div>
                    
                    <div class="service-card fade-in">
                        <div class="service-icon">
                            <i class="fas fa-server"></i>
                        </div>
                        <h3>Desarrollo Backend</h3>
                        <p>Implementamos servidores robustos, APIs y bases de datos escalables.</p>
                        <ul class="service-features">
                            <li>Arquitectura escalable</li>
                            <li>Seguridad avanzada</li>
                            <li>Optimización de rendimiento</li>
                            <li>Documentación completa</li>
                        </ul>
                        <a href="#" class="btn btn-outline" onclick="alert('Servicio seleccionado: Desarrollo Backend'); return false;">Más información</a>
                    </div>
                    
                    <div class="service-card fade-in">
                        <div class="service-icon">
                            <i class="fas fa-paint-brush"></i>
                        </div>
                        <h3>Diseño UX/UI</h3>
                        <p>Creamos interfaces atractivas y experiencias de usuario excepcionales.</p>
                        <ul class="service-features">
                            <li>Investigación de usuarios</li>
                            <li>Wireframing y prototipos</li>
                            <li>Diseño visual</li>
                            <li>Pruebas de usabilidad</li>
                        </ul>
                        <a href="#" class="btn btn-outline" onclick="alert('Servicio seleccionado: Diseño UX/UI'); return false;">Más información</a>
                    </div>
                </div>
                
                <div class="services-cta">
                    <h3>¿Necesitas un servicio personalizado?</h3>
                    <p>Contáctanos para discutir tus necesidades específicas.</p>
                    <a href="#" class="btn" onclick="router.navigate('contact'); return false;">Contactar ahora</a>
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
window.ServicesComponent = ServicesComponent;