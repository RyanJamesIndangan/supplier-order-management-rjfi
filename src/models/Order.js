const { v4: uuidv4 } = require('uuid');

class Order {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.orderNumber = data.orderNumber || this.generateOrderNumber();
    this.supplierId = data.supplierId;
    this.items = data.items || []; // Array of { productId, quantity, unitPrice }
    this.status = data.status || 'pending'; // pending, confirmed, shipped, delivered, cancelled
    this.totalAmount = data.totalAmount || this.calculateTotal();
    this.currency = data.currency || 'USD';
    this.deliveryAddress = data.deliveryAddress || null;
    this.expectedDeliveryDate = data.expectedDeliveryDate || null;
    this.notes = data.notes || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  generateOrderNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
  }

  calculateTotal() {
    return this.items.reduce((total, item) => {
      return total + (item.quantity * item.unitPrice);
    }, 0);
  }

  update(data) {
    if (data.supplierId !== undefined) this.supplierId = data.supplierId;
    if (data.items !== undefined) {
      this.items = data.items;
      this.totalAmount = this.calculateTotal();
    }
    if (data.status !== undefined) this.status = data.status;
    if (data.currency !== undefined) this.currency = data.currency;
    if (data.deliveryAddress !== undefined) this.deliveryAddress = data.deliveryAddress;
    if (data.expectedDeliveryDate !== undefined) this.expectedDeliveryDate = data.expectedDeliveryDate;
    if (data.notes !== undefined) this.notes = data.notes;
    this.updatedAt = new Date().toISOString();
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      orderNumber: this.orderNumber,
      supplierId: this.supplierId,
      items: this.items,
      status: this.status,
      totalAmount: this.totalAmount,
      currency: this.currency,
      deliveryAddress: this.deliveryAddress,
      expectedDeliveryDate: this.expectedDeliveryDate,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Order;

