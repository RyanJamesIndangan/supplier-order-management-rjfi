const prisma = require('../config/database');

/**
 * Get all supplier offers grouped by product
 */
const getOffersByProduct = async (req, res, next) => {
  try {
    // Get all products with their supplier offers
    const products = await prisma.product.findMany({
      include: {
        offers: {
          // Include all statuses: pending, accepted, rejected
          include: {
            supplier: true,
            sourceFile: {
              select: {
                originalName: true,
                createdAt: true
              }
            }
          },
          orderBy: {
            price: 'asc' // Show cheapest first
          }
        },
        _count: {
          select: {
            offers: true
          }
        }
      },
      where: {
        offers: {
          some: {} // Only products that have offers
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
 * Get supplier offers for a specific product
 */
const getOffersForProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        offers: {
          include: {
            supplier: true,
            sourceFile: {
              select: {
                originalName: true,
                createdAt: true
              }
            }
          },
          orderBy: {
            price: 'asc'
          }
        }
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
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
 * Accept a supplier offer
 */
const acceptOffer = async (req, res, next) => {
  try {
    const { offerId } = req.params;

    const offer = await prisma.supplierOffer.update({
      where: { id: offerId },
      data: { status: 'accepted' },
      include: {
        product: true,
        supplier: true
      }
    });

    res.status(200).json({
      success: true,
      message: 'Offer accepted successfully',
      data: offer
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reject a supplier offer
 */
const rejectOffer = async (req, res, next) => {
  try {
    const { offerId } = req.params;

    const offer = await prisma.supplierOffer.update({
      where: { id: offerId },
      data: { status: 'rejected' },
      include: {
        product: true,
        supplier: true
      }
    });

    res.status(200).json({
      success: true,
      message: 'Offer rejected successfully',
      data: offer
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get dashboard statistics for procurement
 */
const getProcurementDashboard = async (req, res, next) => {
  try {
    const [
      totalProducts,
      productsWithOffers,
      pendingOffers,
      acceptedOffers,
      rejectedOffers,
      autoCreatedProducts,
      totalSuppliers
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({
        where: {
          offers: {
            some: {}
          }
        }
      }),
      prisma.supplierOffer.count({
        where: { status: 'pending' }
      }),
      prisma.supplierOffer.count({
        where: { status: 'accepted' }
      }),
      prisma.supplierOffer.count({
        where: { status: 'rejected' }
      }),
      prisma.product.count({
        where: { autoCreated: true }
      }),
      prisma.supplier.count()
    ]);

    res.status(200).json({
      success: true,
      data: {
        products: {
          total: totalProducts,
          withOffers: productsWithOffers,
          autoCreated: autoCreatedProducts
        },
        offers: {
          pending: pendingOffers,
          accepted: acceptedOffers,
          rejected: rejectedOffers,
          total: pendingOffers + acceptedOffers + rejectedOffers
        },
        suppliers: {
          total: totalSuppliers
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOffersByProduct,
  getOffersForProduct,
  acceptOffer,
  rejectOffer,
  getProcurementDashboard
};

