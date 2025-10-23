@echo off
REM 🔧 Quick Docker Fix Script for Windows
REM Cleans up orphaned containers and networks, then restarts everything

echo 🔧 Docker Quick Fix - Cleaning up orphaned containers...

REM Stop all containers
echo ⏹️  Stopping all containers...
docker-compose down 2>nul

REM Remove orphaned containers
echo 🗑️  Removing orphaned containers...
docker rm -f supplier-prisma-studio 2>nul
docker rm -f supplier-order-api 2>nul
docker rm -f supplier-postgres 2>nul

REM Prune orphaned networks
echo 🧹 Cleaning orphaned networks...
docker network prune -f

echo.
echo 🚀 Starting fresh...
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --force-recreate

echo.
echo ⏳ Waiting for services to start...
timeout /t 15 /nobreak >nul

echo.
echo ✅ Done! Check status:
docker ps

echo.
echo 🌐 Access your app:
echo    - Web: http://localhost:3000
echo    - API: http://localhost:3000/docs
echo    - DB:  http://localhost:5555
echo.
pause

