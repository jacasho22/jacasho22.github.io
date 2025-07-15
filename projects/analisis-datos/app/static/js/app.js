/**
 * app.js - Funcionalidad principal de la aplicación de análisis de datos
 * Gestiona la carga de datos, análisis y visualizaciones
 */

// Objeto global para almacenar el estado de la aplicación
const App = {
  // Datos cargados actualmente
  currentData: null,
  // Tipo de datos cargados (ventas, demograficos, etc.)
  dataType: null,
  // Gráficos activos
  charts: {},
  // Opciones de análisis
  analysisOptions: {},
  // Inicializar la aplicación
  init: function() {
    // Cargar datos de ejemplo al inicio
    this.loadSampleData('ventas');
    
    // Configurar listeners de eventos
    this.setupEventListeners();
  },
  
  /**
   * Configura los listeners de eventos para la interfaz
   */
  setupEventListeners: function() {
    // Cambio de pestañas
    document.addEventListener('tabChanged', function(e) {
      const tabId = e.detail.tabId;
      
      // Actualizar UI según la pestaña activa
      if (tabId === 'visualizacion') {
        App.renderCharts();
      } else if (tabId === 'analisis') {
        App.performAnalysis();
      }
    });
    
    // Selector de conjunto de datos
    const datasetSelector = document.getElementById('datasetSelector');
    if (datasetSelector) {
      datasetSelector.addEventListener('change', function() {
        App.loadSampleData(this.value);
      });
    }
    
    // Botones de tipo de gráfico
    document.querySelectorAll('[data-chart-type]').forEach(button => {
      button.addEventListener('click', function() {
        const chartType = this.getAttribute('data-chart-type');
        App.createChart(chartType);
      });
    });
    
    // Botones de tipo de análisis
    document.querySelectorAll('[data-analysis-type]').forEach(button => {
      button.addEventListener('click', function() {
        const analysisType = this.getAttribute('data-analysis-type');
        App.performAnalysis(analysisType);
      });
    });
    
    // Botones de exportación
    document.querySelectorAll('[data-export-format]').forEach(button => {
      button.addEventListener('click', function() {
        const format = this.getAttribute('data-export-format');
        App.exportData(format);
      });
    });
  },
  
  /**
   * Carga datos de ejemplo
   * @param {string} dataType - Tipo de datos a cargar (sales, demographics, education)
   */
  loadSampleData: function(dataType) {
    // Mostrar indicador de carga
    this.showLoading(true);
    
    // Guardar el tipo de datos
    this.dataType = dataType;
    
    // Datos de ejemplo para cada tipo
    const sampleData = {
      sales: {
        data: [
          { fecha: '01/01/2023', region: 'Norte', producto: 'A', ventas: 542, unidades: 12 },
          { fecha: '02/01/2023', region: 'Sur', producto: 'B', ventas: 328, unidades: 8 },
          { fecha: '03/01/2023', region: 'Este', producto: 'A', ventas: 721, unidades: 15 },
          { fecha: '04/01/2023', region: 'Oeste', producto: 'C', ventas: 489, unidades: 10 },
          { fecha: '05/01/2023', region: 'Norte', producto: 'D', ventas: 612, unidades: 14 },
          { fecha: '06/01/2023', region: 'Sur', producto: 'A', ventas: 550, unidades: 13 },
          { fecha: '07/01/2023', region: 'Este', producto: 'B', ventas: 402, unidades: 9 },
          { fecha: '08/01/2023', region: 'Oeste', producto: 'C', ventas: 587, unidades: 12 }
        ],
        columns: ['fecha', 'region', 'producto', 'ventas', 'unidades']
      },
      demographics: {
        data: [
          { id: 1, edad: 28, genero: 'M', educacion: 'Universidad', ingresos: 45000, ciudad: 'Madrid' },
          { id: 2, edad: 35, genero: 'F', educacion: 'Posgrado', ingresos: 62000, ciudad: 'Barcelona' },
          { id: 3, edad: 42, genero: 'M', educacion: 'Universidad', ingresos: 58000, ciudad: 'Valencia' },
          { id: 4, edad: 31, genero: 'F', educacion: 'Secundaria', ingresos: 32000, ciudad: 'Sevilla' },
          { id: 5, edad: 55, genero: 'M', educacion: 'Primaria', ingresos: 28000, ciudad: 'Madrid' },
          { id: 6, edad: 24, genero: 'F', educacion: 'Universidad', ingresos: 38000, ciudad: 'Barcelona' },
          { id: 7, edad: 47, genero: 'M', educacion: 'Posgrado', ingresos: 75000, ciudad: 'Madrid' },
          { id: 8, edad: 39, genero: 'F', educacion: 'Universidad', ingresos: 51000, ciudad: 'Valencia' }
        ],
        columns: ['id', 'edad', 'genero', 'educacion', 'ingresos', 'ciudad']
      },
      education: {
        data: [
          { estudiante: 'E001', matematicas: 85, ciencias: 92, historia: 78, literatura: 88, promedio: 85.75 },
          { estudiante: 'E002', matematicas: 72, ciencias: 68, historia: 91, literatura: 84, promedio: 78.75 },
          { estudiante: 'E003', matematicas: 95, ciencias: 88, historia: 75, literatura: 70, promedio: 82.00 },
          { estudiante: 'E004', matematicas: 68, ciencias: 72, historia: 84, literatura: 90, promedio: 78.50 },
          { estudiante: 'E005', matematicas: 78, ciencias: 82, historia: 88, literatura: 85, promedio: 83.25 },
          { estudiante: 'E006', matematicas: 90, ciencias: 94, historia: 82, literatura: 78, promedio: 86.00 },
          { estudiante: 'E007', matematicas: 65, ciencias: 70, historia: 75, literatura: 80, promedio: 72.50 },
          { estudiante: 'E008', matematicas: 85, ciencias: 80, historia: 92, literatura: 88, promedio: 86.25 }
        ],
        columns: ['estudiante', 'matematicas', 'ciencias', 'historia', 'literatura', 'promedio']
      },
      // Compatibilidad con nombres en español
      ventas: 'sales',
      demograficos: 'demographics',
      educacion: 'education'
    };
    
    try {
      // Manejar compatibilidad con nombres en español
      if (typeof sampleData[dataType] === 'string') {
        dataType = sampleData[dataType];
      }
      
      // Verificar si tenemos datos para el tipo solicitado
      if (!sampleData[dataType]) {
        throw new Error(`No hay datos de muestra disponibles para ${dataType}`);
      }
      
      // Guardar los datos
      this.currentData = {
        data: sampleData[dataType].data,
        columns: sampleData[dataType].columns,
        filename: `sample_${dataType}.csv`
      };
      
      // Actualizar la interfaz
      this.updateDataTable();
      this.renderCharts();
      this.performAnalysis();
      
      // Mostrar mensaje de éxito
      uiUtils.showAlert(`Datos de ${this.getDataTypeName(dataType)} cargados correctamente`, 'success');
    } catch (error) {
      console.error('Error cargando datos:', error);
      uiUtils.showAlert('Error al cargar los datos: ' + error.message, 'danger');
    } finally {
      // Ocultar indicador de carga
      this.showLoading(false);
    }
  },
  
  /**
   * Obtiene el nombre amigable del tipo de datos
   * @param {string} dataType - Tipo de datos
   * @returns {string} Nombre amigable
   */
  getDataTypeName: function(dataType) {
    const names = {
      'ventas': 'ventas por región',
      'demograficos': 'datos demográficos',
      'series_temporales': 'series temporales',
      'correlacion': 'correlación multivariable'
    };
    
    return names[dataType] || dataType;
  },
  
  /**
   * Actualiza la tabla de datos
   */
  updateDataTable: function() {
    if (!this.currentData || !this.currentData.data) return;
    
    const tableContainer = document.getElementById('dataTable');
    if (!tableContainer) return;
    
    // Obtener datos y columnas
    const data = this.currentData.data;
    const columns = this.currentData.columns || Object.keys(data[0] || {});
    
    // Crear tabla HTML
    let tableHtml = `
      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              ${columns.map(col => `<th>${col}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
    `;
    
    // Limitar a 100 filas para rendimiento
    const displayData = data.slice(0, 100);
    
    // Añadir filas
    displayData.forEach(row => {
      tableHtml += '<tr>';
      columns.forEach(col => {
        tableHtml += `<td>${row[col] !== undefined ? row[col] : ''}</td>`;
      });
      tableHtml += '</tr>';
    });
    
    // Cerrar tabla
    tableHtml += `
          </tbody>
        </table>
      </div>
    `;
    
    // Si hay más de 100 filas, mostrar mensaje
    if (data.length > 100) {
      tableHtml += `<div class="text-muted small">Mostrando 100 de ${data.length} filas</div>`;
    }
    
    // Actualizar contenido
    tableContainer.innerHTML = tableHtml;
  },
  
  /**
   * Renderiza los gráficos según el tipo de datos
   */
  renderCharts: function() {
    // Limpiar gráficos existentes
    this.clearCharts();
    
    // Verificar si hay datos
    if (!this.currentData || !this.currentData.data || this.currentData.data.length === 0) {
      document.getElementById('chartContainer').innerHTML = `
        <div class="alert alert-info">No hay datos disponibles para visualizar</div>
      `;
      return;
    }
    
    // Crear contenedores para los gráficos
    const chartContainer = document.getElementById('chartContainer');
    chartContainer.innerHTML = `
      <div class="row">
        <div class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">Gráfico Principal</h5>
              <div class="chart-container">
                <canvas id="mainChart"></canvas>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">Distribución</h5>
              <div class="chart-container">
                <canvas id="distributionChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 mb-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Tendencia Temporal</h5>
              <div class="chart-container">
                <canvas id="timeSeriesChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Crear gráficos según el tipo de datos
    switch (this.dataType) {
      case 'ventas':
        this.createSalesCharts();
        break;
      case 'demograficos':
        this.createDemographicCharts();
        break;
      case 'series_temporales':
        this.createTimeSeriesCharts();
        break;
      case 'correlacion':
        this.createCorrelationCharts();
        break;
      default:
        // Gráficos genéricos
        this.createGenericCharts();
    }
  },
  
  /**
   * Crea gráficos para datos de ventas
   */
  createSalesCharts: function() {
    const data = this.currentData.data;
    
    // Gráfico de ventas por región
    const regionSales = {};
    data.forEach(row => {
      if (!regionSales[row.region]) {
        regionSales[row.region] = 0;
      }
      regionSales[row.region] += parseFloat(row.ventas) || 0;
    });
    
    const regions = Object.keys(regionSales);
    const salesValues = regions.map(region => regionSales[region]);
    
    this.charts.mainChart = chartUtils.createBarChart(
      'mainChart',
      regions,
      salesValues,
      'Ventas por Región'
    );
    
    // Gráfico de distribución por producto
    const productSales = {};
    data.forEach(row => {
      if (!productSales[row.producto]) {
        productSales[row.producto] = 0;
      }
      productSales[row.producto] += parseFloat(row.ventas) || 0;
    });
    
    const products = Object.keys(productSales);
    const productValues = products.map(product => productSales[product]);
    
    this.charts.distributionChart = chartUtils.createPieChart(
      'distributionChart',
      products,
      productValues,
      'Distribución de Ventas por Producto'
    );
    
    // Gráfico de tendencia temporal
    // Agrupar por fecha
    const salesByDate = {};
    data.forEach(row => {
      const date = row.fecha;
      if (!salesByDate[date]) {
        salesByDate[date] = 0;
      }
      salesByDate[date] += parseFloat(row.ventas) || 0;
    });
    
    // Ordenar fechas
    const dates = Object.keys(salesByDate).sort();
    const timeSeriesValues = dates.map(date => salesByDate[date]);
    
    this.charts.timeSeriesChart = chartUtils.createLineChart(
      'timeSeriesChart',
      dates,
      timeSeriesValues,
      'Tendencia de Ventas en el Tiempo'
    );
  },
  
  /**
   * Crea gráficos para datos demográficos
   */
  createDemographicCharts: function() {
    const data = this.currentData.data;
    
    // Gráfico de distribución por género
    const genderCount = {};
    data.forEach(row => {
      if (!genderCount[row.genero]) {
        genderCount[row.genero] = 0;
      }
      genderCount[row.genero]++;
    });
    
    const genders = Object.keys(genderCount);
    const genderValues = genders.map(gender => genderCount[gender]);
    
    this.charts.mainChart = chartUtils.createPieChart(
      'mainChart',
      genders,
      genderValues,
      'Distribución por Género'
    );
    
    // Gráfico de ingresos por edad
    // Preparar datos para scatter plot
    const ageIncomeData = data.map(row => ({
      x: parseInt(row.edad),
      y: parseInt(row.ingresos)
    }));
    
    this.charts.distributionChart = chartUtils.createScatterChart(
      'distributionChart',
      ageIncomeData,
      'Relación Edad-Ingresos'
    );
    
    // Gráfico de ocupaciones
    const occupationCount = {};
    data.forEach(row => {
      if (!occupationCount[row.ocupacion]) {
        occupationCount[row.ocupacion] = 0;
      }
      occupationCount[row.ocupacion]++;
    });
    
    // Ordenar por frecuencia
    const sortedOccupations = Object.entries(occupationCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10); // Top 10
    
    const occupations = sortedOccupations.map(item => item[0]);
    const occupationValues = sortedOccupations.map(item => item[1]);
    
    this.charts.timeSeriesChart = chartUtils.createBarChart(
      'timeSeriesChart',
      occupations,
      occupationValues,
      'Principales Ocupaciones'
    );
  },
  
  /**
   * Crea gráficos para series temporales
   */
  createTimeSeriesCharts: function() {
    const data = this.currentData.data;
    
    // Ordenar por fecha
    const sortedData = [...data].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    const dates = sortedData.map(row => row.fecha);
    
    // Gráfico de temperatura
    const temperatures = sortedData.map(row => parseFloat(row.temperatura));
    
    this.charts.mainChart = chartUtils.createLineChart(
      'mainChart',
      dates,
      temperatures,
      'Evolución de Temperatura'
    );
    
    // Gráfico de precipitación
    const precipitation = sortedData.map(row => parseFloat(row.precipitacion));
    
    this.charts.distributionChart = chartUtils.createBarChart(
      'distributionChart',
      dates,
      precipitation,
      'Precipitación Diaria'
    );
    
    // Gráfico múltiple
    const humidity = sortedData.map(row => parseFloat(row.humedad));
    const windSpeed = sortedData.map(row => parseFloat(row.velocidad_viento));
    
    this.charts.timeSeriesChart = chartUtils.createMultiSeriesChart(
      'timeSeriesChart',
      'line',
      dates,
      [
        { label: 'Temperatura (°C)', data: temperatures },
        { label: 'Humedad (%)', data: humidity },
        { label: 'Velocidad del viento (km/h)', data: windSpeed }
      ],
      'Comparativa de Variables Meteorológicas'
    );
  },
  
  /**
   * Crea gráficos para datos de correlación
   */
  createCorrelationCharts: function() {
    const data = this.currentData.data;
    
    // Gráfico de altura vs peso
    const heightWeightData = data.map(row => ({
      x: parseFloat(row.altura),
      y: parseFloat(row.peso)
    }));
    
    this.charts.mainChart = chartUtils.createScatterChart(
      'mainChart',
      heightWeightData,
      'Relación Altura-Peso'
    );
    
    // Gráfico de presión arterial
    const systolic = data.map(row => parseFloat(row.presion_sistolica));
    const diastolic = data.map(row => parseFloat(row.presion_diastolica));
    
    this.charts.distributionChart = chartUtils.createMultiSeriesChart(
      'distributionChart',
      'bar',
      data.map((_, i) => `Persona ${i+1}`),
      [
        { label: 'Sistólica', data: systolic },
        { label: 'Diastólica', data: diastolic }
      ],
      'Presión Arterial'
    );
    
    // Gráfico de correlación entre variables
    // Simplificado para este ejemplo
    const variables = ['edad', 'altura', 'peso', 'presion_sistolica', 'colesterol'];
    const correlationMatrix = [
      [1.0, 0.2, 0.5, 0.6, 0.4],
      [0.2, 1.0, 0.8, 0.3, 0.1],
      [0.5, 0.8, 1.0, 0.4, 0.3],
      [0.6, 0.3, 0.4, 1.0, 0.7],
      [0.4, 0.1, 0.3, 0.7, 1.0]
    ];
    
    // En una aplicación real, esta matriz se calcularía a partir de los datos
    
    // Crear un contenedor especial para el heatmap
    document.getElementById('timeSeriesChart').remove();
    const container = document.createElement('canvas');
    container.id = 'correlationChart';
    document.querySelector('#chartContainer .row:last-child .chart-container').appendChild(container);
    
    this.charts.correlationChart = chartUtils.createCorrelationHeatmap(
      'correlationChart',
      variables,
      correlationMatrix,
      'Matriz de Correlación'
    );
  },
  
  /**
   * Crea gráficos genéricos para cualquier tipo de datos
   */
  createGenericCharts: function() {
    const data = this.currentData.data;
    const columns = Object.keys(data[0] || {});
    
    // Identificar columnas numéricas
    const numericColumns = columns.filter(col => {
      return !isNaN(parseFloat(data[0][col]));
    });
    
    // Identificar columna categórica para agrupar
    const categoricalColumns = columns.filter(col => !numericColumns.includes(col));
    const groupByColumn = categoricalColumns[0] || columns[0];
    
    // Agrupar por la columna categórica
    const groupedData = {};
    data.forEach(row => {
      const category = row[groupByColumn];
      if (!groupedData[category]) {
        groupedData[category] = 0;
      }
      // Sumar la primera columna numérica
      if (numericColumns.length > 0) {
        groupedData[category] += parseFloat(row[numericColumns[0]]) || 0;
      } else {
        groupedData[category]++;
      }
    });
    
    const categories = Object.keys(groupedData);
    const values = categories.map(cat => groupedData[cat]);
    
    // Gráfico principal
    this.charts.mainChart = chartUtils.createBarChart(
      'mainChart',
      categories,
      values,
      `${numericColumns[0] || 'Conteo'} por ${groupByColumn}`
    );
    
    // Gráfico de distribución
    this.charts.distributionChart = chartUtils.createPieChart(
      'distributionChart',
      categories,
      values,
      `Distribución por ${groupByColumn}`
    );
    
    // Si hay al menos dos columnas numéricas, crear scatter plot
    if (numericColumns.length >= 2) {
      const scatterData = data.map(row => ({
        x: parseFloat(row[numericColumns[0]]),
        y: parseFloat(row[numericColumns[1]])
      }));
      
      // Reemplazar el gráfico de línea temporal
      document.getElementById('timeSeriesChart').remove();
      const container = document.createElement('canvas');
      container.id = 'scatterChart';
      document.querySelector('#chartContainer .row:last-child .chart-container').appendChild(container);
      
      this.charts.scatterChart = chartUtils.createScatterChart(
        'scatterChart',
        scatterData,
        `Relación ${numericColumns[0]}-${numericColumns[1]}`
      );
    } else {
      // Gráfico temporal (si hay fechas)
      const dateColumn = columns.find(col => col.includes('fecha') || col.includes('date'));
      
      if (dateColumn && numericColumns.length > 0) {
        // Ordenar por fecha
        const sortedData = [...data].sort((a, b) => new Date(a[dateColumn]) - new Date(b[dateColumn]));
        const dates = sortedData.map(row => row[dateColumn]);
        const values = sortedData.map(row => parseFloat(row[numericColumns[0]]) || 0);
        
        this.charts.timeSeriesChart = chartUtils.createLineChart(
          'timeSeriesChart',
          dates,
          values,
          `Evolución de ${numericColumns[0]} en el tiempo`
        );
      }
    }
  },
  
  /**
   * Limpia los gráficos existentes
   */
  clearCharts: function() {
    // Destruir instancias de Chart.js
    Object.values(this.charts).forEach(chart => {
      if (chart && typeof chart.destroy === 'function') {
        chart.destroy();
      }
    });
    
    // Reiniciar objeto de gráficos
    this.charts = {};
  },
  
  /**
   * Realiza análisis sobre los datos
   * @param {string} analysisType - Tipo de análisis a realizar
   */
  performAnalysis: function(analysisType = 'summary') {
    // Verificar si hay datos
    if (!this.currentData || !this.currentData.data || this.currentData.data.length === 0) {
      document.getElementById('analysisResults').innerHTML = `
        <div class="alert alert-info">No hay datos disponibles para analizar</div>
      `;
      return;
    }
    
    // Mostrar indicador de carga
    this.showLoading(true, 'analysisResults');
    
    try {
      // Generar resultados de análisis localmente sin depender del servidor
      const results = this.generateAnalysisResults(analysisType);
      
      // Actualizar resultados en la interfaz
      this.displayAnalysisResults(results, analysisType);
    } catch (error) {
      console.error('Error en el análisis:', error);
      document.getElementById('analysisResults').innerHTML = `
        <div class="alert alert-danger">Error al realizar el análisis: ${error.message}</div>
      `;
    } finally {
      // Ocultar indicador de carga
      this.showLoading(false, 'analysisResults');
    }
  },
  
  /**
   * Genera resultados de análisis localmente
   * @param {string} analysisType - Tipo de análisis a realizar
   * @returns {Object} Resultados del análisis
   */
  generateAnalysisResults: function(analysisType) {
    // Obtener datos actuales
    const data = this.currentData.data;
    
    // Diferentes tipos de análisis
    switch (analysisType) {
      case 'summary':
        return this.generateSummaryAnalysis(data);
      case 'correlation':
        return this.generateCorrelationAnalysis(data);
      case 'distribution':
        return this.generateDistributionAnalysis(data);
      case 'timeseries':
        return this.generateTimeSeriesAnalysis(data);
      default:
        throw new Error(`Tipo de análisis no soportado: ${analysisType}`);
    }
  },
  
  /**
   * Genera análisis estadístico descriptivo
   * @param {Array} data - Datos a analizar
   * @returns {Object} Resultados del análisis
   */
  generateSummaryAnalysis: function(data) {
    const results = {
      summary: {},
      info: {
        rows: data.length,
        numeric_columns: [],
        categorical_columns: [],
        missing_values: 0,
        duplicates: 0,
        memory_usage: '~' + (JSON.stringify(data).length / 1024).toFixed(2) + ' KB'
      }
    };
    
    // Detectar tipos de columnas
    const columns = Object.keys(data[0] || {});
    
    columns.forEach(column => {
      // Verificar si la columna es numérica
      const isNumeric = data.every(row => 
        row[column] === null || 
        row[column] === undefined || 
        typeof row[column] === 'number' || 
        !isNaN(parseFloat(row[column]))
      );
      
      if (isNumeric) {
        results.info.numeric_columns.push(column);
        
        // Calcular estadísticas para columnas numéricas
        const values = data.map(row => parseFloat(row[column])).filter(val => !isNaN(val));
        
        if (values.length > 0) {
          // Ordenar para calcular mediana
          const sortedValues = [...values].sort((a, b) => a - b);
          const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
          
          // Calcular desviación estándar
          const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
          const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
          const std = Math.sqrt(variance);
          
          results.summary[column] = {
            mean: mean,
            median: sortedValues.length % 2 === 0 
              ? (sortedValues[sortedValues.length/2 - 1] + sortedValues[sortedValues.length/2]) / 2
              : sortedValues[Math.floor(sortedValues.length/2)],
            std: std,
            min: Math.min(...values),
            max: Math.max(...values),
            count: values.length
          };
        }
      } else {
        results.info.categorical_columns.push(column);
      }
      
      // Contar valores faltantes
      results.info.missing_values += data.filter(row => 
        row[column] === null || 
        row[column] === undefined || 
        row[column] === ''
      ).length;
    });
    
    // Contar duplicados (simplificado)
    const stringified = data.map(row => JSON.stringify(row));
    const uniqueRows = new Set(stringified);
    results.info.duplicates = data.length - uniqueRows.size;
    
    return results;
  },
  
  /**
   * Genera análisis de correlación
   * @param {Array} data - Datos a analizar
   * @returns {Object} Resultados del análisis
   */
  generateCorrelationAnalysis: function(data) {
    // Identificar columnas numéricas
    const columns = Object.keys(data[0] || {});
    const numericColumns = columns.filter(column => {
      return data.every(row => 
        row[column] === null || 
        row[column] === undefined || 
        typeof row[column] === 'number' || 
        !isNaN(parseFloat(row[column]))
      );
    });
    
    // Preparar matriz de correlación
    const matrix = [];
    for (let i = 0; i < numericColumns.length; i++) {
      matrix.push(new Array(numericColumns.length).fill(0));
    }
    
    // Calcular correlaciones
    for (let i = 0; i < numericColumns.length; i++) {
      const col1 = numericColumns[i];
      
      // La diagonal siempre es 1 (correlación perfecta consigo misma)
      matrix[i][i] = 1;
      
      for (let j = i + 1; j < numericColumns.length; j++) {
        const col2 = numericColumns[j];
        
        // Extraer valores numéricos
        const pairs = data.map(row => [
          parseFloat(row[col1]),
          parseFloat(row[col2])
        ]).filter(pair => !isNaN(pair[0]) && !isNaN(pair[1]));
        
        // Calcular correlación de Pearson
        const correlation = this.calculatePearsonCorrelation(pairs);
        
        // La matriz es simétrica
        matrix[i][j] = correlation;
        matrix[j][i] = correlation;
      }
    }
    
    return {
      variables: numericColumns,
      correlation_matrix: matrix
    };
  },
  
  /**
   * Calcula el coeficiente de correlación de Pearson
   * @param {Array} pairs - Pares de valores [x, y]
   * @returns {number} Coeficiente de correlación
   */
  calculatePearsonCorrelation: function(pairs) {
    if (pairs.length < 2) return 0;
    
    // Calcular medias
    const sumX = pairs.reduce((sum, pair) => sum + pair[0], 0);
    const sumY = pairs.reduce((sum, pair) => sum + pair[1], 0);
    const meanX = sumX / pairs.length;
    const meanY = sumY / pairs.length;
    
    // Calcular covarianza y varianzas
    let covXY = 0;
    let varX = 0;
    let varY = 0;
    
    pairs.forEach(pair => {
      const diffX = pair[0] - meanX;
      const diffY = pair[1] - meanY;
      
      covXY += diffX * diffY;
      varX += diffX * diffX;
      varY += diffY * diffY;
    });
    
    // Evitar división por cero
    if (varX === 0 || varY === 0) return 0;
    
    return covXY / Math.sqrt(varX * varY);
  },
  
  /**
   * Genera análisis de distribución
   * @param {Array} data - Datos a analizar
   * @returns {Object} Resultados del análisis
   */
  generateDistributionAnalysis: function(data) {
    // Identificar columnas numéricas
    const columns = Object.keys(data[0] || {});
    const numericColumns = columns.filter(column => {
      return data.every(row => 
        row[column] === null || 
        row[column] === undefined || 
        typeof row[column] === 'number' || 
        !isNaN(parseFloat(row[column]))
      );
    });
    
    // Limitar a máximo 4 columnas para el análisis
    const selectedColumns = numericColumns.slice(0, 4);
    
    const distributions = {};
    
    selectedColumns.forEach(column => {
      // Extraer valores numéricos
      const values = data.map(row => parseFloat(row[column]))
        .filter(val => !isNaN(val));
      
      if (values.length > 0) {
        // Calcular rango para los bins
        const min = Math.min(...values);
        const max = Math.max(...values);
        const range = max - min;
        
        // Crear bins (entre 5 y 10 dependiendo de la cantidad de datos)
        const binCount = Math.min(10, Math.max(5, Math.ceil(Math.sqrt(values.length))));
        const binWidth = range / binCount;
        
        const bins = [];
        const counts = [];
        
        // Crear los límites de los bins
        for (let i = 0; i <= binCount; i++) {
          bins.push(min + i * binWidth);
        }
        
        // Contar valores en cada bin
        for (let i = 0; i < binCount; i++) {
          const lowerBound = bins[i];
          const upperBound = bins[i + 1];
          
          const count = values.filter(val => 
            val >= lowerBound && (i === binCount - 1 ? val <= upperBound : val < upperBound)
          ).length;
          
          counts.push(count);
        }
        
        // Calcular asimetría y curtosis
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        const std = Math.sqrt(variance);
        
        // Asimetría (skewness)
        const skewness = values.reduce((sum, val) => sum + Math.pow((val - mean) / std, 3), 0) / values.length;
        
        // Curtosis
        const kurtosis = values.reduce((sum, val) => sum + Math.pow((val - mean) / std, 4), 0) / values.length;
        
        distributions[column] = {
          bins: bins,
          counts: counts,
          skewness: skewness,
          kurtosis: kurtosis
        };
      }
    });
    
    return { distributions };
  },
  
  /**
   * Genera análisis de series temporales
   * @param {Array} data - Datos a analizar
   * @returns {Object} Resultados del análisis
   */
  generateTimeSeriesAnalysis: function(data) {
    // Buscar columna de fecha
    const columns = Object.keys(data[0] || {});
    let dateColumn = columns.find(col => 
      col.toLowerCase().includes('fecha') || 
      col.toLowerCase().includes('date') || 
      col.toLowerCase().includes('time')
    );
    
    // Si no hay columna de fecha, usar la primera columna
    if (!dateColumn && columns.length > 0) {
      dateColumn = columns[0];
    }
    
    // Buscar columna numérica para analizar
    const numericColumns = columns.filter(column => {
      return column !== dateColumn && data.every(row => 
        row[column] === null || 
        row[column] === undefined || 
        typeof row[column] === 'number' || 
        !isNaN(parseFloat(row[column]))
      );
    });
    
    // Si no hay columnas numéricas, devolver error
    if (numericColumns.length === 0) {
      return {
        error: 'No se encontraron columnas numéricas para analizar'
      };
    }
    
    // Usar la primera columna numérica
    const valueColumn = numericColumns[0];
    
    // Ordenar datos por fecha (si es posible)
    let sortedData = [...data];
    try {
      sortedData.sort((a, b) => {
        const dateA = new Date(a[dateColumn]);
        const dateB = new Date(b[dateColumn]);
        return dateA - dateB;
      });
    } catch (e) {
      // Si no se pueden ordenar por fecha, usar el orden actual
      console.warn('No se pudieron ordenar los datos por fecha');
    }
    
    // Extraer valores
    const dates = sortedData.map(row => row[dateColumn]);
    const values = sortedData.map(row => parseFloat(row[valueColumn])).filter(val => !isNaN(val));
    
    // Calcular tendencia (simplificada)
    const n = values.length;
    let trendDirection = 'Estable';
    
    if (n > 1) {
      // Calcular pendiente promedio
      let sumSlope = 0;
      for (let i = 1; i < n; i++) {
        sumSlope += values[i] - values[i-1];
      }
      const avgSlope = sumSlope / (n - 1);
      
      // Determinar dirección de la tendencia
      if (avgSlope > 0.05 * (Math.max(...values) - Math.min(...values)) / n) {
        trendDirection = 'Creciente';
      } else if (avgSlope < -0.05 * (Math.max(...values) - Math.min(...values)) / n) {
        trendDirection = 'Decreciente';
      }
    }
    
    // Simular componentes de la serie
    const trend = [];
    const seasonal = [];
    const residual = [];
    
    // Generar componente de tendencia
    for (let i = 0; i < n; i++) {
      // Tendencia lineal simple
      trend.push(values[0] + (values[n-1] - values[0]) * i / (n-1));
    }
    
    // Generar componente estacional (patrón cíclico)
    const seasonalPeriod = Math.min(7, Math.max(2, Math.floor(n / 4)));
    const seasonalPattern = [];
    
    // Crear patrón estacional
    for (let i = 0; i < seasonalPeriod; i++) {
      seasonalPattern.push((Math.random() - 0.5) * 0.2 * (Math.max(...values) - Math.min(...values)));
    }
    
    // Aplicar patrón a toda la serie
    for (let i = 0; i < n; i++) {
      seasonal.push(seasonalPattern[i % seasonalPeriod]);
    }
    
    // Calcular residuales
    for (let i = 0; i < n; i++) {
      residual.push(values[i] - trend[i] - seasonal[i]);
    }
    
    // Calcular autocorrelación (lag 1)
    let autocorrelation = 0;
    if (residual.length > 1) {
      let sumProduct = 0;
      let sumSquared = 0;
      
      for (let i = 0; i < residual.length - 1; i++) {
        sumProduct += residual[i] * residual[i+1];
        sumSquared += residual[i] * residual[i];
      }
      
      // Añadir último valor al sumSquared
      sumSquared += residual[residual.length-1] * residual[residual.length-1];
      
      autocorrelation = sumProduct / sumSquared;
    }
    
    return {
      dates: dates,
      values: values,
      trend: trend,
      seasonal: seasonal,
      residual: residual,
      trend_direction: trendDirection,
      has_seasonality: true, // Simulado
      seasonal_period: seasonalPeriod,
      autocorrelation: autocorrelation
    };
  },
  
  /**
   * Muestra los resultados del análisis en la interfaz de usuario
   * @param {Object} results - Resultados del análisis a mostrar
   * @param {string} analysisType - Tipo de análisis realizado
   */
  displayAnalysisResults: function(results, analysisType) {
    const container = document.getElementById('analysisResults');
    if (!container) return; // Si no existe el contenedor, salir de la función
    
    // Diferentes visualizaciones según el tipo de análisis
    switch (analysisType || 'summary') {
      case 'summary':
        this.displaySummaryAnalysis(results, container);
        break;
      case 'correlation':
        this.displayCorrelationAnalysis(results, container);
        break;
      case 'distribution':
        this.displayDistributionAnalysis(results, container);
        break;
      case 'timeseries':
        this.displayTimeSeriesAnalysis(results, container);
        break;
      default:
        // Visualización genérica
        container.innerHTML = `
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Resultados del Análisis</h5>
              <pre class="bg-light p-3 rounded">${JSON.stringify(results, null, 2)}</pre>
            </div>
          </div>
        `;
    }
  },
  
  /**
   * Muestra el resumen estadístico
   * @param {Object} results - Resultados del análisis
   * @param {HTMLElement} container - Contenedor para mostrar resultados
   */
  displaySummaryAnalysis: function(results, container) {
    // Crear tabla de resumen
    let html = `
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">Resumen Estadístico</h5>
          <div class="table-responsive">
            <table class="table table-striped table-sm">
              <thead>
                <tr>
                  <th>Variable</th>
                  <th>Media</th>
                  <th>Mediana</th>
                  <th>Desv. Estándar</th>
                  <th>Mínimo</th>
                  <th>Máximo</th>
                  <th>Conteo</th>
                </tr>
              </thead>
              <tbody>
    `;
    
    // Añadir filas para cada variable
    for (const [variable, stats] of Object.entries(results.summary || {})) {
      html += `
        <tr>
          <td>${variable}</td>
          <td>${stats.mean !== undefined ? stats.mean.toFixed(2) : 'N/A'}</td>
          <td>${stats.median !== undefined ? stats.median.toFixed(2) : 'N/A'}</td>
          <td>${stats.std !== undefined ? stats.std.toFixed(2) : 'N/A'}</td>
          <td>${stats.min !== undefined ? stats.min.toFixed(2) : 'N/A'}</td>
          <td>${stats.max !== undefined ? stats.max.toFixed(2) : 'N/A'}</td>
          <td>${stats.count !== undefined ? stats.count : 'N/A'}</td>
        </tr>
      `;
    }
    
    html += `
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
    
    // Información adicional
    if (results.info) {
      html += `
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Información Adicional</h5>
            <div class="row">
              <div class="col-md-6">
                <ul class="list-group">
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Total de registros
                    <span class="badge bg-primary rounded-pill">${results.info.rows || 0}</span>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Variables numéricas
                    <span class="badge bg-primary rounded-pill">${results.info.numeric_columns?.length || 0}</span>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Variables categóricas
                    <span class="badge bg-primary rounded-pill">${results.info.categorical_columns?.length || 0}</span>
                  </li>
                </ul>
              </div>
              <div class="col-md-6">
                <ul class="list-group">
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Valores faltantes
                    <span class="badge bg-warning rounded-pill">${results.info.missing_values || 0}</span>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Duplicados
                    <span class="badge bg-warning rounded-pill">${results.info.duplicates || 0}</span>
                  </li>
                  <li class="list-group-item d-flex justify-content-between align-items-center">
                    Memoria utilizada
                    <span class="badge bg-info rounded-pill">${results.info.memory_usage || 'N/A'}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      `;
    }
    
    container.innerHTML = html;
  },
  
  /**
   * Muestra el análisis de correlación
   * @param {Object} results - Resultados del análisis
   * @param {HTMLElement} container - Contenedor para mostrar resultados
   */
  displayCorrelationAnalysis: function(results, container) {
    // Crear contenedor para el heatmap
    container.innerHTML = `
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">Matriz de Correlación</h5>
          <div class="chart-container" style="height: 400px;">
            <canvas id="correlationHeatmap"></canvas>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Interpretación</h5>
          <div class="alert alert-info">
            <p><strong>Correlación positiva fuerte (>0.7):</strong> Indica una fuerte relación directa entre variables.</p>
            <p><strong>Correlación negativa fuerte (<-0.7):</strong> Indica una fuerte relación inversa entre variables.</p>
            <p><strong>Correlación débil (-0.3 a 0.3):</strong> Indica poca o ninguna relación lineal entre variables.</p>
          </div>
          <div id="correlationDetails"></div>
        </div>
      </div>
    `;
    
    // Crear heatmap
    if (results.correlation_matrix && results.variables) {
      this.charts.correlationHeatmap = chartUtils.createCorrelationHeatmap(
        'correlationHeatmap',
        results.variables,
        results.correlation_matrix,
        'Matriz de Correlación'
      );
      
      // Mostrar correlaciones importantes
      let correlationDetails = '<h6 class="mt-3">Correlaciones destacadas:</h6><ul>';
      
      // Encontrar correlaciones fuertes (positivas y negativas)
      const strongCorrelations = [];
      
      for (let i = 0; i < results.variables.length; i++) {
        for (let j = i + 1; j < results.variables.length; j++) {
          const value = results.correlation_matrix[i][j];
          if (Math.abs(value) > 0.5) { // Umbral para correlaciones destacadas
            strongCorrelations.push({
              var1: results.variables[i],
              var2: results.variables[j],
              value: value
            });
          }
        }
      }
      
      // Ordenar por valor absoluto
      strongCorrelations.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
      
      // Mostrar las correlaciones más fuertes
      strongCorrelations.slice(0, 5).forEach(corr => {
        const type = corr.value > 0 ? 'positiva' : 'negativa';
        const strength = Math.abs(corr.value) > 0.7 ? 'fuerte' : 'moderada';
        correlationDetails += `
          <li>
            <strong>${corr.var1}</strong> y <strong>${corr.var2}</strong>: 
            Correlación ${type} ${strength} (${corr.value.toFixed(2)})
          </li>
        `;
      });
      
      correlationDetails += '</ul>';
      document.getElementById('correlationDetails').innerHTML = correlationDetails;
    }
  },
  
  /**
   * Muestra el análisis de distribución
   * @param {Object} results - Resultados del análisis
   * @param {HTMLElement} container - Contenedor para mostrar resultados
   */
  displayDistributionAnalysis: function(results, container) {
    // Crear contenedores para histogramas
    let html = `
      <div class="row">
    `;
    
    // Añadir tarjetas para cada variable
    if (results.distributions) {
      const variables = Object.keys(results.distributions);
      
      variables.forEach((variable, index) => {
        html += `
          <div class="col-md-6 mb-4">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">Distribución de ${variable}</h5>
                <div class="chart-container">
                  <canvas id="distribution${index}"></canvas>
                </div>
                <div class="mt-3 small">
                  <strong>Asimetría:</strong> ${results.distributions[variable].skewness?.toFixed(2) || 'N/A'} | 
                  <strong>Curtosis:</strong> ${results.distributions[variable].kurtosis?.toFixed(2) || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        `;
      });
      
      html += `
        </div>
        <div class="card mt-3">
          <div class="card-body">
            <h5 class="card-title">Interpretación</h5>
            <div class="alert alert-info">
              <p><strong>Asimetría:</strong> Mide la falta de simetría en la distribución. Un valor cercano a 0 indica simetría.</p>
              <p><strong>Curtosis:</strong> Mide el grado de concentración de valores. Una distribución normal tiene curtosis cercana a 3.</p>
            </div>
          </div>
        </div>
      `;
      
      container.innerHTML = html;
      
      // Crear histogramas
      variables.forEach((variable, index) => {
        const dist = results.distributions[variable];
        if (dist.bins && dist.counts) {
          // Convertir bins a etiquetas
          const labels = dist.bins.map((bin, i) => {
            if (i < dist.bins.length - 1) {
              return `${bin.toFixed(1)}-${dist.bins[i+1].toFixed(1)}`;
            }
            return `${bin.toFixed(1)}+`;
          });
          
          // Crear histograma
          this.charts[`distribution${index}`] = chartUtils.createBarChart(
            `distribution${index}`,
            labels.slice(0, -1), // Eliminar el último que es vacío
            dist.counts,
            `Distribución de ${variable}`,
            {
              plugins: {
                tooltip: {
                  callbacks: {
                    title: function(tooltipItems) {
                      return tooltipItems[0].label;
                    },
                    label: function(context) {
                      return `Frecuencia: ${context.raw}`;
                    }
                  }
                }
              }
            }
          );
        }
      });
    } else {
      container.innerHTML = `
        <div class="alert alert-warning">No hay datos de distribución disponibles</div>
      `;
    }
  },
  
  /**
   * Muestra el análisis de series temporales
   * @param {Object} results - Resultados del análisis
   * @param {HTMLElement} container - Contenedor para mostrar resultados
   */
  displayTimeSeriesAnalysis: function(results, container) {
    // Crear contenedores para gráficos
    container.innerHTML = `
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">Análisis de Tendencia</h5>
          <div class="chart-container" style="height: 300px;">
            <canvas id="trendChart"></canvas>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">Componente Estacional</h5>
              <div class="chart-container">
                <canvas id="seasonalChart"></canvas>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">Componente Residual</h5>
              <div class="chart-container">
                <canvas id="residualChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Estadísticas</h5>
          <div class="row">
            <div class="col-md-6">
              <ul class="list-group">
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Tendencia
                  <span class="badge bg-primary rounded-pill">${results.trend_direction || 'N/A'}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Estacionalidad
                  <span class="badge bg-primary rounded-pill">${results.has_seasonality ? 'Presente' : 'No detectada'}</span>
                </li>
              </ul>
            </div>
            <div class="col-md-6">
              <ul class="list-group">
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Período estacional
                  <span class="badge bg-info rounded-pill">${results.seasonal_period || 'N/A'}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Autocorrelación
                  <span class="badge bg-info rounded-pill">${results.autocorrelation?.toFixed(2) || 'N/A'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Crear gráficos si hay datos disponibles
    if (results.dates && results.values && results.trend) {
      // Gráfico de tendencia
      this.charts.trendChart = chartUtils.createMultiSeriesChart(
        'trendChart',
        'line',
        results.dates,
        [
          { label: 'Datos originales', data: results.values },
          { label: 'Tendencia', data: results.trend }
        ],
        'Datos y Tendencia'
      );
      
      // Gráfico estacional
      if (results.seasonal) {
        this.charts.seasonalChart = chartUtils.createLineChart(
          'seasonalChart',
          results.dates,
          results.seasonal,
          'Componente Estacional'
        );
      }
      
      // Gráfico residual
      if (results.residual) {
        this.charts.residualChart = chartUtils.createLineChart(
          'residualChart',
          results.dates,
          results.residual,
          'Componente Residual'
        );
      }
    }
  },
  
  /**
   * Exporta los datos en diferentes formatos
   * @param {string} format - Formato de exportación (csv, excel, json)
   */
  exportData: function(format = 'csv') {
    // Verificar si hay datos
    if (!this.currentData || !this.currentData.data || this.currentData.data.length === 0) {
      uiUtils.showAlert('No hay datos disponibles para exportar', 'warning');
      return;
    }
    
    // Mostrar mensaje
    uiUtils.showAlert(`Exportando datos en formato ${format.toUpperCase()}...`, 'info');
    
    // Llamar a la función de exportación
    uiUtils.exportData(`/api/export/${this.dataType}`, format);
  },
  
  /**
   * Muestra u oculta el indicador de carga
   * @param {boolean} show - Si debe mostrarse el indicador
   * @param {string} containerId - ID del contenedor donde mostrar el indicador
   */
  showLoading: function(show, containerId = null) {
    // Si no se especifica contenedor, usar el global
    const container = containerId ? document.getElementById(containerId) : document.body;
    if (!container) return;
    
    // ID para el spinner
    const spinnerId = containerId ? `${containerId}Spinner` : 'globalSpinner';
    
    // Eliminar spinner existente
    const existingSpinner = document.getElementById(spinnerId);
    if (existingSpinner) {
      existingSpinner.remove();
    }
    
    // Crear y mostrar spinner si es necesario
    if (show) {
      const spinner = document.createElement('div');
      spinner.id = spinnerId;
      spinner.className = containerId ? 'text-center my-5' : 'loading-overlay';
      spinner.innerHTML = `
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        ${containerId ? '<p class="mt-2 text-muted">Procesando datos...</p>' : ''}
      `;
      
      // Añadir al contenedor
      if (containerId) {
        container.innerHTML = '';
        container.appendChild(spinner);
      } else {
        document.body.appendChild(spinner);
      }
    }
  }
};

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  App.init();
  
  // Asegurar que los botones de carga de datos de ejemplo funcionen correctamente
  document.getElementById('load-sample-1').addEventListener('click', function() {
    App.loadSampleData('sales');
  });
  
  document.getElementById('load-sample-2').addEventListener('click', function() {
    App.loadSampleData('demographics');
  });
  
  document.getElementById('load-sample-3').addEventListener('click', function() {
    App.loadSampleData('education');
  });
  
  // Asegurar que los botones de navegación de pestañas funcionen correctamente
  const tabButtons = document.querySelectorAll('#demoTabs button');
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabId = this.getAttribute('data-bs-target');
      const tabContent = document.querySelector(tabId);
      
      // Desactivar todas las pestañas
      document.querySelectorAll('#demoTabsContent > div').forEach(tab => {
        tab.classList.remove('show', 'active');
      });
      
      // Desactivar todos los botones
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Activar la pestaña seleccionada
      tabContent.classList.add('show', 'active');
      this.classList.add('active');
    });
  });
});