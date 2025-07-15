/**
 * Modelo de Producto
 * Define la estructura y validación de los datos de productos
 */

class Product {
  constructor(data) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.description = data.description || '';
    this.price = data.price || 0;
    this.category = data.category || '';
    this.tags = data.tags || [];
    this.stock = data.stock !== undefined ? data.stock : 0;
    this.images = data.images || [];
    this.featured = data.featured !== undefined ? data.featured : false;
    this.rating = data.rating || { average: 0, count: 0 };
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.active = data.active !== undefined ? data.active : true;
  }

  /**
   * Valida los datos del producto
   * @returns {Object} Resultado de la validación {isValid, errors}
   */
  validate() {
    const errors = [];

    // Validación de nombre
    if (!this.name) {
      errors.push('El nombre del producto es obligatorio');
    } else if (this.name.length < 3) {
      errors.push('El nombre del producto debe tener al menos 3 caracteres');
    } else if (this.name.length > 100) {
      errors.push('El nombre del producto no puede exceder los 100 caracteres');
    }

    // Validación de precio
    if (this.price === undefined || this.price === null) {
      errors.push('El precio es obligatorio');
    } else if (isNaN(this.price) || this.price < 0) {
      errors.push('El precio debe ser un número positivo');
    }

    // Validación de categoría
    if (!this.category) {
      errors.push('La categoría es obligatoria');
    }

    // Validación de stock
    if (this.stock === undefined || this.stock === null) {
      errors.push('El stock es obligatorio');
    } else if (!Number.isInteger(this.stock) || this.stock < 0) {
      errors.push('El stock debe ser un número entero positivo');
    }

    // Validación de imágenes
    if (this.images && !Array.isArray(this.images)) {
      errors.push('El campo imágenes debe ser un array');
    }

    // Validación de tags
    if (this.tags && !Array.isArray(this.tags)) {
      errors.push('El campo tags debe ser un array');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Actualiza los campos del producto
   * @param {Object} data Nuevos datos del producto
   * @returns {Product} Instancia actualizada
   */
  update(data) {
    if (data.name) this.name = data.name;
    if (data.description) this.description = data.description;
    if (data.price !== undefined) this.price = data.price;
    if (data.category) this.category = data.category;
    if (data.tags) this.tags = data.tags;
    if (data.stock !== undefined) this.stock = data.stock;
    if (data.images) this.images = data.images;
    if (data.featured !== undefined) this.featured = data.featured;
    if (data.active !== undefined) this.active = data.active;
    
    this.updatedAt = new Date();
    return this;
  }

  /**
   * Actualiza la calificación del producto
   * @param {Number} newRating Nueva calificación (1-5)
   * @returns {Product} Instancia actualizada
   */
  addRating(newRating) {
    if (newRating < 1 || newRating > 5) {
      throw new Error('La calificación debe estar entre 1 y 5');
    }
    
    const currentTotal = this.rating.average * this.rating.count;
    this.rating.count += 1;
    this.rating.average = (currentTotal + newRating) / this.rating.count;
    
    return this;
  }

  /**
   * Reduce el stock del producto
   * @param {Number} quantity Cantidad a reducir
   * @returns {Product} Instancia actualizada
   */
  reduceStock(quantity) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error('La cantidad debe ser un número entero positivo');
    }
    
    if (this.stock < quantity) {
      throw new Error('Stock insuficiente');
    }
    
    this.stock -= quantity;
    return this;
  }
}

module.exports = Product;