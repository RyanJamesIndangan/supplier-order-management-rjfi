#!/bin/bash

# 🚀 Automated Docker Startup Script
# This script ensures everything runs smoothly on any platform

set -e

echo "🚀 Supplier Order Management - Automated Setup"
echo "================================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running!"
    echo "   Please start Docker Desktop and try again."
    exit 1
fi

echo "✅ Docker is running"

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose not found!"
    echo "   Please install Docker Compose and try again."
    exit 1
fi

echo "✅ docker-compose is available"
echo ""
echo "🔄 Starting services..."
echo "   - PostgreSQL database"
echo "   - API server"
echo "   - Prisma Studio (database UI)"
echo ""

# Start all services
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if containers are running
if docker ps | grep -q "supplier-order-api" && docker ps | grep -q "supplier-postgres"; then
    echo ""
    echo "✅ All services are running!"
    echo ""
    echo "🎉 Setup Complete!"
    echo "================================================"
    echo ""
    echo "📌 Access Points:"
    echo "   🌐 Web Dashboard:  http://localhost:3000"
    echo "   📚 API Docs:       http://localhost:3000/docs"
    echo "   🗄️  Database UI:    http://localhost:5555"
    echo ""
    echo "🔐 Login Credentials:"
    echo "   Email:    ryan@test.com"
    echo "   Password: test123"
    echo ""
    echo "📖 Need help? Check DOCKER_TROUBLESHOOTING.md"
    echo ""
    echo "💡 To view logs: docker-compose logs -f api"
    echo "🛑 To stop:      docker-compose down"
    echo ""
else
    echo "⚠️  Services may not be ready yet. Check logs:"
    echo "   docker-compose logs api"
    exit 1
fi

