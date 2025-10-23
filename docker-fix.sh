#!/bin/bash

# 🔧 Quick Docker Fix Script
# Cleans up orphaned containers and networks, then restarts everything

echo "🔧 Docker Quick Fix - Cleaning up orphaned containers..."

# Stop all containers
echo "⏹️  Stopping all containers..."
docker-compose down 2>/dev/null

# Remove orphaned Prisma Studio container
echo "🗑️  Removing orphaned containers..."
docker rm -f supplier-prisma-studio 2>/dev/null || true
docker rm -f supplier-order-api 2>/dev/null || true
docker rm -f supplier-postgres 2>/dev/null || true

# Prune orphaned networks
echo "🧹 Cleaning orphaned networks..."
docker network prune -f

echo ""
echo "🚀 Starting fresh..."
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --force-recreate

echo ""
echo "⏳ Waiting for services to start..."
sleep 15

echo ""
echo "✅ Done! Check status:"
docker ps

echo ""
echo "🌐 Access your app:"
echo "   - Web: http://localhost:3000"
echo "   - API: http://localhost:3000/docs"
echo "   - DB:  http://localhost:5555"
echo ""

