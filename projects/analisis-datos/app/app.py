# Importar las bibliotecas necesarias
from flask import Flask, render_template, request, jsonify, send_from_directory
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import io
import base64
import json
import os
from datetime import datetime
import seaborn as sns
from scipy import stats

# Inicializar la aplicación Flask
app = Flask(__name__)

# Configuración
APP_ROOT = os.path.dirname(os.path.abspath(__file__))
SAMPLE_DATA_FOLDER = os.path.join(os.path.dirname(APP_ROOT), 'sample_data')
UPLOAD_FOLDER = os.path.join(os.path.dirname(APP_ROOT), 'uploads')
ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'xls', 'json'}

# Crear directorio de uploads si no existe
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Función para verificar extensiones permitidas
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Ruta principal - renderiza la página de inicio
@app.route('/')
def index():
    return render_template('index.html')

# Ruta para obtener la lista de archivos de muestra disponibles
@app.route('/api/sample-files')
def get_sample_files():
    files = []
    for filename in os.listdir(SAMPLE_DATA_FOLDER):
        if allowed_file(filename):
            file_path = os.path.join(SAMPLE_DATA_FOLDER, filename)
            file_size = os.path.getsize(file_path)
            file_date = datetime.fromtimestamp(os.path.getmtime(file_path))
            
            # Determinar el tipo de datos basado en el nombre del archivo
            data_type = 'general'
            if 'ventas' in filename.lower():
                data_type = 'sales'
            elif 'demograficos' in filename.lower():
                data_type = 'demographics'
            elif 'series_temporales' in filename.lower():
                data_type = 'timeseries'
            elif 'correlacion' in filename.lower():
                data_type = 'correlation'
            
            files.append({
                'name': filename,
                'path': f'/api/sample-data/{filename}',
                'size': file_size,
                'date': file_date.strftime('%Y-%m-%d %H:%M:%S'),
                'type': data_type
            })
    
    return jsonify(files)

# Ruta para servir archivos de muestra
@app.route('/api/sample-data/<filename>')
def get_sample_data(filename):
    if not allowed_file(filename):
        return jsonify({'error': 'Tipo de archivo no permitido'}), 400
    
    file_path = os.path.join(SAMPLE_DATA_FOLDER, filename)
    
    if not os.path.exists(file_path):
        return jsonify({'error': 'Archivo no encontrado'}), 404
    
    # Leer el archivo según su extensión
    try:
        if filename.endswith('.csv'):
            df = pd.read_csv(file_path)
            return jsonify({
                'data': df.to_dict(orient='records'),
                'columns': df.columns.tolist(),
                'filename': filename
            })
        elif filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(file_path)
            return jsonify({
                'data': df.to_dict(orient='records'),
                'columns': df.columns.tolist(),
                'filename': filename
            })
        elif filename.endswith('.json'):
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            # Si es una lista de objetos, convertir a DataFrame para obtener columnas
            if isinstance(data, list) and len(data) > 0 and isinstance(data[0], dict):
                df = pd.DataFrame(data)
                return jsonify({
                    'data': data,
                    'columns': df.columns.tolist(),
                    'filename': filename
                })
            return jsonify({
                'data': data,
                'filename': filename
            })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Ruta para subir archivos
@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No se ha enviado ningún archivo'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No se ha seleccionado ningún archivo'}), 400
    
    if file and allowed_file(file.filename):
        # Generar nombre único para evitar colisiones
        filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{file.filename}"
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)
        
        # Leer el archivo según su extensión
        try:
            if filename.endswith('.csv'):
                df = pd.read_csv(file_path)
                return jsonify({
                    'data': df.to_dict(orient='records'),
                    'columns': df.columns.tolist(),
                    'filename': filename
                })
            elif filename.endswith(('.xlsx', '.xls')):
                df = pd.read_excel(file_path)
                return jsonify({
                    'data': df.to_dict(orient='records'),
                    'columns': df.columns.tolist(),
                    'filename': filename
                })
            elif filename.endswith('.json'):
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                # Si es una lista de objetos, convertir a DataFrame para obtener columnas
                if isinstance(data, list) and len(data) > 0 and isinstance(data[0], dict):
                    df = pd.DataFrame(data)
                    return jsonify({
                        'data': data,
                        'columns': df.columns.tolist(),
                        'filename': filename
                    })
                return jsonify({
                    'data': data,
                    'filename': filename
                })
        except Exception as e:
            # Eliminar el archivo si hay error al procesarlo
            if os.path.exists(file_path):
                os.remove(file_path)
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'error': 'Tipo de archivo no permitido'}), 400

