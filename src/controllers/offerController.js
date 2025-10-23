const prisma = require('../config/database');
const { ApiError } = require('../middlewares/errorHandler');

/**
 * Get all supplier offers
 */
const getAllOffers = async (req, res, next) => {
  try {
    const { supplierId, productId, availability } = req.query;

    const where = {};
    if (supplierId) where.supplierId = supplierId;
    if (productId) where.productId = productId;
    if (availability) where.availability = availability;

    const offers = await prisma.supplierOffer.findMany({
      where,
      include: {
        supplier: true,
        product: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get offer by ID
 */
const getOfferById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const offer = await prisma.supplierOffer.findUnique({
      where: { id },
      include: {
        supplier: true,
        product: true
      }
    });

    if (!offer) {
      throw new ApiError(404, `Supplier offer with ID ${id} not found`);
    }

    res.status(200).json({
      success: true,
      data: offer
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new supplier offer
 */
const createOffer = async (req, res, next) => {
  try {
    const { supplierId, productId, offerName, price, currency, availability } = req.body;

    // Validate supplier exists
    const supplier = await prisma.supplier.findUnique({
      where: { id: supplierId }
    });

    if (!supplier) {
      throw new ApiError(400, `Supplier with ID ${supplierId} not found`);
    }

    // Validate product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new ApiError(400, `Product with ID ${productId} not found`);
    }

    const offer = await prisma.supplierOffer.create({
      data: {
        supplierId,
        productId,
        offerName,
        price,
        currency: currency || 'USD',
        availability: availability || 'available'
      },
      include: {
        supplier: true,
        product: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Supplier offer created successfully',
      data: offer
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update supplier offer
 */
const updateOffer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { offerName, price, currency, availability } = req.body;

    const existingOffer = await prisma.supplierOffer.findUnique({
      where: { id }
    });

    if (!existingOffer) {
      throw new ApiError(404, `Supplier offer with ID ${id} not found`);
    }

    const updateData = {};
    if (offerName !== undefined) updateData.offerName = offerName;
    if (price !== undefined) updateData.price = price;
    if (currency !== undefined) updateData.currency = currency;
    if (availability !== undefined) updateData.availability = availability;

    const offer = await prisma.supplierOffer.update({
      where: { id },
      data: updateData,
      include: {
        supplier: true,
        product: true
      }
    });

    res.status(200).json({
      success: true,
      message: 'Supplier offer updated successfully',
      data: offer
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete supplier offer
 */
const deleteOffer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const offer = await prisma.supplierOffer.findUnique({
      where: { id }
    });

    if (!offer) {
      throw new ApiError(404, `Supplier offer with ID ${id} not found`);
    }

    await prisma.supplierOffer.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Supplier offer deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search/match offers by criteria
 */
const searchOffers = async (req, res, next) => {
  try {
    const { query, minPrice, maxPrice, availability } = req.query;

    const where = {
      AND: []
    };

    if (query) {
      where.AND.push({
        OR: [
          { offerName: { contains: query, mode: 'insensitive' } },
          { product: { name: { contains: query, mode: 'insensitive' } } },
          { supplier: { name: { contains: query, mode: 'insensitive' } } }
        ]
      });
    }

    if (minPrice !== undefined) {
      where.AND.push({ price: { gte: parseFloat(minPrice) } });
    }

    if (maxPrice !== undefined) {
      where.AND.push({ price: { lte: parseFloat(maxPrice) } });
    }

    if (availability) {
      where.AND.push({ availability });
    }

    const offers = await prisma.supplierOffer.findMany({
      where: where.AND.length > 0 ? where : {},
      include: {
        supplier: true,
        product: true
      },
      orderBy: {
        price: 'asc'
      }
    });

    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
  searchOffers
};

