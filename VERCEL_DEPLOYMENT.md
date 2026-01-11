# Vercel Deployment Guide

## Prerequisites
- GitHub repository pushed (✅ done)
- Vercel account

## Steps to Deploy

### 1. Import Project to Vercel
1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import your GitHub repository: `pestavr/school-program`
4. Vercel will auto-detect Next.js settings

### 2. Add Vercel Postgres Database
1. In your Vercel project dashboard, go to "Storage" tab
2. Click "Create Database" → Select "Postgres"
3. Choose database name: `school-program-db`
4. Select region closest to your users (Europe recommended)
5. Click "Create"
6. Vercel will automatically add `DATABASE_URL` to your environment variables

### 3. Add Environment Variables
In Vercel project → Settings → Environment Variables, add:

```
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=https://your-domain.vercel.app
```

To generate `NEXTAUTH_SECRET`, run locally:
```bash
openssl rand -base64 32
```

### 4. Deploy & Run Migrations
1. Click "Deploy" in Vercel dashboard
2. After deployment, go to project settings → Functions tab
3. Or run migrations via Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Run migration command
vercel env pull .env.production
npx prisma migrate deploy
```

### 5. Seed Production Database
Option A - Via Vercel CLI:
```bash
vercel env pull .env.production
npm run db:seed
```

Option B - Via temporary API endpoint (create and delete after seeding):
Create `app/api/seed/route.ts` temporarily, deploy, call it once, then remove.

### 6. Verify Deployment
1. Visit your deployed URL
2. Login with: `admin@pgpp.gr` / `GymAei@2026`
3. Test creating schedules, teachers, etc.

## Local Development with PostgreSQL (Optional)

If you want to use PostgreSQL locally instead of SQLite:

1. Install PostgreSQL locally
2. Create database:
   ```bash
   createdb school_program
   ```
3. Update `.env`:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/school_program?schema=public"
   ```
4. Run migrations:
   ```bash
   npx prisma migrate dev
   npm run db:seed
   ```

## Troubleshooting

### "Database not found" error
- Ensure Vercel Postgres is created and connected
- Check environment variables are set correctly

### Migration errors
- Run `npx prisma migrate reset` locally first
- Then deploy fresh migrations to production

### Can't login after deployment
- Verify `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are set
- Check that seed script ran successfully
- Try running `npm run db:seed` again

## Important Notes

⚠️ **Database Changes**: 
- SQLite (dev.db) will no longer be used in production
- Keep dev.db for local development if desired
- Or switch local dev to PostgreSQL too (see above)

⚠️ **Migrations**:
- Current SQLite migrations in `prisma/migrations/` need to be regenerated for PostgreSQL
- After switching to PostgreSQL locally, run: `npx prisma migrate dev --name init`

⚠️ **Environment Variables**:
- Production uses Vercel Postgres (automatically configured)
- Staging/Preview deployments can use the same database or separate one
- Never commit `.env` files to git
