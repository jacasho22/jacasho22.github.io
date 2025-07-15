// Inicialización cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar los componentes
    initTabs();
    initCharts();
    initSampleDataButtons();
    initAnimations();
    initDarkMode();
});

// Inicializar las pestañas
function initTabs() {
    const tabButtons = document.querySelectorAll('[data-bs-toggle="tab"]');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Desactivar todos los botones
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Activar el botón actual
            this.classList.add('active');
            
            // Mostrar el contenido de la pestaña
            const target = document.querySelector(this.dataset.bsTarget);
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('show', 'active');
            });
            target.classList.add('show', 'active');
        });
    });
}

// Inicializar los gráficos
function initCharts() {
    // Obtener el contexto del canvas
    const ctx = document.getElementById('main-chart').getContext('2d');
    
    // Datos de ejemplo para el gráfico
    const data = {
        labels: ['Enero', 'Febrero', 'Marzo'],
        datasets: [
            {
                label: 'Norte',
                data: [12500, 10800, 18200],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            },
            {
                label: 'Sur',
                data: [8300, 9600, 0],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            },
            {
                label: 'Este',
                data: [15200, 13400, 0],
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ]
    };
    
    // Configuración del gráfico
    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Ventas por Mes y Región'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Ventas (€)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Mes'
                    }
                }
            }
        }
    };
    
    // Crear el gráfico
    const myChart = new Chart(ctx, config);
    
    // Guardar la referencia del gráfico para poder actualizarlo
    window.mainChart = myChart;
    
    // Configurar los botones de tipo de gráfico
    const chartTypeButtons = document.querySelectorAll('.btn-group-sm .btn-outline-secondary');
    chartTypeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Desactivar todos los botones
            chartTypeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Activar el botón actual
            this.classList.add('active');
            
            // Cambiar el tipo de gráfico
            const chartType = this.textContent.trim().toLowerCase();
            let type;
            
            switch(chartType) {
                case 'barras':
                    type = 'bar';
                    break;
                case 'líneas':
                    type = 'line';
                    break;
                case 'pastel':
                    type = 'pie';
                    break;
                case 'dispersión':
                    type = 'scatter';
                    break;
                default:
                    type = 'bar';
            }
            
            // Actualizar el tipo de gráfico
            myChart.config.type = type;
            myChart.update();
        });
    });
    
    // Configurar el interruptor de leyenda
    const legendSwitch = document.getElementById('showLegend');
    legendSwitch.addEventListener('change', function() {
        myChart.options.plugins.legend.display = this.checked;
        myChart.update();
    });
    
    // Configurar el botón de actualizar gráfico
    const updateButton = document.querySelector('.btn-primary.btn-sm.w-100');
    updateButton.addEventListener('click', function() {
        // Aquí se implementaría la lógica para actualizar el gráfico
        // basado en las selecciones del usuario
        alert('Gráfico actualizado con las nuevas opciones');
    });
    
    // Configurar los botones de exportación
    const exportButtons = document.querySelectorAll('.card:last-child .btn-outline-secondary');
    exportButtons.forEach(button => {
        button.addEventListener('click', function() {
            const format = this.textContent.trim().toLowerCase();
            alert(`Gráfico exportado en formato ${format}`);
        });
    });
}

// Inicializar los botones de datos de muestra
function initSampleDataButtons() {
    const sampleButtons = document.querySelectorAll('[id^="load-sample-"]');
    
    sampleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sampleId = this.id.split('-').pop();
            loadSampleData(sampleId);
        });
    });
}

// Cargar datos de muestra
function loadSampleData(sampleId) {
    let title, data;
    
    switch(sampleId) {
        case '1':
            title = 'Ventas por Mes y Región';
            data = {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
                datasets: [
                    {
                        label: 'Norte',
                        data: [12500, 10800, 18200, 15600, 19800, 22100],
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Sur',
                        data: [8300, 9600, 11200, 10500, 12800, 14300],
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Este',
                        data: [15200, 13400, 16800, 18900, 17500, 19200],
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }
                ]
            };
            break;
        case '2':
            title = 'Distribución por Edad y Género';
            data = {
                labels: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
                datasets: [
                    {
                        label: 'Hombres',
                        data: [15, 30, 25, 22, 18, 12],
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Mujeres',
                        data: [18, 28, 27, 24, 20, 15],
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }
                ]
            };
            break;
        case '3':
            title = 'Rendimiento Escolar por Asignatura';
            data = {
                labels: ['Matemáticas', 'Ciencias', 'Historia', 'Literatura', 'Idiomas', 'Arte'],
                datasets: [
                    {
                        label: 'Grupo A',
                        data: [75, 82, 68, 70, 85, 90],
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Grupo B',
                        data: [70, 75, 72, 80, 78, 85],
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Grupo C',
                        data: [65, 70, 75, 68, 72, 80],
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }
                ]
            };
            break;
        default:
            return;
    }
    
    // Actualizar el gráfico con los nuevos datos
    window.mainChart.data = data;
    window.mainChart.options.plugins.title.text = title;
    window.mainChart.update();
    
    // Mostrar un mensaje de confirmación
    alert(`Datos de muestra cargados: ${title}`);
    
    // Cambiar a la pestaña de visualización
    document.querySelector('[data-bs-target="#tab-visualization"]').click();
}

// Inicializar animaciones
function initAnimations() {
    // Animación al hacer scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, #demo .card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animate-fade-in');
            }
        });
    };
    
    // Ejecutar la animación al cargar la página
    animateOnScroll();
    
    // Ejecutar la animación al hacer scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Smooth scrolling para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Inicializar modo oscuro
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const icon = darkModeToggle.querySelector('i');
    
    // Comprobar si el modo oscuro está guardado en localStorage
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // Aplicar modo oscuro si estaba activado
    if (isDarkMode) {
        body.classList.add('dark-mode');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
    
    // Evento para cambiar entre modo oscuro y claro
    darkModeToggle.addEventListener('click', () => {
        // Cambiar el estado del modo oscuro
        body.classList.toggle('dark-mode');
        
        // Guardar preferencia en localStorage
        const isDark = body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);
        
        // Cambiar el icono
        if (isDark) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
        
        // Si hay un gráfico, actualizarlo para que se adapte al tema
        if (window.mainChart) {
            updateChartTheme(window.mainChart, isDark);
        }
    });
}

// Actualizar tema del gráfico
function updateChartTheme(chart, isDarkMode) {
    if (isDarkMode) {
        chart.options.scales.x.ticks.color = '#e0e0e0';
        chart.options.scales.y.ticks.color = '#e0e0e0';
        chart.options.scales.x.grid.color = 'rgba(255, 255, 255, 0.1)';
        chart.options.scales.y.grid.color = 'rgba(255, 255, 255, 0.1)';
        chart.options.plugins.title.color = '#e0e0e0';
        chart.options.plugins.legend.labels.color = '#e0e0e0';
    } else {
        chart.options.scales.x.ticks.color = '#666';
        chart.options.scales.y.ticks.color = '#666';
        chart.options.scales.x.grid.color = 'rgba(0, 0, 0, 0.1)';
        chart.options.scales.y.grid.color = 'rgba(0, 0, 0, 0.1)';
        chart.options.plugins.title.color = '#333';
        chart.options.plugins.legend.labels.color = '#333';
    }
    chart.update();
}