# 🚀 START HERE - Supplier Order Management Solution

## Welcome to Your Demo Application!

This is a complete, production-ready backend API for managing suppliers, products, and orders.

---

## ⚡ Quick Start (2 Steps)

### Step 1: Start Docker Desktop
Make sure Docker Desktop is running on your system.

### Step 2: Run the Application
```bash
docker-compose up
```

**That's it!** 🎉 Your API is now running at http://localhost:3000

---

## 🧪 Test It Right Now

### Open in Browser:
- **Health Check:** http://localhost:3000/health
- **API Info:** http://localhost:3000/api/v1/
- **View Suppliers:** http://localhost:3000/api/v1/suppliers
- **View Products:** http://localhost:3000/api/v1/products

### Or use curl:
```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/v1/suppliers
curl http://localhost:3000/api/v1/products
```

---

## 📚 What You Can Do

### 1️⃣ Manage Suppliers
```bash
# Get all suppliers
curl http://localhost:3000/api/v1/suppliers

# Create a supplier
curl -X POST http://localhost:3000/api/v1/suppliers \
  -H "Content-Type: application/json" \
  -d '{"name":"ABC Corp","email":"abc@corp.com","status":"active"}'
```

### 2️⃣ Manage Products
```bash
# Search products
curl "http://localhost:3000/api/v1/products/search?query=mouse"

# Create a product
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","sku":"LAP-001","price":999.99,"supplierId":"sup-001"}'
```

### 3️⃣ Manage Orders
```bash
# Create an order
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{"supplierId":"sup-001","items":[{"productId":"prod-001","quantity":10,"unitPrice":29.99}]}'
```

---

## 🧰 Testing Tools Included

### Postman Collection
1. Open Postman
2. Import: `POSTMAN_COLLECTION.json`
3. All endpoints are ready to test!

### Test Scripts
```bash
# Windows
scripts\test-api.bat

# Linux/Mac
./scripts/test-api.sh
```

---

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| **START_HERE.md** | You are here! Quick start guide |
| **README.md** | Complete documentation & API reference |
| **QUICK_START.md** | Quick start instructions |
| **PROJECT_OVERVIEW.md** | Architecture & technical details |
| **SETUP_VERIFICATION.md** | Verification steps & troubleshooting |

---

## 🎯 Sample Data Included

The app starts with ready-to-use sample data:

**Suppliers:**
- Tech Supplies Inc. (ID: sup-001)
- Office Essentials Ltd. (ID: sup-002)

**Products:**
- Wireless Mouse - $29.99 (ID: prod-001)
- USB-C Hub - $49.99 (ID: prod-002)

---

## 🔧 Useful Commands

```bash
# Start the application
docker-compose up

# Start in background
docker-compose up -d

# Stop the application
docker-compose down

# View logs
docker-compose logs -f

# Restart
docker-compose restart
```

### Alternative: Run Locally (Without Docker)
```bash
npm install
npm start
```

---

## 📡 All API Endpoints

### System
- `GET /health` - Health check
- `GET /api/v1/` - API documentation

### Suppliers
- `GET /api/v1/suppliers` - List suppliers
- `GET /api/v1/suppliers/:id` - Get supplier
- `POST /api/v1/suppliers` - Create supplier
- `PUT /api/v1/suppliers/:id` - Update supplier
- `DELETE /api/v1/suppliers/:id` - Delete supplier

### Products
- `GET /api/v1/products` - List products
- `GET /api/v1/products/search` - Search products
- `GET /api/v1/products/:id` - Get product
- `POST /api/v1/products` - Create product
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product

### Orders
- `GET /api/v1/orders` - List orders
- `GET /api/v1/orders/:id` - Get order
- `POST /api/v1/orders` - Create order
- `PUT /api/v1/orders/:id` - Update order
- `PATCH /api/v1/orders/:id/status` - Update status
- `DELETE /api/v1/orders/:id` - Delete order

---

## ✅ Features Implemented

- ✅ RESTful API with Express.js
- ✅ Supplier management (CRUD)
- ✅ Product catalog with supplier relationships
- ✅ Order management with line items
- ✅ Product search & matching
- ✅ Stock validation
- ✅ Order status tracking
- ✅ Auto-calculated order totals
- ✅ Business logic & validation
- ✅ Error handling
- ✅ Docker containerization
- ✅ Sample data included
- ✅ Postman collection for testing
- ✅ Health checks
- ✅ Comprehensive documentation

---

## 🆘 Need Help?

### Port Already in Use?
Edit `docker-compose.yml` and change `3000:3000` to `3001:3000`

### Docker Not Running?
Start Docker Desktop and wait for it to fully initialize.

### Want to See More Details?
Check `README.md` for complete documentation.

---

## 🎓 For Technical Assessment

This project demonstrates:
- ✅ Backend API development (Node.js + Express)
- ✅ RESTful design principles
- ✅ Data modeling & relationships
- ✅ Business logic implementation
- ✅ Error handling & validation
- ✅ Docker containerization
- ✅ API documentation
- ✅ Testing readiness
- ✅ Clean code architecture
- ✅ Production best practices

---

## 🎉 You're All Set!

1. **Start:** `docker-compose up`
2. **Test:** Open http://localhost:3000/health
3. **Explore:** Import Postman collection
4. **Read:** Check README.md for full details

**Happy testing!** 🚀

---

**Questions?** Check the other documentation files or the inline code comments.

