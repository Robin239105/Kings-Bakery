# KingsBakery — Premium Luxury Dessert E-commerce & Admin Console

KingsBakery is a modern, high-end e-commerce platform and administrative console for a boutique dessert bakery. Designed with a clean, slate/cream luxury aesthetic, it features an interactive storefront, a bespoke tasting box builder, an automated delivery slot calendar, an order tracking timeline, a customer membership portal, and a utilitarian administration panel for managing inventory, blog posts, and order fulfillment.

Built using **Next.js 14+ (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, **PostgreSQL**, and **Zustand**.

---

## 🌟 Key Features

### 🍰 Storefront & Dessert Catalog
- **Signature Layer HUD Display**: Pulsing layer hotspots on product highlights letting users reveal pastry structures (e.g., 24k Gold Leaf, Valrhona Ganache, Sable Crust) with frosted-glass details.
- **Dynamic Shop Filtering**: Category sidebar tabs (Cakes, Tarts, Pastries, Macarons) and dietary matching options (Gluten-Free, Vegan, Nut-Free) synchronized in URL query parameters.
- **Floating Cart Panel**: A bottom-left anchored notification widget showing order subtotals, item thumbnails, quantity steppers, and free shipping trackers.

### 🎁 Curated Tasting Flights
- **Tasting Box Builder**: Editorial list design showing box items connected by dashed alignment guides.
- **Customization Engine**: Let's users swap default items for custom choice options before checkout.

### 📅 Delivery Calendar Scheduling
- **Month Availability Grid**: Interactive scheduling preventing bookings on past dates and flagging fully booked dates in red.
- **Capacity Gates**: Automated limit locking (20 orders/day) integrated with the database transaction queue.

### 📦 Order Tracking & Member Portal
- **Tracking Journey Timeline**: Enter confirmation order numbers (e.g., `KB-XXXXXX`) to view delivery status (Placed ➜ Confirmed ➜ Baking ➜ Transit ➜ Delivered).
- **Connoisseur Club Portal**: Member profile dashboard detailing active loyalty point balances (Gold tier status), saved address books, and order summaries.

### 📊 Utility Admin Dashboard (`/admin`)
- **JWT Cookie Security**: Secure admin token authentication with Next.js middleware routing guards.
- **Real-Time Analytics**: Counters for today's orders, revenue, pending tasks, and low-stock warnings, paired with a **Recharts Line Chart** of weekly booking trends.
- **Fulfillment Operations**: Detailed order tables with status dropdown controllers.
- **CRUD Operations**: Inventory managers, tasting box flight configurers, and journal article publishers.

---

## 🛠 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database & ORM**: PostgreSQL, Prisma ORM
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Visual Charts**: Recharts
- **Form Validation**: React Hook Form, Zod

---

## 🔒 Security & Deployment Configuration

To deploy KingsBakery securely (e.g., on Vercel with Neon PostgreSQL), the following environment variables must be defined in your production hosting panel:

```env
DATABASE_URL="postgres://..."          # Shared connection pool URL for API handlers
DIRECT_URL="postgres://..."            # Direct connection URL for database migrations
JWT_SECRET="your-jwt-secret-phrase"    # Secret key used for admin panel session tokens
ADMIN_SEED_EMAIL="your-admin-email"    # Administrative email seeded for initial login
ADMIN_SEED_PASSWORD="your-secure-pass" # Administrative password seeded for initial login
```

During deployment or database synchronization passes, execute the standard migrations:
```bash
npx prisma db push
npx prisma db seed
```

---

## 👥 Contributors

- **Robin239105** (Lead Developer & Creator)
