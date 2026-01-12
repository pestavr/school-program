#!/bin/bash
# Prepare production schema for Vercel deployment

echo "📦 Preparing production schema..."
cp prisma/schema.production.prisma prisma/schema.prisma
echo "✅ Schema updated to PostgreSQL for production"
