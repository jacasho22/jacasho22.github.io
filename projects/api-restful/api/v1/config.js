/**
 * Configuración de la API RESTful
 * Este archivo contiene la configuración principal de la API
 */

const config = {
  // Configuración del servidor
  server: {
    port: 3000,
    host: 'localhost'
  },
  
  // Configuración de la base de datos
  database: {
    host: 'localhost',
    port: 27017,
    name: 'api_restful_db',
    user: 'admin',
    password: '********' // Nota: En producción, usar variables de entorno
  },
  
  // Configuración de autenticación
  auth: {
    jwtSecret: 'your-secret-key', // Nota: En producción, usar variables de entorno
    jwtExpiresIn: '1h',
    saltRounds: 10
  },
  
  // Configuración de CORS
  cors: {
    origin: '*', // En producción, limitar a dominios específicos
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  
  // Configuración de rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // límite de 100 solicitudes por ventana
  },
  
  // Configuración de logs
  logging: {
    level: 'info', // opciones: error, warn, info, verbose, debug, silly
    format: 'combined' // opciones: combined, common, dev, short, tiny
  }
};

module.exports = config;