# 🚀 QUICK START - Fresh Clone (Copy & Paste)

**For evaluators/testers doing a fresh clone**

## Windows

```cmd
git clone https://github.com/RyanJamesIndangan/supplier-order-management-rjfi.git
cd supplier-order-management-rjfi
docker-start.bat
```

Wait 60 seconds, then open: **http://localhost:3000**

Login: `ryan@test.com` / `test123`

---

## Mac/Linux

```bash
git clone https://github.com/RyanJamesIndangan/supplier-order-management-rjfi.git
cd supplier-order-management-rjfi
chmod +x docker-start.sh
./docker-start.sh
```

Wait 60 seconds, then open: **http://localhost:3000**

Login: `ryan@test.com` / `test123`

---

## Manual Method (If Scripts Don't Work)

```bash
# Clone
git clone https://github.com/RyanJamesIndangan/supplier-order-management-rjfi.git
cd supplier-order-management-rjfi

# Build (REQUIRED for first time - fixes line endings automatically)
docker-compose build --no-cache api

# Start
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Wait 60 seconds, then check
docker-compose logs api | tail -20
```

Expected output:
```
✅ Database setup complete!
🚀 Server running in development mode
📡 Listening on port 3000
```

---

## If Container Keeps Restarting

**This means the image wasn't built with the line ending fix!**

```bash
# Clean everything
docker-compose down -v

# Rebuild from scratch (this applies dos2unix fix)
docker-compose build --no-cache api

# Start fresh
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Check logs
docker-compose logs -f api
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Exit code 255 / Restarting | Run `docker-compose build --no-cache api` first! |
| Network errors | Run `./docker-fix.sh` or `docker-fix.bat` |
| Port already in use | Change ports in `docker-compose.yml` or stop conflicting services |
| Docker not running | Start Docker Desktop first |

---

## Access Points After Success

- 🌐 **Web Dashboard**: http://localhost:3000
- 📚 **API Docs**: http://localhost:3000/docs
- 🗄️ **Database UI**: http://localhost:5555
- ✅ **Health Check**: http://localhost:3000/health

---

**Need more help?** See `DOCKER_TROUBLESHOOTING.md` or `README.md`

