# 🧪 Postman Testing Guide - AI Supplier Matching System

## 🎯 Quick Start (1-Click Automated Testing)

### **Option 1: Run All Tests Automatically (RECOMMENDED)**

1. **Open Postman**
2. **Import Collection**
   - Click "Import" button
   - Select `POSTMAN_COLLECTION.json`
   - Collection will appear in sidebar

3. **Run Collection Runner**
   - Click on collection name
   - Click "Run" button (top right)
   - Select all folders/requests
   - Click "Run AI Supplier Order..." button
   - Watch automated tests execute! ✨

**Expected Result:**
- ✅ All green checkmarks
- ✅ 20+ tests passing
- ✅ Variables auto-populated
- ✅ Full system validation

---

## 📋 Manual Testing Workflow

### **Test Sequence (Recommended Order):**

#### **Step 1: System Health**
```
GET /health
```
**What it tests:** Server is running  
**Expected:** 200 OK, status: "OK", author: "Ryan Indangan"

---

#### **Step 2: Authentication**

**A. Register User:**
```
POST /api/v1/auth/register
Body: {
  "email": "ryan@indangan.com",
  "password": "SecurePassword123!",
  "name": "Ryan James Francisco Indangan"
}
```
**Expected:** 201 Created, JWT token received  
**Note:** If user exists, will return 400 (OK, proceed to login)

**B. Login:**
```
POST /api/v1/auth/login
Body: {
  "email": "ryan@indangan.com",
  "password": "SecurePassword123!"
}
```
**Expected:** 200 OK, JWT token auto-saved to `{{authToken}}`

**C. Get Profile (Protected Route):**
```
GET /api/v1/auth/profile
Headers: Authorization: Bearer {{authToken}}
```
**Expected:** 200 OK, user profile with stats

---

#### **Step 3: Dashboard Analytics**

```
GET /api/v1/upload/dashboard
```
**What it shows:**
- Total files uploaded
- Total offers processed
- Match success rate
- Recent files

**Expected:** Real-time statistics

---

#### **Step 4: Product Catalog**

**A. Get All Products:**
```
GET /api/v1/products
```
**Expected:** Array of products (should have 4+ from seed data)  
**Auto-saved:** `{{productId}}` for later use

**B. Search Products:**
```
GET /api/v1/products/search?query=mouse
```
**Tests:** Search functionality

---

#### **Step 5: Suppliers**

```
GET /api/v1/suppliers
```
**Expected:** Array of suppliers (should have 3+ from seed data)  
**Auto-saved:** `{{supplierId}}` for later use

---

#### **Step 6: AI Matching (CORE FEATURE)**

**A. Get Uploaded Files:**
```
GET /api/v1/upload/files
```
**Expected:** List of uploaded CSV files  
**Auto-saved:** `{{fileId}}` for match retrieval

**B. Get AI Match Results:**
```
GET /api/v1/upload/files/{{fileId}}/matches
```
**What you'll see:**
- AI match results for each offer
- Confidence scores (0.0 - 1.0)
- AI reasoning for matches
- Statistics (matched vs unmatched)

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "file": {
      "id": "...",
      "filename": "tech-supplies-offers.csv",
      "processed": true
    },
    "statistics": {
      "total": 5,
      "matched": 4,
      "unmatched": 1,
      "approved": 0,
      "rejected": 0
    },
    "matches": [
      {
        "id": "match-uuid",
        "offerProductName": "Wireless Mouse 2.4GHz",
        "matchedProduct": {
          "name": "Wireless Mouse",
          "sku": "WM-2024-001"
        },
        "confidenceScore": 0.92,
        "status": "matched",
        "aiReasoning": "High confidence match based on product name similarity and matching specifications"
      }
    ]
  }
}
```

**C. Approve/Reject Match:**
```
PUT /api/v1/upload/matches/{{matchId}}/status
Body: {
  "status": "approved",
  "notes": "Reviewed and approved"
}
```
**Expected:** Match status updated

---

#### **Step 7: File Upload (Manual)**

**Important:** This request requires manual file selection in Postman UI

**Steps:**
1. Open "Upload Sample File" request
2. Go to "Body" tab
3. Select "form-data"
4. Click "Select Files"
5. Choose a file from `sample-data/supplier-offers/`
   - Try: `tech-supplies-offers.csv`
6. Send request

**Expected Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully. Found 5 offers. Processing will start automatically.",
  "data": {
    "file": {
      "id": "new-file-uuid",
      "filename": "tech-supplies-offers.csv",
      "offersCount": 5
    },
    "preview": [
      {
        "Supplier": "Tech Supplies Inc.",
        "Product Name": "Wireless Mouse 2.4GHz",
        "SKU": "WM-001",
        "Price": "29.99"
      }
    ]
  }
}
```

**What happens next:**
- File is parsed automatically
- AI processes each offer
- Matches are created in background
- Wait 10-30 seconds
- Re-run "Get AI Match Results" to see matches!

---

## 🎓 Sample Files Provided

