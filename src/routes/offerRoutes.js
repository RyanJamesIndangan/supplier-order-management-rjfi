const express = require('express');
const router = express.Router();
const {
  getAllOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
  searchOffers
} = require('../controllers/offerController');

/**
 * @route   GET /api/v1/offers/search
 * @desc    Search/match supplier offers
 * @query   query - Search term
 * @query   minPrice - Minimum price
 * @query   maxPrice - Maximum price
 * @query   availability - Filter by availability
 */
router.get('/search', searchOffers);

/**
 * @route   GET /api/v1/offers
 * @desc    Get all supplier offers
 * @query   supplierId - Filter by supplier ID
 * @query   productId - Filter by product ID
 * @query   availability - Filter by availability
 */
router.get('/', getAllOffers);

/**
 * @route   GET /api/v1/offers/:id
 * @desc    Get supplier offer by ID
 */
router.get('/:id', getOfferById);

/**
 * @route   POST /api/v1/offers
 * @desc    Create new supplier offer
 */
router.post('/', createOffer);

/**
 * @route   PUT /api/v1/offers/:id
 * @desc    Update supplier offer
 */
router.put('/:id', updateOffer);

/**
 * @route   DELETE /api/v1/offers/:id
 * @desc    Delete supplier offer
 */
router.delete('/:id', deleteOffer);

module.exports = router;

