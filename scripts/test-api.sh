#!/bin/bash

# Simple API test script
# Usage: ./scripts/test-api.sh

BASE_URL="http://localhost:3000"
API_URL="$BASE_URL/api/v1"

echo "==========================================="
echo "Testing Supplier Order Management API"
echo "==========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test health endpoint
echo "1. Testing Health Endpoint..."
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/health")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✓ Health check passed${NC}"
    echo "$body" | python -m json.tool 2>/dev/null || echo "$body"
else
    echo -e "${RED}✗ Health check failed (HTTP $http_code)${NC}"
fi
echo ""

# Test API info
echo "2. Testing API Info Endpoint..."
response=$(curl -s -w "\n%{http_code}" "$API_URL/")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✓ API info retrieved${NC}"
else
    echo -e "${RED}✗ API info failed (HTTP $http_code)${NC}"
fi
echo ""

# Test get all suppliers
echo "3. Testing GET /suppliers..."
response=$(curl -s -w "\n%{http_code}" "$API_URL/suppliers")
http_code=$(echo "$response" | tail -n1)

if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✓ Get suppliers passed${NC}"
else
    echo -e "${RED}✗ Get suppliers failed (HTTP $http_code)${NC}"
fi
echo ""

# Test get all products
echo "4. Testing GET /products..."
response=$(curl -s -w "\n%{http_code}" "$API_URL/products")
http_code=$(echo "$response" | tail -n1)

if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✓ Get products passed${NC}"
else
    echo -e "${RED}✗ Get products failed (HTTP $http_code)${NC}"
fi
echo ""

# Test create supplier
echo "5. Testing POST /suppliers..."
response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/suppliers" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Supplier","email":"test@supplier.com","phone":"+1-555-9999","status":"active"}')
http_code=$(echo "$response" | tail -n1)

if [ "$http_code" == "201" ]; then
    echo -e "${GREEN}✓ Create supplier passed${NC}"
else
    echo -e "${RED}✗ Create supplier failed (HTTP $http_code)${NC}"
fi
echo ""

# Test search products
echo "6. Testing GET /products/search..."
response=$(curl -s -w "\n%{http_code}" "$API_URL/products/search?query=mouse")
http_code=$(echo "$response" | tail -n1)

if [ "$http_code" == "200" ]; then
    echo -e "${GREEN}✓ Product search passed${NC}"
else
    echo -e "${RED}✗ Product search failed (HTTP $http_code)${NC}"
fi
echo ""

echo "==========================================="
echo "API Testing Complete"
echo "==========================================="

