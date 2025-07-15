/**
 * Endpoints de Usuarios
 * Gestiona todas las operaciones relacionadas con usuarios
 */

const User = require('../models/user');

// Simulación de base de datos (en una aplicación real, esto sería una BD)
let users = [
  new User({
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqaG3vv1BD7WC', // 'admin123' hasheado
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    createdAt: new Date('2023-01-01'),
    active: true
  }),
  new User({
    id: '2',
    username: 'user1',
    email: 'user1@example.com',
    password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqaG3vv1BD7WC', // 'password123' hasheado
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    createdAt: new Date('2023-01-15'),
    active: true
  }),
  new User({
    id: '3',
    username: 'editor1',
    email: 'editor@example.com',
    password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqaG3vv1BD7WC', // 'editor123' hasheado
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'editor',
    createdAt: new Date('2023-02-01'),
    active: true
  })
];

/**
 * Controladores para las rutas de usuarios
 */
const usersController = {
  /**
   * Obtiene todos los usuarios
   * @param {Object} req - Objeto de solicitud
   * @param {Object} res - Objeto de respuesta
   */
  getAllUsers: (req, res) => {
    // Filtrar datos sensibles antes de enviar
    const safeUsers = users.map(user => user.toSafeObject());
    
    // Implementar paginación
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const results = {
      users: safeUsers.slice(startIndex, endIndex),
      pagination: {
        total: safeUsers.length,
        page,
        limit,
        pages: Math.ceil(safeUsers.length / limit)
      }
    };
    
    res.status(200).json(results);
  },
  
  /**
   * Obtiene un usuario por su ID
   * @param {Object} req - Objeto de solicitud
   * @param {Object} res - Objeto de respuesta
   */
  getUserById: (req, res) => {
    const userId = req.params.id;
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.status(200).json(user.toSafeObject());
  },
  
  /**
   * Crea un nuevo usuario
   * @param {Object} req - Objeto de solicitud
   * @param {Object} res - Objeto de respuesta
   */
  createUser: (req, res) => {
    const userData = req.body;
    
    // Generar ID único (en una aplicación real, esto lo haría la BD)
    userData.id = (users.length + 1).toString();
    
    const newUser = new User(userData);
    const validation = newUser.validate();
    
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }
    
    // En una aplicación real, aquí se hashearía la contraseña
    
    users.push(newUser);
    res.status(201).json(newUser.toSafeObject());
  },
  
  /**
   * Actualiza un usuario existente
   * @param {Object} req - Objeto de solicitud
   * @param {Object} res - Objeto de respuesta
   */
  updateUser: (req, res) => {
    const userId = req.params.id;
    const userData = req.body;
    
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Actualizar usuario
    const updatedUser = users[userIndex].update(userData);
    const validation = updatedUser.validate();
    
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }
    
    // Actualizar en el array
    users[userIndex] = updatedUser;
    
    res.status(200).json(updatedUser.toSafeObject());
  },
  
  /**
   * Elimina un usuario
   * @param {Object} req - Objeto de solicitud
   * @param {Object} res - Objeto de respuesta
   */
  deleteUser: (req, res) => {
    const userId = req.params.id;
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Eliminar usuario (o marcar como inactivo en una aplicación real)
    users = users.filter(u => u.id !== userId);
    
    res.status(204).send();
  }
};

module.exports = usersController;