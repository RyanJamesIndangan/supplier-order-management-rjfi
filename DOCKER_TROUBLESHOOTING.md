# 🔧 Docker Troubleshooting Guide

## ✅ **GOOD NEWS: Line Ending Issues Are Now Automated!**

As of the latest version, the Dockerfile **automatically fixes line endings** during the build process. This means:
- ✅ Works on Windows, Mac, and Linux without manual configuration
- ✅ No need to run `sed` or `dos2unix` commands manually
- ✅ `.gitattributes` ensures consistent line endings across all platforms
- ✅ Clone and run - it just works!

---

## 🚀 Recommended: Use the Automated Startup Script

```bash
# Windows
docker-start.bat

# Mac/Linux
./docker-start.sh
```

This script:
- ✅ Checks if Docker is running
- ✅ Verifies docker-compose is installed
- ✅ Starts all services automatically
- ✅ Displays helpful status messages
- ✅ Shows all access URLs when ready

---

## Quick Fix for "no such file or directory" Error

If you're using an older clone and encounter:
```
exec /app/docker-entrypoint.sh: no such file or directory
```

Run these commands:

```bash
# 1. Stop and remove all containers/volumes
docker-compose down -v

# 2. Pull latest changes (includes automated fix)
git pull origin main

# 3. Remove Docker cache and rebuild (this applies the fix)
docker-compose build --no-cache api

# 4. Start everything fresh
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# 5. Check logs to verify it's working
docker-compose logs api | tail -20
```

## Expected Output

You should see:
```
✅ Database setup complete!
🚀 Starting application...
🚀 Server running in development mode
📡 Listening on port 3000
```

## Access Points

- Main App: http://localhost:3000
- Login: ryan@test.com / test123
- Prisma Studio: http://localhost:5555

---

## Alternative Fixes (Usually Not Needed!)

### Option A: Fresh clone with automation
```bash
# Start completely fresh with automated setup
cd ..
rm -rf supplier-order-management-rjfi
git clone https://github.com/RyanJamesIndangan/supplier-order-management-rjfi.git
cd supplier-order-management-rjfi

# Use the automated startup script
./docker-start.sh          # Mac/Linux
docker-start.bat           # Windows
```

### Option B: Manual line ending fix (Legacy - Not needed anymore!)
```bash
# This is now automated in the Dockerfile, but if you need it:
sed -i 's/\r$//' docker-entrypoint.sh

# Then rebuild
docker-compose build --no-cache api
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

---

## Common Issues

**Q: Still getting "no such file or directory"?**
- **Solution**: Pull latest changes with `git pull origin main`
- The automated fix is now included in the Dockerfile
- Make sure you ran `docker-compose build --no-cache api`
- Docker might be using cached layers - `--no-cache` forces a fresh build

**Q: Permission denied on docker-entrypoint.sh?**
- **Solution**: This is now automated in the Dockerfile (line 25)
- If you still see it, run: `chmod +x docker-entrypoint.sh` and rebuild

**Q: Container keeps restarting?**
- Check logs: `docker-compose logs api`
- Make sure PostgreSQL started: `docker-compose logs postgres`
- Wait 30-60 seconds for first-time database setup

**Q: Docker Desktop not running?**
- **Solution**: Open Docker Desktop and wait for "running" status
- The `docker-start.sh`/`docker-start.bat` scripts check this automatically

**Q: Port conflicts (3000, 5432, or 5555)?**
- **Solution**: Stop other services using these ports
- Or modify ports in `docker-compose.yml`

---

## 🎯 Best Practice: Always Use the Startup Script

```bash
# Windows
docker-start.bat

# Mac/Linux
./docker-start.sh
```

The startup scripts include automatic checks and helpful error messages!

