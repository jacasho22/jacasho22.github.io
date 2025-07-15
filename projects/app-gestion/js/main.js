document.addEventListener('DOMContentLoaded', function() {
    // Inicializar los gráficos
    initCharts();
    
    // Inicializar el modo oscuro
    initDarkMode();
    
    // Inicializar animaciones al hacer scroll
    initScrollAnimations();
    
    // Inicializar los tabs de Bootstrap
    var triggerTabList = [].slice.call(document.querySelectorAll('.list-group-item[data-bs-toggle="tab"]'));
    triggerTabList.forEach(function (triggerEl) {
        var tabTrigger = new bootstrap.Tab(triggerEl);
        triggerEl.addEventListener('click', function (event) {
            event.preventDefault();
            tabTrigger.show();
            
            // Actualizar la clase active en los botones de la lista
            triggerTabList.forEach(function(el) {
                el.classList.remove('active');
            });
            triggerEl.classList.add('active');
        });
    });
});

/**
 * Inicializa los gráficos de la aplicación
 */
function initCharts() {
    // Gráfico de ventas mensuales
    var ventasCtx = document.getElementById('ventas-chart');
    if (ventasCtx) {
        var ventasChart = new Chart(ventasCtx, {
            type: 'line',
            data: {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
                datasets: [{
                    label: 'Ventas 2025',
                    data: [4500, 5200, 4800, 5800, 6200, 5300],
                    borderColor: '#0d6efd',
                    backgroundColor: 'rgba(13, 110, 253, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + ' €';
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Gráfico de productos más vendidos
    var productosCtx = document.getElementById('productos-chart');
    if (productosCtx) {
        var productosChart = new Chart(productosCtx, {
            type: 'doughnut',
            data: {
                labels: ['Portátil Pro X5', 'Monitor UltraWide 34"', 'Teclado Mecánico RGB', 'Ratón Gaming', 'Auriculares Bluetooth'],
                datasets: [{
                    data: [30, 25, 15, 18, 12],
                    backgroundColor: [
                        '#0d6efd',
                        '#6610f2',
                        '#6f42c1',
                        '#d63384',
                        '#dc3545'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                var label = context.label || '';
                                var value = context.raw || 0;
                                var total = context.dataset.data.reduce((a, b) => a + b, 0);
                                var percentage = Math.round((value / total) * 100);
                                return label + ': ' + percentage + '%';
                            }
                        }
                    }
                }
            }
        });
    }
}

/**
 * Inicializa el modo oscuro
 */
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const icon = darkModeToggle.querySelector('i');
    
    // Comprobar si el modo oscuro está guardado en localStorage
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // Aplicar el modo oscuro si está guardado
    if (isDarkMode) {
        body.classList.add('dark-mode');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        updateChartsTheme(true);
    }
    
    // Evento para cambiar entre modo oscuro y claro
    darkModeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        
        // Cambiar el icono
        if (body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('darkMode', 'true');
            updateChartsTheme(true);
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('darkMode', 'false');
            updateChartsTheme(false);
        }
    });
}

/**
 * Actualiza el tema de los gráficos según el modo oscuro/claro
 */
function updateChartsTheme(isDarkMode) {
    // Actualizar opciones globales de Chart.js
    Chart.defaults.color = isDarkMode ? '#e0e0e0' : '#212529';
    Chart.defaults.borderColor = isDarkMode ? '#333' : '#ddd';
    
    // Actualizar todos los gráficos existentes
    Chart.instances.forEach(chart => {
        chart.update();
    });
}

/**
 * Inicializa las animaciones al hacer scroll
 */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.feature-card, .card, h2, .btn');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}