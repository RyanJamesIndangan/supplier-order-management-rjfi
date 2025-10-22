const Order = require('../models/Order');
const dataStore = require('../services/dataStore');
const { ApiError } = require('../middlewares/errorHandler');

/**
 * Get all orders
 */
const getAllOrders = async (req, res, next) => {
  try {
    const { supplierId, status } = req.query;
    let orders = dataStore.getAll('orders');

    if (supplierId) {
      orders = orders.filter(o => o.supplierId === supplierId);
    }

    if (status) {
      orders = orders.filter(o => o.status === status);
    }

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get order by ID
 */
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = dataStore.getById('orders', id);

    if (!order) {
      throw new ApiError(404, `Order with ID ${id} not found`);
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new order
 */
const createOrder = async (req, res, next) => {
  try {
    const { supplierId, items } = req.body;

    // Validate supplier exists
    const supplier = dataStore.getById('suppliers', supplierId);
    if (!supplier) {
      throw new ApiError(400, `Supplier with ID ${supplierId} not found`);
    }

    // Validate all products exist and have sufficient stock
    if (!items || items.length === 0) {
      throw new ApiError(400, 'Order must contain at least one item');
    }

    for (const item of items) {
      const product = dataStore.getById('products', item.productId);
      
      if (!product) {
        throw new ApiError(400, `Product with ID ${item.productId} not found`);
      }

      if (product.stockQuantity < item.quantity) {
        throw new ApiError(400, 
          `Insufficient stock for product ${product.name}. Available: ${product.stockQuantity}, Requested: ${item.quantity}`
        );
      }

      // Set unit price from product if not provided
      if (!item.unitPrice) {
        item.unitPrice = product.price;
      }
    }

    const order = new Order(req.body);
    const created = dataStore.create('orders', order.toJSON());

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: created
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update order
 */
const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = dataStore.getById('orders', id);

    if (!existing) {
      throw new ApiError(404, `Order with ID ${id} not found`);
    }

    // Validate supplier if being updated
    if (req.body.supplierId && req.body.supplierId !== existing.supplierId) {
      const supplier = dataStore.getById('suppliers', req.body.supplierId);
      if (!supplier) {
        throw new ApiError(400, `Supplier with ID ${req.body.supplierId} not found`);
      }
    }

    const order = new Order(existing);
    order.update(req.body);
    const updated = dataStore.update('orders', id, order.toJSON());

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update order status
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      throw new ApiError(400, 'Status is required');
    }

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const existing = dataStore.getById('orders', id);
    if (!existing) {
      throw new ApiError(404, `Order with ID ${id} not found`);
    }

    const order = new Order(existing);
    order.update({ status });
    const updated = dataStore.update('orders', id, order.toJSON());

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete order
 */
const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = dataStore.getById('orders', id);

    if (!existing) {
      throw new ApiError(404, `Order with ID ${id} not found`);
    }

    // Only allow deletion of pending or cancelled orders
    if (!['pending', 'cancelled'].includes(existing.status)) {
      throw new ApiError(400, 'Only pending or cancelled orders can be deleted');
    }

    dataStore.delete('orders', id);

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder
};

