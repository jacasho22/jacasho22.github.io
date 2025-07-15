// JavaScript para el proyecto Java

document.addEventListener('DOMContentLoaded', function() {
    // Animación de aparición para las tarjetas de características
    const featureCards = document.querySelectorAll('.feature-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    featureCards.forEach(card => {
        appearOnScroll.observe(card);
    });
    
    // Resaltado de sintaxis para el código Java
    const codeElements = document.querySelectorAll('code');
    
    codeElements.forEach(element => {
        // Resaltar palabras clave de Java
        const javaKeywords = ['public', 'class', 'static', 'void', 'private', 'protected', 
                             'import', 'package', 'extends', 'implements', 'interface', 
                             'abstract', 'final', 'return', 'if', 'else', 'for', 'while', 
                             'do', 'switch', 'case', 'break', 'continue', 'new', 'this', 
                             'super', 'try', 'catch', 'finally', 'throw', 'throws', 'int', 
                             'boolean', 'char', 'byte', 'short', 'long', 'float', 'double', 
                             'String', 'true', 'false', 'null'];
        
        let html = element.innerHTML;
        
        // Resaltar palabras clave
        javaKeywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            html = html.replace(regex, `<span class="keyword">${keyword}</span>`);
        });
        
        // Resaltar strings
        html = html.replace(/"(.*?)"/g, '<span class="string">"$1"</span>');
        
        // Resaltar comentarios
        html = html.replace(/\/\/(.*)/g, '<span class="comment">//$1</span>');
        html = html.replace(/\/\*(.*?)\*\//gs, '<span class="comment">/*$1*/</span>');
        
        // Resaltar nombres de clases (simplificado)
        html = html.replace(/\b([A-Z][a-zA-Z0-9_]*)\b/g, '<span class="class">$1</span>');
        
        // Resaltar métodos (simplificado)
        html = html.replace(/\b([a-z][a-zA-Z0-9_]*)\s*\(/g, '<span class="method">$1</span>(');
        
        element.innerHTML = html;
    });
    
    // Galería de capturas de pantalla con lightbox
    const screenshots = document.querySelectorAll('.screenshot img');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    
    if (screenshots.length > 0 && lightbox) {
        screenshots.forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
            });
        });
        
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });
    }
    
    // Contador de descargas (simulado)
    const downloadBtn = document.querySelector('.download-btn');
    let downloadCount = localStorage.getItem('javaAppDownloads') || 0;
    const downloadCounter = document.querySelector('.download-counter');
    
    if (downloadCounter) {
        downloadCounter.textContent = downloadCount;
    }
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            downloadCount++;
            localStorage.setItem('javaAppDownloads', downloadCount);
            if (downloadCounter) {
                downloadCounter.textContent = downloadCount;
            }
        });
    }
    
    // Formulario de contacto
    const contactForm = document.querySelector('#contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulación de envío de formulario
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const formFields = contactForm.querySelectorAll('input, textarea');
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            
            // Simulación de tiempo de envío
            setTimeout(() => {
                // Mostrar mensaje de éxito
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = '¡Mensaje enviado con éxito!';
                contactForm.appendChild(successMessage);
                
                // Limpiar campos
                formFields.forEach(field => {
                    field.value = '';
                });
                
                // Restaurar botón
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar Mensaje';
                
                // Eliminar mensaje después de un tiempo
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            }, 1500);
        });
    }
});