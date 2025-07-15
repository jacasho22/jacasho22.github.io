/**
 * charts.js - Biblioteca de funciones para crear y gestionar gráficos
 * Utiliza Chart.js para renderizar visualizaciones de datos
 */

// Configuración global para todos los gráficos
Chart.defaults.font.family = '"Poppins", "Helvetica Neue", "Helvetica", "Arial", sans-serif';
Chart.defaults.color = '#555';
Chart.defaults.responsive = true;
Chart.defaults.maintainAspectRatio = false;

// Colores predefinidos para los gráficos
const CHART_COLORS = {
  primary: '#4361ee',
  secondary: '#3f37c9',
  success: '#4cc9f0',
  info: '#4895ef',
  warning: '#f72585',
  danger: '#e63946',
  light: '#f8f9fa',
  dark: '#212529',
  // Paleta extendida para múltiples series
  blue: '#4361ee',
  indigo: '#3f37c9',
  purple: '#7209b7',
  pink: '#f72585',
  red: '#e63946',
  orange: '#fb8500',
  yellow: '#ffbe0b',
  green: '#06d6a0',
  teal: '#2ec4b6',
  cyan: '#4cc9f0',
};

// Paleta de colores para múltiples series
const CHART_COLORS_ARRAY = Object.values(CHART_COLORS);

/**
 * Crea un gráfico de barras
 * @param {string} canvasId - ID del elemento canvas donde se renderizará el gráfico
 * @param {Array} labels - Etiquetas para el eje X
 * @param {Array} data - Datos para representar
 * @param {string} title - Título del gráfico
 * @param {Object} options - Opciones adicionales para el gráfico
 * @returns {Chart} Instancia del gráfico creado
 */
function createBarChart(canvasId, labels, data, title = '', options = {}) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  
  // Configuración por defecto
  const defaultOptions = {
    plugins: {
      title: {
        display: title !== '',
        text: title,
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
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
          precision: 0
        }
      }
    }
  };
  
  // Combinar opciones por defecto con las proporcionadas
  const chartOptions = { ...defaultOptions, ...options };
  
  // Crear el gráfico
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: title,
        data: data,
        backgroundColor: CHART_COLORS.primary,
        borderColor: CHART_COLORS.primary,
        borderWidth: 1
      }]
    },
    options: chartOptions
  });
}

/**
 * Crea un gráfico de líneas
 * @param {string} canvasId - ID del elemento canvas donde se renderizará el gráfico
 * @param {Array} labels - Etiquetas para el eje X
 * @param {Array} data - Datos para representar
 * @param {string} title - Título del gráfico
 * @param {Object} options - Opciones adicionales para el gráfico
 * @returns {Chart} Instancia del gráfico creado
 */
function createLineChart(canvasId, labels, data, title = '', options = {}) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  
  // Configuración por defecto
  const defaultOptions = {
    plugins: {
      title: {
        display: title !== '',
        text: title,
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
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
        beginAtZero: false,
      }
    }
  };
  
  // Combinar opciones por defecto con las proporcionadas
  const chartOptions = { ...defaultOptions, ...options };
  
  // Crear el gráfico
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: title,
        data: data,
        backgroundColor: 'rgba(67, 97, 238, 0.2)',
        borderColor: CHART_COLORS.primary,
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: CHART_COLORS.primary,
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    },
    options: chartOptions
  });
}

/**
 * Crea un gráfico de dispersión
 * @param {string} canvasId - ID del elemento canvas donde se renderizará el gráfico
 * @param {Array} data - Array de objetos {x, y}
 * @param {string} title - Título del gráfico
 * @param {Object} options - Opciones adicionales para el gráfico
 * @returns {Chart} Instancia del gráfico creado
 */
function createScatterChart(canvasId, data, title = '', options = {}) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  
  // Configuración por defecto
  const defaultOptions = {
    plugins: {
      title: {
        display: title !== '',
        text: title,
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `(${context.parsed.x}, ${context.parsed.y})`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom'
      },
      y: {
        beginAtZero: false,
      }
    }
  };
  
  // Combinar opciones por defecto con las proporcionadas
  const chartOptions = { ...defaultOptions, ...options };
  
  // Crear el gráfico
  return new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: title,
        data: data,
        backgroundColor: CHART_COLORS.primary,
        borderColor: CHART_COLORS.primary,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: chartOptions
  });
}

/**
 * Crea un gráfico de pastel
 * @param {string} canvasId - ID del elemento canvas donde se renderizará el gráfico
 * @param {Array} labels - Etiquetas para las secciones
 * @param {Array} data - Datos para representar
 * @param {string} title - Título del gráfico
 * @param {Object} options - Opciones adicionales para el gráfico
 * @returns {Chart} Instancia del gráfico creado
 */
function createPieChart(canvasId, labels, data, title = '', options = {}) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  
  // Configuración por defecto
  const defaultOptions = {
    plugins: {
      title: {
        display: title !== '',
        text: title,
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };
  
  // Combinar opciones por defecto con las proporcionadas
  const chartOptions = { ...defaultOptions, ...options };
  
  // Generar colores para cada sección
  const backgroundColors = [];
  for (let i = 0; i < data.length; i++) {
    backgroundColors.push(CHART_COLORS_ARRAY[i % CHART_COLORS_ARRAY.length]);
  }
  
  // Crear el gráfico
  return new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: title,
        data: data,
        backgroundColor: backgroundColors,
        borderColor: '#fff',
        borderWidth: 2
      }]
    },
    options: chartOptions
  });
}

