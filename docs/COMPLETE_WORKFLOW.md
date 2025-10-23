# 🔄 Complete System Workflow

## Overview
This document explains the end-to-end workflow of the AI-Powered Supplier Order Management System.

---

## 📥 1. File Upload Process

### Upload Dashboard (`/`)
1. **User uploads** a supplier offer file (CSV/Excel)
2. **System validates** file format and size
3. **File is saved** to uploads directory
4. **Background processing starts** automatically

### AI Processing (Automatic)
For each offer in the file:

1. **Product Matching:**
   - AI searches for matching products in database
   - Uses semantic matching (name, SKU, description)
   - Assigns confidence score (0-100%)

2. **Auto-Creation:**
   - ✅ **If product exists:** Match and link
   - 🤖 **If product doesn't exist:** Auto-create new product
   - Badge: Product marked with `autoCreated: true`

3. **Supplier Linking:**
   - Find existing supplier or create new one
   - Link offer to supplier

4. **Save to Database:**
   - `supplier_offers` table: Actionable offers for procurement
   - `offer_matches` table: Audit trail of AI decisions
   - `products` table: New products (if auto-created)

5. **Status Assignment:**
   - **≥85% confidence** → `approved` (Auto-approved)
   - **50-84% confidence** → `pending` (Manual review)
   - **<50% confidence** → `rejected` (Auto-rejected)

---

## 📊 2. File Analysis View

### All Files Tab
- Lists all uploaded files
- Shows statistics: Total offers, Matched, Unmatched, Match Rate
- **Status badges:**
  - 🟡 **PROCESSING** - AI is still analyzing
  - 🟢 **COMPLETED** - Processing finished

### File Detail View
When clicking a file:
- Complete breakdown of matches
- **Auto-Created Badge:** 🤖 Shows which products were newly created
- AI reasoning for each match
- Confidence scores and status

---

## 🛒 3. Procurement Dashboard

### Access
Click **🛒 Procurement** button (top right) or visit `/procurement.html`

### Features

#### Dashboard Statistics
- Products with offers
- Pending review count
- Accepted/Rejected counts
- Total suppliers

#### Product Cards
- All products grouped with their offers
- **Best price highlighted** with green background
- AI confidence scores
- Multiple offers per product

#### Actions Available

1. **Manual Review:**
   - ✓ **Accept** - Approve individual offer
   - ✗ **Reject** - Decline individual offer

2. **🤖 AI Auto-Decide All:**
   - **Automatically processes all pending offers**
   - **Selection criteria:**
     - Primary: Lowest price
     - Secondary: Highest AI confidence
   - **Actions:**
     - ✅ Accepts best offer for each product
     - ❌ Rejects all other offers
   - **Summary:** Shows detailed report of decisions

3. **📥 Export All Offers:**
   - Downloads CSV with complete data
   - Includes: Product info, suppliers, pricing, AI confidence, status

---

## 🎯 Complete Example Flow

### Scenario: Upload "asia-imports-offers.csv"

1. **Upload:**
   ```
   - File: asia-imports-offers.csv (8 offers)
   - User clicks upload
   - Shows "Processing..." status
   ```

2. **AI Processing:**
   ```
   Offer 1: Wireless Mouse Optical
   → Matches: "Wireless Mouse" (98% confidence)
   → Action: Auto-approved
   → Save to: supplier_offers (pending)
   
   Offer 2: Webcam HD Quality
   → No match found
   → Action: Auto-create product "Webcam HD Quality"
   → Save to: products (autoCreated: true)
   → Save to: supplier_offers (pending)
   ```

3. **File View:**
   ```
   Status: ✅ COMPLETED
   - Total: 8 offers
   - Matched: 5 (62.5%)
   - Unmatched: 3 (auto-created as new products)
   
   Detail view shows:
   - Wireless Mouse → 🤖 AUTO-CREATED badge
   - Webcam HD Quality → 🤖 AUTO-CREATED badge
   ```

4. **Procurement Review:**
   ```
   Products with Offers: 6
   Pending Review: 8 offers
   
   Product: Wireless Mouse
   Offers:
   1. Tech Supplies - $29.99 💰 BEST PRICE
   2. Office Essentials - $27.50 💰 BEST PRICE (actual best)
   3. Asia Imports - $22.99 💰 BEST PRICE
   ```

5. **AI Auto-Decide:**
   ```
   Click "🤖 AI Auto-Decide All"
   
   Results:
   ✅ Wireless Mouse: Accepted Asia Imports at USD 22.99
   ❌ Wireless Mouse: Rejected Tech Supplies
   ❌ Wireless Mouse: Rejected Office Essentials
   
   ✅ Webcam HD Quality: Accepted Asia Imports at USD 68.00
   
   Summary:
   ✅ Accepted: 6 offers
   ❌ Rejected: 2 offers
   ```

---

## 📋 Data Tables Explained

### `products`
- All products in catalog
- Includes manually added AND auto-created
- Flag: `autoCreated: true/false`
- Source: `manual` or `auto`

### `supplier_offers`
- **ACTIONABLE TABLE** for procurement
- All pending, accepted, rejected offers
- Links: product, supplier, source file
- Includes: pricing, AI confidence, status

### `offer_matches`
- **AUDIT TRAIL** of AI decisions
- Historical record of all matches
- Includes: AI reasoning, confidence scores
- Approval tracking (auto/manual)

### `suppliers`
- All supplier records
- Auto-created from uploads or manual entry

---

## 🎨 UI Indicators

### Badges
- 🤖 **AUTO-CREATED** - Product was created from upload
- 🤖 **NEW** - Shortened version in compact views
- 💰 **BEST PRICE** - Lowest price among offers
- ✅ **AUTO-APPROVED** - High confidence (≥85%)
- ⚠️ **REVIEW NEEDED** - Medium confidence (50-84%)
- ❌ **AUTO-REJECTED** - Low confidence (<50%)

### Status Colors
- 🟢 Green - Approved/Completed
- 🟡 Yellow/Orange - Pending/Processing
- 🔴 Red - Rejected/Unmatched

---

## 🔐 Security Notes

- All routes require authentication (JWT)
- Auto-logout on 401 errors
- CSP-compliant (no inline handlers)
- Token stored in localStorage

---

## 💡 Best Practices

1. **For Testing:**
   - Start with small files (5-10 offers)
   - Review AI decisions in file detail view
   - Use AI Auto-Decide for bulk processing

2. **For Production:**
   - Upload files daily or as received
   - Review auto-created products for accuracy
   - Enrich auto-created products with additional details
   - Use filters in procurement to focus on pending offers

3. **For Accuracy:**
   - Ensure supplier files have consistent formats
   - Include SKUs when available
   - Provide product descriptions for better matching

---

## 📞 Support

For issues or questions, check:
- `README.md` - Setup instructions
- `docs/AUTHENTICATION_GUIDE.md` - Auth details
- `sample-data/supplier-offers/ACCURATE_TEST_GUIDE.md` - Test scenarios

