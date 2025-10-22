const Supplier = require('../models/Supplier');
const dataStore = require('../services/dataStore');
const { ApiError } = require('../middlewares/errorHandler');

/**
 * Get all suppliers
 */
const getAllSuppliers = async (req, res, next) => {
  try {
    const { status } = req.query;
    let suppliers = dataStore.getAll('suppliers');

    if (status) {
      suppliers = suppliers.filter(s => s.status === status);
    }

    res.status(200).json({
      success: true,
      count: suppliers.length,
      data: suppliers
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get supplier by ID
 */
const getSupplierById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const supplier = dataStore.getById('suppliers', id);

    if (!supplier) {
      throw new ApiError(404, `Supplier with ID ${id} not found`);
    }

    res.status(200).json({
      success: true,
      data: supplier
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new supplier
 */
const createSupplier = async (req, res, next) => {
  try {
    const supplier = new Supplier(req.body);
    const created = dataStore.create('suppliers', supplier.toJSON());

    res.status(201).json({
      success: true,
      message: 'Supplier created successfully',
      data: created
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update supplier
 */
const updateSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = dataStore.getById('suppliers', id);

    if (!existing) {
      throw new ApiError(404, `Supplier with ID ${id} not found`);
    }

    const supplier = new Supplier(existing);
    supplier.update(req.body);
    const updated = dataStore.update('suppliers', id, supplier.toJSON());

    res.status(200).json({
      success: true,
      message: 'Supplier updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete supplier
 */
const deleteSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = dataStore.getById('suppliers', id);

    if (!existing) {
      throw new ApiError(404, `Supplier with ID ${id} not found`);
    }

    // Check if supplier has associated products
    const products = dataStore.findBy('products', p => p.supplierId === id);
    if (products.length > 0) {
      throw new ApiError(400, `Cannot delete supplier with ${products.length} associated products`);
    }

    dataStore.delete('suppliers', id);

    res.status(200).json({
      success: true,
      message: 'Supplier deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
};

