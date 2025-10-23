# 🧪 Accurate Test Guide - Sample Data

**Last Verified**: October 24, 2025  
**System**: AI-Powered Supplier Order Management  
**Catalog**: 4 products (Wireless Mouse, USB-C Hub, Mechanical Keyboard, Laptop Stand)

---

## ✅ **Use This Guide** (Other READMEs may be outdated)

This document contains **verified, accurate** test results based on the current system and sample files.

---

## 📊 **Test File Summary**

| File | Offers | Match | Unmatch | Match Rate | Notes |
|------|--------|-------|---------|------------|-------|
| **01-basic-matching/tech-supplies-offers.csv** | 5 | 5 | 0 | 100% | All perfect matches ✅ |
| **02-naming-variations/asia-imports-offers.csv** | 8 | 5 | 3 | 62.5% | Tests name variations |
| **02-naming-variations/office-essentials-offers.csv** | 5 | 3 | 2 | 60% | Synonym matching |
| **02-naming-variations/global-electronics-offers.csv** | 7 | 3-4 | 3-4 | ~50% | International names |
| **02-naming-variations/premium-tech-offers.csv** | 7 | 3-4 | 3-4 | ~50% | Brand names |

---

## 🎯 **Recommended Test Sequence**

### **Test 1: Basic Functionality** (2 minutes)
**File**: `01-basic-matching/tech-supplies-offers.csv`

**Expected Results**:
- ✅ 5 offers processed
- ✅ 5 matches (100%)
- ✅ All auto-approved (confidence ≥ 85%)

**What It Tests**:
- File upload works
- AI matching works
- Auto-approval logic works

---

### **Test 2: Name Variations** (3 minutes)
**File**: `02-naming-variations/asia-imports-offers.csv`

**Expected Results**:
- ✅ 8 offers processed
- ✅ 5 matches (~62%)
- ⚠️ Mix of auto-approved and review-needed

**Matched Offers**:
1. Wireless Mouse Optical → Wireless Mouse
2. HUB USB TYPE C → USB-C Hub
3. KEYBOARD MECHANICAL GAMING → Mechanical Keyboard
4. STAND FOR LAPTOP → Laptop Stand
5. Mouse 2.4GHz Wireless → Wireless Mouse

**Unmatched Offers**:
1. Webcam HD Quality (not in catalog)
2. USB C Cable 6ft (not in catalog)
3. Mouse Pad Gaming (not in catalog)

**What It Tests**:
- Handles different naming conventions
- Handles uppercase/mixed case
- Handles description-heavy formats

---

### **Test 3: Real-World Messiness & Data Quality** (optional)
**File**: `03-data-quality-issues/messy-data-quality.xlsx`

**Expected Results**:
```
Total Rows: 7 (data rows, excluding header)
✅ Valid: 5 offers processed
❌ Invalid: 2 offers (skipped due to invalid data)

✅ Matched to Existing: 2 (40%)
   - wireless mouse → Wireless Mouse (seed product)
   - Keyboard With Spaces → Mechanical Keyboard (seed product)

🤖 Newly Created: 3 (60%)
   - Mouse Pad (€12.99 EUR)
   - Duplicate Product #1 ($29.99) - auto-created
   - Duplicate Product #2 ($31.99) - matches auto-created product

Existing Product Rate: 40%
```

**What Gets Skipped**:
- USB CABLE (invalid price: "INVALID")
- UPPERCASE PRODUCT NAME (price is 0, must be > 0)

**What It Tests**:
- ✅ System robustness with bad data
- ✅ Graceful skipping of invalid offers
- ✅ Clear error logging
- ✅ Auto-creation of new products (Mouse Pad, Duplicate Product)
- ✅ Duplicate product handling (same product, different prices - both saved as separate offers)
- ✅ Trimming of extra spaces in product names
- ✅ Special characters in supplier names
- ✅ Mixed case handling (UPPERCASE, lowercase, Mixed)

---

## 🏢 **Enterprise Scale Test** (optional, uses API calls)
**File**: `06-enterprise-scale/enterprise-catalog-500-items.csv`

**Warning**: This file has 500 rows and will use ~500 Gemini AI API calls.

**Expected**:
- Takes 5-10 minutes to process
- Shows system can handle large files
- Dashboard remains responsive (performance optimization)

**Recommendation**: Only run if demonstrating scalability to evaluators.

---

## 📝 **Our Product Catalog** (What AI Matches Against)

| Product | SKU | Category |
|---------|-----|----------|
| Wireless Mouse | WM-2024-001 | Electronics |
| USB-C Hub | HUB-2024-002 | Electronics |
| Mechanical Keyboard | KB-2024-003 | Electronics |
| Laptop Stand | LS-2024-004 | Electronics |

**Note**: AI matches supplier offers to these 4 seed products. Offers for products NOT in this catalog (webcams, cables, etc.) will:
- Show as "🤖 New Products" in statistics
- Be **auto-created** as new products in your catalog
- Be fully available in procurement dashboard
- Have the 🤖 AUTO-CREATED badge for easy identification

---

## 💡 **Understanding Match Confidence**

| Confidence | Status | Example |
|-----------|--------|---------|
| **≥ 85%** | ✅ Auto-Approved | Exact name match: "Wireless Mouse" |
| **70-84%** | ⚠️ Review Needed | Similar: "Ergonomic Keyboard" vs "Mechanical Keyboard" |
| **50-69%** | ⚠️ Review Needed | Partial: "USB Hub" vs "USB-C Hub" |
| **< 50%** | ❌ Auto-Rejected | Poor match or wrong category |

---

## 🚀 **Quick Test (5 Minutes)**

1. Login: `ryan@test.com` / `test123`
2. Upload: `01-basic-matching/tech-supplies-offers.csv`
3. Wait: 30-60 seconds
4. Refresh page
5. Verify: 5 matches, 100% rate, all auto-approved ✅

**Expected Dashboard**:
- Total Files: 1
- Offers Processed: 5
- Successfully Matched: 5
- Match Success Rate: 100%

---

## ⚠️ **Note About Folder READMEs**

Individual folder READMEs may contain **outdated information**. Always refer to this `ACCURATE_TEST_GUIDE.md` for verified results.

---

**Need Help?** Check `EVALUATOR_SETUP_GUIDE.md` in the root directory for complete setup and testing instructions.

