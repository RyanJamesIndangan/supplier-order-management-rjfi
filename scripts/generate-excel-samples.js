/**
 * Generate Excel sample files using xlsx library
 * Run: node scripts/generate-excel-samples.js
 */

const xlsx = require('xlsx');
const path = require('path');

function generateExcelFiles() {
  console.log('📊 Generating Excel sample files...\n');

  // Sample 1: Clean Excel file
  const data1 = [
    ['Supplier', 'Product Name', 'SKU', 'Price', 'Currency', 'Description'],
    ['Tech Excel Suppliers', 'Wireless Mouse Premium', 'WM-EXCEL-001', 29.99, 'USD', 'Premium wireless mouse with ergonomic design'],
    ['Tech Excel Suppliers', 'Mechanical Keyboard RGB', 'KB-EXCEL-001', 119.99, 'USD', 'RGB mechanical keyboard with blue switches'],
    ['Tech Excel Suppliers', 'USB Hub 7-Port', 'UH-EXCEL-001', 39.99, 'USD', '7-port powered USB hub with fast charging'],
    ['Tech Excel Suppliers', 'HDMI Cable 4K', 'HDMI-EXCEL-001', 14.99, 'USD', '2m HDMI 2.1 cable 4K 120Hz support'],
    ['Tech Excel Suppliers', 'Wireless Headset', 'WH-EXCEL-001', 79.99, 'USD', 'Noise-cancelling wireless headset']
  ];

  const wb1 = xlsx.utils.book_new();
  const ws1 = xlsx.utils.aoa_to_sheet(data1);
  xlsx.utils.book_append_sheet(wb1, ws1, 'Supplier Offers');
  xlsx.writeFile(wb1, 'sample-data/supplier-offers/tech-excel-suppliers.xlsx');
  console.log('✅ Created: tech-excel-suppliers.xlsx (5 offers - clean data)');

  // Sample 2: Excel with data quality issues
  const data2 = [
    ['Supplier', 'Product Name', 'SKU', 'Price', 'Currency', 'Description'],
    ['Messy Data Inc', 'wireless mouse', '', 19.99, 'USD', 'basic wireless mouse'],
    ['', 'USB CABLE', 'USB-001', 'INVALID', 'USD', null],
    ['Messy Data Inc', '  Keyboard  With  Spaces  ', 'KB SPACE 001', 49.99, '', ''],
    ['WEIRD@SUPPLIER#NAME', 'Mouse Pad', 'MP@#$001', 12.99, 'EUR', 'Large mouse pad with weird characters in supplier name'],
    ['Messy Data Inc', 'UPPERCASE PRODUCT NAME', 'sku-lowercase-001', 0, 'USD', 'Mixed case issues'],
    ['Messy Data Inc', 'Duplicate Product', 'DUP-001', 29.99, 'USD', 'First entry'],
    ['Messy Data Inc', 'Duplicate Product', 'DUP-001', 31.99, 'USD', 'Duplicate entry with different price']
  ];

  const wb2 = xlsx.utils.book_new();
  const ws2 = xlsx.utils.aoa_to_sheet(data2);
  xlsx.utils.book_append_sheet(wb2, ws2, 'Messy Data');
  xlsx.writeFile(wb2, 'sample-data/supplier-offers/messy-data-quality.xlsx');
  console.log('✅ Created: messy-data-quality.xlsx (7 offers - intentional issues)');

  // Sample 3: Excel with multiple sheets (only first will be used)
  const data3Main = [
    ['Supplier', 'Product Name', 'SKU', 'Price', 'Currency', 'Description'],
    ['Multi Sheet Supplier', 'Gaming Mouse RGB', 'GM-RGB-001', 59.99, 'USD', 'High DPI gaming mouse'],
    ['Multi Sheet Supplier', 'Gaming Keyboard', 'GK-MECH-001', 129.99, 'USD', 'Mechanical gaming keyboard'],
    ['Multi Sheet Supplier', 'Gaming Headset', 'GH-SURROUND-001', 99.99, 'USD', '7.1 surround sound gaming headset']
  ];

  const data3Extra = [
    ['This sheet contains extra information'],
    ['Only the first sheet will be processed'],
    ['The parser will ignore this sheet']
  ];

  const wb3 = xlsx.utils.book_new();
  const ws3Main = xlsx.utils.aoa_to_sheet(data3Main);
  const ws3Extra = xlsx.utils.aoa_to_sheet(data3Extra);
  xlsx.utils.book_append_sheet(wb3, ws3Main, 'Main Offers');
  xlsx.utils.book_append_sheet(wb3, ws3Extra, 'Extra Info');
  xlsx.writeFile(wb3, 'sample-data/supplier-offers/multi-sheet-example.xlsx');
  console.log('✅ Created: multi-sheet-example.xlsx (3 offers - multi-sheet test)');

  // Sample 4: Large batch for bulk upload testing
  const data4 = [
    ['Supplier', 'Product Name', 'SKU', 'Price', 'Currency', 'Description']
  ];

  for (let i = 1; i <= 50; i++) {
    data4.push([
      `Bulk Supplier ${(i % 5) + 1}`,
      `Product Item ${i}`,
      `BULK-${String(i).padStart(3, '0')}`,
      +(Math.random() * 100 + 10).toFixed(2),
      i % 3 === 0 ? 'EUR' : 'USD',
      `Bulk product description for item ${i}`
    ]);
  }

  const wb4 = xlsx.utils.book_new();
  const ws4 = xlsx.utils.aoa_to_sheet(data4);
  xlsx.utils.book_append_sheet(wb4, ws4, 'Bulk Offers');
  xlsx.writeFile(wb4, 'sample-data/supplier-offers/bulk-upload-50-items.xlsx');
  console.log('✅ Created: bulk-upload-50-items.xlsx (50 offers - bulk testing)');

  console.log('\n🎉 All Excel files generated successfully!');
  console.log('\n📁 Files created in: sample-data/supplier-offers/');
  console.log('   - tech-excel-suppliers.xlsx (clean data)');
  console.log('   - messy-data-quality.xlsx (data quality issues)');
  console.log('   - multi-sheet-example.xlsx (multiple sheets)');
  console.log('   - bulk-upload-50-items.xlsx (bulk testing)');
}

// Run if called directly
if (require.main === module) {
  try {
    generateExcelFiles();
  } catch (error) {
    console.error('Error generating files:', error);
    process.exit(1);
  }
}

module.exports = { generateExcelFiles };
