#!/bin/sh
set -e

echo "🔄 Starting entrypoint script..."

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
max_retries=30
retry_count=0

while [ $retry_count -lt $max_retries ]; do
  if node -e "
    const { Client } = require('pg');
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    client.connect()
      .then(() => { client.end(); process.exit(0); })
      .catch(() => process.exit(1));
  " 2>/dev/null; then
    echo "✅ PostgreSQL is ready!"
    break
  fi
  
  retry_count=$((retry_count + 1))
  echo "   Attempt $retry_count/$max_retries - PostgreSQL is unavailable, sleeping..."
  sleep 2
done

if [ $retry_count -eq $max_retries ]; then
  echo "❌ Failed to connect to PostgreSQL after $max_retries attempts"
  exit 1
fi

# Run Prisma migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy

# Seed database if AUTO_SEED is set (default: true)
AUTO_SEED=${AUTO_SEED:-true}
if [ "$AUTO_SEED" = "true" ]; then
  echo "🌱 Seeding database..."
  npm run seed || echo "⚠️  Seeding failed or already seeded"
fi

echo "✅ Database setup complete!"
echo "🚀 Starting application..."

# Execute the main command
exec "$@"
