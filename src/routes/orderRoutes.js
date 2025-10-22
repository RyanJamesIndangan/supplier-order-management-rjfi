const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderController');

/**
 * @route   GET /api/v1/orders
 * @desc    Get all orders
 * @query   supplierId - Filter by supplier ID
 * @query   status - Filter by status
 */
router.get('/', getAllOrders);

/**
 * @route   GET /api/v1/orders/:id
 * @desc    Get order by ID
 */
router.get('/:id', getOrderById);

/**
 * @route   POST /api/v1/orders
 * @desc    Create new order
 */
router.post('/', createOrder);

/**
 * @route   PUT /api/v1/orders/:id
 * @desc    Update order
 */
router.put('/:id', updateOrder);

/**
 * @route   PATCH /api/v1/orders/:id/status
 * @desc    Update order status
 */
router.patch('/:id/status', updateOrderStatus);

/**
 * @route   DELETE /api/v1/orders/:id
 * @desc    Delete order
 */
router.delete('/:id', deleteOrder);

module.exports = router;

