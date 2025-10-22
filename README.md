# Supplier Order Management Solution

A backend API demo for managing supplier offers, product matching, and order management.

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose installed
- Node.js 18+ (for local development without Docker)

### Run with Docker (Recommended)

```bash
# Start the application
docker-compose up

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

The API will be available at: `http://localhost:3000`

### Run Locally (Without Docker)

```bash
# Install dependencies
npm install

# Start the server
npm start

# Or use nodemon for development
npm run dev
```

## 📡 API Endpoints

### Health Check
- `GET /health` - Check API health status

### API Information
- `GET /api/v1/` - Get API information and available endpoints

### Suppliers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/suppliers` | Get all suppliers |
| GET | `/api/v1/suppliers/:id` | Get supplier by ID |
| POST | `/api/v1/suppliers` | Create new supplier |
| PUT | `/api/v1/suppliers/:id` | Update supplier |
| DELETE | `/api/v1/suppliers/:id` | Delete supplier |

**Query Parameters:**
- `status` - Filter by status (active, inactive, suspended)

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/products` | Get all products |
| GET | `/api/v1/products/:id` | Get product by ID |
| GET | `/api/v1/products/search` | Search/match products |
| POST | `/api/v1/products` | Create new product |
| PUT | `/api/v1/products/:id` | Update product |
| DELETE | `/api/v1/products/:id` | Delete product |

**Query Parameters:**
- `supplierId` - Filter by supplier ID
- `category` - Filter by category
- `status` - Filter by status
- `query` - Search term (for /search endpoint)
- `minPrice` - Minimum price (for /search endpoint)
- `maxPrice` - Maximum price (for /search endpoint)

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/orders` | Get all orders |
| GET | `/api/v1/orders/:id` | Get order by ID |
| POST | `/api/v1/orders` | Create new order |
| PUT | `/api/v1/orders/:id` | Update order |
| PATCH | `/api/v1/orders/:id/status` | Update order status |
| DELETE | `/api/v1/orders/:id` | Delete order |

**Query Parameters:**
- `supplierId` - Filter by supplier ID
- `status` - Filter by status (pending, confirmed, shipped, delivered, cancelled)

## 📝 Sample Requests

### Create a Supplier

```bash
curl -X POST http://localhost:3000/api/v1/suppliers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ABC Supplies",
    "email": "contact@abcsupplies.com",
    "phone": "+1-555-0300",
    "address": "789 Supply Lane, Chicago, IL 60601",
    "rating": 4.8,
    "status": "active"
  }'
```

### Create a Product

```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mechanical Keyboard",
    "sku": "KB-2024-001",
    "description": "RGB Mechanical Gaming Keyboard",
    "category": "Electronics",
    "price": 89.99,
    "currency": "USD",
    "stockQuantity": 50,
    "supplierId": "sup-001",
    "status": "available",
    "specifications": {
      "color": "Black",
      "switchType": "Cherry MX Blue",
      "backlight": "RGB"
    }
  }'
```

### Create an Order

```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "supplierId": "sup-001",
    "items": [
      {
        "productId": "prod-001",
        "quantity": 10,
        "unitPrice": 29.99
      },
      {
        "productId": "prod-002",
        "quantity": 5,
        "unitPrice": 49.99
      }
    ],
    "deliveryAddress": "123 Business St, San Francisco, CA 94102",
    "expectedDeliveryDate": "2024-11-01",
    "notes": "Please deliver before 5 PM"
  }'
```

### Search Products

```bash
# Search by name/description
curl "http://localhost:3000/api/v1/products/search?query=mouse"

# Search with price range
curl "http://localhost:3000/api/v1/products/search?minPrice=20&maxPrice=50"
```

### Update Order Status

```bash
curl -X PATCH http://localhost:3000/api/v1/orders/{orderId}/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "confirmed"
  }'
```

## 🏗️ Project Structure

```
supplier-order-management/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── middlewares/      # Custom middleware
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   ├── services/        # Business logic & data store
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose configuration
├── package.json         # Dependencies
└── README.md           # This file
```

## 🔧 Technology Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Security:** Helmet.js
- **Logging:** Morgan
- **Validation:** Express Validator
- **Data Storage:** In-memory (for demo purposes)

## 📦 Sample Data

The application comes pre-loaded with sample data:

**Suppliers:**
- Tech Supplies Inc. (ID: sup-001)
- Office Essentials Ltd. (ID: sup-002)

**Products:**
- Wireless Mouse (ID: prod-001) - Supplier: sup-001
- USB-C Hub (ID: prod-002) - Supplier: sup-001

## 🧪 Testing with Postman

Import the following endpoints into Postman or use the API documentation at:
`http://localhost:3000/api/v1/`

A Postman collection can be added for automated testing.

## 🐳 Docker Commands

```bash
# Build the image
docker-compose build

# Start services
docker-compose up

# Stop services
docker-compose down

# View logs
docker-compose logs -f api

# Restart service
docker-compose restart api

# Remove containers and volumes
docker-compose down -v
```

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "status": 400,
  "message": "Error description",
  "errors": { ... }
}
```

## 🔐 Data Models

### Supplier
- id, name, email, phone, address, rating, status, createdAt, updatedAt

### Product
- id, name, sku, description, category, price, currency, stockQuantity, supplierId, status, specifications, createdAt, updatedAt

### Order
- id, orderNumber, supplierId, items[], status, totalAmount, currency, deliveryAddress, expectedDeliveryDate, notes, createdAt, updatedAt

## 🚧 Future Enhancements

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Authentication & Authorization (JWT)
- [ ] Rate limiting
- [ ] Request validation middleware
- [ ] Automated tests (Jest/Mocha)
- [ ] Postman collection for automated testing
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Pagination for list endpoints
- [ ] Advanced search and filtering
- [ ] Order tracking and notifications

## 📄 License

MIT

## 👨‍💻 Development

```bash
# Install dependencies
npm install

# Run in development mode with auto-reload
npm run dev

# Run in production mode
npm start
```

---

**Built for IT Technical Assessment - Supplier Order Management Solution**

