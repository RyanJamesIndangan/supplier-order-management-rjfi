# 🔧 Fix for Docker Entrypoint Issue

## Quick Fix Commands

Run these commands in order:

```bash
# 1. Stop and remove all containers/volumes
docker-compose down -v

# 2. Pull latest changes
git pull origin main

# 3. Remove Docker cache and rebuild
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

## If Still Having Issues

### Option A: Manual line ending fix
```bash
# Convert line endings (run once)
sed -i 's/\r$//' docker-entrypoint.sh

# Then rebuild
docker-compose build --no-cache api
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

### Option B: Fresh clone
```bash
# Start completely fresh
cd ..
rm -rf supplier-order-management-rjfi
git clone https://github.com/RyanJamesIndangan/supplier-order-management-rjfi.git
cd supplier-order-management-rjfi
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

---

## Common Issues

**Q: Still getting "no such file or directory"?**
- Make sure you ran `docker-compose build --no-cache api`
- Docker might be using cached layers with old CRLF endings

**Q: Permission denied on docker-entrypoint.sh?**
- Run: `chmod +x docker-entrypoint.sh`
- Then rebuild

**Q: Container keeps restarting?**
- Check logs: `docker-compose logs api`
- Make sure PostgreSQL started: `docker-compose logs postgres`

