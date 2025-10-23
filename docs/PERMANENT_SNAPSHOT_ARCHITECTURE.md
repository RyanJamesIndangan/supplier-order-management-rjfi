# Permanent File Analysis Snapshot Architecture

## 🎯 Problem Solved

Previously, file analysis data was **recalculated every time** it was viewed, and it could be **affected by procurement decisions** (accepting/rejecting offers). This caused:

1. ❌ **Performance Issues** - Counting matches on every API call
2. ❌ **Data Integrity Issues** - Stats changed when procurement accepted/rejected offers
3. ❌ **No Historical Accuracy** - Couldn't preserve the original upload analysis

## ✅ Solution: Permanent Snapshot Table

We now store a **permanent, immutable snapshot** of the file analysis at upload time.

---

## 📊 Database Structure

### `uploaded_files` Table (Summary Counts)
```sql
- total_rows               INT    -- Total data rows in file (excl. header)
- valid_count              INT    -- Successfully processed offers
- skipped_count            INT    -- Invalid/missing data rows
- matched_to_existing_count INT   -- Offers matched to seed products
- newly_created_count      INT    -- Offers matched to auto-created products
```

### `file_analysis_snapshots` Table (Detailed Analysis)
```sql
- id                    UUID      PRIMARY KEY
- file_id               UUID      UNIQUE → uploaded_files(id)
- skipped_offers        JSONB     -- Invalid rows with reasons
- analyzed_matches      JSONB     -- Full match details (permanent)
- total_rows            INT       -- Same as uploaded_files
- valid_count           INT       -- Same as uploaded_files
- skipped_count         INT       -- Same as uploaded_files
- matched_count         INT       -- Matched to existing
- newly_created_count   INT       -- Auto-created products
- created_at            TIMESTAMP -- When snapshot was created
```

---

## 🔄 How It Works

### 1️⃣ **File Upload**
```javascript
// uploadController.js
processOffersFromFile(fileId, offers, totalRows)
  .then(async (result) => {
    // Save summary counts to uploaded_files
    await prisma.uploadedFile.update({
      where: { id: fileId },
      data: {
        totalRows: result.totalRows,
        validCount: result.validCount,
        skippedCount: result.skippedCount,
        matchedToExistingCount: result.matchedToExistingCount,
        newlyCreatedCount: result.newlyCreatedCount
      }
    });

    // Create PERMANENT snapshot (never changes)
    await prisma.fileAnalysisSnapshot.create({
      data: {
        fileId: fileId,
        skippedOffers: result.skippedOffers,      // [{productName, reason, ...}]
        analyzedMatches: result.analyzedMatches,   // [{productName, matchedTo, confidence, ...}]
        totalRows: result.totalRows,
        validCount: result.validCount,
        skippedCount: result.skippedCount,
        matchedCount: result.matchedToExistingCount,
        newlyCreatedCount: result.newlyCreatedCount
      }
    });
  });
```

### 2️⃣ **AI Processing**
```javascript
// aiMatchingService.js
const analyzedMatches = results.map(r => ({
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
  wasAutoCreated: r.productCreated || false,  // KEY FLAG
  approvalType: r.offerMatch.approvalType
}));
```

### 3️⃣ **File List View (All Files Tab)**
```javascript
// getUploadedFiles() - No joins, no calculations!
const files = await prisma.uploadedFile.findMany({
  include: { user: true }
});

const filesWithCounts = files.map(file => ({
  ...file,
  _count: {
    offers: file.validCount || 0,
    matchedOffers: file.matchedToExistingCount || 0,
    unmatchedOffers: file.newlyCreatedCount || 0
  },
  matchRate: file.validCount > 0 
    ? ((file.matchedToExistingCount / file.validCount) * 100).toFixed(1) + '%' 
    : '0%'
}));
```

