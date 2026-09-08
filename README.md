# Homedecor — Full-Stack E-Commerce Platform

A production-shaped e-commerce platform with a customer storefront, an admin
dashboard, and a real payment integration for the Pakistani market.

## Live Demo
- Storefront: [add link]
- Admin dashboard: [add link] (seed an admin with `npm run seed:admin` in `/server`)

## What's real vs. simulated
- ✅ Auth — registration/login with bcrypt password hashing, JWT access +
  refresh tokens with rotation, refresh tokens persisted and revocable in Mongo
- ✅ Payments — JazzCash mobile wallet integration (hash-signed transaction payloads)
- ✅ Admin dashboard — products, categories, orders, customers, CMS blocks, analytics
- ✅ Image uploads via Cloudinary
- ✅ i18n — English and Urdu locales
- ✅ Rate limiting, Helmet, request validation via Zod
- ⚠️ Automated tests — not yet added (see Roadmap)

## Stack
| Layer | Tech |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, Zustand, react-hook-form + Zod, Tailwind |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB (Mongoose) |
| Auth | JWT (access + refresh, httpOnly cookies) |
| Payments | JazzCash |
| Media | Cloudinary |
| Deployment | Render (`render.yaml`) |

## Architecture note worth knowing
Refresh tokens aren't just signed JWTs trusted blindly — each one is stored
in a `RefreshToken` collection tied to the user, with an expiry and a
`revoked` flag. That means a compromised refresh token, or a user logging
out, can be invalidated server-side immediately, instead of waiting for
natural JWT expiry.

## Project structure
```
client/   Next.js storefront + admin UI
server/   Express API (auth, products, orders, payments, CMS, analytics)
```

## Setup

**Server**
```bash
cd server
cp .env.example .env   # fill in MONGO_URI, JWT secrets, Cloudinary + JazzCash keys
npm install
npm run dev
```

**Client**
```bash
cd client
cp .env.example .env
npm install
npm run dev
```

## Roadmap
- [ ] Add integration tests for auth and order flows
- [ ] Add CI (lint + test) on push
- [ ] Document JazzCash sandbox credentials for reviewers
