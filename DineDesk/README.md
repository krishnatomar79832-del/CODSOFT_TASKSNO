# DineDesk — Restaurant Ordering Platform

A Next.js, Node.js, PostgreSQL and Prisma full-stack starter based on the supplied Task 2 brief.

## Features included
- Login and role-based access (ADMIN, STAFF, CHEF, CUSTOMER)
- Restaurant dashboard with order, reservation, menu and table counts
- Seeded restaurant menu categories and sample dishes
- Order creation API with server-side price calculation
- Order list and kitchen queue pages
- Order status update API
- Table reservation creation API and reservation management page
- Prisma database models for users, menu, tables, reservations and orders

This is an MVP starter. It does not include a payment gateway integration, a customer-facing cart/checkout screen, or complete edit/delete management screens. Payment is recorded as a status/mode only; do not treat it as actual online payment processing. Add a verified payment provider and webhook validation before accepting online payments.

## Requirements
- Node.js 20+
- PostgreSQL 14+
- npm

## Setup
1. Create a PostgreSQL database called `dinedesk`.
2. Copy `.env.example` to `.env`; set `DATABASE_URL` and a long random `JWT_SECRET`.
3. Run:

   ```bash
   npm install
   npx prisma generate
   npx prisma migrate dev --name init
   npm run db:seed
   npm run dev
   ```

4. Open http://localhost:3000

### Initial admin login
- Email: `admin@dinedesk.local`
- Password: `DineDesk@123`

Change this password and secret before using real data.

## API endpoints

### Login
`POST /api/auth/login`
```json
{ "email": "admin@dinedesk.local", "password": "DineDesk@123" }
```

### Logout
`POST /api/auth/logout`

### Place an order
`POST /api/orders`
```json
{
  "customerName": "Aarav Sharma",
  "customerEmail": "aarav@example.com",
  "orderType": "TAKEAWAY",
  "items": [
    { "menuItemId": "PASTE_MENU_ITEM_ID", "quantity": 2 }
  ],
  "notes": "Less spicy"
}
```
The server looks up menu prices and calculates the total; it does not trust a price sent by the browser.

### List orders
`GET /api/orders` — ADMIN, STAFF or CHEF

### Update order status
`PATCH /api/orders/{id}/status`
```json
{ "status": "PREPARING" }
```
Allowed statuses: PLACED, ACCEPTED, PREPARING, READY, COMPLETED, CANCELLED.

### Create a reservation
`POST /api/reservations`
```json
{
  "guestName": "Aarav Sharma",
  "email": "aarav@example.com",
  "phone": "9876543210",
  "dateTime": "2027-01-15T19:30:00.000Z",
  "guests": 4,
  "notes": "Window seat preferred"
}
```

### List reservations
`GET /api/reservations` — ADMIN or STAFF

## Database
Prisma schema: `prisma/schema.prisma`.
- User and Role
- MenuCategory and MenuItem
- RestaurantTable
- Reservation
- Order and OrderItem

## Security / production checklist
Use HTTPS, strong secrets, rate limiting, robust request validation, CSRF protections for state-changing browser requests, audit logging, database backups, privacy notices, and a real payment gateway with verified server-side webhooks. Keep `.env` out of GitHub. Do not upload `node_modules` or `.next`.
