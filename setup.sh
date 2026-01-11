#!/bin/bash

echo "🏫 School Duty Management System - Setup"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "✅ Dependencies installed"
echo ""

# Setup database
echo "🗄️  Setting up database..."
npm run db:setup

if [ $? -ne 0 ]; then
    echo "❌ Failed to setup database"
    exit 1
fi

echo ""
echo "✅ Database setup complete"
echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📝 Default admin credentials:"
echo "   Email: admin@school.com"
echo "   Password: admin123"
echo ""
echo "🚀 To start the development server, run:"
echo "   npm run dev"
echo ""
echo "📖 Check QUICKSTART.md for more information"
