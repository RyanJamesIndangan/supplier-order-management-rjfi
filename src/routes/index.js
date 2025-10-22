const express = require('express');
const router = express.Router();

const supplierRoutes = require('./supplierRoutes');
const productRoutes = require('./productRoutes');
const orderRoutes = require('./orderRoutes');

// Mount routes
router.use('/suppliers', supplierRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Supplier Order Management API',
    version: '1.0.0',
    endpoints: {
      suppliers: '/api/v1/suppliers',
      products: '/api/v1/products',
      orders: '/api/v1/orders'
    },
    documentation: {
      health: 'GET /health',
      suppliers: {
        getAll: 'GET /api/v1/suppliers',
        getById: 'GET /api/v1/suppliers/:id',
        create: 'POST /api/v1/suppliers',
        update: 'PUT /api/v1/suppliers/:id',
        delete: 'DELETE /api/v1/suppliers/:id'
      },
      products: {
        getAll: 'GET /api/v1/products',
        getById: 'GET /api/v1/products/:id',
        search: 'GET /api/v1/products/search',
        create: 'POST /api/v1/products',
        update: 'PUT /api/v1/products/:id',
        delete: 'DELETE /api/v1/products/:id'
      },
      orders: {
        getAll: 'GET /api/v1/orders',
        getById: 'GET /api/v1/orders/:id',
        create: 'POST /api/v1/orders',
        update: 'PUT /api/v1/orders/:id',
        updateStatus: 'PATCH /api/v1/orders/:id/status',
        delete: 'DELETE /api/v1/orders/:id'
      }
    }
  });
});

module.exports = router;

