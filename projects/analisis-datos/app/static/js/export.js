/**
 * export.js - Funciones para exportar datos en diferentes formatos
 * Permite exportar datos a CSV, Excel y JSON
 */

// Objeto global para funciones de exportación
const DataExport = {
  /**
   * Exporta datos a formato CSV
   * @param {Array} data - Array de objetos con los datos
   * @param {string} filename - Nombre del archivo a descargar
   */
  toCSV: function(data, filename = 'datos_exportados.csv') {
    if (!data || !data.length) {
      console.error('No hay datos para exportar');
      return;
    }
    
    try {
      // Obtener encabezados (propiedades del primer objeto)
      const headers = Object.keys(data[0]);
      
      // Crear contenido CSV
      let csvContent = headers.join(',') + '\n';
      
      // Añadir filas
      data.forEach(item => {
        const row = headers.map(header => {
          // Escapar comillas y formatear valores
          let cell = item[header] === null || item[header] === undefined ? '' : item[header].toString();
          // Si contiene comas, comillas o saltos de línea, encerrar en comillas
          if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
            cell = '"' + cell.replace(/"/g, '""') + '"';
          }
          return cell;
        }).join(',');
        csvContent += row + '\n';
      });
      
      // Crear blob y descargar
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      this.downloadBlob(blob, filename);
      
      return true;
    } catch (error) {
      console.error('Error exportando a CSV:', error);
      return false;
    }
  },
  
  /**
   * Exporta datos a formato JSON
   * @param {Array|Object} data - Datos a exportar
   * @param {string} filename - Nombre del archivo a descargar
   */
  toJSON: function(data, filename = 'datos_exportados.json') {
    if (!data) {
      console.error('No hay datos para exportar');
      return;
    }
    
    try {
      // Convertir a string JSON con formato
      const jsonContent = JSON.stringify(data, null, 2);
      
      // Crear blob y descargar
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
      this.downloadBlob(blob, filename);
      
      return true;
    } catch (error) {
      console.error('Error exportando a JSON:', error);
      return false;
    }
  },
  
  /**
   * Exporta datos a formato Excel (XLSX)
   * Requiere la librería SheetJS (xlsx)
   * @param {Array} data - Array de objetos con los datos
   * @param {string} filename - Nombre del archivo a descargar
   * @param {string} sheetName - Nombre de la hoja de cálculo
   */
  toExcel: function(data, filename = 'datos_exportados.xlsx', sheetName = 'Datos') {
    if (!data || !data.length) {
      console.error('No hay datos para exportar');
      return;
    }
    
    // Verificar si la librería xlsx está disponible
    if (typeof XLSX === 'undefined') {
      console.error('La librería SheetJS (xlsx) no está disponible');
      alert('No se puede exportar a Excel. La librería necesaria no está cargada.');
      return false;
    }
    
    try {
      // Crear libro y hoja
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);
      
      // Añadir hoja al libro
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      
      // Generar archivo y descargar
      XLSX.writeFile(wb, filename);
      
      return true;
    } catch (error) {
      console.error('Error exportando a Excel:', error);
      return false;
    }
  },
  
  /**
   * Exporta datos a formato HTML (tabla)
   * @param {Array} data - Array de objetos con los datos
   * @param {string} filename - Nombre del archivo a descargar
   * @param {string} title - Título de la página HTML
   */
  toHTML: function(data, filename = 'datos_exportados.html', title = 'Datos Exportados') {
    if (!data || !data.length) {
      console.error('No hay datos para exportar');
      return;
    }
    
    try {
      // Obtener encabezados
      const headers = Object.keys(data[0]);
      
      // Crear contenido HTML
      let htmlContent = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            h1 { color: #333; }
            .container { max-width: 1200px; margin: 0 auto; }
            .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${title}</h1>
            <table>
              <thead>
                <tr>
                  ${headers.map(header => `<th>${header}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
      `;
      
      // Añadir filas
      data.forEach(item => {
        htmlContent += '<tr>';
        headers.forEach(header => {
          htmlContent += `<td>${item[header] !== null && item[header] !== undefined ? item[header] : ''}</td>`;
        });
        htmlContent += '</tr>';
      });
      
      // Cerrar HTML
      htmlContent += `
              </tbody>
            </table>
            <div class="footer">
              Generado el ${new Date().toLocaleString()}
            </div>
          </div>
        </body>
        </html>
      `;
      
      // Crear blob y descargar
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
      this.downloadBlob(blob, filename);
      
      return true;
    } catch (error) {
      console.error('Error exportando a HTML:', error);
      return false;
    }
  },
  
  /**
   * Descarga un Blob como archivo
   * @param {Blob} blob - Blob a descargar
   * @param {string} filename - Nombre del archivo
   */
  downloadBlob: function(blob, filename) {
    // Crear URL para el blob
    const url = window.URL.createObjectURL(blob);
    
    // Crear enlace temporal
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    // Añadir al DOM, simular clic y limpiar
    document.body.appendChild(link);
    link.click();
    
    // Limpiar después de un breve retraso
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
  },
  
  /**
   * Exporta datos desde una tabla HTML
   * @param {HTMLElement|string} table - Elemento tabla o ID
   * @param {string} format - Formato de exportación (csv, excel, json)
   * @param {string} filename - Nombre del archivo
   */
  fromTable: function(table, format = 'csv', filename) {
    // Obtener elemento de tabla si se proporciona un ID
    if (typeof table === 'string') {
      table = document.getElementById(table);
    }
    
    if (!table || table.tagName !== 'TABLE') {
      console.error('Elemento de tabla no válido');
      return false;
    }
    
    try {
      // Extraer datos de la tabla
      const data = [];
      const headers = [];
      
      // Obtener encabezados
      const headerRow = table.querySelector('thead tr');
      if (headerRow) {
        headerRow.querySelectorAll('th').forEach(th => {
          headers.push(th.textContent.trim());
        });
      }
      
      // Si no hay encabezados en thead, intentar con la primera fila
      if (headers.length === 0) {
        const firstRow = table.querySelector('tr');
        if (firstRow) {
          firstRow.querySelectorAll('th, td').forEach(cell => {
            headers.push(cell.textContent.trim());
          });
        }
      }
      
      // Obtener filas de datos
      const rows = table.querySelectorAll('tbody tr');
      rows.forEach(row => {
        const rowData = {};
        const cells = row.querySelectorAll('td');
        
        cells.forEach((cell, index) => {
          if (index < headers.length) {
            rowData[headers[index]] = cell.textContent.trim();
          }
        });
        
        data.push(rowData);
      });
      
      // Exportar según formato
      if (!filename) {
        filename = `datos_tabla.${format}`;
      }
      
      switch (format.toLowerCase()) {
        case 'csv':
          return this.toCSV(data, filename);
        case 'json':
          return this.toJSON(data, filename);
        case 'excel':
        case 'xlsx':
          return this.toExcel(data, filename);
        case 'html':
          return this.toHTML(data, filename);
        default:
          console.error(`Formato no soportado: ${format}`);
          return false;
      }
    } catch (error) {
      console.error('Error exportando desde tabla:', error);
      return false;
    }
  },
  
  /**
   * Exporta un gráfico como imagen
   * @param {Chart} chart - Instancia del gráfico Chart.js
   * @param {string} filename - Nombre del archivo
   * @param {string} format - Formato de imagen (png, jpg)
   */
  chartToImage: function(chart, filename = 'grafico.png', format = 'png') {
    if (!chart || typeof chart.toBase64Image !== 'function') {
      console.error('Gráfico no válido');
      return false;
    }
    
    try {
      // Obtener imagen como base64
      const imgData = chart.toBase64Image();
      
      // Crear enlace y descargar
      const link = document.createElement('a');
      link.href = imgData;
      link.download = filename;
      link.click();
      
      return true;
    } catch (error) {
      console.error('Error exportando gráfico:', error);
      return false;
    }
  }
};

// Exportar funciones
window.DataExport = DataExport;