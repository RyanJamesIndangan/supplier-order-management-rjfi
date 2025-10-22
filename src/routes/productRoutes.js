const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
} = require('../controllers/productController');

/**
 * @route   GET /api/v1/products/search
 * @desc    Search/match products
 * @query   query - Search term
 * @query   minPrice - Minimum price
 * @query   maxPrice - Maximum price
 */
router.get('/search', searchProducts);

/**
 * @route   GET /api/v1/products
 * @desc    Get all products
 * @query   supplierId - Filter by supplier ID
 * @query   category - Filter by category
 * @query   status - Filter by status
 */
router.get('/', getAllProducts);

/**
 * @route   GET /api/v1/products/:id
 * @desc    Get product by ID
 */
router.get('/:id', getProductById);

/**
 * @route   POST /api/v1/products
 * @desc    Create new product
 */
router.post('/', createProduct);

/**
 * @route   PUT /api/v1/products/:id
 * @desc    Update product
 */
router.put('/:id', updateProduct);

/**
 * @route   DELETE /api/v1/products/:id
 * @desc    Delete product
 */
router.delete('/:id', deleteProduct);

module.exports = router;

