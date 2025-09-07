#!/bin/bash

# Digital Commerce Platform - Development Startup Script
echo "🚀 Starting Digital Commerce Platform Development Environment"
echo "=============================================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if required tools are installed
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed."; exit 1; }

echo "✅ Prerequisites check passed"

# Start Docker services
echo "🔄 Starting Docker services (PostgreSQL, Redis, Elasticsearch)..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
echo "🔍 Checking service health..."

# Check PostgreSQL
if docker-compose exec -T postgres pg_isready -U dev -d digital_commerce > /dev/null 2>&1; then
    echo "✅ PostgreSQL is ready"
else
    echo "❌ PostgreSQL is not ready"
    exit 1
fi

# Check Redis
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis is ready"
else
    echo "❌ Redis is not ready"
    exit 1
fi

# Check Elasticsearch
if curl -s http://localhost:9200/_cluster/health > /dev/null 2>&1; then
    echo "✅ Elasticsearch is ready"
else
    echo "❌ Elasticsearch is not ready"
    exit 1
fi

echo "✅ All services are ready"

# Install dependencies if needed
echo "🔄 Installing dependencies..."
npm install

# Set up environment files
echo "🔄 Setting up environment files..."

# Backend environment
if [ ! -f backend/.env ]; then
    cp backend/env.example backend/.env
    echo "✅ Created backend/.env from template"
else
    echo "ℹ️  Backend .env already exists"
fi

# Frontend environment
if [ ! -f frontend/.env.local ]; then
    cp frontend/env.local.example frontend/.env.local
    echo "✅ Created frontend/.env.local from template"
else
    echo "ℹ️  Frontend .env.local already exists"
fi

# Run database migrations
echo "🔄 Running database migrations..."
cd backend
node scripts/migrate.js
cd ..

echo "✅ Database migrations completed"

# Build applications
echo "🔄 Building applications..."

# Build backend
echo "Building backend..."
cd backend
npm run build
cd ..

# Build frontend
echo "Building frontend..."
cd frontend
npm run build
cd ..

echo "✅ Applications built successfully"

# Start development servers
echo "🚀 Starting development servers..."
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📊 Health Check: http://localhost:8000/health"
echo "🔍 Elasticsearch: http://localhost:9200"
echo "📈 Kibana: http://localhost:5601"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Start both servers concurrently
npm run dev

