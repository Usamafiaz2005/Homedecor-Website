# Homedecor — Luxury Home Furnishings E-Commerce Platform

> A full-stack, production-ready luxury home décor e-commerce store built for the Pakistani market. Artisan furniture, curated interiors, and premium living delivered to your door.

[![Next.js](https://img.shields.io/badge/Next.js-15.3-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-4.19-green?logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://www.mongodb.com/atlas)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://vercel.com)

---

## ✨ Features

### Storefront
- **Product Catalogue** — SSR product grid with keyword search, colour & price filters, pagination
- **Product Detail Pages** — Rich SSR pages with JSON-LD structured data, variant picker, add-to-cart
- **Live Search Overlay** — Debounced API search with thumbnail results and keyboard navigation
- **Best Sellers Carousel** — Dynamic, API-driven horizontal scroll carousel
- **Luxury Hero Slider** — Full-screen auto-advancing editorial hero

### Shopping & Checkout
- **Zustand Cart** — Persistent cart with variant-aware line items (localStorage)
- **Checkout Flow** — Pakistani address form with real-time city-based shipping calculation
- **Payment Methods** — COD · JazzCash · EasyPaisa · Stripe
- **Order History** — Full order detail with status badges and delivery address

### Account & Auth
- **JWT Authentication** — HttpOnly cookie-based access + refresh token rotation
- **Role-based Access** — `user` and `admin` roles embedded in JWT at issue time
- **Profile Page** — Inline name editing, phone number, recent orders summary
- **Registration / Login** — Zod-validated forms with Pakistani phone regex

### Informational Pages
- **Dynamic `/[slug]` Pages** — About · Contact · Shipping · Returns · Craftsmanship
- **Contact Form** — Connected to Nodemailer backend
- **Newsletter** — Subscriptions stored in MongoDB with duplicate detection

### Admin Panel
- **Dashboard** — Recharts analytics (revenue, orders, top products)
- **Product Management** — Full CRUD with Cloudinary image uploads
- **Order Fulfillment** — Status progression (Pending → Processing → Shipped → Delivered)
- **Category Management** — Self-referential category tree
- **CMS Blocks** — Hero banner and promo content editor
- **Customer Management** — View users, promote to admin

### SEO & Performance
- **Server-Side Rendering** — All product pages are SSR with `generateMetadata`
- **JSON-LD Structured Data** — `Product` + `BreadcrumbList` schemas on every product
- **Open Graph & Twitter Cards** — Auto-generated from product data
- **Sitemap & Robots.txt** — Dynamic generation via Next.js App Router

---

## 🗂️ Project Structure

```
.
├── client/                         # Next.js 15.3 App Router frontend
│   └── src/
│       ├── app/
│       │   ├── (auth)/             # Login, Register
│       │   ├── (storefront)/       # Shop, Product Detail, Cart, Checkout, Orders, Profile
│       │   ├── (informational)/    # Dynamic [slug] pages (about, contact, shipping, returns)
│       │   └── admin/              # Admin dashboard suite
│       ├── components/
│       │   ├── home/               # Hero, BestSellers, BrandStory, Testimonials, Newsletter
│       │   ├── product/            # ProductCard, ProductGrid, ProductActions
│       │   ├── layout/             # Navbar, Footer
│       │   ├── cart/               # CartDrawer
│       │   ├── search/             # SearchOverlay
│       │   ├── contact/            # ContactForm
│       │   └── ui/                 # WhatsApp widget, Skeletons
│       ├── store/                  # Zustand (authStore, useCartStore)
│       ├── lib/
│       │   ├── axios.ts            # Axios instance + 401 refresh interceptor
│       │   ├── formatCurrency.ts   # formatPKR(), formatPKRShort()
│       │   └── seo/                # metadata, product-schema, open-graph, twitter, canonical
│       ├── constants/
│       │   └── pakistan.ts         # PAKISTAN_CITIES[], getShippingRate()
│       ├── locales/
│       │   ├── en/common.ts        # English i18n strings
│       │   └── ur/common.ts        # Urdu i18n strings
│       └── types/index.ts          # Shared TypeScript interfaces
│
└── server/                         # Express 4.19 + TypeScript API
    └── src/
        ├── controllers/            # auth, product, order, category, cms, contact, newsletter, upload
        ├── models/                 # User, Product, Order, Category, CmsBlock, Coupon, RefreshToken, Subscriber
        ├── middleware/             # auth (protect, adminOnly), validate (Zod), errorHandler
        ├── routes/                 # All API route files
        ├── utils/                  # token, ApiFeatures, shippingCalculator, emailTemplates
        ├── validators/             # auth.validator, upload.validator (Zod schemas)
        └── seeds/                  # seedAdmin.ts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas cluster (or local MongoDB)
- Cloudinary account
- (Optional) Nodemailer-compatible SMTP credentials

### 1. Clone the Repository

```bash
git clone https://github.com/Usamafiaz2005/Homedecor-Website.git
cd Homedecor-Website
```

### 2. Server Setup

```bash
cd server
npm install
```

Create `server/.env`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/homedecor
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your_app_password
CONTACT_RECEIVER_EMAIL=admin@yourdomain.com
```

```bash
# Compile TypeScript
npm run build

# Seed admin user (admin@homedecore.homes / AdminPassword123!)
npm run seed

# Start production server
npm start

# Or development with hot reload
npm run dev
```

### 3. Client Setup

```bash
cd client
npm install
```

Create `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

```bash
npm run dev     # Development at http://localhost:3000
npm run build   # Production build
npm start       # Production server
```

---

## 🌐 Deployment

### Vercel (Frontend)

The client is deployed on Vercel with the following settings:

| Setting | Value |
|---------|-------|
| Framework Preset | Next.js |
| Root Directory | `client` |
| Build Command | `npm run build` |
| Output Directory | `.next` |
| Environment Variable | `NEXT_PUBLIC_API_URL` → your Render API URL |

### Render / Railway (Backend)

| Setting | Value |
|---------|-------|
| Root Directory | `server` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Environment | All variables from `.env` above |

> **Important:** Set `CLIENT_URL` to your Vercel deployment URL for correct CORS configuration.

---

## 🔌 API Reference

### Auth Routes — `/api/auth`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | — | Register new user |
| POST | `/login` | — | Login (sets HttpOnly cookies) |
| POST | `/logout` | — | Clear auth cookies |
| POST | `/refresh` | — | Rotate access token |
| GET | `/me` | ✅ | Get authenticated user |
| PATCH | `/me` | ✅ | Update name / phone |
| GET | `/users` | 🔒 Admin | List all users |
| PUT | `/users/:id/role` | 🔒 Admin | Promote/demote user |

### Product Routes — `/api/products`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | — | Get products (search, filter, sort, paginate) |
| GET | `/:slug` | — | Get product by slug |
| GET | `/curated/:type` | — | `new` · `best` · `trending` · `flash-sale` |
| POST | `/` | 🔒 Admin | Create product |
| PUT | `/:id` | 🔒 Admin | Update product |
| DELETE | `/:id` | 🔒 Admin | Delete product |

### Order Routes — `/api/orders`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | ✅ | Create order (server-side price validation) |
| GET | `/my-orders` | ✅ | Get user's orders |
| GET | `/:id` | ✅ | Get order detail |
| GET | `/admin/all` | 🔒 Admin | All orders with filters |
| PUT | `/:id/status` | 🔒 Admin | Update order status |

### Other Routes
| Prefix | Description |
|--------|-------------|
| `/api/categories` | Category CRUD (admin) |
| `/api/cms` | CMS block management (admin) |
| `/api/upload` | Cloudinary image upload |
| `/api/contact` | Contact form → Nodemailer |
| `/api/newsletter` | Newsletter subscribe |
| `/api/analytics` | Dashboard aggregations (admin) |

---

## 🛡️ Security

- **JWT** — Access tokens (15 min) + refresh tokens (7 days) stored as `HttpOnly; Secure; SameSite=Strict` cookies
- **Role enforcement** — Role is embedded in the JWT at issue time; `adminOnly` middleware verifies on every protected route
- **Price integrity** — Order controller re-fetches all prices from MongoDB (never trusts frontend values)
- **Input validation** — All endpoints use Zod schemas via `validate` middleware
- **CORS** — Configured to allow only `CLIENT_URL` origin with credentials

---

## 💳 Payment Methods (Pakistan)

| Method | Status |
|--------|--------|
| Cash on Delivery (COD) | ✅ Live |
| JazzCash | ✅ Integrated (HMAC hash) |
| EasyPaisa | ✅ Integrated |
| Stripe | ✅ Integrated |

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | Next.js 15.3 (App Router) |
| UI Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| State Management | Zustand (with persistence) |
| Form Validation | React Hook Form + Zod |
| Backend Framework | Express 4.19 |
| Language | TypeScript (both client & server) |
| Database | MongoDB + Mongoose |
| Auth | JWT (HttpOnly cookies) |
| Image Storage | Cloudinary |
| Email | Nodemailer |
| Charts | Recharts |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 🗺️ Pakistan Shipping Rates

| Destination | Rate |
|-------------|------|
| Orders above Rs. 100,000 | **Free** |
| Lahore | Rs. 500 |
| Karachi · Islamabad · Rawalpindi · Faisalabad · Multan | Rs. 1,500 |
| Rest of Pakistan | Rs. 2,500 |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is proprietary software. All rights reserved © 2025 Homedecor Pakistan.

---

<div align="center">
  <strong>Homedecor Pakistan</strong> · Lahore · <a href="https://wa.me/923270724767">WhatsApp</a>
</div>
