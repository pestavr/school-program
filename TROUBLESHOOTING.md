# Troubleshooting Guide

## Common Issues and Solutions

### Issue: Port 3000 is already in use

**Symptom**: Error message saying port 3000 is in use

**Solution**: 
- The app will automatically use port 3001
- Or kill the process using port 3000:
```bash
lsof -ti:3000 | xargs kill -9
```

### Issue: Database not found

**Symptom**: Error about missing database file

**Solution**:
```bash
npm run db:setup
```

### Issue: Prisma Client not generated

**Symptom**: Import errors for @prisma/client

**Solution**:
```bash
npm run db:generate
```

### Issue: Cannot login

**Symptom**: "Invalid email or password" error

**Solution**:
1. Verify credentials:
   - Email: `admin@school.com`
   - Password: `admin123`
2. Re-seed the database:
```bash
npm run db:seed
```

### Issue: No schedules showing on homepage

**Symptom**: Empty state on public display

**Possible Causes**:
1. No schedules created
2. No schedules match current day/time
3. Time format mismatch

**Solution**:
1. Login to admin panel
2. Create schedules that match current day and time
3. Or wait until 10:00-10:15 (sample data covers this time)

### Issue: TypeScript errors

**Symptom**: Red squiggly lines in VS Code

**Solution**:
```bash
# Restart TypeScript server in VS Code
# Or reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: Styles not loading

**Symptom**: Unstyled or broken layout

**Solution**:
1. Clear Next.js cache:
```bash
rm -rf .next
npm run dev
```

### Issue: Changes not reflecting

**Symptom**: Code changes don't appear

**Solution**:
1. Hard refresh browser: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)
2. Clear browser cache
3. Restart dev server

### Issue: Authentication not working

**Symptom**: Always redirected to login

**Possible Causes**:
1. NEXTAUTH_SECRET not set
2. Cookie issues
3. Session expired

**Solution**:
1. Check `.env` file exists with NEXTAUTH_SECRET
2. Clear browser cookies
3. Restart dev server

### Issue: Database locked

**Symptom**: SQLite error about database being locked

**Solution**:
1. Close any other processes accessing the database
2. Delete `.db-journal` file:
```bash
rm prisma/dev.db-journal
```

### Issue: Module not found errors

**Symptom**: Cannot find module errors

**Solution**:
```bash
# Reinstall dependencies
npm install

# Check file paths match exactly (case-sensitive)
```

## Development Tips

### Reset Everything

If you want to start fresh:

```bash
# Stop dev server (Ctrl+C)

# Remove database
rm prisma/dev.db
rm prisma/dev.db-journal

# Remove dependencies
rm -rf node_modules

# Remove build files
rm -rf .next

# Reinstall and setup
npm install
npm run db:setup
npm run dev
```

### Check Logs

Always check the terminal for error messages:
- API errors show in the server terminal
- Client errors show in browser console

### Database Inspection

To view database contents:

```bash
# Install SQLite browser
brew install sqlite

# Open database
sqlite3 prisma/dev.db

# Run queries
SELECT * FROM User;
SELECT * FROM Teacher;
SELECT * FROM Location;
SELECT * FROM Schedule;

# Exit
.quit
```

### API Testing

Test API endpoints directly:

```bash
# Get teachers (requires authentication)
curl http://localhost:3001/api/teachers

# Get current schedules (public)
curl http://localhost:3001/api/schedules/current
```

## Getting Help

If issues persist:

1. Check error messages carefully
2. Review the code in relevant files
3. Check browser console for client-side errors
4. Check terminal for server-side errors
5. Review the documentation in README.md

## Known Limitations

1. **Time Zone**: Uses server's local time zone
2. **Single User**: Only one admin account (can add more in database)
3. **SQLite**: Not suitable for high-traffic production (use PostgreSQL)
4. **No Email**: Authentication is local only (no password reset)

## Performance Issues

### Slow API responses

**Solution**:
- Database indexes are already in place
- For production, use PostgreSQL with connection pooling

### Memory Issues

**Solution**:
- Restart dev server periodically
- Clear browser cache
- Close unused browser tabs

## Browser Compatibility

**Tested browsers**:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

**Not supported**:
- Internet Explorer
- Very old browser versions

## Production Deployment Issues

### Vercel deployment fails

**Solution**:
1. Add environment variables in Vercel dashboard
2. Change database to PostgreSQL
3. Update `schema.prisma` datasource

### Database migrations

**Solution**:
For production, use proper migrations:
```bash
npx prisma migrate dev
```

### CORS errors

**Solution**:
Update `NEXTAUTH_URL` to match your domain

## Still Need Help?

- Review all documentation files
- Check the code comments
- Search for similar issues online
- Create an issue with:
  - Error messages
  - Steps to reproduce
  - Your environment (OS, Node version, etc.)
