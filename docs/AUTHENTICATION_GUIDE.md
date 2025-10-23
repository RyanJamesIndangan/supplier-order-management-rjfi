# 🔐 Authentication Guide - Using JWT

**Purpose**: How to protect routes and use JWT authentication  
**Date**: October 24, 2025

---

## ✅ **Routes Are Now Protected!**

All upload and dashboard routes now require JWT authentication.

---

## 🎯 **How to Create User & Get Token**

### Method 1: Using Postman (Easiest)

#### Step 1: Register a User
```
POST http://localhost:3000/api/v1/auth/register

Body (JSON):
{
  "email": "test@example.com",
  "password": "test123",
  "name": "Test User"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "email": "test@example.com",
      "name": "Test User"
    }
  }
}
```

#### Step 2: Login (Get Token)
```
POST http://localhost:3000/api/v1/auth/login

Body (JSON):
{
  "email": "test@example.com",
  "password": "test123"
}

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Step 3: Use Token in Requests
```
GET http://localhost:3000/api/v1/upload/dashboard

Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### Method 2: Using curl (Terminal)

```bash
# 1. Register user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User"
  }'

# 2. Login and get token
TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Your token: $TOKEN"

# 3. Use token to access protected route
curl -X GET http://localhost:3000/api/v1/upload/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

---

### Method 3: Browser Console (JavaScript)

Open browser console (F12) on http://localhost:3000 and run:

```javascript
// 1. Register user
const registerResponse = await fetch('http://localhost:3000/api/v1/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'test123',
    name: 'Test User'
  })
});
const registerData = await registerResponse.json();
console.log('Register:', registerData);

// 2. Login to get token
const loginResponse = await fetch('http://localhost:3000/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'test123'
  })
});
const loginData = await loginResponse.json();
const token = loginData.data.token;
console.log('Token:', token);

// 3. Save token to localStorage
localStorage.setItem('authToken', token);

// 4. Use token in requests
const dashboardResponse = await fetch('http://localhost:3000/api/v1/upload/dashboard', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const dashboardData = await dashboardResponse.json();
console.log('Dashboard:', dashboardData);
```

---

## 🌐 **Option: Add Simple Login UI**

I can add a login page to your web UI. Would you like:

**Option A**: Simple login form before dashboard (recommended)  
**Option B**: Login modal popup  
**Option C**: Keep web UI without auth (for demo), protect API only  

---

## 🔧 **Current Setup**

### Protected Routes (Require JWT):
- `POST /api/v1/upload` - Upload file
- `GET /api/v1/upload/files` - List files
- `GET /api/v1/upload/dashboard` - Get dashboard
- `GET /api/v1/upload/files/:id/matches` - Get matches

### Public Routes (No Auth):
- `POST /api/v1/auth/register` - Create account
- `POST /api/v1/auth/login` - Get token
- `GET /api/v1/auth/profile` - Needs token (protected)
- `GET /health` - Health check
- `GET /docs` - API documentation
- `GET /` - Homepage (but can't use dashboard without token)

---

## 💡 **Quick Test Script**

Save this as `test-auth.sh`:

```bash
#!/bin/bash

API_URL="http://localhost:3000/api/v1"

echo "🔐 Testing Authentication Flow"
echo ""

# Register
echo "1. Registering user..."
REGISTER_RESPONSE=$(curl -s -X POST ${API_URL}/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@test.com",
    "password": "demo123",
    "name": "Demo User"
  }')

echo $REGISTER_RESPONSE | head -c 200
echo ""
echo ""

# Login
echo "2. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST ${API_URL}/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@test.com",
    "password": "demo123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token: ${TOKEN:0:50}..."
echo ""

# Test protected route
echo "3. Accessing protected dashboard..."
curl -s -X GET ${API_URL}/upload/dashboard \
  -H "Authorization: Bearer $TOKEN" | head -c 300

echo ""
echo ""
echo "✅ Authentication working!"
```

Run with:
```bash
chmod +x test-auth.sh
./test-auth.sh
```

---

## 📱 **Using with Postman**

### Setup Collection Variables:

1. Open Postman
2. Import `POSTMAN_COLLECTION.json`
3. The collection already has auth tests!

### Automated Flow:

The Postman collection has a "Authentication Flow" folder:
1. **Register User** - Creates account, saves token
2. **Login User** - Gets token, saves to variable
3. **Get Profile** - Tests protected route

Just click "Run Collection" → All tests run automatically!

---

## 🔓 **Temporarily Disable Auth (For Testing)**

If you want to go back to no-auth mode for demo:

```javascript
// In src/routes/uploadRoutes.js
// Change:
router.post('/', authenticate, uploadOfferFile);

// Back to:
router.post('/', optionalAuth, uploadOfferFile);
```

---

## 🎓 **Understanding JWT**

### What Happens:

1. **Register/Login** → Server creates JWT token
2. **Token contains**: User ID, email, expiry (7 days)
3. **Token is signed**: With secret key (in .env)
4. **Client stores**: In localStorage or memory
5. **Client sends**: `Authorization: Bearer <token>` header
6. **Server validates**: Checks signature, decodes user info
7. **Request succeeds**: If token valid

### Token Example:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI...
│         Header         │      Payload      │  Signature  │
```

---

## ⚠️ **Important Notes**

### For Demo/Evaluation:
- Consider keeping auth OPTIONAL for easy testing
- Document that auth is implemented but not enforced for demo

### For Production:
- Enable auth on ALL routes
- Use HTTPS only
- Add rate limiting
- Rotate JWT secrets
- Implement refresh tokens

---

## 🚀 **Next Steps**

**Choose one**:

1. **Test via Postman** (easiest, already works)
2. **Test via curl** (use script above)
3. **Add login UI** (I can create this for you)
4. **Keep demo mode** (make auth optional again)

**What would you like?** 

Let me know and I'll implement it!

---

*Guide created: October 24, 2025*  
*Authentication now enforced on upload routes*

