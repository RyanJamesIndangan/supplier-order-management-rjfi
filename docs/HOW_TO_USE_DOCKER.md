# 🐳 How to Use Docker with This Project

## 🎯 The Simple Truth

**Docker runs your entire application - database AND API server!**

You don't need to:
- ❌ Run `npm install`
- ❌ Run `npm start`  
- ❌ Create `.env` files
- ❌ Run migrations manually
- ❌ Seed the database manually

**Docker does ALL of that automatically!**

---

## 📦 What's Inside Docker?

When you run `docker-compose up`, you get **2 containers**:

### Container 1: PostgreSQL Database
- **Name:** `supplier-postgres`
- **Port:** 5432
- **Database:** supplierdb
- **User:** postgres
- **Password:** postgres
- **What it does:** Stores all your data (suppliers, products, offers)

### Container 2: API Server
- **Name:** `supplier-order-api`
- **Port:** 3000
- **What it does:** 
  - Runs the Express.js backend
  - Connects to PostgreSQL
  - Serves API at http://localhost:3000

---

## 🚀 How to Use It

### Step 1: Start Docker Desktop

Make sure Docker Desktop is open and running.

### Step 2: Start Everything

Open your terminal in the project folder and run:

```bash
docker-compose up -d
```

**What `-d` means:** Detached mode (runs in background)

### Step 3: Wait

Wait **30 seconds** for:
- PostgreSQL to start
- Migrations to run
- Database to seed with sample data
- API server to start

### Step 4: Test

#### Option A: Use Postman (Easiest)

1. Open Postman
2. Click **Import**
3. Select `POSTMAN_COLLECTION.json`
4. Click any request (start with "Health Check")
5. Click **Send**
6. See the response!

#### Option B: Use Browser

Open in your browser:
- http://localhost:3000/health
- http://localhost:3000/api/v1/suppliers
- http://localhost:3000/api/v1/products
- http://localhost:3000/api/v1/offers

#### Option C: Use curl

```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/v1/suppliers
```

---

## 🔍 How to See What's Happening

### View Logs (Recommended)

```bash
# See everything
docker-compose logs -f

# See only API logs
docker-compose logs -f api

# See only database logs
docker-compose logs -f postgres
```

**What you'll see:**
- Server starting
- Database queries
- API requests
- Any errors

**Tip:** Keep this running in a terminal while testing!

### Check Container Status

```bash
docker-compose ps
```

**You should see:**
```
NAME                STATE       PORTS
supplier-postgres   Up          0.0.0.0:5432->5432/tcp
supplier-order-api  Up          0.0.0.0:3000->3000/tcp
```

### View in Docker Desktop

1. Open Docker Desktop
2. Click "Containers" in left sidebar
3. Find `supplier-order-management-rjfi`
4. Click to expand and see both containers
5. Click container name to see logs

---

## 🛑 How to Stop

### Stop Everything (Keep Data)

```bash
docker-compose down
```

**What this does:**
- Stops both containers
- Removes containers
- **KEEPS** your database data

**To start again:** `docker-compose up -d`

### Stop and Delete Everything

```bash
docker-compose down -v
```

**What this does:**
- Stops both containers
- Removes containers
- **DELETES** all database data

**Use this for:** Fresh start with sample data

---

## 🔄 Common Workflows

### Daily Development

```bash
# Start
docker-compose up -d

# Check logs while testing
docker-compose logs -f api

# Stop when done
docker-compose down
```

### Testing with Postman

```bash
# Start Docker
docker-compose up -d

# Wait 30 seconds

# Import POSTMAN_COLLECTION.json
# Click requests and Send!

# Stop when done
docker-compose down
```

### Fresh Start / Reset

```bash
# Delete everything
docker-compose down -v

# Start fresh (reseeds sample data)
docker-compose up -d

# Wait 30 seconds
```

### View/Edit Database

```bash
# Make sure Docker is running
docker-compose up -d

# Open database GUI (runs on your computer)
npm run prisma:studio

# Opens at http://localhost:5555
# Browse/edit data visually!
```

---

## 📊 What Sample Data is Loaded?

Every time you start fresh, you get:

**3 Suppliers:**
- Tech Supplies Inc.
- Office Essentials Ltd.
- Global Electronics Co.

**4 Products:**
- Wireless Mouse ($29.99)
- USB-C Hub ($49.99)
- Mechanical Keyboard ($89.99)
- Laptop Stand ($39.99)

