#!/bin/bash

# HOMY UI v3 Development Environment Setup
# ======================================

echo "🚀 Setting up HOMY UI v3 development environment..."

# Create necessary directories
mkdir -p test/{integration,mocks,utils}

# Clean existing build artifacts
echo "🧹 Cleaning build artifacts..."
npm run clean:all

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Setup test environment
echo "🧪 Setting up test environment..."
npm run test:init

# Build initial development bundle
echo "🔨 Building initial development bundle..."
NODE_ENV=development npm run build

echo "✨ Development environment setup complete!"
echo "
Available commands:
------------------
npm run dev         - Start development server
npm run dev:turbo   - Start development server with Turbopack
npm run test        - Run tests
npm run test:watch  - Run tests in watch mode
npm run build       - Build for production

For more commands, check package.json scripts.
"

# Check if everything is working
echo "🔍 Performing environment checks..."

# Check Node.js version
NODE_VERSION=$(node -v)
echo "Node.js version: $NODE_VERSION"

# Check npm version
NPM_VERSION=$(npm -v)
echo "npm version: $NPM_VERSION"

# Check Next.js installation
if [ -d "node_modules/next" ]; then
  NEXT_VERSION=$(node -p "require('./package.json').dependencies.next")
  echo "Next.js version: $NEXT_VERSION ✅"
else
  echo "⚠️  Next.js not found in node_modules!"
fi

# Final instructions
echo "
🎉 Setup complete! Start developing with:
----------------------------------------
npm run dev

Happy coding! 🚀
" 