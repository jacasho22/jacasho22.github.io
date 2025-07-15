// Router simple para la SPA
class Router {
    constructor(routes, rootElement) {
        this.routes = routes;
        this.rootElement = rootElement;
        this.currentComponent = null;
        
        // Manejar los cambios en la URL
        window.addEventListener('hashchange', this.handleRouteChange.bind(this));
        
        // Inicializar la ruta actual
        this.handleRouteChange();
    }
    
    // Método para manejar el cambio de ruta
    handleRouteChange() {
        // Obtener la ruta actual de la URL (sin el #)
        const path = window.location.hash.substring(1) || '/';
        
        // Encontrar la ruta correspondiente
        const route = this.routes.find(route => route.path === path);
        
        // Si la ruta existe, renderizar el componente
        if (route) {
            this.renderComponent(route.component);
            this.updateActiveLink(path);
        } else {
            // Si la ruta no existe, redirigir a la ruta por defecto
            this.navigate('/');
        }
    }
    
    // Método para renderizar un componente
    renderComponent(ComponentClass) {
        // Crear una instancia del componente
        this.currentComponent = new ComponentClass();
        
        // Renderizar el componente en el elemento raíz
        this.rootElement.innerHTML = this.currentComponent.render();
        
        // Llamar al método afterRender si existe
        if (typeof this.currentComponent.afterRender === 'function') {
            this.currentComponent.afterRender();
        }
        
        // Inicializar las animaciones de scroll para el nuevo contenido
        if (typeof window.initScrollAnimations === 'function') {
            window.initScrollAnimations();
        }
    }
    
    // Método para navegar a una ruta
    navigate(path) {
        window.location.hash = path;
    }
    
    // Método para actualizar el enlace activo en la navegación
    updateActiveLink(path) {
        // Eliminar la clase active de todos los enlaces
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Añadir la clase active al enlace correspondiente
        const activeLink = document.querySelector(`.nav-links a[href="#${path}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

// Exportar el router
window.Router = Router;