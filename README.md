# School Duty Management System

A Next.js application for managing and displaying teacher duty schedules in a school environment.

## Features

- 🔐 **Secure Admin Panel** - Authentication system for authorized access
- 👨‍🏫 **Teacher Management** - Add, edit, and delete teacher information
- 📍 **Location Management** - Manage school areas that need supervision
- 📅 **Schedule Management** - Create and manage duty schedules by day and time
- 🕐 **Real-time Display** - Front-end shows current duties based on day and time
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Styling**: Tailwind CSS
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up the database:

```bash
npm run db:setup
```

This will:
- Create the SQLite database
- Run migrations
- Seed the database with sample data

### Default Admin Credentials

After seeding, you can login with:
- **Email**: admin@school.com
- **Password**: admin123

⚠️ **Important**: Change these credentials in production!

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Front-End Display

The homepage (`/`) displays:
- Current date and time
- Active duty assignments based on the current day and time
- Teacher names and contact information
- Location details

The display automatically updates every minute to show current duties.

### Admin Panel

Access the admin panel at `/admin` (requires login):

#### Teachers Management
- Add new teachers with name, email, and phone
- Edit teacher information
- Delete teachers

#### Locations Management
- Add school areas that need supervision (e.g., courtyards, hallways)
- Add descriptions for each location
- Edit and delete locations

#### Schedule Management
- Create duty assignments
- Select teacher, location, day of week, start time, and end time
- View schedules organized by day
- Edit and delete existing schedules

## Database Schema

### User
- Admin users who can access the admin panel

### Teacher
- Name, email, phone
- Assigned to multiple schedules

### Location
- Name and description of school areas
- Can have multiple schedules

### Schedule
- Links teachers to locations
- Day of week (0-6, where 0 is Sunday)
- Start and end times (HH:MM format)

## API Endpoints

### Teachers
- `GET /api/teachers` - List all teachers
- `POST /api/teachers` - Create teacher
- `PUT /api/teachers/[id]` - Update teacher
- `DELETE /api/teachers/[id]` - Delete teacher

### Locations
- `GET /api/locations` - List all locations
- `POST /api/locations` - Create location
- `PUT /api/locations/[id]` - Update location
- `DELETE /api/locations/[id]` - Delete location

### Schedules
- `GET /api/schedules` - List all schedules
- `GET /api/schedules/current` - Get current active schedules
- `POST /api/schedules` - Create schedule
- `PUT /api/schedules/[id]` - Update schedule
- `DELETE /api/schedules/[id]` - Delete schedule

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

## Database Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with sample data
npm run db:seed

# Setup database (push + seed)
npm run db:setup
```

## Deployment

### Production Considerations

1. **Change Admin Password**: Update the default admin credentials
2. **Environment Variables**: Set secure values for `NEXTAUTH_SECRET`
3. **Database**: Consider using PostgreSQL or MySQL for production
4. **SSL**: Enable HTTPS in production

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy

For production database, update `DATABASE_URL` in `.env` and `schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // or "mysql"
  url      = env("DATABASE_URL")
}
```

## License

MIT

## Support

For issues and questions, please open an issue on the repository.
