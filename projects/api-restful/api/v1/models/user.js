/**
 * Modelo de Usuario
 * Define la estructura y validación de los datos de usuario
 */

class User {
  constructor(data) {
    this.id = data.id || null;
    this.username = data.username || '';
    this.email = data.email || '';
    this.password = data.password || ''; // Almacenar solo hash en producción
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.role = data.role || 'user'; // Por defecto: 'user'
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.lastLogin = data.lastLogin || null;
    this.active = data.active !== undefined ? data.active : true;
  }

  /**
   * Valida los datos del usuario
   * @returns {Object} Resultado de la validación {isValid, errors}
   */
  validate() {
    const errors = [];

    // Validación de username
    if (!this.username) {
      errors.push('El nombre de usuario es obligatorio');
    } else if (this.username.length < 3) {
      errors.push('El nombre de usuario debe tener al menos 3 caracteres');
    } else if (this.username.length > 50) {
      errors.push('El nombre de usuario no puede exceder los 50 caracteres');
    }

    // Validación de email
    if (!this.email) {
      errors.push('El email es obligatorio');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        errors.push('El formato del email no es válido');
      }
    }

    // Validación de password (solo para creación o actualización de contraseña)
    if (this.id === null && !this.password) {
      errors.push('La contraseña es obligatoria');
    } else if (this.password && this.password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres');
    }

    // Validación de role
    const validRoles = ['user', 'admin', 'editor'];
    if (!validRoles.includes(this.role)) {
      errors.push(`El rol debe ser uno de los siguientes: ${validRoles.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Convierte el objeto a un formato seguro para enviar al cliente
   * (elimina datos sensibles como la contraseña)
   * @returns {Object} Datos seguros del usuario
   */
  toSafeObject() {
    const { password, ...safeData } = this;
    return safeData;
  }

  /**
   * Actualiza los campos del usuario
   * @param {Object} data Nuevos datos del usuario
   * @returns {User} Instancia actualizada
   */
  update(data) {
    if (data.username) this.username = data.username;
    if (data.email) this.email = data.email;
    if (data.password) this.password = data.password;
    if (data.firstName) this.firstName = data.firstName;
    if (data.lastName) this.lastName = data.lastName;
    if (data.role) this.role = data.role;
    if (data.active !== undefined) this.active = data.active;
    
    this.updatedAt = new Date();
    return this;
  }
}

module.exports = User;