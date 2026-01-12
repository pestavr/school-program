# Database Setup for Vercel

## Problem
SQLite doesn't work on Vercel because serverless functions don't have persistent file storage.

## Solution: Use SQLite Locally, PostgreSQL on Vercel

### Setup Complete! ✅

The project is now configured to:
- Use **SQLite** for local development (prisma/schema.prisma)
- Use **PostgreSQL** for production on Vercel (prisma/schema.production.prisma)
- Automatically switch during Vercel deployment

### Step 1: Create Postgres Database in Vercel
1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project: `school-program`
3. Go to **Storage** tab
4. Click **Create Database**
5. Select **Postgres**
6. Name: `school-program-db`
7. Region: Select **Europe** (closest to Greece)
8. Click **Create**

✅ Vercel will automatically add `POSTGRES_*` environment variables to your project.

### Step 2: Create PostgreSQL Migrations

Since the production database uses PostgreSQL (not SQLite), we need to create PostgreSQL-compatible migrations:

```bash
# Switch to production schema temporarily
cp prisma/schema.production.prisma prisma/schema.prisma.backup
cp prisma/schema.production.prisma prisma/schema.prisma

# Create new PostgreSQL migration
rm -rf prisma/migrations
npx prisma migrate dev --name init

# Restore SQLite schema for local dev
mv prisma/schema.prisma.backup prisma/schema.prisma
npx prisma generate
```

### Step 3: Deploy to Vercel

```bash
git add .
git commit -m "Add PostgreSQL support for production"
git push
vercel --prod
```

The build command will:
1. Copy `schema.production.prisma` to `schema.prisma`
2. Generate Prisma Client for PostgreSQL
3. Run migrations on the Vercel Postgres database
4. Build the Next.js app

### Step 4: Seed Production Database

After deployment, seed the database:

```bash
# Pull production environment variables
vercel env pull .env.production

# Temporarily use production DB
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2-) npm run db:seed

# Or manually via Vercel CLI
vercel env pull && npm run db:seed
```

### Step 5: Verify
1. Visit your site: https://school-program.vercel.app
2. Login with: admin@pgpp.gr / admin123
3. Check if schedules appear

## Local Development

Your local setup continues using SQLite:

```bash
# Normal development workflow
npm run dev

# Reset local database if needed
npx prisma migrate reset

# View database
npx prisma studio
```

## Troubleshooting

### "Provider mismatch" error locally
- Make sure `prisma/schema.prisma` uses `provider = "sqlite"`
- Run `npx prisma generate` after changing provider

### Build fails on Vercel
- Check Vercel logs: `vercel logs`
- Verify DATABASE_URL is set in Vercel environment variables
- Ensure PostgreSQL migrations exist in `prisma/migrations/`

### Can't seed production database
- Run: `vercel env pull .env.local`
- Then: `DATABASE_URL="<postgres-url>" npm run db:seed`
- Replace `<postgres-url>` with the URL from `.env.local`
