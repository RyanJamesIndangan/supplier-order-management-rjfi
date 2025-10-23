const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const {
  getOffersByProduct,
  getOffersForProduct,
  acceptOffer,
  rejectOffer,
  getProcurementDashboard
} = require('../controllers/supplierOfferController');

// All routes require authentication
router.use(authenticate);

// Get procurement dashboard statistics
router.get('/dashboard', getProcurementDashboard);

// Get all offers grouped by product
router.get('/by-product', getOffersByProduct);

// Get offers for a specific product
router.get('/product/:productId', getOffersForProduct);

// Accept an offer
router.put('/:offerId/accept', acceptOffer);

// Reject an offer
router.put('/:offerId/reject', rejectOffer);

module.exports = router;

