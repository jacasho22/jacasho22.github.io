/**
 * Autenticación de la API RESTful
 * Gestiona la autenticación y autorización de usuarios
 */

const config = require('./config');

/**
 * Controladores para la autenticación
 */
const authController = {
  /**
   * Inicia sesión de usuario
   * @param {Object} req - Objeto de solicitud
   * @param {Object} res - Objeto de respuesta
   */
  login: (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Se requiere nombre de usuario y contraseña' });
    }
    
    // En una aplicación real, buscaríamos el usuario en la BD
    // y verificaríamos la contraseña con bcrypt.compare
    
    // Simulación de autenticación exitosa
    const token = generateToken({
      username,
      role: 'user' // En una aplicación real, esto vendría del usuario encontrado
    });
    
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      expiresIn: config.auth.jwtExpiresIn
    });
  },
  
  /**
   * Registra un nuevo usuario
   * @param {Object} req - Objeto de solicitud
   * @param {Object} res - Objeto de respuesta
   */
  register: (req, res) => {
    const { username, email, password, firstName, lastName } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ 
        error: 'Se requiere nombre de usuario, email y contraseña' 
      });
    }
    
    // En una aplicación real, verificaríamos si el usuario ya existe
    // y hashearíamos la contraseña con bcrypt.hash
    
    // Simulación de registro exitoso
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        username,
        email,
        firstName,
        lastName,
        role: 'user'
      }
    });
  },
  
  /**
   * Verifica el token JWT
   * @param {Object} req - Objeto de solicitud
   * @param {Object} res - Objeto de respuesta
   */
  verifyToken: (req, res) => {
    // En una aplicación real, el token ya estaría verificado por un middleware
    res.status(200).json({
      message: 'Token válido',
      user: req.user // En una aplicación real, esto vendría del middleware de autenticación
    });
  },
  
  /**
   * Cierra la sesión del usuario
   * @param {Object} req - Objeto de solicitud
   * @param {Object} res - Objeto de respuesta
   */
  logout: (req, res) => {
    // En una aplicación real, podríamos invalidar el token
    // o añadirlo a una lista negra
    res.status(200).json({ message: 'Sesión cerrada exitosamente' });
  },
  
  /**
   * Middleware para verificar autenticación
   * @param {Object} req - Objeto de solicitud
   * @param {Object} res - Objeto de respuesta
   * @param {Function} next - Función para continuar
   */
  authenticate: (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Se requiere token de autenticación' });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      // En una aplicación real, verificaríamos el token con jwt.verify
      const decoded = { username: 'user', role: 'user' }; // Simulación
      
      // Añadir usuario decodificado a la solicitud
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }
  },
  
  /**
   * Middleware para verificar roles
   * @param {Array} roles - Roles permitidos
   * @returns {Function} Middleware
   */
  authorize: (roles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ error: 'No autenticado' });
      }
      
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'No autorizado' });
      }
      
      next();
    };
  }
};

/**
 * Genera un token JWT
 * @param {Object} payload - Datos a incluir en el token
 * @returns {String} Token JWT
 */
function generateToken(payload) {
  // En una aplicación real, usaríamos jwt.sign
  // Simulación de token JWT
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const claims = Buffer.from(JSON.stringify({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600 // 1 hora
  })).toString('base64');
  
  // En una aplicación real, firmaríamos con HMAC-SHA256
  const signature = 'simulated_signature';
  
  return `${header}.${claims}.${signature}`;
}

module.exports = authController;