// Componente Contact
class ContactComponent {
    constructor() {
        this.template = `
            <div class="contact-view">
                <div class="contact-header">
                    <h2>Contacto</h2>
                    <p>Estamos aquí para ayudarte. Ponte en contacto con nosotros.</p>
                </div>
                
                <div class="contact-container">
                    <div class="contact-info">
                        <h3>Información de Contacto</h3>
                        <p class="contact-intro">Utiliza cualquiera de estos medios para comunicarte con nuestro equipo.</p>
                        
                        <div class="contact-info-item">
                            <div class="contact-info-icon">
                                <i class="fas fa-map-marker-alt"></i>
                            </div>
                            <div class="contact-info-content">
                                <h4>Dirección</h4>
                                <p>Calle Ejemplo 123, Ciudad, País</p>
                            </div>
                        </div>
                        
                        <div class="contact-info-item">
                            <div class="contact-info-icon">
                                <i class="fas fa-phone"></i>
                            </div>
                            <div class="contact-info-content">
                                <h4>Teléfono</h4>
                                <p>+34 123 456 789</p>
                            </div>
                        </div>
                        
                        <div class="contact-info-item">
                            <div class="contact-info-icon">
                                <i class="fas fa-envelope"></i>
                            </div>
                            <div class="contact-info-content">
                                <h4>Email</h4>
                                <p>info@ejemplo.com</p>
                            </div>
                        </div>
                        
                        <div class="contact-info-item">
                            <div class="contact-info-icon">
                                <i class="fas fa-clock"></i>
                            </div>
                            <div class="contact-info-content">
                                <h4>Horario</h4>
                                <p>Lunes - Viernes: 9:00 - 18:00</p>
                            </div>
                        </div>
                        
                        <div class="contact-social">
                            <h4>Síguenos</h4>
                            <div class="social-icons">
                                <a href="#" class="social-icon"><i class="fab fa-facebook"></i></a>
                                <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
                                <a href="#" class="social-icon"><i class="fab fa-linkedin"></i></a>
                                <a href="#" class="social-icon"><i class="fab fa-instagram"></i></a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="contact-form-container">
                        <h3>Envíanos un Mensaje</h3>
                        <p class="form-intro">Completa el formulario y te responderemos lo antes posible.</p>
                        
                        <form id="contact-form" onsubmit="handleContactForm(event)">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="name">Nombre</label>
                                    <input type="text" id="name" class="form-control" placeholder="Tu nombre" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="email">Email</label>
                                    <input type="email" id="email" class="form-control" placeholder="Tu email" required>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="subject">Asunto</label>
                                <input type="text" id="subject" class="form-control" placeholder="Asunto del mensaje">
                            </div>
                            
                            <div class="form-group">
                                <label for="message">Mensaje</label>
                                <textarea id="message" class="form-control" placeholder="Tu mensaje" required></textarea>
                            </div>
                            
                            <button type="submit" class="btn btn-contact">Enviar mensaje <i class="fas fa-paper-plane"></i></button>
                        </form>
                        
                        <div id="success-message" class="success-message">
                            <i class="fas fa-check-circle"></i> Tu mensaje ha sido enviado correctamente. Nos pondremos en contacto contigo pronto.
                        </div>
                    </div>
                </div>
                
                <div class="map-section">
                    <div class="map-header">
                        <h3>Nuestra ubicación</h3>
                        <p>Visítanos en nuestras oficinas</p>
                    </div>
                    <div class="map-container">
                        <!-- Aquí iría un mapa real en una aplicación en producción -->
                        <div class="map-placeholder">
                            <i class="fas fa-map-marked-alt map-icon"></i>
                            <p>Mapa de ubicación</p>
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
        
        // Inicializar el formulario de contacto
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(event) {
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
                
                // Mostrar mensaje de éxito
                const formContainer = document.querySelector('.contact-form-container');
                if (formContainer) {
                    formContainer.innerHTML = `
                        <div class="success-message">
                            <i class="fas fa-check-circle"></i>
                            <h3>¡Mensaje enviado con éxito!</h3>
                            <p>Gracias ${name} por tu mensaje. Te responderemos lo antes posible.</p>
                        </div>
                    `;
                }
            });
        }
    }
}

// Exportar el componente
window.ContactComponent = ContactComponent;