**8 Supplier Offers:**
- Multiple suppliers offering same products
- Different prices
- Use for price comparison testing

---

## 🆘 Troubleshooting

### Problem: "Port 3000 is already in use"

**Cause:** Another application is using port 3000

**Fix Option 1 - Change Port:**
1. Edit `docker-compose.yml`
2. Find line: `- "3000:3000"`
3. Change to: `- "3001:3000"`
4. Save and run: `docker-compose up -d`
5. Access at: http://localhost:3001

**Fix Option 2 - Stop Other App:**
Find and stop whatever is using port 3000.

### Problem: Containers not starting

**Fix:**
```bash
# View errors
docker-compose logs

# Rebuild
docker-compose build --no-cache
docker-compose up -d
```

### Problem: Database connection errors

**Fix:**
```bash
# Stop everything
docker-compose down -v

# Start fresh
docker-compose up -d

# Wait 30 seconds
```

### Problem: No sample data

**Fix:**
```bash
# Seed manually
docker-compose exec api npm run seed
```

### Problem: "Cannot connect to Docker daemon"

**Cause:** Docker Desktop is not running

**Fix:** Start Docker Desktop and wait for it to fully start

---

## 💡 Pro Tips

### 1. Always Check Logs

```bash
docker-compose logs -f api
```

This shows you:
- When server is ready
- All API requests
- Database queries
- Errors

### 2. Use Prisma Studio

```bash
npm run prisma:studio
```

Visual database browser at http://localhost:5555

### 3. Keep Docker Desktop Open

See container status and logs visually

### 4. Test with Postman

Much easier than curl - import `POSTMAN_COLLECTION.json`

### 5. Fresh Start When Stuck

```bash
docker-compose down -v && docker-compose up -d
```

Solves 90% of problems!

---

## ❓ Common Questions

### Q: Do I need to run npm install?

**A: NO** - Docker does this inside the container

### Q: Do I need to create .env file?

**A: NO** - Docker has environment variables in docker-compose.yml

### Q: How do I run migrations?

**A: YOU DON'T** - Docker runs them automatically on startup

### Q: How do I seed the database?

**A: YOU DON'T** - Docker seeds it automatically on first run

### Q: Can I edit the code while Docker is running?

**A: YES** - But you need to restart:
```bash
docker-compose restart api
```

### Q: Where is my data stored?

**A:** In a Docker volume called `postgres_data`
- Persists between starts
- Deleted only with `docker-compose down -v`

### Q: Can I access the database directly?

**A: YES**
```bash
docker-compose exec postgres psql -U postgres -d supplierdb
```

---

## 📝 Complete Command Reference

```bash
# START
docker-compose up -d              # Start in background
docker-compose up                 # Start with logs visible

# STOP
docker-compose down               # Stop (keep data)
docker-compose down -v            # Stop and delete data

# LOGS
docker-compose logs -f            # All logs
docker-compose logs -f api        # API logs only
docker-compose logs -f postgres   # Database logs only

# STATUS
docker-compose ps                 # Check status
docker ps                         # See all containers

# RESTART
docker-compose restart            # Restart all
docker-compose restart api        # Restart API only

# REBUILD
docker-compose build              # Rebuild containers
docker-compose build --no-cache   # Force full rebuild

# DATABASE
npm run prisma:studio             # Open GUI
docker-compose exec api npm run seed    # Reseed
docker-compose exec postgres psql -U postgres -d supplierdb  # CLI

# CLEAN UP
docker-compose down -v            # Delete everything
docker system prune               # Clean Docker cache
```

---

## ✅ Quick Checklist

Before testing:
- [ ] Docker Desktop is running
- [ ] Terminal is in project folder
- [ ] Ran `docker-compose up -d`
- [ ] Waited 30 seconds
- [ ] Checked `docker-compose ps` shows "Up"

For Postman testing:
- [ ] Postman is open
- [ ] Imported `POSTMAN_COLLECTION.json`
- [ ] Base URL is `http://localhost:3000`
- [ ] Clicked "Health Check" → Send
- [ ] Got `{"status":"OK"}` response

---

## 🎉 Success!

If you can:
- ✅ Run `docker-compose up -d`
- ✅ Wait 30 seconds
- ✅ Open Postman
- ✅ Import the collection
- ✅ Click "Send" on any request
- ✅ Get a response

**You're using Docker correctly!** 🎊

---

**That's all you need to know to use Docker with this project!**

For more details: `SETUP_INSTRUCTIONS.md`

