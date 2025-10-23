const prisma = require('../config/database');
const { ApiError } = require('../middlewares/errorHandler');

/**
 * Get all suppliers
 */
const getAllSuppliers = async (req, res, next) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      include: {
        offers: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

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
    
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        offers: {
          include: {
            product: true
          }
        }
      }
    });

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
    const { name, contactInfo } = req.body;

    const supplier = await prisma.supplier.create({
      data: {
        name,
        contactInfo: contactInfo || {}
      }
    });

    res.status(201).json({
      success: true,
      message: 'Supplier created successfully',
      data: supplier
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
    const { name, contactInfo } = req.body;

    const existingSupplier = await prisma.supplier.findUnique({
      where: { id }
    });

    if (!existingSupplier) {
      throw new ApiError(404, `Supplier with ID ${id} not found`);
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (contactInfo !== undefined) updateData.contactInfo = contactInfo;

    const supplier = await prisma.supplier.update({
      where: { id },
      data: updateData,
      include: {
        offers: true
      }
    });

    res.status(200).json({
      success: true,
      message: 'Supplier updated successfully',
      data: supplier
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

    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        offers: true
      }
    });

    if (!supplier) {
      throw new ApiError(404, `Supplier with ID ${id} not found`);
    }

    // Delete supplier (cascade will handle offers)
    await prisma.supplier.delete({
      where: { id }
    });

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
