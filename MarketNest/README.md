# MarketNest — Multi-Vendor E-Commerce Marketplace

A monorepo starter based on Task 4's stack: Next.js, NestJS, PostgreSQL, Prisma, Redis, S3-compatible object storage.

## Included in this MVP
- Next.js storefront with product search and category filtering
- NestJS REST API for products, categories, sellers and orders
- PostgreSQL schema managed by Prisma
- Multi-seller product ownership and order-line seller attribution
- Server-side order price calculation and stock decrement in a transaction
- Order status update endpoint
- Seed data: demo seller, four categories and sample products
- Docker Compose services for PostgreSQL, Redis and MinIO (S3-compatible storage)

## Important scope note
This is a starter MVP, not a production-ready marketplace. The storefront's Buy button currently explains the order API rather than completing a customer checkout. Authentication, seller/admin dashboards, payment gateway integration, refunds, shipping integrations, Redis caching/queues, S3 upload handling, tax calculation, commissions and promotion application still need to be implemented before production. Do not accept real payments or customer data with this starter as-is.

## Requirements
- Node.js 20+
- npm 10+
- Docker Desktop (recommended) or a local PostgreSQL server

## Setup

1. Extract the ZIP and open the root folder in VS Code.
2. Copy `.env.example` to `.env`.
3. Start local infrastructure:

   ```bash
   docker compose up -d
   ```

4. Install dependencies:

   ```bash
   npm install
   ```

5. Generate Prisma client and create database tables:

   ```bash
   npm run db:generate
   npm run db:migrate -- --name init
   ```

6. Seed sample marketplace data:

   ```bash
   npm run db:seed
   ```

7. Start both apps:

   ```bash
   npm run dev
   ```

8. Open:
   - Storefront: http://localhost:3000
   - API: http://localhost:4000
   - API health: http://localhost:4000/api/health
   - MinIO console: http://localhost:9001 (minioadmin / minioadmin123)

## Main API endpoints

### Products
- `GET /api/products`
- `GET /api/products?q=headphones`
- `GET /api/products?category=CATEGORY_ID`
- `GET /api/products/:id`
- `POST /api/products`

Example product body:
```json
{
  "name": "Bluetooth Speaker",
  "description": "Portable speaker",
  "price": 1299,
  "stock": 20,
  "categoryId": "CATEGORY_ID",
  "sellerId": "SELLER_ID"
}
```

### Sellers
- `GET /api/sellers`
- `GET /api/sellers/:id`
- `POST /api/sellers`

### Categories
- `GET /api/categories`

### Orders
- `POST /api/orders`
- `GET /api/orders`
- `PATCH /api/orders/ORDER_ID/status`

Example order body:
```json
{
  "customerName": "Aarav Sharma",
  "customerEmail": "aarav@example.com",
  "shippingAddress": "Mathura, Uttar Pradesh",
  "items": [
    { "productId": "PRODUCT_ID", "quantity": 2 }
  ]
}
```

Allowed order statuses: `PLACED`, `CONFIRMED`, `PACKED`, `SHIPPED`, `DELIVERED`, `CANCELLED`.

## Database models
- Seller
- Category
- Product
- Order
- OrderItem
- Promotion

## Technology notes
- Redis and MinIO containers are included, but app-level Redis caching/queues and S3 uploads are not wired yet.
- MinIO provides a local S3-compatible environment for future product-image uploads.
- Do not commit `.env`, credentials, `node_modules`, or build output to GitHub.
- Before production, add authentication/authorization, rate limiting, request logging, tests, backups, payment provider webhooks and security review.
