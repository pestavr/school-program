# Quick Start Guide

## Application is Running!

Your school duty management system is now running at:
**http://localhost:3001**

## Login Credentials

Use these credentials to access the admin panel:
- **Email**: `admin@school.com`
- **Password**: `admin123`

## What's Included

The application has been seeded with sample data:

### Teachers
- Γιάννης Παπαδόπουλος
- Μαρία Κωνσταντίνου
- Νίκος Γεωργίου

### Locations
- Κεντρική Αυλή (Main Courtyard)
- Ανατολικός Διάδρομος (East Hallway)
- Δυτικός Διάδρομος (West Hallway)
- Πλαϊνή Αυλή (Side Courtyard)

### Schedules
- Sample schedules for Monday-Friday, 10:00-10:15

## How to Use

### 1. View Current Duties (Public)
- Go to: http://localhost:3001
- See which teachers are on duty right now
- Updates automatically every minute

### 2. Admin Panel (Login Required)
- Go to: http://localhost:3001/admin
- Login with the credentials above
- Manage teachers, locations, and schedules

## Features

### Teachers Management
- Add new teachers with contact information
- Edit existing teacher details
- Delete teachers (removes their schedules too)

### Locations Management
- Add school areas that need supervision
- Add descriptions for each location
- Edit and delete locations

### Schedule Management
- Create duty assignments
- Select: Teacher + Location + Day + Time Range
- View by day of week
- Edit and delete schedules

## Tips

1. **Testing the Display**: To see active duties on the homepage, make sure you have schedules that match the current day and time.

2. **Creating Schedules**: Break times typically are:
   - Morning: 10:00-10:15
   - Afternoon: 12:00-12:15
   - You can create schedules for any time period

3. **Multiple Locations**: You can assign different teachers to different locations at the same time.

4. **Greek Language**: The interface is in Greek (Ελληνικά) for better usability in Greek schools.

## Next Steps

1. ✅ Application is running
2. ✅ Database is set up with sample data
3. 📝 Login and explore the admin panel
4. 🎯 Create your own schedules based on your school's needs
5. 📺 Display the homepage on a screen in your school

## Stopping the Server

To stop the development server, press `Ctrl+C` in the terminal.

## Need Help?

Check the main README.md file for full documentation including:
- API endpoints
- Database schema
- Deployment instructions
- Environment variables
