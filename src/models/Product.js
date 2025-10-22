const { v4: uuidv4 } = require('uuid');

class Product {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.name = data.name;
    this.sku = data.sku;
    this.description = data.description || null;
    this.category = data.category || null;
    this.price = data.price || 0;
    this.currency = data.currency || 'USD';
    this.stockQuantity = data.stockQuantity || 0;
    this.supplierId = data.supplierId || null;
    this.status = data.status || 'available'; // available, out_of_stock, discontinued
    this.specifications = data.specifications || {};
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  update(data) {
    if (data.name !== undefined) this.name = data.name;
    if (data.sku !== undefined) this.sku = data.sku;
    if (data.description !== undefined) this.description = data.description;
    if (data.category !== undefined) this.category = data.category;
    if (data.price !== undefined) this.price = data.price;
    if (data.currency !== undefined) this.currency = data.currency;
    if (data.stockQuantity !== undefined) this.stockQuantity = data.stockQuantity;
    if (data.supplierId !== undefined) this.supplierId = data.supplierId;
    if (data.status !== undefined) this.status = data.status;
    if (data.specifications !== undefined) this.specifications = data.specifications;
    this.updatedAt = new Date().toISOString();
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      sku: this.sku,
      description: this.description,
      category: this.category,
      price: this.price,
      currency: this.currency,
      stockQuantity: this.stockQuantity,
      supplierId: this.supplierId,
      status: this.status,
      specifications: this.specifications,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Product;

