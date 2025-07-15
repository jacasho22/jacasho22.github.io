/**
 * Endpoints de Productos
 * Gestiona todas las operaciones relacionadas con productos
 */

const Product = require('../models/product');

// Simulación de base de datos (en una aplicación real, esto sería una BD)
let products = [
  new Product({
    id: '1',
    name: 'Smartphone XYZ',
    description: 'Smartphone de última generación con cámara de alta resolución y batería de larga duración.',
    price: 599.99,
    category: 'electronics',
    tags: ['smartphone', 'tech', 'camera'],
    stock: 50,
    images: ['smartphone1.jpg', 'smartphone2.jpg'],
    featured: true,
    rating: { average: 4.5, count: 120 },
    createdAt: new Date('2023-01-10'),
    active: true
  }),
  new Product({
    id: '2',
    name: 'Laptop Pro',
    description: 'Laptop profesional con procesador de alto rendimiento y pantalla de alta definición.',
    price: 1299.99,
    category: 'electronics',
    tags: ['laptop', 'tech', 'professional'],
    stock: 25,
    images: ['laptop1.jpg', 'laptop2.jpg'],
    featured: true,
    rating: { average: 4.8, count: 85 },
    createdAt: new Date('2023-01-15'),
    active: true
  }),
  new Product({
    id: '3',
    name: 'Auriculares Inalámbricos',
    description: 'Auriculares con cancelación de ruido y conexión Bluetooth.',
    price: 149.99,
    category: 'accessories',
    tags: ['audio', 'wireless', 'headphones'],
    stock: 100,
    images: ['headphones1.jpg', 'headphones2.jpg'],
    featured: false,
    rating: { average: 4.2, count: 65 },
    createdAt: new Date('2023-02-01'),
    active: true
  }),
  new Product({
    id: '4',
    name: 'Smartwatch Fitness',
    description: 'Reloj inteligente con monitoreo de actividad física y notificaciones.',
    price: 199.99,
    category: 'wearables',
    tags: ['watch', 'fitness', 'health'],
    stock: 75,
    images: ['smartwatch1.jpg', 'smartwatch2.jpg'],
    featured: false,
    rating: { average: 4.0, count: 42 },
    createdAt: new Date('2023-02-15'),
    active: true
  })
];

/**
 * Controladores para las rutas de productos
 */
const productsController = {
  /**
   * Obtiene todos los productos
   * @param {Object} req - Objeto de solicitud
   * @param {Object} res - Objeto de respuesta
   */
  getAllProducts: (req, res) => {
    // Implementar filtros
    let filteredProducts = [...products];
    
    // Filtrar por categoría
    if (req.query.category) {
      filteredProducts = filteredProducts.filter(p => 
        p.category === req.query.category
      );
    }
    
    // Filtrar por precio mínimo
    if (req.query.minPrice) {
      const minPrice = parseFloat(req.query.minPrice);
      filteredProducts = filteredProducts.filter(p => p.price >= minPrice);
    }
    
    // Filtrar por precio máximo
    if (req.query.maxPrice) {
      const maxPrice = parseFloat(req.query.maxPrice);
      filteredProducts = filteredProducts.filter(p => p.price <= maxPrice);
    }
    
    // Filtrar por disponibilidad
    if (req.query.inStock === 'true') {
      filteredProducts = filteredProducts.filter(p => p.stock > 0);
    }
    
    // Filtrar por destacados
    if (req.query.featured === 'true') {
      filteredProducts = filteredProducts.filter(p => p.featured);
    }
    
    // Implementar ordenamiento
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price_asc':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'name_asc':
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name_desc':
          filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.rating.average - a.rating.average);
          break;
        default:
          // Por defecto, ordenar por ID
          filteredProducts.sort((a, b) => a.id - b.id);
      }
    }
    
    // Implementar paginación
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const results = {
      products: filteredProducts.slice(startIndex, endIndex),
      pagination: {
        total: filteredProducts.length,
        page,
        limit,
        pages: Math.ceil(filteredProducts.length / limit)
      }
    };
    
    res.status(200).json(results);
  },
  
  /**
   * Obtiene un producto por su ID
   * @param {Object} req - Objeto de solicitud
   * @param {Object} res - Objeto de respuesta
   */
  getProductById: (req, res) => {
    const productId = req.params.id;
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.status(200).json(product);
  },
  
  /**
   * Crea un nuevo producto
   * @param {Object} req - Objeto de solicitud
   * @param {Object} res - Objeto de respuesta
   */
  createProduct: (req, res) => {
    const productData = req.body;
    
    // Generar ID único (en una aplicación real, esto lo haría la BD)
    productData.id = (products.length + 1).toString();
    
    const newProduct = new Product(productData);
    const validation = newProduct.validate();
    
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }
    
    products.push(newProduct);
    res.status(201).json(newProduct);
  },
  
  /**
   * Actualiza un producto existente
   * @param {Object} req - Objeto de solicitud
   * @param {Object} res - Objeto de respuesta
   */
  updateProduct: (req, res) => {
    const productId = req.params.id;
    const productData = req.body;
    
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    // Actualizar producto
    const updatedProduct = products[productIndex].update(productData);
    const validation = updatedProduct.validate();
    
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }
    
    // Actualizar en el array
    products[productIndex] = updatedProduct;
    
    res.status(200).json(updatedProduct);
  },
  
  /**
   * Elimina un producto
   * @param {Object} req - Objeto de solicitud
   * @param {Object} res - Objeto de respuesta
   */
  deleteProduct: (req, res) => {
    const productId = req.params.id;
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    // Eliminar producto (o marcar como inactivo en una aplicación real)
    products = products.filter(p => p.id !== productId);
    
    res.status(204).send();
  },
  
  /**
   * Añade una calificación a un producto
   * @param {Object} req - Objeto de solicitud
   * @param {Object} res - Objeto de respuesta
   */
  rateProduct: (req, res) => {
    const productId = req.params.id;
    const { rating } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'La calificación debe ser un número entre 1 y 5' });
    }
    
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    try {
      const updatedProduct = products[productIndex].addRating(rating);
      products[productIndex] = updatedProduct;
      
      res.status(200).json({ 
        message: 'Calificación añadida correctamente',
        rating: updatedProduct.rating
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = productsController;