# Ruta para obtener análisis estadístico descriptivo
@app.route('/api/analysis/summary', methods=['POST'])
def get_summary_analysis():
    data = request.json
    
    if not data or 'data' not in data or not data['data']:
        return jsonify({'error': 'No se han proporcionado datos para analizar'}), 400
    
    try:
        # Convertir datos a DataFrame
        df = pd.DataFrame(data['data'])
        
        # Seleccionar solo columnas numéricas para el análisis
        numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
        
        if not numeric_cols:
            return jsonify({'error': 'No hay columnas numéricas para analizar'}), 400
        
        # Calcular estadísticas descriptivas
        stats_df = df[numeric_cols].describe().transpose()
        
        # Añadir más estadísticas
        stats_df['median'] = df[numeric_cols].median()
        stats_df['variance'] = df[numeric_cols].var()
        stats_df['skewness'] = df[numeric_cols].skew()
        stats_df['kurtosis'] = df[numeric_cols].kurtosis()
        
        # Convertir a diccionario para la respuesta JSON
        stats_dict = stats_df.reset_index().rename(columns={'index': 'column'}).to_dict(orient='records')
        
        # Calcular estadísticas para columnas categóricas
        categorical_cols = df.select_dtypes(include=['object']).columns.tolist()
        categorical_stats = []
        
        for col in categorical_cols:
            value_counts = df[col].value_counts().reset_index()
            value_counts.columns = ['value', 'count']
            value_counts['percentage'] = (value_counts['count'] / len(df) * 100).round(2)
            
            categorical_stats.append({
                'column': col,
                'unique_values': df[col].nunique(),
                'most_common': value_counts.iloc[0]['value'] if not value_counts.empty else None,
                'most_common_count': value_counts.iloc[0]['count'] if not value_counts.empty else 0,
                'most_common_percentage': value_counts.iloc[0]['percentage'] if not value_counts.empty else 0,
                'distribution': value_counts.to_dict(orient='records')
            })
        
        return jsonify({
            'numeric': stats_dict,
            'categorical': categorical_stats,
            'row_count': len(df),
            'column_count': len(df.columns),
            'missing_values': df.isna().sum().to_dict()
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Ruta para obtener análisis de correlación
@app.route('/api/analysis/correlation', methods=['POST'])
def get_correlation_analysis():
    data = request.json
    
    if not data or 'data' not in data or not data['data']:
        return jsonify({'error': 'No se han proporcionado datos para analizar'}), 400
    
    try:
        # Convertir datos a DataFrame
        df = pd.DataFrame(data['data'])
        
        # Seleccionar solo columnas numéricas para la correlación
        numeric_df = df.select_dtypes(include=['number'])
        
        if numeric_df.empty or numeric_df.shape[1] < 2:
            return jsonify({'error': 'Se necesitan al menos dos columnas numéricas para el análisis de correlación'}), 400
        
        # Calcular matriz de correlación
        corr_matrix = numeric_df.corr().round(4)
        
        # Generar gráfico de correlación
        plt.figure(figsize=(10, 8))
        mask = np.triu(np.ones_like(corr_matrix, dtype=bool))
        cmap = sns.diverging_palette(230, 20, as_cmap=True)
        
        sns.heatmap(
            corr_matrix,
            mask=mask,
            cmap=cmap,
            vmax=1,
            vmin=-1,
            center=0,
            square=True,
            linewidths=.5,
            annot=True,
            fmt='.2f'
        )
        
        plt.title('Matriz de Correlación')
        plt.tight_layout()
        
        # Convertir gráfico a base64 para enviar al cliente
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png', dpi=100)
        buffer.seek(0)
        img_str = base64.b64encode(buffer.read()).decode('utf-8')
        plt.close()
        
        # Preparar datos para la respuesta
        correlation_data = []
        for i, col1 in enumerate(corr_matrix.columns):
            for j, col2 in enumerate(corr_matrix.columns):
                if i < j:  # Solo incluir la mitad superior de la matriz
                    corr_value = corr_matrix.loc[col1, col2]
                    p_value = stats.pearsonr(numeric_df[col1].dropna(), numeric_df[col2].dropna())[1]
                    
                    # Interpretar la fuerza de la correlación
                    strength = 'Muy débil'
                    if abs(corr_value) > 0.9:
                        strength = 'Muy fuerte'
                    elif abs(corr_value) > 0.7:
                        strength = 'Fuerte'
                    elif abs(corr_value) > 0.5:
                        strength = 'Moderada'
                    elif abs(corr_value) > 0.3:
                        strength = 'Débil'
                    
                    # Interpretar la dirección
                    direction = 'Positiva' if corr_value > 0 else 'Negativa'
                    
                    # Interpretar significancia estadística
                    significance = 'No significativa'
                    if p_value < 0.001:
                        significance = 'Altamente significativa (p<0.001)'
                    elif p_value < 0.01:
                        significance = 'Muy significativa (p<0.01)'
                    elif p_value < 0.05:
                        significance = 'Significativa (p<0.05)'
                    
                    correlation_data.append({
                        'variable1': col1,
                        'variable2': col2,
                        'correlation': corr_value,
                        'p_value': p_value,
                        'strength': strength,
                        'direction': direction,
                        'significance': significance
                    })
        
        # Ordenar por valor absoluto de correlación (descendente)
        correlation_data.sort(key=lambda x: abs(x['correlation']), reverse=True)
        
        return jsonify({
            'correlation_matrix': corr_matrix.to_dict(),
            'correlation_pairs': correlation_data,
            'correlation_plot': img_str
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Ruta para obtener análisis de distribución
@app.route('/api/analysis/distribution', methods=['POST'])
def get_distribution_analysis():
    data = request.json
    
    if not data or 'data' not in data or not data['data'] or 'column' not in data:
        return jsonify({'error': 'No se han proporcionado datos o columna para analizar'}), 400
    
    column = data['column']
    
    try:
        # Convertir datos a DataFrame
        df = pd.DataFrame(data['data'])
        
        if column not in df.columns:
            return jsonify({'error': f'La columna {column} no existe en los datos'}), 400
        
        # Verificar si la columna es numérica
        is_numeric = pd.api.types.is_numeric_dtype(df[column])
        
        result = {
            'column': column,
            'is_numeric': is_numeric
        }
        
        if is_numeric:
            # Estadísticas para columnas numéricas
            series = df[column].dropna()
            
            # Calcular estadísticas básicas
            result.update({
                'count': len(series),
                'missing': df[column].isna().sum(),
                'min': float(series.min()),
                'max': float(series.max()),
                'mean': float(series.mean()),
                'median': float(series.median()),
                'std': float(series.std()),
                'variance': float(series.var()),
                'skewness': float(series.skew()),
                'kurtosis': float(series.kurtosis())
            })
            
            # Calcular percentiles
            percentiles = [0, 1, 5, 10, 25, 50, 75, 90, 95, 99, 100]
            percentile_values = np.percentile(series.dropna(), percentiles).tolist()
            result['percentiles'] = dict(zip([f'p{p}' for p in percentiles], percentile_values))
            
            # Prueba de normalidad (Shapiro-Wilk)
            if len(series) >= 3 and len(series) <= 5000:  # Limitación del test
                shapiro_test = stats.shapiro(series)
                result['normality_test'] = {
                    'test': 'Shapiro-Wilk',
                    'statistic': float(shapiro_test[0]),
                    'p_value': float(shapiro_test[1]),
                    'is_normal': shapiro_test[1] > 0.05
                }
            
            # Generar histograma
            plt.figure(figsize=(10, 6))
            sns.histplot(series, kde=True)
            plt.title(f'Distribución de {column}')
            plt.xlabel(column)
            plt.ylabel('Frecuencia')
            plt.grid(True, alpha=0.3)
            
            # Añadir línea de media y mediana
            plt.axvline(series.mean(), color='red', linestyle='--', label=f'Media: {series.mean():.2f}')
            plt.axvline(series.median(), color='green', linestyle='-.', label=f'Mediana: {series.median():.2f}')
            plt.legend()
            
            # Convertir gráfico a base64
            buffer = io.BytesIO()
            plt.savefig(buffer, format='png', dpi=100)
            buffer.seek(0)
            histogram_img = base64.b64encode(buffer.read()).decode('utf-8')
            plt.close()
            
            # Generar QQ plot para verificar normalidad
            plt.figure(figsize=(8, 8))
            stats.probplot(series, dist="norm", plot=plt)
            plt.title(f'Q-Q Plot de {column}')
            plt.grid(True, alpha=0.3)
            
            # Convertir QQ plot a base64
            buffer = io.BytesIO()
            plt.savefig(buffer, format='png', dpi=100)
            buffer.seek(0)
            qqplot_img = base64.b64encode(buffer.read()).decode('utf-8')
            plt.close()
            
            # Generar boxplot
            plt.figure(figsize=(10, 4))
            sns.boxplot(x=series)
            plt.title(f'Boxplot de {column}')
            plt.grid(True, alpha=0.3)
            
            # Convertir boxplot a base64
            buffer = io.BytesIO()
            plt.savefig(buffer, format='png', dpi=100)
            buffer.seek(0)
            boxplot_img = base64.b64encode(buffer.read()).decode('utf-8')
            plt.close()
            
            # Añadir imágenes al resultado
            result['plots'] = {
                'histogram': histogram_img,
                'qqplot': qqplot_img,
                'boxplot': boxplot_img
            }
            
            # Calcular outliers usando IQR
            Q1 = series.quantile(0.25)
            Q3 = series.quantile(0.75)
            IQR = Q3 - Q1
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR
            outliers = series[(series < lower_bound) | (series > upper_bound)]
            
            result['outliers'] = {
                'count': len(outliers),
                'percentage': (len(outliers) / len(series) * 100) if len(series) > 0 else 0,
                'lower_bound': float(lower_bound),
                'upper_bound': float(upper_bound),
                'values': outliers.tolist() if len(outliers) <= 100 else outliers.iloc[:100].tolist()
            }
            
        else:
            # Estadísticas para columnas categóricas
            value_counts = df[column].value_counts().reset_index()
            value_counts.columns = ['value', 'count']
            value_counts['percentage'] = (value_counts['count'] / len(df) * 100).round(2)
            
            result.update({
                'count': len(df[column].dropna()),
                'missing': df[column].isna().sum(),
                'unique_values': df[column].nunique(),
                'most_common': value_counts.iloc[0]['value'] if not value_counts.empty else None,
                'most_common_count': int(value_counts.iloc[0]['count']) if not value_counts.empty else 0,
                'most_common_percentage': float(value_counts.iloc[0]['percentage']) if not value_counts.empty else 0,
                'distribution': value_counts.to_dict(orient='records')
            })
            
            # Generar gráfico de barras para categorías
            plt.figure(figsize=(12, 6))
            
            # Limitar a las 20 categorías más frecuentes si hay muchas
            plot_data = value_counts.head(20) if len(value_counts) > 20 else value_counts
            
            # Rotar etiquetas si hay muchas categorías
            rotation = 90 if len(plot_data) > 5 else 0
            
            ax = sns.barplot(x='value', y='count', data=plot_data)
            plt.title(f'Distribución de {column}')
            plt.xlabel(column)
            plt.ylabel('Frecuencia')
            plt.xticks(rotation=rotation)
            plt.grid(True, alpha=0.3)
            
            # Añadir etiquetas de valor en las barras
            for p in ax.patches:
                ax.annotate(f'{int(p.get_height())}', 
                           (p.get_x() + p.get_width() / 2., p.get_height()),
                           ha='center', va='bottom', rotation=0)
            
            # Convertir gráfico a base64
            buffer = io.BytesIO()
            plt.savefig(buffer, format='png', dpi=100)
            buffer.seek(0)
            barplot_img = base64.b64encode(buffer.read()).decode('utf-8')
            plt.close()
            
            # Generar gráfico de pastel para categorías
            plt.figure(figsize=(10, 10))
            
            # Limitar a las 10 categorías más frecuentes para el gráfico de pastel
            pie_data = value_counts.head(10) if len(value_counts) > 10 else value_counts
            
            # Si hay más categorías que no se muestran, añadir una categoría "Otros"
            if len(value_counts) > 10:
                others_sum = value_counts.iloc[10:]['count'].sum()
                others_row = pd.DataFrame({'value': ['Otros'], 'count': [others_sum], 
                                          'percentage': [(others_sum / len(df) * 100).round(2)]})
                pie_data = pd.concat([pie_data, others_row])
            
            plt.pie(pie_data['count'], labels=pie_data['value'], autopct='%1.1f%%', 
                   shadow=True, startangle=90)
            plt.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle
            plt.title(f'Distribución porcentual de {column}')
            
            # Convertir gráfico a base64
            buffer = io.BytesIO()
            plt.savefig(buffer, format='png', dpi=100)
            buffer.seek(0)
            pieplot_img = base64.b64encode(buffer.read()).decode('utf-8')
            plt.close()
            
            # Añadir imágenes al resultado
            result['plots'] = {
                'barplot': barplot_img,
                'pieplot': pieplot_img
            }
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Ruta para obtener análisis de series temporales
@app.route('/api/analysis/timeseries', methods=['POST'])
def get_timeseries_analysis():
    data = request.json
    
    if not data or 'data' not in data or not data['data'] or 'date_column' not in data or 'value_column' not in data:
        return jsonify({'error': 'No se han proporcionado datos, columna de fecha o columna de valor para analizar'}), 400
    
    date_column = data['date_column']
    value_column = data['value_column']
    group_by = data.get('group_by', 'month')  # Agrupación por defecto: mes
    
    try:
        # Convertir datos a DataFrame
        df = pd.DataFrame(data['data'])
        
        if date_column not in df.columns or value_column not in df.columns:
            return jsonify({'error': f'Las columnas especificadas no existen en los datos'}), 400
        
        # Verificar si la columna de valor es numérica
        if not pd.api.types.is_numeric_dtype(df[value_column]):
            return jsonify({'error': f'La columna de valor debe ser numérica'}), 400
        
        # Convertir columna de fecha a datetime
        try:
            df[date_column] = pd.to_datetime(df[date_column])
        except Exception as e:
            return jsonify({'error': f'Error al convertir la columna de fecha: {str(e)}'}), 400
        
        # Ordenar por fecha
        df = df.sort_values(by=date_column)
        
        # Agrupar datos según el parámetro group_by
        if group_by == 'day':
            df['period'] = df[date_column].dt.date
            period_format = '%Y-%m-%d'
        elif group_by == 'week':
            df['period'] = df[date_column].dt.to_period('W').dt.start_time.dt.date
            period_format = 'Semana %U, %Y'
        elif group_by == 'month':
            df['period'] = df[date_column].dt.to_period('M').dt.start_time.dt.date
            period_format = '%b %Y'
        elif group_by == 'quarter':
            df['period'] = df[date_column].dt.to_period('Q').dt.start_time.dt.date
            period_format = 'Q%q %Y'
        elif group_by == 'year':
            df['period'] = df[date_column].dt.year
            period_format = '%Y'
        else:
            return jsonify({'error': f'Tipo de agrupación no soportado: {group_by}'}), 400
        
        # Agrupar y calcular estadísticas
        grouped = df.groupby('period')[value_column].agg(['mean', 'sum', 'min', 'max', 'count']).reset_index()
        
        # Convertir period a string formateado para la visualización
        if group_by != 'year':
            grouped['period_str'] = grouped['period'].apply(lambda x: x.strftime(period_format) if hasattr(x, 'strftime') else str(x))
        else:
            grouped['period_str'] = grouped['period'].astype(str)
        
        # Ordenar por período
        grouped = grouped.sort_values('period')
        
        # Preparar datos para la respuesta
        time_series_data = {
            'labels': grouped['period_str'].tolist(),
            'datasets': {
                'mean': grouped['mean'].tolist(),
                'sum': grouped['sum'].tolist(),
                'min': grouped['min'].tolist(),
                'max': grouped['max'].tolist(),
                'count': grouped['count'].tolist()
            }
        }
        
        # Generar gráfico de línea para la serie temporal
        plt.figure(figsize=(12, 6))
        plt.plot(grouped['period_str'], grouped['sum'], marker='o', linestyle='-', linewidth=2, label='Suma')
        plt.title(f'Serie Temporal de {value_column} por {group_by.capitalize()}')
        plt.xlabel('Período')
        plt.ylabel(value_column)
        plt.grid(True, alpha=0.3)
        plt.xticks(rotation=45)
        plt.tight_layout()
        plt.legend()
        
        # Convertir gráfico a base64
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png', dpi=100)
        buffer.seek(0)
        line_plot = base64.b64encode(buffer.read()).decode('utf-8')
        plt.close()
        
        # Generar gráfico de barras para comparar períodos
        plt.figure(figsize=(12, 6))
        plt.bar(grouped['period_str'], grouped['sum'], alpha=0.7)
        plt.title(f'Comparación de {value_column} por {group_by.capitalize()}')
        plt.xlabel('Período')
        plt.ylabel(value_column)
        plt.grid(True, alpha=0.3, axis='y')
        plt.xticks(rotation=45)
        
        # Añadir etiquetas de valor en las barras
        for i, v in enumerate(grouped['sum']):
            plt.text(i, v + 0.1, f'{v:.1f}', ha='center', va='bottom', rotation=0, fontsize=9)
        
        plt.tight_layout()
        
        # Convertir gráfico a base64
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png', dpi=100)
        buffer.seek(0)
        bar_plot = base64.b64encode(buffer.read()).decode('utf-8')
        plt.close()
        
        # Calcular estadísticas de tendencia
        x = np.arange(len(grouped))
        y = grouped['sum'].values
        
        # Regresión lineal para detectar tendencia
        slope, intercept, r_value, p_value, std_err = stats.linregress(x, y)
        
        trend_line = intercept + slope * x
        
        # Generar gráfico con línea de tendencia
        plt.figure(figsize=(12, 6))
        plt.scatter(grouped['period_str'], y, alpha=0.7, label='Datos')
        plt.plot(grouped['period_str'], trend_line, 'r--', label=f'Tendencia (pendiente={slope:.2f})')
        plt.title(f'Análisis de Tendencia de {value_column}')
        plt.xlabel('Período')
        plt.ylabel(value_column)
        plt.grid(True, alpha=0.3)
        plt.xticks(rotation=45)
        plt.legend()
        plt.tight_layout()
        
        # Convertir gráfico a base64
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png', dpi=100)
        buffer.seek(0)
        trend_plot = base64.b64encode(buffer.read()).decode('utf-8')
        plt.close()
        
        # Calcular estadísticas de crecimiento
        if len(grouped) > 1:
            grouped['growth'] = grouped['sum'].pct_change() * 100
            grouped['growth_abs'] = grouped['sum'].diff()
            
            # Generar gráfico de crecimiento
            plt.figure(figsize=(12, 6))
            plt.bar(grouped['period_str'][1:], grouped['growth'][1:], alpha=0.7, 
                   color=[('green' if x >= 0 else 'red') for x in grouped['growth'][1:]])
            plt.title(f'Crecimiento Porcentual de {value_column} por {group_by.capitalize()}')
            plt.xlabel('Período')
            plt.ylabel('Crecimiento (%)')
            plt.grid(True, alpha=0.3, axis='y')
            plt.xticks(rotation=45)
            plt.axhline(y=0, color='black', linestyle='-', alpha=0.3)
            
            # Añadir etiquetas de valor en las barras
            for i, v in enumerate(grouped['growth'][1:]):
                plt.text(i, v + (1 if v >= 0 else -3), f'{v:.1f}%', ha='center', va='bottom' if v >= 0 else 'top', 
                        fontsize=9, color='black')
            
            plt.tight_layout()
            
            # Convertir gráfico a base64
            buffer = io.BytesIO()
            plt.savefig(buffer, format='png', dpi=100)
            buffer.seek(0)
            growth_plot = base64.b64encode(buffer.read()).decode('utf-8')
            plt.close()
        else:
            growth_plot = None
            grouped['growth'] = []
            grouped['growth_abs'] = []
        
        # Preparar análisis de tendencia
        trend_analysis = {
            'slope': float(slope),
            'intercept': float(intercept),
            'r_squared': float(r_value**2),
            'p_value': float(p_value),
            'std_error': float(std_err),
            'is_significant': p_value < 0.05,
            'direction': 'Creciente' if slope > 0 else 'Decreciente' if slope < 0 else 'Estable',
            'strength': 'Fuerte' if abs(r_value) > 0.7 else 'Moderada' if abs(r_value) > 0.3 else 'Débil'
        }
        
        # Preparar estadísticas de crecimiento
        if len(grouped) > 1:
            growth_stats = {
                'mean_growth_pct': float(grouped['growth'][1:].mean()),
                'total_growth_pct': float(((grouped['sum'].iloc[-1] / grouped['sum'].iloc[0]) - 1) * 100) if grouped['sum'].iloc[0] != 0 else None,
                'total_growth_abs': float(grouped['sum'].iloc[-1] - grouped['sum'].iloc[0]),
                'periods_positive_growth': int((grouped['growth'] > 0).sum()),
                'periods_negative_growth': int((grouped['growth'] < 0).sum()),
                'max_growth_period': grouped.iloc[grouped['growth'].idxmax()]['period_str'] if len(grouped['growth']) > 0 and not grouped['growth'].isna().all() else None,
                'max_growth_value': float(grouped['growth'].max()) if len(grouped['growth']) > 0 and not grouped['growth'].isna().all() else None,
                'min_growth_period': grouped.iloc[grouped['growth'].idxmin()]['period_str'] if len(grouped['growth']) > 0 and not grouped['growth'].isna().all() else None,
                'min_growth_value': float(grouped['growth'].min()) if len(grouped['growth']) > 0 and not grouped['growth'].isna().all() else None
            }
        else:
            growth_stats = None
        
        # Preparar estadísticas generales
        general_stats = {
            'total_periods': len(grouped),
            'total_sum': float(grouped['sum'].sum()),
            'mean_per_period': float(grouped['sum'].mean()),
            'max_value_period': grouped.iloc[grouped['sum'].idxmax()]['period_str'],
            'max_value': float(grouped['sum'].max()),
            'min_value_period': grouped.iloc[grouped['sum'].idxmin()]['period_str'],
            'min_value': float(grouped['sum'].min()),
            'std_dev': float(grouped['sum'].std()),
            'variance': float(grouped['sum'].var())
        }
        
        # Preparar resultado final
        result = {
            'time_series_data': time_series_data,
            'trend_analysis': trend_analysis,
            'growth_stats': growth_stats,
            'general_stats': general_stats,
            'plots': {
                'line_plot': line_plot,
                'bar_plot': bar_plot,
                'trend_plot': trend_plot,
                'growth_plot': growth_plot
            }
        }
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Ruta para generar gráficos
@app.route('/api/chart', methods=['POST'])
def generate_chart():
    try:
        # Obtener los datos de la solicitud JSON
        data = request.json
        
        if not data or 'data' not in data or not data['data']:
            return jsonify({
                'success': False,
                'error': 'No se han proporcionado datos para generar el gráfico'
            }), 400
        
        chart_type = data.get('chart_type')
        x_column = data.get('x_column')
        y_column = data.get('y_column')
        group_by = data.get('group_by')
        title = data.get('title', '')
        
        if not chart_type or not x_column or not y_column:
            return jsonify({
                'success': False,
                'error': 'Faltan parámetros requeridos (chart_type, x_column, y_column)'
            }), 400
        
        # Convertir datos a DataFrame
        df = pd.DataFrame(data['data'])
        
        # Verificar que las columnas existan
        if x_column not in df.columns or y_column not in df.columns:
            return jsonify({
                'success': False,
                'error': 'Columnas no encontradas en los datos'
            }), 400
        
        if group_by and group_by not in df.columns:
            return jsonify({
                'success': False,
                'error': f'Columna de agrupación {group_by} no encontrada'
            }), 400
        
        # Crear el gráfico según el tipo solicitado
        plt.figure(figsize=(12, 8))
        
        # Configurar estilo del gráfico
        plt.style.use('seaborn-v0_8-whitegrid')
        
        # Definir una paleta de colores atractiva
        colors = ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f', '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab']
        
        if chart_type == 'bar':
            if group_by:
                # Gráfico de barras agrupadas
                grouped_data = df.groupby([x_column, group_by])[y_column].mean().unstack()
                grouped_data.plot(kind='bar', ax=plt.gca(), color=colors[:len(grouped_data.columns)])
                plt.title(title or f'{y_column} por {x_column} y {group_by}')
            else:
                # Gráfico de barras simple
                df.groupby(x_column)[y_column].mean().plot(kind='bar', ax=plt.gca(), color=colors[0])
                plt.title(title or f'{y_column} por {x_column}')
            
            plt.xlabel(x_column)
            plt.ylabel(y_column)
            plt.xticks(rotation=45)
            plt.grid(True, alpha=0.3)
            plt.tight_layout()
        
        elif chart_type == 'line':
            if group_by:
                # Gráfico de líneas agrupadas
                for i, (group, data) in enumerate(df.groupby(group_by)):
                    data_grouped = data.groupby(x_column)[y_column].mean()
                    plt.plot(data_grouped.index, data_grouped.values, marker='o', 
                             label=str(group), color=colors[i % len(colors)])
                plt.title(title or f'{y_column} por {x_column} y {group_by}')
                plt.legend()
            else:
                # Gráfico de líneas simple
                df.groupby(x_column)[y_column].mean().plot(kind='line', marker='o', 
                                                          ax=plt.gca(), color=colors[0])
                plt.title(title or f'{y_column} por {x_column}')
            
            plt.xlabel(x_column)
            plt.ylabel(y_column)
            plt.grid(True, alpha=0.3)
            plt.tight_layout()
        
        elif chart_type == 'scatter':
            if group_by:
                # Gráfico de dispersión con colores por grupo
                for i, (group, data) in enumerate(df.groupby(group_by)):
                    plt.scatter(data[x_column], data[y_column], label=str(group), 
                               alpha=0.7, color=colors[i % len(colors)])
                plt.title(title or f'Relación entre {x_column} y {y_column} por {group_by}')
                plt.legend()
            else:
                # Gráfico de dispersión simple
                plt.scatter(df[x_column], df[y_column], alpha=0.7, color=colors[0])
                plt.title(title or f'Relación entre {x_column} y {y_column}')
            
            # Añadir línea de tendencia si ambas columnas son numéricas
            if pd.api.types.is_numeric_dtype(df[x_column]) and pd.api.types.is_numeric_dtype(df[y_column]):
                try:
                    # Calcular línea de tendencia
                    z = np.polyfit(df[x_column], df[y_column], 1)
                    p = np.poly1d(z)
                    
                    # Ordenar los valores de x para la línea de tendencia
                    x_sorted = sorted(df[x_column])
                    plt.plot(x_sorted, p(x_sorted), "r--", alpha=0.8, label=f'Tendencia: y={z[0]:.2f}x+{z[1]:.2f}')
                    plt.legend()
                except Exception:
                    # Si hay error al calcular la tendencia, simplemente no la mostramos
                    pass
            
            plt.xlabel(x_column)
            plt.ylabel(y_column)
            plt.grid(True, alpha=0.3)
            plt.tight_layout()
        
        elif chart_type == 'pie':
            # Gráfico circular
            # Limitar a las 10 categorías más frecuentes si hay muchas
            pie_data = df.groupby(x_column)[y_column].sum()
            if len(pie_data) > 10:
                # Ordenar y tomar los 9 más grandes, el resto como "Otros"
                pie_data = pie_data.sort_values(ascending=False)
                others_sum = pie_data[9:].sum()
                pie_data = pie_data[:9]
                pie_data['Otros'] = others_sum
            
            pie_data.plot(kind='pie', autopct='%1.1f%%', ax=plt.gca(), 
                         colors=colors[:len(pie_data)], shadow=True, startangle=90)
            plt.title(title or f'Distribución de {y_column} por {x_column}')
            plt.ylabel('')  # Quitar etiqueta del eje y
            plt.tight_layout()
        
        elif chart_type == 'histogram':
            # Histograma
            if not pd.api.types.is_numeric_dtype(df[x_column]):
                return jsonify({
                    'success': False,
                    'error': 'La columna para el histograma debe ser numérica'
                }), 400
            
            plt.hist(df[x_column].dropna(), bins=20, alpha=0.7, color=colors[0], edgecolor='black')
            plt.title(title or f'Histograma de {x_column}')
            plt.xlabel(x_column)
            plt.ylabel('Frecuencia')
            plt.grid(True, alpha=0.3)
            plt.tight_layout()
        
        elif chart_type == 'boxplot':
            # Diagrama de caja
            if not pd.api.types.is_numeric_dtype(df[y_column]):
                return jsonify({
                    'success': False,
                    'error': 'La columna para el boxplot debe ser numérica'
                }), 400
            
            if group_by:
                # Boxplot agrupado
                sns.boxplot(x=x_column, y=y_column, data=df, hue=group_by, palette=colors[:10])
                plt.title(title or f'Distribución de {y_column} por {x_column} y {group_by}')
                plt.legend(title=group_by)
            else:
                # Boxplot simple
                sns.boxplot(x=x_column, y=y_column, data=df, palette=colors[:10])
                plt.title(title or f'Distribución de {y_column} por {x_column}')
            
            plt.grid(True, alpha=0.3)
            plt.tight_layout()
        
        elif chart_type == 'heatmap':
            # Mapa de calor (solo para columnas numéricas)
            numeric_df = df.select_dtypes(include=['number'])
            
            if numeric_df.shape[1] < 2:
                return jsonify({
                    'success': False,
                    'error': 'Se necesitan al menos dos columnas numéricas para el mapa de calor'
                }), 400
            
            # Calcular matriz de correlación
            corr_matrix = numeric_df.corr()
            
            # Generar mapa de calor
            mask = np.triu(np.ones_like(corr_matrix, dtype=bool))
            cmap = sns.diverging_palette(230, 20, as_cmap=True)
            
            sns.heatmap(
                corr_matrix,
                mask=mask,
                cmap=cmap,
                vmax=1,
                vmin=-1,
                center=0,
                square=True,
                linewidths=.5,
                annot=True,
                fmt='.2f'
            )
            
            plt.title(title or 'Matriz de Correlación')
            plt.tight_layout()
        
        else:
            return jsonify({
                'success': False,
                'error': 'Tipo de gráfico no soportado'
            }), 400
        
        # Convertir el gráfico a base64
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png', dpi=100)
        buffer.seek(0)
        image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        plt.close()
        
        return jsonify({
            'success': True,
            'chart_type': chart_type,
            'image': image_base64
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Ruta para exportar datos
@app.route('/api/export', methods=['POST'])
def export_data():
    try:
        # Obtener los datos de la solicitud JSON
        data = request.json
        
        if not data or 'data' not in data or not data['data']:
            return jsonify({
                'success': False,
                'error': 'No se han proporcionado datos para exportar'
            }), 400
        
        export_format = data.get('format', 'csv')
        filename_prefix = data.get('filename_prefix', 'datos')
        
        # Convertir datos a DataFrame
        df = pd.DataFrame(data['data'])
        
        # Exportar según el formato solicitado
        if export_format == 'csv':
            output = io.StringIO()
            df.to_csv(output, index=False)
            export_data = output.getvalue()
            mime_type = 'text/csv'
            filename = f'{filename_prefix}_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
        
        elif export_format == 'excel':
            output = io.BytesIO()
            df.to_excel(output, index=False, engine='openpyxl')
            output.seek(0)
            export_data = base64.b64encode(output.getvalue()).decode('utf-8')
            mime_type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            filename = f'{filename_prefix}_{datetime.now().strftime("%Y%m%d_%H%M%S")}.xlsx'
        
        elif export_format == 'json':
            export_data = df.to_json(orient='records')
            mime_type = 'application/json'
            filename = f'{filename_prefix}_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
        
        elif export_format == 'html':
            # Exportar como tabla HTML con estilos de Bootstrap
            html_table = df.to_html(classes='table table-striped table-hover table-bordered', index=False)
            
            # Añadir estilos y scripts de Bootstrap para una mejor presentación
            html_content = f'''
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Datos Exportados</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body {{ padding: 20px; }}
                    h1 {{ margin-bottom: 20px; }}
                    .table-container {{ overflow-x: auto; }}
                    .table {{ margin-bottom: 0; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Datos Exportados</h1>
                    <p>Fecha de exportación: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}</p>
                    <div class="table-container">
                        {html_table}
                    </div>
                </div>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
            </body>
            </html>
            '''
            
            export_data = html_content
            mime_type = 'text/html'
            filename = f'{filename_prefix}_{datetime.now().strftime("%Y%m%d_%H%M%S")}.html'
        
        else:
            return jsonify({
                'success': False,
                'error': 'Formato de exportación no soportado'
            }), 400
        
        return jsonify({
            'success': True,
            'data': export_data,
            'mime_type': mime_type,
            'filename': filename
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Iniciar la aplicación si se ejecuta directamente
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)