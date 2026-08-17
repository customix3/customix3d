# CustoMix3D

Premium e-commerce platform for **custom and ready-made 3D printed products**.

> CustoMix3D is **not** a 3D printer seller. We manufacture and sell 3D-printed products.

**Live (Vercel):** https://customix3d.vercel.app (or project aliases)

**GitHub:** https://github.com/customix3/customix3d

## Tech Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Zustand, Framer Motion
- **Backend:** Firebase Auth + Firestore + Storage
- **Payment:** Demo/Test provider (architecture ready for Razorpay / Cashfree / PhonePe)
- **Courier:** Manual provider (admin enters tracking; ready for Shiprocket etc.)
- **WhatsApp:** Number stored; notification service ready for later API

## Quick Start

```bash
npm install
cp .env.example .env   # fill Firebase keys
npm run dev
```

## Create Admin

1. Sign up as a normal user
2. In Firestore `users/{uid}` set `role: "admin"`
3. Login at `/admin/login`

## Security Rules

Deploy `firestore.rules` and `storage.rules` from this repo.

## Project Structure

```
src/
  components/ pages/ admin/ layouts/
  context/ services/ firebase/ types/ utils/
```

Full production features include cart, checkout (test payment), custom 3D order form with file upload, order timeline tracking, admin dashboard, product/order/offer/review management.
