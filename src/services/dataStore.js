/**
 * In-memory data store for demo purposes
 * In production, this would be replaced with a proper database
 */

class DataStore {
  constructor() {
    this.suppliers = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.initializeSampleData();
  }

  initializeSampleData() {
    // Add sample suppliers
    const supplier1 = {
      id: 'sup-001',
      name: 'Tech Supplies Inc.',
      email: 'contact@techsupplies.com',
      phone: '+1-555-0100',
      address: '123 Tech Street, Silicon Valley, CA 94025',
      rating: 4.5,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const supplier2 = {
      id: 'sup-002',
      name: 'Office Essentials Ltd.',
      email: 'sales@officeessentials.com',
      phone: '+1-555-0200',
      address: '456 Business Ave, New York, NY 10001',
      rating: 4.2,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.suppliers.set(supplier1.id, supplier1);
    this.suppliers.set(supplier2.id, supplier2);

    // Add sample products
    const product1 = {
      id: 'prod-001',
      name: 'Wireless Mouse',
      sku: 'WM-2024-001',
      description: 'Ergonomic wireless mouse with USB receiver',
      category: 'Electronics',
      price: 29.99,
      currency: 'USD',
      stockQuantity: 150,
      supplierId: 'sup-001',
      status: 'available',
      specifications: {
        color: 'Black',
        connectivity: 'Wireless',
        battery: '2x AA'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const product2 = {
      id: 'prod-002',
      name: 'USB-C Hub',
      sku: 'HUB-2024-002',
      description: '7-in-1 USB-C Hub with HDMI and Ethernet',
      category: 'Electronics',
      price: 49.99,
      currency: 'USD',
      stockQuantity: 75,
      supplierId: 'sup-001',
      status: 'available',
      specifications: {
        ports: '7',
        hdmiSupport: '4K@60Hz',
        powerDelivery: '100W'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.products.set(product1.id, product1);
    this.products.set(product2.id, product2);
  }

  // Generic CRUD operations
  getAll(collection) {
    return Array.from(this[collection].values());
  }

  getById(collection, id) {
    return this[collection].get(id);
  }

  create(collection, data) {
    this[collection].set(data.id, data);
    return data;
  }

  update(collection, id, data) {
    if (!this[collection].has(id)) {
      return null;
    }
    this[collection].set(id, data);
    return data;
  }

  delete(collection, id) {
    return this[collection].delete(id);
  }

  // Query operations
  findBy(collection, predicate) {
    return Array.from(this[collection].values()).filter(predicate);
  }

  // Clear all data
  clear() {
    this.suppliers.clear();
    this.products.clear();
    this.orders.clear();
  }

  // Reset to sample data
  reset() {
    this.clear();
    this.initializeSampleData();
  }
}

// Singleton instance
const dataStore = new DataStore();

module.exports = dataStore;

