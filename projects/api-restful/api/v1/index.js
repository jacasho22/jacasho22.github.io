/**
 * API RESTful - Punto de entrada principal
 * Configura y expone los endpoints de la API
 */

const config = require('./config');
const auth = require('./auth');
const usersController = require('./endpoints/users');
const productsController = require('./endpoints/products');

/**
 * Configuración de rutas de la API
 * @param {Object} app - Instancia de Express
 */
function setupRoutes(app) {
  // Middleware para parsear JSON
  app.use(express.json());
  
  // Middleware para CORS
  app.use(cors(config.cors));
  
  // Middleware para rate limiting
  app.use(rateLimit(config.rateLimit));
  
  // Ruta de estado de la API
  app.get('/api/v1/status', (req, res) => {
    res.status(200).json({
      status: 'online',
      version: 'v1',
      timestamp: new Date().toISOString()
    });
  });
  
  // Rutas de autenticación
  app.post('/api/v1/auth/login', auth.login);
  app.post('/api/v1/auth/register', auth.register);
  app.get('/api/v1/auth/verify', auth.authenticate, auth.verifyToken);
  app.post('/api/v1/auth/logout', auth.authenticate, auth.logout);
  
  // Rutas de usuarios
  app.get('/api/v1/users', auth.authenticate, auth.authorize(['admin']), usersController.getAllUsers);
  app.get('/api/v1/users/:id', auth.authenticate, usersController.getUserById);
  app.post('/api/v1/users', auth.authenticate, auth.authorize(['admin']), usersController.createUser);
  app.put('/api/v1/users/:id', auth.authenticate, usersController.updateUser);
  app.delete('/api/v1/users/:id', auth.authenticate, auth.authorize(['admin']), usersController.deleteUser);
  
  // Rutas de productos
  app.get('/api/v1/products', productsController.getAllProducts);
  app.get('/api/v1/products/:id', productsController.getProductById);
  app.post('/api/v1/products', auth.authenticate, auth.authorize(['admin', 'editor']), productsController.createProduct);
  app.put('/api/v1/products/:id', auth.authenticate, auth.authorize(['admin', 'editor']), productsController.updateProduct);
  app.delete('/api/v1/products/:id', auth.authenticate, auth.authorize(['admin']), productsController.deleteProduct);
  app.post('/api/v1/products/:id/rate', auth.authenticate, productsController.rateProduct);
  
  // Middleware para manejo de errores
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });
  
  // Middleware para rutas no encontradas
  app.use((req, res) => {
    res.status(404).json({
      error: 'Ruta no encontrada',
      path: req.path
    });
  });
}

/**
 * Inicia el servidor de la API
 */
function startServer() {
  const express = require('express');
  const cors = require('cors');
  const rateLimit = require('express-rate-limit');
  
  const app = express();
  
  // Configurar rutas
  setupRoutes(app);
  
  // Iniciar servidor
  app.listen(config.server.port, config.server.host, () => {
    console.log(`API RESTful ejecutándose en http://${config.server.host}:${config.server.port}`);
  });
}

// Exportar funciones para uso externo
module.exports = {
  setupRoutes,
  startServer
};

// Si este archivo se ejecuta directamente, iniciar el servidor
if (require.main === module) {
  startServer();
}