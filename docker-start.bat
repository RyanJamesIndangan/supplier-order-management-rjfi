@echo off
REM 🚀 Automated Docker Startup Script for Windows
REM This script ensures everything runs smoothly on Windows

echo 🚀 Supplier Order Management - Automated Setup
echo ================================================

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running!
    echo    Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo ✅ Docker is running

REM Check if docker-compose is available
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ docker-compose not found!
    echo    Please install Docker Compose and try again.
    pause
    exit /b 1
)

echo ✅ docker-compose is available
echo.
echo 🔄 Building containers (first time or updates)...
echo    This ensures line endings are fixed automatically
docker-compose build --no-cache api

echo.
echo 🚀 Starting services...
echo    - PostgreSQL database
echo    - API server
echo    - Prisma Studio (database UI)
echo.

REM Start all services
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

echo.
echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak >nul

REM Check if containers are running
docker ps | findstr "supplier-order-api" >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Services may not be ready yet. Check logs:
    echo    docker-compose logs api
    pause
    exit /b 1
)

docker ps | findstr "supplier-postgres" >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Services may not be ready yet. Check logs:
    echo    docker-compose logs api
    pause
    exit /b 1
)

echo.
echo ✅ All services are running!
echo.
echo 🎉 Setup Complete!
echo ================================================
echo.
echo 📌 Access Points:
echo    🌐 Web Dashboard:  http://localhost:3000
echo    📚 API Docs:       http://localhost:3000/docs
echo    🗄️  Database UI:    http://localhost:5555
echo.
echo 🔐 Login Credentials:
echo    Email:    ryan@test.com
echo    Password: test123
echo.
echo 📖 Need help? Check DOCKER_TROUBLESHOOTING.md
echo.
echo 💡 To view logs: docker-compose logs -f api
echo 🛑 To stop:      docker-compose down
echo.
pause