### 4️⃣ **File Detail View (Inside File)**
```javascript
// getFileMatches() - Fetch permanent snapshot
const file = await prisma.uploadedFile.findUnique({
  where: { id: fileId },
  include: { analysisSnapshot: true }
});

return {
  file: { id, filename, uploadedAt, processed },
  matches: snapshot.analyzedMatches,      // Permanent JSON data
  skippedOffers: snapshot.skippedOffers,  // Permanent JSON data
  processingMeta: {
    totalRows: snapshot.totalRows,
    validCount: snapshot.validCount,
    skippedCount: snapshot.skippedCount
  }
};
```

---

## 🚀 Benefits

### ✅ **Performance**
- No joins with `offer_matches` or `supplier_offers`
- No filtering or counting
- Instant response from pre-calculated columns

### ✅ **Data Integrity**
- Original analysis is **frozen at upload time**
- Procurement decisions (accept/reject) don't affect file stats
- Audit trail of original AI decisions

### ✅ **Accuracy**
- **"Matched to Existing"** = Products that existed in seed data
- **"Newly Created"** = Products auto-created during processing
- **"Invalid"** = Rows with missing/invalid data

---

## 📋 Example: `messy-data-quality.xlsx`

### File Contains (7 data rows):
1. ✅ Valid: wireless mouse → **Matched to existing** (Wireless Mouse seed product)
2. ❌ Invalid: USB CABLE → **Skipped** (price = "INVALID")
3. ✅ Valid: Keyboard With Spaces → **Matched to existing** (Mechanical Keyboard)
4. ✅ Valid: Mouse Pad → **Auto-created** (new product)
5. ❌ Invalid: UPPERCASE PRODUCT NAME → **Skipped** (price = 0)
6. ✅ Valid: Duplicate Product (first) → **Auto-created** (new product)
7. ✅ Valid: Duplicate Product (second) → **Auto-created** (matched to #6)

### Permanent Snapshot Stores:
```json
{
  "totalRows": 7,
  "validCount": 5,
  "skippedCount": 2,
  "matchedCount": 2,         // Matched to seed products
  "newlyCreatedCount": 3,    // Auto-created products
  "skippedOffers": [
    {
      "productName": "USB CABLE",
      "reason": "Invalid/missing price: \"INVALID\""
    },
    {
      "productName": "UPPERCASE PRODUCT NAME",
      "reason": "Invalid/missing price: \"0\""
    }
  ],
  "analyzedMatches": [
    {
      "productName": "wireless mouse",
      "matchedProductName": "Wireless Mouse",
      "wasAutoCreated": false,  // Seed product!
      "confidence": "0.95",
      "status": "approved"
    },
    // ... 4 more valid matches
  ]
}
```

---

## 🔍 Key Differences

| Aspect | Old Approach | New Approach |
|--------|--------------|--------------|
| **Data Source** | Live `offer_matches` table | Permanent `file_analysis_snapshots` |
| **Calculation** | Every API call | Once at upload time |
| **Affected by procurement?** | ✅ Yes | ❌ No |
| **Performance** | Slow (joins + filters) | Fast (direct read) |
| **Historical accuracy** | ❌ Lost | ✅ Preserved |

---

## 🧪 Testing Instructions

### 1. Fresh Upload
```bash
# Upload messy-data-quality.xlsx
# Expected permanent counts:
- Total Rows: 7
- Valid: 5
- Invalid: 2
- Matched to Existing: 2
- Newly Created: 3
- Existing Product Rate: 40%
```

### 2. Procurement Actions
```bash
# Accept/Reject offers in procurement dashboard
# Then refresh file detail view
# Expected: Counts remain UNCHANGED (permanent!)
```

### 3. Database Verification
```sql
-- Check snapshot was created
SELECT * FROM file_analysis_snapshots 
WHERE file_id = '...';

-- Snapshot should have:
-- total_rows = 7
-- valid_count = 5
-- skipped_count = 2
-- matched_count = 2
-- newly_created_count = 3
```

---

## 🎉 Summary

The **permanent snapshot architecture** ensures that file analysis data is:
- ✅ **Calculated once** at upload time
- ✅ **Never modified** by procurement decisions
- ✅ **Always accurate** to the original analysis
- ✅ **Fast to retrieve** (no complex joins/calculations)

This is critical for audit trails, historical reporting, and system performance!

