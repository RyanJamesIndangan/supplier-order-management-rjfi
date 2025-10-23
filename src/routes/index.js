const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const supplierRoutes = require('./supplierRoutes');
const productRoutes = require('./productRoutes');
const offerRoutes = require('./offerRoutes');
const uploadRoutes = require('./uploadRoutes');
const supplierOfferRoutes = require('./supplierOfferRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/products', productRoutes);
router.use('/offers', offerRoutes);
router.use('/upload', uploadRoutes);
router.use('/supplier-offers', supplierOfferRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI-Powered Supplier Order Management API',
    version: '2.0.0',
    author: 'Ryan James Francisco Indangan',
    database: 'PostgreSQL with Prisma ORM',
    ai: 'Google Gemini API for product matching',
    endpoints: {
      auth: '/api/v1/auth',
      suppliers: '/api/v1/suppliers',
      products: '/api/v1/products',
      offers: '/api/v1/offers',
      upload: '/api/v1/upload',
      dashboard: '/api/v1/upload/dashboard'
    },
    features: [
      '🤖 AI-Powered Product Matching with Google Gemini',
      '📤 File Upload (Excel/CSV) for Supplier Offers',
      '🔐 JWT Authentication',
      '📊 Smart Dashboard & Analytics',
      '✅ Match Review & Approval Workflow',
      '🔍 Semantic Search & Fuzzy Matching'
    ],
    documentation: {
      interactive: 'GET / (Swagger UI)',
      health: 'GET /health',
      auth: {
        register: 'POST /api/v1/auth/register',
        login: 'POST /api/v1/auth/login',
        profile: 'GET /api/v1/auth/profile'
      },
      upload: {
        uploadFile: 'POST /api/v1/upload',
        getFiles: 'GET /api/v1/upload/files',
        getMatches: 'GET /api/v1/upload/files/:fileId/matches',
        updateStatus: 'PUT /api/v1/upload/matches/:matchId/status',
        dashboard: 'GET /api/v1/upload/dashboard'
      },
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
      offers: {
        getAll: 'GET /api/v1/offers',
        getById: 'GET /api/v1/offers/:id',
        search: 'GET /api/v1/offers/search',
        create: 'POST /api/v1/offers',
        update: 'PUT /api/v1/offers/:id',
        delete: 'DELETE /api/v1/offers/:id'
      }
    }
  });
});

module.exports = router;
