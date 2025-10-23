# 🏗️ System Architecture - AI Supplier Matching Platform

> **Author:** Ryan James Francisco Indangan  
> **Version:** 2.0.0  
> **Last Updated:** October 22, 2025

---

## 📋 Table of Contents

1. [High-Level Overview](#high-level-overview)
2. [Component Architecture](#component-architecture)
3. [Data Flow](#data-flow)
4. [Database Schema](#database-schema)
5. [API Design](#api-design)
6. [AI Matching Algorithm](#ai-matching-algorithm)
7. [Security Architecture](#security-architecture)
8. [Scalability & Performance](#scalability--performance)
9. [Deployment Architecture](#deployment-architecture)

---

## 🎯 High-Level Overview

### **System Purpose:**
Automate supplier offer matching using AI to reduce manual effort and improve accuracy.

### **Core Architecture Pattern:**
**Layered Monolithic Architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│         (Web UI + Swagger Documentation)                     │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    API Layer (Express.js)                    │
│         (Routes + Controllers + Middleware)                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                   Business Logic Layer                       │
│         (Services + AI Matching Logic)                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                   Data Access Layer                          │
│         (Prisma ORM + Database Queries)                      │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                   Data Storage Layer                         │
│         (PostgreSQL + File System)                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧩 Component Architecture

### **1. Web UI Layer**

**Technology:** Vanilla JavaScript + HTML/CSS  
**Location:** `public/index.html`  
**Purpose:** User-facing dashboard

```
┌────────────────────────────────────┐
│         Web Dashboard              │
│                                    │
│  ┌──────────────────────────────┐ │
│  │   Header & Branding          │ │
│  └──────────────────────────────┘ │
│  ┌──────────────────────────────┐ │
│  │   Statistics Cards           │ │
│  │   (Files, Matches, Rate)     │ │
│  └──────────────────────────────┘ │
│  ┌──────────────────────────────┐ │
│  │   File Upload Area           │ │
│  │   (Drag & Drop)              │ │
│  └──────────────────────────────┘ │
│  ┌──────────────────────────────┐ │
│  │   Recent Matches Display     │ │
│  │   (Confidence Scores)        │ │
│  └──────────────────────────────┘ │
└────────────────────────────────────┘
         │
         │ AJAX/Fetch API
         ▼
   Express.js Backend
```

**Features:**
- Real-time statistics via API polling
- Drag-and-drop file upload
- Match results visualization
- Auto-refresh (30s interval)
- Responsive design

---

### **2. API Layer**

**Technology:** Express.js 4.18+  
**Pattern:** RESTful API with versioning

```
┌─────────────────────────────────────────────────────────────┐
│                     Express.js Application                   │
│                                                               │
│  Middleware Stack:                                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 1. Helmet (Security Headers)                        │    │
│  │ 2. CORS (Cross-Origin)                              │    │
│  │ 3. Body Parser (JSON/URL-encoded)                   │    │
│  │ 4. File Upload (express-fileupload)                 │    │
│  │ 5. Morgan (Logging)                                 │    │
│  │ 6. JWT Authentication (custom)                      │    │
│  │ 7. Error Handler (custom)                           │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  Route Handlers:                                             │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐ │
│  │   Auth      │   Upload    │  Products   │  Suppliers  │ │
│  │  Routes     │   Routes    │   Routes    │   Routes    │ │
│  └─────────────┴─────────────┴─────────────┴─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**API Versioning:**
- Base path: `/api/v1/`
- Future versions: `/api/v2/` (backward compatible)
- Swagger docs at: `/docs`

---

### **3. Business Logic Layer**

#### **A. AI Matching Service** ⭐ CORE COMPONENT

**File:** `src/services/aiMatchingService.js`

```javascript
┌──────────────────────────────────────────────┐
│         AI Matching Service                  │
│                                              │
│  Input: Supplier Offer Data                 │
│  {                                           │
│    productName: "Wireless Mouse 2.4GHz"     │
│    sku: "WM-001"                             │
│    price: 29.99                              │
│  }                                           │
│                                              │
│  Step 1: Fetch Product Catalog              │
│  ┌────────────────────────────────────────┐ │
│  │  SELECT * FROM products;               │ │
│  │  Returns: All products in DB           │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  Step 2: Build AI Prompt                    │
│  ┌────────────────────────────────────────┐ │
│  │  "You are a product matching expert.  │ │
│  │   Match this offer to our catalog:    │ │
│  │   Offer: Wireless Mouse 2.4GHz        │ │
│  │   Catalog:                             │ │
│  │   1. Wireless Mouse (WM-2024-001)     │ │
│  │   2. USB Hub (HUB-2024-002)           │ │
│  │   ..."                                 │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  Step 3: Call Google Gemini API             │
│  ┌────────────────────────────────────────┐ │
│  │  POST https://generativelanguage...   │ │
│  │  Returns JSON with match result        │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  Step 4: Parse AI Response                  │
│  ┌────────────────────────────────────────┐ │
│  │  {                                     │ │
│  │    productId: "uuid-123",              │ │
│  │    confidence: 0.92,                   │ │
│  │    reasoning: "Strong semantic match"  │ │
│  │  }                                     │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  Step 5: Fallback (if AI fails)             │
│  ┌────────────────────────────────────────┐ │
│  │  Use string similarity algorithm       │ │
│  │  Calculate Levenshtein distance        │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  Output: Match Result                       │
│  {                                           │
│    matched: true,                            │
│    productId: "uuid-123",                    │
│    confidence: 0.92,                         │
│    reasoning: "High confidence..."          │
│  }                                           │
└──────────────────────────────────────────────┘
```

**Algorithm Flow:**

```
START
  │
  ▼
Parse Supplier Offer
  │
  ▼
Fetch Product Catalog
  │
  ▼
Build AI Prompt
  │
  ▼
Call Google Gemini ──► Success? ──► Parse Response
  │                         │
  │ Failure                 │
  ▼                         ▼
Use Fallback           Extract Match Data
String Matching             │
  │                         │
  └─────────┬───────────────┘
            │
            ▼
      Store in Database
            │
            ▼
      Return Result
            │
            ▼
          END
```

#### **B. Controllers**

```
┌────────────────────────────────────────────────────────┐
│                    Controllers                          │
│                                                         │
│  ┌──────────────────┐  ┌──────────────────┐           │
│  │  authController  │  │ uploadController │           │
│  │                  │  │                  │           │
│  │ • register()     │  │ • uploadFile()   │           │
│  │ • login()        │  │ • getMatches()   │           │
│  │ • getProfile()   │  │ • updateStatus() │           │
│  └──────────────────┘  │ • dashboard()    │           │
│                        └──────────────────┘           │
│  ┌──────────────────┐  ┌──────────────────┐           │
│  │productController │  │supplierController│           │
│  │                  │  │                  │           │
│  │ • getAll()       │  │ • getAll()       │           │
│  │ • getById()      │  │ • getById()      │           │
│  │ • create()       │  │ • create()       │           │
│  │ • update()       │  │ • update()       │           │
│  │ • delete()       │  │ • delete()       │           │
│  └──────────────────┘  └──────────────────┘           │
└────────────────────────────────────────────────────────┘
```

---

### **4. Data Access Layer**

**Technology:** Prisma ORM 5.7+

```
┌─────────────────────────────────────────────────────────┐
│                    Prisma ORM                            │
│                                                          │
│  Features:                                              │
│  • Type-safe queries                                    │
│  • Automatic migrations                                 │
│  • Relation handling                                    │
│  • Connection pooling                                   │
│                                                          │
│  Usage Example:                                         │
│  ┌────────────────────────────────────────────────────┐ │
│  │  const products = await prisma.product.findMany({  │ │
│  │    include: { offers: true }                       │ │
│  │  });                                               │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  Benefits:                                              │
│  ✓ No SQL injection vulnerabilities                     │
│  ✓ IntelliSense support                                 │
│  ✓ Automatic type generation                            │
│  ✓ Easy relation traversal                              │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

### **Complete Request-Response Cycle:**

```
1. USER ACTION: Upload CSV file via dashboard
   │
   ▼
2. BROWSER: FormData POST to /api/v1/upload
   │
   ▼
3. EXPRESS: express-fileupload middleware
   │   - Validates file type
   │   - Checks file size (< 10MB)
   │   - Saves to disk
   ▼
4. UPLOAD CONTROLLER:
   │   - Parse Excel/CSV → JSON
   │   - Create UploadedFile record in DB
   │   - Return 201 response with file ID
   │   - Start async processing
   ▼
5. AI MATCHING SERVICE (Async):
   │   For each offer in file:
   │   ├─► Build AI prompt
   │   ├─► Call Google Gemini API
   │   ├─► Parse confidence + reasoning
   │   └─► Create OfferMatch record
   ▼
6. DATABASE: Store match results
   │   - matched_product_id
   │   - confidence_score
   │   - ai_reasoning
   │   - status (matched/unmatched)
   ▼
7. DASHBOARD: Poll GET /api/v1/upload/files/{id}/matches
   │   - Retrieves match results
   │   - Displays confidence scores
   │   - Shows AI reasoning
   ▼
8. USER: Reviews matches
   │   - Approves high-confidence matches
   │   - Rejects/reviews low-confidence
   ▼
9. UPDATE: PUT /api/v1/upload/matches/{id}/status
   │   - Updates status to approved/rejected
   │   - Records reviewer ID
   ▼
10. COMPLETE: Match workflow finished
```

---

## 💾 Database Schema

### **Entity-Relationship Diagram:**

```
┌─────────────────┐
│     User        │
├─────────────────┤
│ id (UUID) PK    │
│ email (unique)  │
│ password (hash) │
│ name            │
│ role            │
│ created_at      │
│ updated_at      │
└────────┬────────┘
         │ 1
         │
         │ uploaded_by
         │
         │ N
┌────────▼────────────┐         ┌─────────────────┐
│  UploadedFile       │    N    │   OfferMatch    │
├─────────────────────┤◄────────┤─────────────────┤
│ id (UUID) PK        │ file_id │ id (UUID) PK    │
│ filename            │         │ file_id FK      │
│ original_name       │         │ supplier_name   │
│ mimetype            │         │ offer_product_  │
│ size                │         │   name          │
│ path                │         │ offer_sku       │
│ uploaded_by FK      │         │ offer_price     │
│ processed (bool)    │         │ matched_product │
│ created_at          │         │   _id FK        │
└─────────────────────┘         │ confidence_score│
                                │ status          │
                                │ ai_reasoning    │
                                │ reviewed_by FK  │
                                │ created_at      │
                                │ updated_at      │
                                └────────┬────────┘
                                         │
                                         │ matched_product_id
                                         │
                                         │
┌─────────────────┐         ┌───────────▼─────────┐
│    Supplier     │    1    │      Product        │
├─────────────────┤         ├─────────────────────┤
│ id (UUID) PK    │         │ id (UUID) PK        │
│ name (unique)   │         │ name                │
│ contact_info    │         │ sku (unique)        │
│ created_at      │         │ category            │
│ updated_at      │         │ specs (JSON)        │
└────────┬────────┘         │ created_at          │
         │ 1                │ updated_at          │
         │                  └───────────┬─────────┘
         │                              │ 1
         │                              │
         │ N                            │ N
┌────────▼────────────────────────────────▼─────────┐
│            SupplierOffer                          │
├───────────────────────────────────────────────────┤
│ id (UUID) PK                                      │
│ supplier_id FK ────────────────────┐              │
│ product_id FK ─────────────────────┼─────┐        │
│ offer_name                         │     │        │
│ price                              │     │        │
│ currency                           │     │        │
│ availability                       │     │        │
│ created_at                         │     │        │
│ updated_at                         │     │        │
└────────────────────────────────────┘     │        │
         │                                 │        │
         └─────────────────────────────────┘        │
                                                    │
         ┌──────────────────────────────────────────┘
         │
         └─► Cascade Delete (if product deleted)
```

### **Key Design Decisions:**

1. **UUIDs for Primary Keys:** Better for distributed systems, no collisions
2. **JSON Fields:** Flexible storage for varying contact_info and specs
3. **Cascade Deletes:** Maintain referential integrity
4. **Indexes:** On foreign keys and unique constraints
5. **Timestamps:** Auto-managed by Prisma

---

## 🔌 API Design

### **RESTful Principles:**

```
Resource-Based URLs:
✓ /api/v1/products          (collection)
✓ /api/v1/products/123      (specific resource)
✓ /api/v1/products/search   (sub-resource/action)

HTTP Verbs:
✓ GET     - Retrieve
✓ POST    - Create
✓ PUT     - Update
✓ DELETE  - Delete

Standard Response Format:
{
  "success": true|false,
  "data": { ... },
  "message": "Optional message",
  "count": 10,        // For lists
  "error": "..."      // On failures
}

Status Codes:
200 - OK
201 - Created
400 - Bad Request
401 - Unauthorized
404 - Not Found
500 - Internal Error
```

---

## 🤖 AI Matching Algorithm

### **Detailed Flow:**

```python
# Pseudo-code for AI Matching

function matchOfferToProduct(offer):
    # Step 1: Get all products from database
    products = database.getAllProducts()
    
    if products.isEmpty():
        return {matched: false, reason: "No products in catalog"}
    
    # Step 2: Build structured prompt
    prompt = """
    You are a product matching expert.
    
    SUPPLIER OFFER:
    - Name: {offer.productName}
    - SKU: {offer.sku or "N/A"}
    - Description: {offer.description or "N/A"}
    
    OUR CATALOG:
    {formatProducts(products)}
    
    TASK: Find the best match
    
    RULES:
    1. Consider semantic similarity
    2. Handle name variations
    3. Account for SKU differences
    4. Assign confidence 0.0-1.0
    5. Provide reasoning
    
    RESPOND JSON:
    {
      "productId": "uuid or null",
      "confidence": 0.0-1.0,
      "reasoning": "explanation"
    }
    """
    
    # Step 3: Call AI with retry logic
    try:
        response = geminiAPI.generateContent(prompt)
        result = JSON.parse(response.text)
        
        # Step 4: Validate response
        if result.confidence >= 0.5:
            return {
                matched: true,
                productId: result.productId,
                confidence: result.confidence,
                reasoning: result.reasoning
            }
        else:
            return {
                matched: false,
                confidence: result.confidence,
                reasoning: result.reasoning
            }
    
    except AIError:
        # Step 5: Fallback to string matching
        return fallbackStringMatch(offer, products)

function fallbackStringMatch(offer, products):
    bestMatch = null
    bestScore = 0
    
    for product in products:
        # Calculate similarity score (0.0 - 1.0)
        score = 0
        
        # Name similarity (weight: 0.8)
        nameSimilarity = levenshtein(offer.name, product.name)
        score += nameSimilarity * 0.8
        
        # SKU similarity (weight: 0.2)
        if offer.sku and product.sku:
            skuSimilarity = exactOrPartialMatch(offer.sku, product.sku)
            score += skuSimilarity * 0.2
        
        if score > bestScore:
            bestScore = score
            bestMatch = product
    
    return {
        matched: bestScore >= 0.5,
        productId: bestMatch?.id,
        confidence: bestScore,
        reasoning: "Fallback string matching (AI unavailable)"
    }
```

### **Why Google Gemini AI?**

**Advantages:**
- ✅ Semantic understanding (not just string matching)
- ✅ Handles context and ambiguity
- ✅ Provides explanations
- ✅ Free tier (60 requests/min)
- ✅ Easy integration

**Example AI Reasoning:**

```json
{
  "productId": "abc-123",
  "confidence": 0.92,
  "reasoning": "High confidence match: Both products are wireless mice with 2.4GHz connectivity. The SKU formats differ (WM-001 vs WM-2024-001) but likely represent the same product line. Name variations ('Wireless Mouse' vs 'Mouse - Wireless') are semantically identical."
}
```

---

## 🔐 Security Architecture

### **Authentication Flow:**

```
1. USER: POST /api/v1/auth/register
   {
     email: "ryan@example.com",
     password: "SecurePass123!"
   }
   │
   ▼
2. SERVER: Hash password with bcrypt (10 rounds)
   │
   ▼
3. DATABASE: Store user record
   {
     email: "ryan@example.com",
     password: "$2a$10$hashed...",  ← bcrypt hash
     role: "user"
   }
   │
   ▼
4. SERVER: Generate JWT token
   payload = {
     id: user.id,
     email: user.email,
     role: user.role
   }
   token = jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' })
   │
   ▼
5. RESPONSE: Return token
   {
     success: true,
     data: {
       user: { id, email, name },
       token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     }
   }
   │
   ▼
6. CLIENT: Store token (localStorage/cookie)
   │
   ▼
7. FUTURE REQUESTS: Include in Authorization header
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   │
   ▼
8. SERVER MIDDLEWARE: Verify token
   try {
     decoded = jwt.verify(token, SECRET_KEY)
     req.user = decoded  // Attach user to request
     next()
   } catch {
     return 401 Unauthorized
   }
```

### **Security Measures:**

1. **Password Security:**
   - Bcrypt hashing (10 rounds)
   - Never stored in plain text
   - Salt automatically added

2. **JWT Tokens:**
   - Signed with secret key
   - 7-day expiration
   - Stateless authentication

3. **HTTPS (Production):**
   - All traffic encrypted
   - Helmet.js security headers

4. **Input Validation:**
   - express-validator middleware
   - SQL injection prevention (Prisma)
   - XSS protection

5. **File Upload Security:**
   - Type validation (.csv, .xlsx only)
   - Size limit (10MB)
   - Sanitized file names

6. **Rate Limiting (Future):**
   - Prevent brute-force attacks
   - API quota enforcement

---

## 📈 Scalability & Performance

### **Current Capacity:**

| Metric | Current | Target (Phase 2) |
|--------|---------|------------------|
| Concurrent Users | 100 | 10,000 |
| File Uploads/Day | 1,000 | 100,000 |
| Offers Processed/Day | 50,000 | 10,000,000 |
| API Response Time | < 500ms | < 200ms |
| Database Size | < 1GB | < 100GB |

### **Optimization Strategies:**

```
┌─────────────────────────────────────────────────────────┐
│             Performance Optimizations                    │
│                                                          │
│  Current:                                               │
│  ✓ Async offer processing                               │
│  ✓ Database indexing                                    │
│  ✓ Connection pooling                                   │
│  ✓ JSON response compression                            │
│                                                          │
│  Future (Phase 2):                                      │
│  □ Redis caching layer                                  │
│  □ Message queue (RabbitMQ)                             │
│  □ Load balancing (Nginx)                               │
│  □ Database read replicas                               │
│  □ CDN for static assets                                │
│  □ Elasticsearch for search                             │
│  □ Horizontal pod autoscaling (K8s)                     │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Deployment Architecture

### **Current (Development):**

```
┌──────────────────────────────────────────────────────┐
│              Docker Compose                          │
│                                                      │
│  ┌────────────────┐         ┌──────────────────┐   │
│  │   API          │         │   PostgreSQL     │   │
│  │   Container    │◄────────┤   Container      │   │
│  │                │         │                  │   │
│  │ Node.js 18     │         │ postgres:15      │   │
│  │ Port: 3000     │         │ Port: 5432       │   │
│  └────────────────┘         └──────────────────┘   │
│          │                           │              │
│          │                           │              │
│    ┌─────▼───────┐         ┌────────▼──────┐      │
│    │  Volumes    │         │   Volumes     │      │
│    │  ./src      │         │  postgres_    │      │
│    │  (dev)      │         │    data       │      │
│    └─────────────┘         └───────────────┘      │
│                                                      │
│  Network: supplier-network (bridge)                 │
└──────────────────────────────────────────────────────┘
         │
         │ Exposed Ports
         ▼
    localhost:3000
```

### **Production (Recommended):**

```
┌───────────────────────────────────────────────────────────┐
│                      Cloud Platform                        │
│                    (AWS / GCP / Azure)                     │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │             Load Balancer (Nginx)                    │ │
│  │             SSL/TLS Termination                      │ │
│  └─────────────────┬────────────────────────────────────┘ │
│                    │                                       │
│        ┌───────────┼───────────┐                          │
│        │           │           │                          │
│  ┌─────▼────┐ ┌───▼─────┐ ┌───▼─────┐                    │
│  │  API     │ │  API    │ │  API    │                    │
│  │  Node 1  │ │  Node 2 │ │  Node 3 │                    │
│  │  (Auto   │ │  (Auto  │ │  (Auto  │                    │
│  │  Scale)  │ │  Scale) │ │  Scale) │                    │
│  └─────┬────┘ └───┬─────┘ └───┬─────┘                    │
│        │          │           │                          │
│        └──────────┼───────────┘                          │
│                   │                                       │
│         ┌─────────▼─────────┐                            │
│         │  PostgreSQL       │                            │
│         │  (Managed DB)     │                            │
│         │  + Read Replicas  │                            │
│         └───────────────────┘                            │
│                                                            │
│  ┌──────────────┐         ┌──────────────┐              │
│  │    Redis     │         │   S3/Blob    │              │
│  │    Cache     │         │   Storage    │              │
│  │              │         │  (Uploads)   │              │
│  └──────────────┘         └──────────────┘              │
└───────────────────────────────────────────────────────────┘
```

---

## 🎯 Design Decisions & Rationale

### **1. Why Monolithic (not Microservices)?**

**Decision:** Single Express.js application

**Rationale:**
- ✅ Simpler deployment
- ✅ Easier debugging
- ✅ Lower operational overhead
- ✅ Sufficient for current scale
- ✅ Can evolve to microservices later

### **2. Why PostgreSQL (not MongoDB)?**

**Decision:** PostgreSQL with Prisma

**Rationale:**
- ✅ Strong typing & relationships
- ✅ ACID compliance
- ✅ JSON support for flexibility
- ✅ Better for structured data
- ✅ Prisma ORM benefits

### **3. Why Google Gemini (not OpenAI)?**

**Decision:** Google Gemini Pro API

**Rationale:**
- ✅ Free tier (60 req/min)
- ✅ Excellent for semantic tasks
- ✅ Fast response times
- ✅ Good documentation
- ✅ No credit card required for testing

### **4. Why Vanilla JS (not React)?**

**Decision:** Plain JavaScript for UI

**Rationale:**
- ✅ No build step needed
- ✅ Lighter weight
- ✅ Easier for assessors to review
- ✅ Focus on backend capability
- ✅ Can migrate to React later

---

## 📊 Monitoring & Observability (Future)

```
Proposed Stack:

┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   Metrics   │  │    Logs     │  │   Traces    │
│  (Prometheus│  │  (Winston   │  │  (Jaeger)   │
│   + Grafana)│  │   + ELK)    │  │             │
└─────────────┘  └─────────────┘  └─────────────┘
      │                │                │
      └────────────────┼────────────────┘
                       │
           ┌───────────▼───────────┐
           │   Alert Manager       │
           │   (PagerDuty)         │
           └───────────────────────┘
```

---

## 🎓 Lessons Learned

### **What Went Well:**
1. ✅ Clean separation of concerns
2. ✅ Type-safe database queries (Prisma)
3. ✅ Comprehensive error handling
4. ✅ Docker makes deployment trivial
5. ✅ AI integration was straightforward

### **Challenges Overcome:**
1. ⚠️ Async file processing coordination
2. ⚠️ AI prompt engineering for consistency
3. ⚠️ Handling various CSV formats
4. ⚠️ Docker networking configuration

### **Would Do Differently:**
1. 🔄 Add rate limiting from start
2. 🔄 Implement caching earlier
3. 🔄 More comprehensive logging
4. 🔄 Frontend testing (Jest/Cypress)

---

## 📚 References & Resources

**Documentation:**
- Express.js: https://expressjs.com
- Prisma: https://prisma.io
- Google Gemini: https://ai.google.dev
- Docker: https://docs.docker.com
- PostgreSQL: https://postgresql.org

**Best Practices:**
- RESTful API Design: https://restfulapi.net
- JWT Authentication: https://jwt.io
- Security Headers: https://helmetjs.github.io

---

## 🎉 Conclusion

This architecture provides:

✅ **Scalability:** Can handle growth from 100 to 10,000+ users  
✅ **Maintainability:** Clean code, clear separation  
✅ **Security:** Industry-standard authentication & encryption  
✅ **Performance:** Optimized queries, async processing  
✅ **Flexibility:** Easy to extend and modify  
✅ **Reliability:** Error handling, health checks  

**Built with care by Ryan James Francisco Indangan** 🚀

---

*Last Updated: October 22, 2025*

