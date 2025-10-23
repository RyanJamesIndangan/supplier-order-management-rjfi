const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/config');
const prisma = require('../config/database');

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(config.geminiApiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

/**
 * Match supplier offer to products using AI
 * This is the CORE feature for the assessment - AI-powered semantic matching
 */
async function matchOfferToProduct(offerData) {
  try {
    const { productName, sku, description } = offerData;

    // Get all products from database
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        sku: true,
        category: true,
        specs: true
      }
    });

    if (products.length === 0) {
      return {
        matched: false,
        confidence: 0,
        productId: null,
        reasoning: 'No products in database to match against'
      };
    }

    // Prepare prompt for AI
    const prompt = `
You are an expert product matching system for a supplier order management platform.

TASK: Match the following supplier offer to the most similar product from our catalog. You MUST return the exact Product ID from the list below.

SUPPLIER OFFER:
- Product Name: "${productName}"
- SKU: "${sku || 'Not provided'}"
- Description: "${description || 'Not provided'}"

OUR PRODUCT CATALOG (Copy the exact Product ID):
${products.map((p, idx) => `
${idx + 1}. Product ID: ${p.id}
   Name: ${p.name}
   SKU: ${p.sku}
   Category: ${p.category || 'N/A'}
   Specs: ${JSON.stringify(p.specs || {})}
`).join('\n')}

CRITICAL INSTRUCTIONS:
1. Analyze the supplier offer and compare with EACH product above
2. Find the best semantic match considering:
   - Product name similarity (handle variations like "Wireless Mouse" = "Mouse Wireless")
   - SKU matches or partial matches
   - Product category relevance
3. If you find a match with confidence >= 0.5, YOU MUST copy the EXACT Product ID from the list above
4. The productId MUST be one of the UUIDs listed above, or null if no match
5. Assign confidence from 0.0 to 1.0 based on match quality

RESPOND ONLY IN THIS EXACT JSON FORMAT:
{
  "productId": "copy-exact-UUID-here-or-null",
  "confidence": 0.85,
  "reasoning": "Brief explanation"
}

EXAMPLES:
- Good match (0.8+): productId = exact UUID from list, confidence = 0.85
- Partial match (0.5-0.7): productId = exact UUID from list, confidence = 0.6
- No match (< 0.5): productId = null, confidence = 0.3
`;

    // Call Gemini AI
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up response (remove markdown code blocks if present)
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Parse AI response
    const aiResult = JSON.parse(text);

    // VALIDATION: Ensure productId exists in database if AI returned one
    let validatedProductId = aiResult.productId;
    if (validatedProductId && validatedProductId !== 'null') {
      const productExists = products.find(p => p.id === validatedProductId);
      if (!productExists) {
        console.warn(`AI returned invalid product ID: ${validatedProductId}`);
        // Try to find the best match by name if AI gave wrong ID
        if (aiResult.confidence >= 0.5) {
          const fallback = fallbackMatch(offerData, products);
          validatedProductId = fallback.productId;
          console.log(`Using fallback match: ${validatedProductId}`);
        } else {
          validatedProductId = null;
        }
      }
    } else {
      validatedProductId = null;
    }

    return {
      matched: validatedProductId !== null && aiResult.confidence >= 0.5,
      confidence: aiResult.confidence,
      productId: validatedProductId,
      reasoning: aiResult.reasoning
    };

  } catch (error) {
    console.error('AI Matching Error:', error);
    
    // Fallback to simple string matching if AI fails
    return fallbackMatch(offerData, await prisma.product.findMany());
  }
}

/**
 * Fallback matching algorithm using simple string similarity
 */
