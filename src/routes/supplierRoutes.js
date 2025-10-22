const express = require('express');
const router = express.Router();
const {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
} = require('../controllers/supplierController');

/**
 * @route   GET /api/v1/suppliers
 * @desc    Get all suppliers
 * @query   status - Filter by supplier status (active, inactive, suspended)
 */
router.get('/', getAllSuppliers);

/**
 * @route   GET /api/v1/suppliers/:id
 * @desc    Get supplier by ID
 */
router.get('/:id', getSupplierById);

/**
 * @route   POST /api/v1/suppliers
 * @desc    Create new supplier
 */
router.post('/', createSupplier);

/**
 * @route   PUT /api/v1/suppliers/:id
 * @desc    Update supplier
 */
router.put('/:id', updateSupplier);

/**
 * @route   DELETE /api/v1/suppliers/:id
 * @desc    Delete supplier
 */
router.delete('/:id', deleteSupplier);

module.exports = router;

