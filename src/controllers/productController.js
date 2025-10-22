const Product = require('../models/Product');
const dataStore = require('../services/dataStore');
const { ApiError } = require('../middlewares/errorHandler');

/**
 * Get all products
 */
const getAllProducts = async (req, res, next) => {
  try {
    const { supplierId, category, status } = req.query;
    let products = dataStore.getAll('products');

    if (supplierId) {
      products = products.filter(p => p.supplierId === supplierId);
    }

    if (category) {
      products = products.filter(p => p.category === category);
    }

    if (status) {
      products = products.filter(p => p.status === status);
    }

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get product by ID
 */
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = dataStore.getById('products', id);

    if (!product) {
      throw new ApiError(404, `Product with ID ${id} not found`);
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new product
 */
const createProduct = async (req, res, next) => {
  try {
    // Validate supplier exists if supplierId is provided
    if (req.body.supplierId) {
      const supplier = dataStore.getById('suppliers', req.body.supplierId);
      if (!supplier) {
        throw new ApiError(400, `Supplier with ID ${req.body.supplierId} not found`);
      }
    }

    const product = new Product(req.body);
    const created = dataStore.create('products', product.toJSON());

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: created
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update product
 */
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = dataStore.getById('products', id);

    if (!existing) {
      throw new ApiError(404, `Product with ID ${id} not found`);
    }

    // Validate supplier exists if supplierId is being updated
    if (req.body.supplierId && req.body.supplierId !== existing.supplierId) {
      const supplier = dataStore.getById('suppliers', req.body.supplierId);
      if (!supplier) {
        throw new ApiError(400, `Supplier with ID ${req.body.supplierId} not found`);
      }
    }

    const product = new Product(existing);
    product.update(req.body);
    const updated = dataStore.update('products', id, product.toJSON());

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete product
 */
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = dataStore.getById('products', id);

    if (!existing) {
      throw new ApiError(404, `Product with ID ${id} not found`);
    }

    dataStore.delete('products', id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search/match products
 */
const searchProducts = async (req, res, next) => {
  try {
    const { query, minPrice, maxPrice } = req.query;
    let products = dataStore.getAll('products');

    if (query) {
      const searchTerm = query.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description?.toLowerCase().includes(searchTerm) ||
        p.sku.toLowerCase().includes(searchTerm)
      );
    }

    if (minPrice !== undefined) {
      products = products.filter(p => p.price >= parseFloat(minPrice));
    }

    if (maxPrice !== undefined) {
      products = products.filter(p => p.price <= parseFloat(maxPrice));
    }

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
};