function fallbackMatch(offerData, products) {
  const { productName, sku } = offerData;
  
  // Safety check
  if (!productName || !products || products.length === 0) {
    return {
      matched: false,
      confidence: 0,
      productId: null,
      reasoning: 'Insufficient data for matching'
    };
  }
  
  let bestMatch = null;
  let bestScore = 0;

  products.forEach(product => {
    let score = 0;

    // Name similarity (case-insensitive)
    const offerNameLower = productName.toLowerCase();
    const productNameLower = (product.name || '').toLowerCase();
    
    if (offerNameLower === productNameLower) {
      score += 0.8;
    } else if (offerNameLower.includes(productNameLower) || productNameLower.includes(offerNameLower)) {
      score += 0.5;
    } else {
      // Count matching words
      const offerWords = offerNameLower.split(/\s+/);
      const productWords = productNameLower.split(/\s+/);
      const matchingWords = offerWords.filter(w => productWords.includes(w));
      score += (matchingWords.length / Math.max(offerWords.length, productWords.length)) * 0.4;
    }

    // SKU similarity
    if (sku && product.sku) {
      const offerSkuLower = sku.toLowerCase();
      const productSkuLower = product.sku.toLowerCase();
      
      if (offerSkuLower === productSkuLower) {
        score += 0.2;
      } else if (offerSkuLower.includes(productSkuLower) || productSkuLower.includes(offerSkuLower)) {
        score += 0.1;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = product;
    }
  });

  return {
    matched: bestScore >= 0.5,
    confidence: bestScore,
    productId: bestMatch?.id || null,
    reasoning: `Fallback match: ${bestScore >= 0.5 ? 'Found similar product' : 'No good match found'} (score: ${bestScore.toFixed(2)})`
  };
}

/**
 * Batch process multiple offers from uploaded file
 * Complete workflow: Match/Create Product → Create Supplier → Save Actionable Offer
 */
async function processOffersFromFile(fileId, offers, totalRows = offers.length) {
  const results = [];
  const skippedOffers = [];

  for (const offer of offers) {
    try {
      // Handle both camelCase and space-separated column names from CSV
      const productName = (offer['Product Name'] || offer['Product Description'] || offer.productName || offer.product || offer.name || '').trim();
      const sku = offer['SKU'] || offer['Part Number'] || offer.sku || offer.productSKU || offer.partNumber || null;
      const supplierName = (offer['Supplier'] || offer['Vendor'] || offer.supplier || offer.supplierName || offer.vendor || 'Unknown Supplier').trim() || 'Unknown Supplier';
      
      // Handle price parsing with better error handling
      const priceString = offer['Price'] || offer['List Price'] || offer.price || offer.unitPrice || offer.listPrice || '0';
      let price = parseFloat(priceString);
      if (isNaN(price) || price <= 0) {
        const skipReason = `Invalid/missing price: "${priceString}"`;
        console.warn(`Skipping offer with invalid/missing price. Product: "${productName}", Price: "${priceString}"`);
        skippedOffers.push({
          productName: productName || '(Empty)',
          supplierName,
          sku,
          price: priceString,
          reason: skipReason
        });
        continue;
      }
      
      const currency = offer['Currency'] || offer.currency || 'USD';
      const quantity = parseInt(offer['Quantity'] || offer.quantity || 0) || null;
      const description = offer['Description'] || offer['Remarks'] || offer.description || offer.remarks || null;

      // Skip if missing critical data
      if (!productName || productName.length === 0) {
        const skipReason = 'Missing product name';
        console.warn('Skipping offer with missing product name:', offer);
        skippedOffers.push({
          productName: '(Empty)',
          supplierName,
          sku: sku || '(None)',
          price: priceString,
          reason: skipReason
        });
        continue;
      }

      // STEP 1: Try to match existing product
      const matchResult = await matchOfferToProduct({
        productName,
        sku,
        description
      });

      let productId = matchResult.productId;
      let confidence = matchResult.confidence || 0;
      let reasoning = matchResult.reasoning;
      let wasProductCreated = false;

      // STEP 2: Auto-create product if no match found
      if (!productId) {
        console.log(`No match found for "${productName}". Auto-creating new product...`);
        
        const newProduct = await prisma.product.create({
          data: {
            name: productName,
            sku: sku || `AUTO-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`.toUpperCase(),
            category: 'Auto-Generated',
            specs: description ? { description, autoGenerated: true } : { autoGenerated: true },
            autoCreated: true,
            source: 'auto'
          }
        });

        productId = newProduct.id;
        confidence = 1.0; // Perfect match since we created it for this offer
        reasoning = `Auto-created new product from supplier offer. Requires manual review and enrichment.`;
        wasProductCreated = true;
        
        console.log(`✅ Created new product: ${newProduct.name} (${newProduct.sku})`);
      }

      // STEP 3: Create or find supplier
      let supplierRecord = await prisma.supplier.findFirst({
        where: { name: supplierName }
      });

      if (!supplierRecord) {
        supplierRecord = await prisma.supplier.create({
          data: {
            name: supplierName,
            contactInfo: { autoCreated: true, source: 'upload' }
          }
        });
        console.log(`✅ Created new supplier: ${supplierName}`);
      }

      // STEP 4: Determine offer status based on confidence
      let offerStatus = 'pending'; // Default for supplier_offers table
      let matchStatus = 'unmatched'; // For offer_matches table
      let approvalType = null;
      let approvedAt = null;

      if (productId && !wasProductCreated) {
        // Existing product match
        if (confidence >= 0.85) {
          matchStatus = 'approved';
          offerStatus = 'pending'; // Procurement still needs to review
          approvalType = 'auto';
          approvedAt = new Date();
        } else if (confidence >= 0.50) {
          matchStatus = 'pending';
          offerStatus = 'pending';
        } else {
          matchStatus = 'rejected';
          offerStatus = 'pending'; // Still save for review
          approvalType = 'auto';
          approvedAt = new Date();
        }
      } else if (wasProductCreated) {
        // Auto-created product
        matchStatus = 'pending'; // Needs review
        offerStatus = 'pending';
      }

      // STEP 5: Save to supplier_offers (ACTIONABLE TABLE for procurement)
      const supplierOffer = await prisma.supplierOffer.create({
        data: {
          supplierId: supplierRecord.id,
          productId: productId,
          offerName: productName,
          offerSku: sku,
          price: price,
          currency: currency,
          quantity: quantity,
          status: offerStatus,
          sourceFileId: fileId,
          aiConfidence: confidence,
          aiReasoning: reasoning
        },
        include: {
          product: true,
          supplier: true
        }
      });

      // STEP 6: Also save to offer_matches (for tracking/audit)
      const offerMatch = await prisma.offerMatch.create({
        data: {
          fileId,
          supplierName: supplierName,
          offerProductName: productName,
          offerSku: sku,
          offerPrice: price,
          offerCurrency: currency,
          matchedProductId: productId,
          confidenceScore: confidence,
          status: matchStatus,
          aiReasoning: wasProductCreated 
            ? `${reasoning} (New product auto-created)`
            : reasoning,
          approvalType: approvalType,
          approvedAt: approvedAt
        },
        include: {
          matchedProduct: true
        }
      });

      results.push({
        offerMatch,
        supplierOffer,
        productCreated: wasProductCreated
      });

    } catch (error) {
      console.error('Error processing offer:', offer, error);
      results.push({
        error: true,
        offer,
        message: error.message
      });
    }
  }

  // Mark file as processed
  await prisma.uploadedFile.update({
    where: { id: fileId },
    data: { processed: true }
  });

  // Calculate breakdown counts based on whether matched product is seed vs auto-created
  const matchedToExistingCount = results.filter(r => 
    !r.error && r.offerMatch.matchedProduct && !r.offerMatch.matchedProduct.autoCreated
  ).length;
  const newlyCreatedCount = results.filter(r => 
    !r.error && r.offerMatch.matchedProduct && r.offerMatch.matchedProduct.autoCreated
  ).length;

  // Prepare analyzed matches for permanent snapshot
  const analyzedMatches = results
    .filter(r => !r.error)
    .map(r => ({
      supplierName: r.offerMatch.supplierName,
      productName: r.offerMatch.offerProductName,
      sku: r.offerMatch.offerSku,
      price: r.offerMatch.offerPrice.toString(),
      currency: r.offerMatch.offerCurrency,
      matchedProductId: r.offerMatch.matchedProductId,
      matchedProductName: r.offerMatch.matchedProduct?.name,
      confidence: r.offerMatch.confidenceScore?.toString(),
      status: r.offerMatch.status,
      reasoning: r.offerMatch.aiReasoning,
      wasAutoCreated: r.offerMatch.matchedProduct?.autoCreated || false,
      approvalType: r.offerMatch.approvalType
    }));

  console.log(`✅ Finished processing file ${fileId}:`);
  console.log(`   - Total rows: ${totalRows}`);
  console.log(`   - Valid offers: ${results.length}`);
  console.log(`   - Matched to existing: ${matchedToExistingCount}`);
  console.log(`   - Newly created: ${newlyCreatedCount}`);
  console.log(`   - Skipped offers: ${skippedOffers.length}`);
  
  return {
    validOffers: results,
    skippedOffers: skippedOffers,
    analyzedMatches: analyzedMatches,
    totalRows: totalRows,
    validCount: results.length,
    skippedCount: totalRows - results.length,
    matchedToExistingCount: matchedToExistingCount,
    newlyCreatedCount: newlyCreatedCount
  };
}

module.exports = {
  matchOfferToProduct,
  processOffersFromFile
};

