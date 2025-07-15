document.addEventListener('DOMContentLoaded', function() {
    // Inicializar los gráficos
    initCharts();
    
    // Inicializar las animaciones al hacer scroll
    initScrollAnimations();
    
    // Inicializar los filtros de fecha
    initDateFilters();
    
    // Inicializar los tooltips y popovers de Bootstrap
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
        new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.forEach(function (popoverTriggerEl) {
        new bootstrap.Popover(popoverTriggerEl);
    });
    
    // Inicializar los tabs
    var triggerTabList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tab"]'));
    triggerTabList.forEach(function (triggerEl) {
        var tabTrigger = new bootstrap.Tab(triggerEl);
        triggerEl.addEventListener('click', function (event) {
            event.preventDefault();
            tabTrigger.show();
        });
    });
    
    // Manejar el cambio de tema (claro/oscuro)
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Inicializar los selectores de datos
    initDataSelectors();
});

/**
 * Inicializa los gráficos del dashboard
 */
function initCharts() {
    // Gráfico de líneas - Tendencia de ventas
    const salesTrendCtx = document.getElementById('sales-trend-chart');
    if (salesTrendCtx) {
        const salesTrendChart = new Chart(salesTrendCtx, {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                datasets: [{
                    label: '2025',
                    data: [5000, 5800, 6200, 6800, 7500, 8000, 8200, 8600, 9100, 9500, 10000, 11000],
                    borderColor: '#4285F4',
                    backgroundColor: 'rgba(66, 133, 244, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                }, {
                    label: '2024',
                    data: [4200, 4500, 4800, 5200, 5500, 5800, 6000, 6300, 6500, 6800, 7200, 7800],
                    borderColor: '#34A853',
                    backgroundColor: 'rgba(52, 168, 83, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
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
                                return value.toLocaleString() + ' €';
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Gráfico de barras - Ventas por categoría
    const categoryChartCtx = document.getElementById('category-chart');
    if (categoryChartCtx) {
        const categoryChart = new Chart(categoryChartCtx, {
            type: 'bar',
            data: {
                labels: ['Tecnología', 'Moda', 'Hogar', 'Deportes', 'Alimentación'],
                datasets: [{
                    label: 'Ventas por Categoría',
                    data: [12500, 8300, 6700, 5400, 4200],
                    backgroundColor: [
                        '#4285F4',
                        '#34A853',
                        '#FBBC05',
                        '#EA4335',
                        '#9C27B0'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.raw.toLocaleString() + ' €';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString() + ' €';
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Gráfico circular - Distribución de clientes
    const customerChartCtx = document.getElementById('customer-chart');
    if (customerChartCtx) {
        const customerChart = new Chart(customerChartCtx, {
            type: 'doughnut',
            data: {
                labels: ['Nuevos', 'Recurrentes', 'Inactivos'],
                datasets: [{
                    data: [35, 55, 10],
                    backgroundColor: [
                        '#4285F4',
                        '#34A853',
                        '#FBBC05'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.raw + '%';
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Gráfico de área - Tráfico del sitio web
    const trafficChartCtx = document.getElementById('traffic-chart');
    if (trafficChartCtx) {
        const trafficChart = new Chart(trafficChartCtx, {
            type: 'line',
            data: {
                labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                datasets: [{
                    label: 'Visitantes',
                    data: [1200, 1900, 1700, 1500, 2200, 2800, 2100],
                    borderColor: '#4285F4',
                    backgroundColor: 'rgba(66, 133, 244, 0.2)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
}

/**
 * Inicializa las animaciones al hacer scroll
 */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
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

/**
 * Inicializa los filtros de fecha
 */
function initDateFilters() {
    const dateRangeFilter = document.getElementById('date-range-filter');
    if (dateRangeFilter) {
        dateRangeFilter.addEventListener('change', function() {
            // Aquí iría la lógica para actualizar los datos según el rango de fechas seleccionado
            updateDashboardData(this.value);
        });
    }
}

/**
 * Actualiza los datos del dashboard según el filtro seleccionado
 * @param {string} filter - El filtro seleccionado (hoy, semana, mes, año)
 */
function updateDashboardData(filter) {
    // Simulación de actualización de datos
    console.log('Actualizando datos con filtro: ' + filter);
    
    // Aquí iría la lógica para obtener los datos según el filtro
    // y actualizar los gráficos y KPIs
    
    // Mostrar un indicador de carga
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'block';
        
        // Simular tiempo de carga
        setTimeout(() => {
            loadingIndicator.style.display = 'none';
            
            // Actualizar los KPIs con datos simulados
            updateKPIs(filter);
            
            // Mostrar notificación de actualización
            showNotification('Datos actualizados correctamente');
        }, 800);
    }
}

/**
 * Actualiza los KPIs con datos simulados según el filtro
 * @param {string} filter - El filtro seleccionado
 */
function updateKPIs(filter) {
    // Datos simulados para cada filtro
    const kpiData = {
        'hoy': {
            ventas: '2.450 €',
            pedidos: '18',
            conversion: '3.2%',
            ticket: '136 €'
        },
        'semana': {
            ventas: '18.350 €',
            pedidos: '142',
            conversion: '3.8%',
            ticket: '129 €'
        },
        'mes': {
            ventas: '76.500 €',
            pedidos: '583',
            conversion: '4.1%',
            ticket: '131 €'
        },
        'año': {
            ventas: '925.000 €',
            pedidos: '7.245',
            conversion: '4.5%',
            ticket: '128 €'
        }
    };
    
    // Obtener los datos para el filtro seleccionado
    const data = kpiData[filter] || kpiData['mes'];
    
    // Actualizar los elementos del DOM
    document.getElementById('kpi-ventas').textContent = data.ventas;
    document.getElementById('kpi-pedidos').textContent = data.pedidos;
    document.getElementById('kpi-conversion').textContent = data.conversion;
    document.getElementById('kpi-ticket').textContent = data.ticket;
}

/**
 * Muestra una notificación temporal
 * @param {string} message - El mensaje a mostrar
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Mostrar la notificación
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Ocultar y eliminar la notificación después de un tiempo
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

/**
 * Cambia entre tema claro y oscuro
 */
function toggleTheme() {
    const body = document.body;
    const isDarkMode = body.classList.toggle('dark-mode');
    
    // Actualizar el icono del botón
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        themeIcon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    // Guardar la preferencia en localStorage
    localStorage.setItem('darkMode', isDarkMode);
    
    // Actualizar los gráficos para el nuevo tema
    updateChartsTheme(isDarkMode);
}

/**
 * Actualiza los colores de los gráficos según el tema
 * @param {boolean} isDarkMode - Indica si el tema oscuro está activo
 */
function updateChartsTheme(isDarkMode) {
    // Aquí iría la lógica para actualizar los colores de los gráficos
    // según el tema seleccionado
    Chart.instances.forEach(chart => {
        chart.options.scales.x.grid.color = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        chart.options.scales.y.grid.color = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        chart.options.scales.x.ticks.color = isDarkMode ? '#e0e0e0' : '#666';
        chart.options.scales.y.ticks.color = isDarkMode ? '#e0e0e0' : '#666';
        chart.update();
    });
}

/**
 * Inicializa los selectores de datos
 */
function initDataSelectors() {
    const dataSelectors = document.querySelectorAll('.data-selector');
    dataSelectors.forEach(selector => {
        selector.addEventListener('change', function() {
            const target = this.getAttribute('data-target');
            const value = this.value;
            
            // Actualizar el gráfico correspondiente
            updateChartData(target, value);
        });
    });
}

/**
 * Actualiza los datos de un gráfico específico
 * @param {string} chartId - El ID del gráfico a actualizar
 * @param {string} dataType - El tipo de datos a mostrar
 */
function updateChartData(chartId, dataType) {
    // Aquí iría la lógica para actualizar los datos del gráfico
    // según el tipo de datos seleccionado
    console.log(`Actualizando gráfico ${chartId} con datos de tipo ${dataType}`);
    
    // Simulación de datos diferentes para cada tipo
    const chartData = {
        'ventas': {
            'sales-trend-chart': {
                data1: [5000, 5800, 6200, 6800, 7500, 8000, 8200, 8600, 9100, 9500, 10000, 11000],
                data2: [4200, 4500, 4800, 5200, 5500, 5800, 6000, 6300, 6500, 6800, 7200, 7800]
            },
            'category-chart': {
                data: [12500, 8300, 6700, 5400, 4200]
            }
        },
        'unidades': {
            'sales-trend-chart': {
                data1: [350, 420, 480, 510, 550, 590, 620, 650, 680, 710, 750, 800],
                data2: [300, 330, 360, 390, 410, 430, 450, 470, 490, 510, 540, 580]
            },
            'category-chart': {
                data: [950, 720, 580, 450, 320]
            }
        },
        'clientes': {
            'sales-trend-chart': {
                data1: [120, 150, 180, 200, 230, 250, 270, 290, 310, 330, 350, 380],
                data2: [100, 120, 140, 160, 180, 190, 200, 210, 220, 230, 240, 260]
            },
            'category-chart': {
                data: [450, 380, 320, 280, 220]
            }
        }
    };
    
    // Obtener el gráfico y actualizar sus datos
    const chart = Chart.getChart(chartId);
    if (chart && chartData[dataType] && chartData[dataType][chartId]) {
        if (chart.config.type === 'line' && chart.data.datasets.length >= 2) {
            chart.data.datasets[0].data = chartData[dataType][chartId].data1;
            chart.data.datasets[1].data = chartData[dataType][chartId].data2;
        } else if (chart.config.type === 'bar' || chart.config.type === 'doughnut') {
            chart.data.datasets[0].data = chartData[dataType][chartId].data;
        }
        
        chart.update();
    }
}