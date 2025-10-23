# Environment Configuration

## ✅ **No .env File Required!**

All environment variables are **pre-configured** in `docker-compose.yml`. The system works out-of-the-box when running:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

---

## Pre-Configured Environment Variables

### **Database (PostgreSQL)**
```yaml
POSTGRES_USER: postgres
POSTGRES_PASSWORD: postgres
POSTGRES_DB: supplierdb
```

### **API Server**
```yaml
NODE_ENV: development
PORT: 3000
API_VERSION: v1
LOG_LEVEL: info
DATABASE_URL: postgresql://postgres:postgres@postgres:5432/supplierdb?schema=public
JWT_SECRET: supplier-order-mgmt-secret-key-2024
GEMINI_API_KEY: AIzaSyDwE9AroHeB22TRHsm35e1hotQHKd9XNSE
```

---

## For Custom Configuration

If you need to override default values, create a `.env` file in the root directory:

```env
# Database
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB=your_database

# API
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
PORT=3000
```

Then update `docker-compose.yml` to use these variables:

```yaml
environment:
  - POSTGRES_USER=${POSTGRES_USER}
  - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
  # ... etc
```

**But this is OPTIONAL!** The system works perfectly with hardcoded values for development/testing.

---

## Security Note

For **production deployment**, you should:
1. Create a `.env` file with secure credentials
2. Use strong, randomly generated secrets
3. Never commit `.env` to version control (already in `.gitignore`)
4. Rotate API keys regularly

---

## Quick Reference

**Current Setup:**
- ✅ No .env file needed
- ✅ All configs in docker-compose.yml
- ✅ Works immediately after `docker-compose up`
- ✅ Demo user: `ryan@test.com` / `test123`
- ✅ Gemini API key included (development only)

**For Production:**
- ⚠️ Create `.env` with secure credentials
- ⚠️ Update `GEMINI_API_KEY` with your own key
- ⚠️ Change `JWT_SECRET` to random string
- ⚠️ Use strong database passwords

