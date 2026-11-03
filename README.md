# EduManage — Student Management System

A Next.js + Node.js + PostgreSQL + Prisma starter application based on the supplied project brief.

## Included
- Email/password login with an HTTP-only session cookie
- Role model: ADMIN, TEACHER, STUDENT
- Dashboard counts and fee collection summary
- Student and teacher directory pages
- Attendance, exam/result and fee data models and read views
- Admin-only student creation API

> This is a working project foundation/MVP, not a production-ready school ERP. Before deployment, add complete CRUD screens for every module, password reset, audit logs, input validation, CSRF/rate limiting, pagination, tests, and production security review. Restrict public registration; users should be provisioned by an administrator.

## Requirements
- Node.js 20+
- PostgreSQL 14+
- npm

## Setup

1. Create a PostgreSQL database named `edumanage`.
2. Copy `.env.example` to `.env` and set your PostgreSQL username/password and a strong `JWT_SECRET`.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Generate Prisma client and create database tables:

   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. Create the initial admin account:

   ```bash
   npm run db:seed
   ```

6. Start the application:

   ```bash
   npm run dev
   ```

7. Open http://localhost:3000

### Initial admin login
- Email: `admin@edumanage.local`
- Password: `Admin@12345`

Change this password and the seed credentials before using real data.

## API

All endpoints require a logged-in session unless noted.

### Login
`POST /api/auth/login`
```json
{ "email": "admin@edumanage.local", "password": "Admin@12345" }
```

### Logout
`POST /api/auth/logout`

### List students
`GET /api/students` — ADMIN or TEACHER

### Add student
`POST /api/students` — ADMIN only
```json
{
  "admissionNo": "ADM-001",
  "fullName": "Aarav Sharma",
  "email": "aarav@example.com",
  "className": "10",
  "section": "A",
  "phone": "9876543210",
  "address": "Mathura"
}
```

## Database modules
- `User`: authentication and role
- `Student`: admission and academic profile
- `Teacher`: employee and subject details
- `Attendance`: daily attendance by student/date/subject
- `Exam` and `Result`: examination schedule and marks
- `Fee`: amount, payment and due-date records

## Notes
- Prisma schema is in `prisma/schema.prisma`.
- Database connection is configured by `DATABASE_URL`.
- Do not upload `.env`, passwords, or database credentials to GitHub.
- `node_modules` and `.next` are generated locally; do not upload them.
