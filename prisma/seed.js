const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.supplierOffer.deleteMany();
  await prisma.product.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Existing data cleared\n');

  // Create Demo User
  console.log('👤 Creating demo user...');
  const hashedPassword = await bcrypt.hash('test123', 10);
  const demoUser = await prisma.user.create({
    data: {
      email: 'ryan@test.com',
      password: hashedPassword,
      name: 'Ryan Test',
      role: 'user'
    }
  });
  console.log(`✅ Created demo user: ${demoUser.email}\n`);

  // Create Products
  console.log('📦 Creating products...');
  const product1 = await prisma.product.create({
    data: {
      name: 'Wireless Mouse',
      sku: 'WM-2024-001',
      category: 'Electronics',
      specs: {
        color: 'Black',
        connectivity: 'Wireless',
        battery: '2x AA',
        dpi: '1600',
        buttons: 5
      }
    }
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'USB-C Hub',
      sku: 'HUB-2024-002',
      category: 'Electronics',
      specs: {
        ports: 7,
        hdmiSupport: '4K@60Hz',
        powerDelivery: '100W',
        ethernet: true
      }
    }
  });

  const product3 = await prisma.product.create({
    data: {
      name: 'Mechanical Keyboard',
      sku: 'KB-2024-003',
      category: 'Electronics',
      specs: {
        switchType: 'Cherry MX Blue',
        backlight: 'RGB',
        layout: 'Full-size',
        wired: true
      }
    }
  });

  const product4 = await prisma.product.create({
    data: {
      name: 'Laptop Stand',
      sku: 'LS-2024-004',
      category: 'Accessories',
      specs: {
        material: 'Aluminum',
        adjustable: true,
        maxWeight: '5kg',
        color: 'Silver'
      }
    }
  });

  console.log(`✅ Created ${4} products\n`);

  // Create Suppliers
  console.log('🏢 Creating suppliers...');
  const supplier1 = await prisma.supplier.create({
    data: {
      name: 'Tech Supplies Inc.',
      contactInfo: {
        email: 'contact@techsupplies.com',
        phone: '+1-555-0100',
        address: '123 Tech Street, Silicon Valley, CA 94025',
        website: 'www.techsupplies.com',
        rating: 4.5
      }
    }
  });

  const supplier2 = await prisma.supplier.create({
    data: {
      name: 'Office Essentials Ltd.',
      contactInfo: {
        email: 'sales@officeessentials.com',
        phone: '+1-555-0200',
        address: '456 Business Ave, New York, NY 10001',
        website: 'www.officeessentials.com',
        rating: 4.2
      }
    }
  });

  const supplier3 = await prisma.supplier.create({
    data: {
      name: 'Global Electronics Co.',
      contactInfo: {
        email: 'info@globalelectronics.com',
        phone: '+1-555-0300',
        address: '789 Commerce Blvd, Los Angeles, CA 90001',
        website: 'www.globalelectronics.com',
        rating: 4.7
      }
    }
  });

  console.log(`✅ Created ${3} suppliers\n`);

  // Create Supplier Offers
  console.log('💰 Creating supplier offers...');
  
  const offers = [
    // Tech Supplies Inc. offers
    {
      supplierId: supplier1.id,
      productId: product1.id,
      offerName: 'Wireless Mouse - Premium Package',
      price: 29.99,
      currency: 'USD'
    },
    {
      supplierId: supplier1.id,
      productId: product2.id,
      offerName: 'USB-C Hub - Professional Series',
      price: 49.99,
      currency: 'USD'
    },
    {
      supplierId: supplier1.id,
      productId: product3.id,
      offerName: 'Mechanical Keyboard - Gaming Edition',
      price: 89.99,
      currency: 'USD'
    },
    
    // Office Essentials Ltd. offers
    {
      supplierId: supplier2.id,
      productId: product1.id,
      offerName: 'Wireless Mouse - Office Bundle',
      price: 27.50,
      currency: 'USD'
    },
    {
      supplierId: supplier2.id,
      productId: product4.id,
      offerName: 'Laptop Stand - Ergonomic Design',
      price: 39.99,
      currency: 'USD'
    },
    
    // Global Electronics Co. offers
    {
      supplierId: supplier3.id,
      productId: product2.id,
      offerName: 'USB-C Hub - Enterprise Solution',
      price: 54.99,
      currency: 'USD'
    },
    {
      supplierId: supplier3.id,
      productId: product3.id,
      offerName: 'Mechanical Keyboard - Pro Developer',
      price: 95.00,
      currency: 'USD'
    },
    {
      supplierId: supplier3.id,
      productId: product4.id,
      offerName: 'Laptop Stand - Premium Aluminum',
      price: 45.00,
      currency: 'USD'
    }
  ];

  for (const offer of offers) {
    await prisma.supplierOffer.create({ data: offer });
  }

  console.log(`✅ Created ${offers.length} supplier offers\n`);

  console.log('🎉 Database seeding completed successfully!\n');
  console.log('📊 Summary:');
  console.log(`   - Users: 1 (ryan@test.com / test123)`);
  console.log(`   - Products: ${4}`);
  console.log(`   - Suppliers: ${3}`);
  console.log(`   - Supplier Offers: ${offers.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

