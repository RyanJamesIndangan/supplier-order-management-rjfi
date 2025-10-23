# 03 - Data Quality Issues

Tests system robustness with messy/incomplete data.

## Files:

| File | Total Rows | Valid | Invalid | Matched | New Products | Match Rate |
|------|------------|-------|---------|---------|--------------|------------|
| `poor-quality-data.csv` | 10 | 5 | 5 | 2 | 3 | 40% |
| `messy-data-quality.xlsx` | 7 | 5 | 2 | 3 | 2 | 60% |

## What Gets Processed:

### ✅ Valid Offers (5):
1. **wireless mouse** - $19.99 USD → Matches existing "Wireless Mouse"
2. **Keyboard With Spaces** - $49.99 USD → Matches existing "Mechanical Keyboard"
3. **Mouse Pad** - €12.99 EUR → 🤖 NEW PRODUCT (auto-created)
4. **Duplicate Product** - $29.99 USD → 🤖 NEW PRODUCT (auto-created, first entry)
5. **Duplicate Product** - $31.99 USD → Matches the newly created "Duplicate Product" (duplicate with different price)

### ❌ Skipped/Invalid Offers (2):
1. **USB CABLE** - "INVALID" price → Not a valid number
2. **UPPERCASE PRODUCT NAME** - Price is 0 → Invalid (price must be > 0)

## Expected Results:

```
📊 File Analysis:
Total Rows: 7 (data rows, excluding header)
✅ Valid: 5 offers
❌ Invalid: 2 offers

Of Valid Offers:
✅ Matched to Existing: 2 (40%) - wireless mouse, Keyboard With Spaces
🤖 Newly Created: 3 (60%) - Mouse Pad, Duplicate Product (×2)
Existing Product Rate: 40%
```

## Key Learnings:

1. **System is Robust:**
   - ✅ Processes valid data
   - ✅ Skips invalid data gracefully
   - ✅ Logs clear error messages
   - ✅ Doesn't crash on bad data

2. **New Products Auto-Created:**
   - Mouse Pad (no match in catalog)
   - Cable USB-C (no match in catalog)
   - Laptop with emoji (handles special characters)

3. **Duplicate Handling:**
   - Same product (Wireless Mouse) from different suppliers
   - Different prices ($15.99 vs $19.99)
   - Both saved as separate offers
   - Procurement can choose best price

4. **What Causes Skipping:**
   - Missing price or product name
   - Invalid price format (text)
   - Broken CSV formatting
   - Empty required fields

**For detailed expectations**: See `../ACCURATE_TEST_GUIDE.md`
