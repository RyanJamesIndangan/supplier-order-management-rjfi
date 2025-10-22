@echo off
REM Simple API test script for Windows
REM Usage: scripts\test-api.bat

set BASE_URL=http://localhost:3000
set API_URL=%BASE_URL%/api/v1

echo ===========================================
echo Testing Supplier Order Management API
echo ===========================================
echo.

echo 1. Testing Health Endpoint...
curl -s %BASE_URL%/health
echo.
echo.

echo 2. Testing API Info Endpoint...
curl -s %API_URL%/
echo.
echo.

echo 3. Testing GET /suppliers...
curl -s %API_URL%/suppliers
echo.
echo.

echo 4. Testing GET /products...
curl -s %API_URL%/products
echo.
echo.

echo 5. Testing POST /suppliers...
curl -s -X POST %API_URL%/suppliers -H "Content-Type: application/json" -d "{\"name\":\"Test Supplier\",\"email\":\"test@supplier.com\",\"phone\":\"+1-555-9999\",\"status\":\"active\"}"
echo.
echo.

echo 6. Testing GET /products/search...
curl -s "%API_URL%/products/search?query=mouse"
echo.
echo.

echo ===========================================
echo API Testing Complete
echo ===========================================

