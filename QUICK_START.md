# Quick Start Guide

## Option 1: Docker (Recommended)

The fastest way to get started is with Docker:

```bash
docker-compose up
```

Access the API at: http://localhost:3000

### Test the API

1. **Health Check:**
   ```bash
   curl http://localhost:3000/health
   ```

2. **Get API Info:**
   ```bash
   curl http://localhost:3000/api/v1/
   ```

3. **Get Sample Suppliers:**
   ```bash
   curl http://localhost:3000/api/v1/suppliers
   ```

4. **Get Sample Products:**
   ```bash
   curl http://localhost:3000/api/v1/products
   ```

## Option 2: Local Development

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start the Server:**
   ```bash
   npm start
   ```

3. **Or use development mode with auto-reload:**
   ```bash
   npm run dev
   ```

## Verify Installation

### Using Browser
Open your browser and navigate to:
- http://localhost:3000/health
- http://localhost:3000/api/v1/

### Using Postman
1. Import `POSTMAN_COLLECTION.json` into Postman
2. The collection includes all API endpoints with sample requests
3. Base URL is set to `http://localhost:3000`

### Using curl

**Create a new supplier:**
```bash
curl -X POST http://localhost:3000/api/v1/suppliers \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test Supplier\",\"email\":\"test@supplier.com\",\"phone\":\"+1-555-9999\",\"status\":\"active\"}"
```

**Create a new product:**
```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test Product\",\"sku\":\"TEST-001\",\"price\":99.99,\"stockQuantity\":100,\"supplierId\":\"sup-001\"}"
```

**Create a new order:**
```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d "{\"supplierId\":\"sup-001\",\"items\":[{\"productId\":\"prod-001\",\"quantity\":5,\"unitPrice\":29.99}],\"deliveryAddress\":\"123 Test St\"}"
```

## Expected Output

### Health Check Response:
```json
{
  "status": "OK",
  "timestamp": "2024-10-22T12:00:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

### API Info Response:
```json
{
  "success": true,
  "message": "Supplier Order Management API",
  "version": "1.0.0",
  "endpoints": {
    "suppliers": "/api/v1/suppliers",
    "products": "/api/v1/products",
    "orders": "/api/v1/orders"
  }
}
```

## Common Issues

### Port Already in Use
If port 3000 is already in use:

1. **For Docker:**
   Edit `docker-compose.yml` and change the port mapping:
   ```yaml
   ports:
     - "3001:3000"  # Use port 3001 instead
   ```

2. **For Local:**
   Create/edit `.env` file:
   ```
   PORT=3001
   ```

### Docker Issues
If Docker build fails:
```bash
# Clear Docker cache and rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up
```

## Next Steps

1. ✅ API is running
2. ✅ Test with sample data (2 suppliers, 2 products included)
3. ✅ Import Postman collection for comprehensive testing
4. ✅ Create your own suppliers, products, and orders
5. ⏭️ Add automated tests (coming soon)

## Support

For detailed API documentation, see [README.md](README.md)

For Postman testing, import [POSTMAN_COLLECTION.json](POSTMAN_COLLECTION.json)

