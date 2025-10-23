const prisma = require('../config/database');
const { ApiError } = require('../middlewares/errorHandler');

/**
 * Get all products
 */
const getAllProducts = async (req, res, next) => {
  try {
    const { category, sku } = req.query;
    
    const where = {};
    if (category) where.category = category;
    if (sku) where.sku = sku;

    const products = await prisma.product.findMany({
      where,
      include: {
        offers: {
          include: {
            supplier: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get product by ID
 */
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        offers: {
          include: {
            supplier: true
          }
        }
      }
    });

    if (!product) {
      throw new ApiError(404, `Product with ID ${id} not found`);
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new product
 */
const createProduct = async (req, res, next) => {
  try {
    const { name, sku, category, specs } = req.body;

    // Check if SKU already exists
    const existingProduct = await prisma.product.findUnique({
      where: { sku }
    });

    if (existingProduct) {
      throw new ApiError(400, `Product with SKU ${sku} already exists`);
    }

    const product = await prisma.product.create({
      data: {
        name,
        sku,
        category,
        specs: specs || {}
      }
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update product
 */
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, sku, category, specs } = req.body;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      throw new ApiError(404, `Product with ID ${id} not found`);
    }

    // If SKU is being updated, check if new SKU already exists
    if (sku && sku !== existingProduct.sku) {
      const skuExists = await prisma.product.findUnique({
        where: { sku }
      });
      
      if (skuExists) {
        throw new ApiError(400, `Product with SKU ${sku} already exists`);
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (sku !== undefined) updateData.sku = sku;
    if (category !== undefined) updateData.category = category;
    if (specs !== undefined) updateData.specs = specs;

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        offers: true
      }
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete product
 */
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        offers: true
      }
    });

    if (!product) {
      throw new ApiError(404, `Product with ID ${id} not found`);
    }

    // Delete product (cascade will handle offers)
    await prisma.product.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search products
 */
const searchProducts = async (req, res, next) => {
  try {
    const { query, category } = req.query;

    const where = {
      AND: []
    };

    if (query) {
      where.AND.push({
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { sku: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } }
        ]
      });
    }

    if (category) {
      where.AND.push({ category });
    }

    const products = await prisma.product.findMany({
      where: where.AND.length > 0 ? where : {},
      include: {
        offers: {
          include: {
            supplier: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
};
