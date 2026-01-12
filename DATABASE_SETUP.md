# Database Setup - Complete! ✅

## Overview
The project now uses:
- **SQLite** for local development
- **PostgreSQL (Neon)** for production on Vercel

## Schema Files
- `prisma/schema.local.prisma` - SQLite schema for local dev
- `prisma/schema.production.prisma` - PostgreSQL schema for production
- `prisma/schema.prisma` - Generated (git-ignored), copied from one of the above

## Production Setup (DONE ✅)
1. ✅ Vercel Postgres database created (Neon)
2. ✅ Migrations applied
3. ✅ Database seeded with test data
4. ✅ Build command configured to use production schema

## Local Development

Start dev server (uses SQLite):
```bash
npm run dev
```

Reset local database:
```bash
npx prisma migrate reset
```

View local database:
```bash
npx prisma studio
```

## How It Works

### Local Development
- Uses `schema.local.prisma` (SQLite)
- DATABASE_URL in `.env` points to `file:./dev.db`
- Run `npm run dev` normally

### Production (Vercel)
- Build command copies `schema.production.prisma` → `schema.prisma`
- Uses PostgreSQL on Neon (DATABASE_URL from Vercel env vars)
- Migrations run automatically during build

## Updating Schema

When you need to change the database schema:

1. **Update BOTH schema files:**
   ```bash
   # Edit both files to keep them in sync
   code prisma/schema.local.prisma
   code prisma/schema.production.prisma
   ```

2. **Test locally:**
   ```bash
   cp prisma/schema.local.prisma prisma/schema.prisma
   npx prisma migrate dev --name your_migration_name
   ```

3. **Deploy to production:**
   ```bash
   git add prisma/
   git commit -m "Update schema"
   git push
   vercel --prod
   ```

## Current Login
- Email: `admin@pgpp.gr`
- Password: `GymAei@2026`

## Verifying Production
Visit: https://school-program.vercel.app