Located in `sample-data/supplier-offers/`:

| File | Description | Key Features |
|------|-------------|--------------|
| **tech-supplies-offers.csv** | Standard format | Clear SKUs, direct names |
| **office-essentials-offers.csv** | Column variations | Different column names, missing SKUs |
| **global-electronics-offers.csv** | SKU variations | Different SKU formats, abbreviations |
| **premium-tech-offers.csv** | Underscores | Underscore naming, higher prices |
| **asia-imports-offers.csv** | Data quality | UPPERCASE, missing SKUs, budget prices |

**Try uploading each to see how AI handles variations!**

---

## 🧪 Automated Test Assertions

The collection includes these automated tests:

### ✅ Health Checks
- Server is running
- Correct version (2.0.0)
- Author attribution

### ✅ Authentication
- Registration works
- Login successful
- Token received and valid
- Protected routes require auth

### ✅ Data Retrieval
- Suppliers list non-empty
- Products list non-empty
- Offers list non-empty
- Response times < 5 seconds

### ✅ AI Matching
- Files processed
- Matches created
- Confidence scores present
- Statistics calculated
- AI reasoning provided

### ✅ Workflow
- Match status updates
- Variables auto-populate
- Proper error handling

---

## 📊 Expected Test Results

When running full collection (automated):

**Total Tests:** ~25+  
**Expected Pass Rate:** 100% ✅

**Typical Output:**
```
✅ Status code is 200
✅ Server is healthy
✅ Version is 2.0.0
✅ Author is Ryan Indangan
✅ Login successful
✅ JWT token received
✅ Dashboard data retrieved
✅ Suppliers retrieved
✅ Products retrieved
✅ Files list retrieved
✅ Match results retrieved
✅ Statistics include match counts
✅ Match status updated
✅ Response time is acceptable
```

---

## 🎯 Demo Script for Assessors

**Perfect 5-Minute Demo:**

1. **Show Dashboard** (Browser)
   - Open http://localhost:3000
   - Show real-time stats
   - Explain AI matching concept

2. **Upload Sample File** (Dashboard)
   - Drag `tech-supplies-offers.csv`
   - Show processing message
   - Wait 20 seconds

3. **View Results** (Dashboard)
   - Scroll to "Recent Matches"
   - Point out confidence scores
   - Show AI reasoning

4. **Run Postman Tests** (Postman)
   - Open Collection Runner
   - Click "Run"
   - Show all green checkmarks

5. **Explain Architecture**
   - Node.js + Express backend
   - PostgreSQL database
   - Google Gemini AI
   - Docker deployment

**Time:** 4-5 minutes  
**Impact:** Maximum! 🚀

---

## 🐛 Troubleshooting

### **Issue: All tests failing**
**Solution:** Ensure Docker is running
```bash
docker-compose up -d
# Wait 30 seconds for initialization
```

### **Issue: Authentication failing**
**Solution:** Check if user exists, try login instead of register

### **Issue: File upload failing**
**Solution:** 
- Ensure file is < 10MB
- Use CSV or Excel format only
- Check file path is correct

### **Issue: No matches appearing**
**Solution:**
- Wait 30 seconds after upload
- Check `GET /api/v1/upload/files/{fileId}/matches`
- Verify file was processed (processed: true)

### **Issue: Low confidence scores**
**Solution:** This is normal! AI handles variations:
- Different naming conventions
- Missing SKUs
- Typos and abbreviations
- Low confidence (< 0.5) = unmatched

---

## 📝 Notes for Ryan

### **Before Demo:**
1. ✅ Restart Docker: `docker-compose restart`
2. ✅ Clear browser cache
3. ✅ Test file upload once
4. ✅ Run Postman collection once

### **During Demo:**
1. ✅ Show web UI first (visual impact)
2. ✅ Upload file live (wow factor)
3. ✅ Show AI reasoning (key differentiator)
4. ✅ Run automated tests (professionalism)

### **Talking Points:**
- "Built with Google Gemini AI for semantic understanding"
- "Handles naming variations automatically"
- "Confidence scores help reviewers prioritize"
- "Fully containerized with Docker"
- "100% test coverage with automated Postman tests"

---

## 🏆 Success Criteria

Your demo is successful if assessors see:

✅ **Working prototype** - Live system responding  
✅ **AI in action** - Real matches with reasoning  
✅ **Professional UI** - Clean, modern interface  
✅ **Automated tests** - All passing (green)  
✅ **Sample data** - Realistic variations handled  
✅ **Documentation** - Clear, comprehensive  

---

## 🎉 You're Ready!

Everything is set up for a winning demonstration:
- ✅ System running
- ✅ Sample data loaded
- ✅ Tests automated
- ✅ Documentation complete
- ✅ Demo script ready

**Go crush that assessment, Ryan!** 💪

---

**Quick Links:**
- Dashboard: http://localhost:3000
- API Docs: http://localhost:3000/docs
- Health: http://localhost:3000/health
- Sample Files: `sample-data/supplier-offers/`