/**
 * Crea un gráfico de múltiples series
 * @param {string} canvasId - ID del elemento canvas donde se renderizará el gráfico
 * @param {string} type - Tipo de gráfico ('bar', 'line', etc.)
 * @param {Array} labels - Etiquetas para el eje X
 * @param {Array} datasets - Array de objetos con {label, data}
 * @param {string} title - Título del gráfico
 * @param {Object} options - Opciones adicionales para el gráfico
 * @returns {Chart} Instancia del gráfico creado
 */
function createMultiSeriesChart(canvasId, type, labels, datasets, title = '', options = {}) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  
  // Configuración por defecto
  const defaultOptions = {
    plugins: {
      title: {
        display: title !== '',
        text: title,
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
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
        beginAtZero: type === 'bar',
      }
    }
  };
  
  // Combinar opciones por defecto con las proporcionadas
  const chartOptions = { ...defaultOptions, ...options };
  
  // Preparar datasets con colores
  const formattedDatasets = datasets.map((dataset, index) => {
    const color = CHART_COLORS_ARRAY[index % CHART_COLORS_ARRAY.length];
    
    if (type === 'line') {
      return {
        ...dataset,
        backgroundColor: `${color}33`, // Color con transparencia
        borderColor: color,
        borderWidth: 2,
        tension: 0.3,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      };
    } else {
      return {
        ...dataset,
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1
      };
    }
  });
  
  // Crear el gráfico
  return new Chart(ctx, {
    type: type,
    data: {
      labels: labels,
      datasets: formattedDatasets
    },
    options: chartOptions
  });
}

/**
 * Crea un gráfico de correlación (heatmap)
 * @param {string} canvasId - ID del elemento canvas donde se renderizará el gráfico
 * @param {Array} labels - Etiquetas para ambos ejes
 * @param {Array} data - Matriz de correlación
 * @param {string} title - Título del gráfico
 * @param {Object} options - Opciones adicionales para el gráfico
 * @returns {Chart} Instancia del gráfico creado
 */
function createCorrelationHeatmap(canvasId, labels, data, title = '', options = {}) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  
  // Configuración por defecto
  const defaultOptions = {
    plugins: {
      title: {
        display: title !== '',
        text: title,
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      legend: {
        position: 'right',
        align: 'start',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw.v;
            return `Correlación: ${value.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'category',
        labels: labels,
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        type: 'category',
        labels: labels,
        reverse: true
      }
    }
  };
  
  // Combinar opciones por defecto con las proporcionadas
  const chartOptions = { ...defaultOptions, ...options };
  
  // Preparar datos para el heatmap
  const heatmapData = [];
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      heatmapData.push({
        x: labels[j],
        y: labels[i],
        v: data[i][j]
      });
    }
  }
  
  // Crear el gráfico
  return new Chart(ctx, {
    type: 'matrix',
    data: {
      datasets: [{
        label: title,
        data: heatmapData,
        backgroundColor(context) {
          const value = context.dataset.data[context.dataIndex].v;
          const alpha = Math.abs(value);
          const color = value < 0 ? 'rgb(231, 76, 60)' : 'rgb(52, 152, 219)';
          return value === 1 ? 'rgb(46, 204, 113)' : `${color.slice(0, -1)}, ${alpha})`;
        },
        borderColor: '#fff',
        borderWidth: 1,
        width: ({ chart }) => (chart.chartArea || {}).width / labels.length - 1,
        height: ({ chart }) => (chart.chartArea || {}).height / labels.length - 1
      }]
    },
    options: chartOptions
  });
} // End of createCorrelationHeatmap function


/**
 * Exporta un gráfico como imagen PNG
 * @param {Chart} chart - Instancia del gráfico a exportar
 * @param {string} fileName - Nombre del archivo a descargar
 */
function exportChartAsPNG(chart, fileName = 'chart') {
  // Crear un enlace temporal
  const link = document.createElement('a');
  link.download = `${fileName}.png`;
  link.href = chart.toBase64Image();
  link.click();
  link.remove();
}

/**
 * Actualiza los datos de un gráfico existente
 * @param {Chart} chart - Instancia del gráfico a actualizar
 * @param {Array} labels - Nuevas etiquetas
 * @param {Array} data - Nuevos datos
 * @param {boolean} animate - Si debe animarse la transición
 */
function updateChartData(chart, labels, data, animate = true) {
  chart.data.labels = labels;
  
  // Si es un solo conjunto de datos
  if (!Array.isArray(data[0])) {
    chart.data.datasets[0].data = data;
  } else {
    // Si son múltiples conjuntos de datos
    data.forEach((dataSet, index) => {
      if (chart.data.datasets[index]) {
        chart.data.datasets[index].data = dataSet;
      }
    });
  }
  
  chart.update(animate ? undefined : 'none');
}

// Exportar funciones
window.chartUtils = {
  createBarChart,
  createLineChart,
  createScatterChart,
  createPieChart,
  createMultiSeriesChart,
  createCorrelationHeatmap,
  exportChartAsPNG,
  updateChartData,
  CHART_COLORS,
  CHART_COLORS_ARRAY
};