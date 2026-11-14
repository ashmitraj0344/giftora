# Giftora – Personalized Gift Store Builder

> **"Make Every Gift Unforgettable."**  
> Built as an Academic Task for **INT257 (26271)** at **Lovely Professional University**.

Giftora is a full-stack, production-grade personalized gift e-commerce web application engineered with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **MongoDB Atlas (Mongoose ODM)**, **Auth Sessions**, **Cloudinary**, and **Razorpay Payment Gateway**.

---

## 🌟 Key Features

### 1. Interactive Product Customization Studio
- **Real-Time Live Canvas Preview:** Instant visual feedback without page reload using dynamic SVG and CSS matrix transformations.
- **Photo Upload & Manipulation:** Supports JPG, PNG, and WebP with scaling (0.5x to 2.5x), X/Y positioning, rotation, brightness adjustments, and vintage Black & White grayscale toggles.
- **Custom Typography Inscriptions:** Add multiple text lines, choose from luxury serif and cursive fonts (*Playfair Display, Inter, Cinzel, Dancing Script, Montserrat*), customize font sizes, and select from royal palette swatches.
- **Persistent Design Configurations:** Customization parameters and previews are stored in the database and linked with orders.

### 2. Comprehensive E-Commerce Pipeline
- **Artisanal Product Catalog:** 8 categories including Photo Frames, Customized Mugs, Organic Cotton T-Shirts, Bonded Leather Photo Albums, Velvet Cushions, LED Photo Lamps, and Brass Keychains.
- **Server-Side Price Recalculation:** Base price + photo print charges (+₹50) + text inscriptions (+₹20) + luxury velvet packaging (+₹40) strictly re-calculated on the backend (Never trusting client-supplied amounts).
- **Shopping Cart with Free Shipping Progress:** Dynamic calculations, coupon code validation (*WELCOME10, GIFTORA100, FESTIVE20*), and session persistence.
- **Checkout & Razorpay Payment Gateway:**
  - Real Razorpay Checkout modal with server-side HMAC-SHA256 signature verification.
  - **Academic Evaluator Test Mode:** One-click instant verification simulation for evaluators testing without merchant keys!
- **Live 5-Stage Order Dispatch Tracking:** Real-time visual timeline (*Confirmed → Design Approved → Processing → Shipped → Delivered*) with carrier airway bill numbers and customer customization inspection.

### 3. Role-Based Administration Dashboard
- Real-time KPI metrics: Gross Revenue, Total Orders, Active Customers, Products, Pending Pipeline, and Low-stock inventory alerts.
- Order Management with production stage updates, courier tracking assignment, and customization reviews.
- Product catalog and customer directory management.
- One-click **Database Seed** button to populate sample products, coupons, and orders instantly.

---

## 🛠️ Technology Stack (INT257 Syllabus Alignment)

- **Framework:** Next.js 14 (App Router, Server & Client Components, Route Handlers)
- **Frontend Concepts:** React 18 (`useState`, `useEffect`, `useContext`, `useRef`), Framer Motion, Lucide React Icons
- **Styling:** Tailwind CSS (Royal Burgundy `#702C3B`, Champagne Gold `#C6A46A`, Warm Ivory `#FAF8F3`, Soft Beige `#EDE5D8`)
- **Backend:** Next.js Route Handlers (RESTful architecture, Zod schema validation)
- **Database:** MongoDB Atlas via Mongoose ODM (with zero-config in-memory fallback for immediate evaluation)
- **Authentication:** JWT Sessions signed via `jose`, bcrypt password hashing, `httpOnly` secure cookies
- **Payments:** Razorpay Node.js SDK + client checkout script + HMAC signature verification
- **Media Storage:** Cloudinary CDN integration with automatic data-URL fallback

---

## 🚀 Quick Start Guide

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory (a pre-configured `.env.example` is provided):
```env
# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/giftora?retryWrites=true&w=majority

# Authentication
AUTH_SECRET=giftora_super_secret_jwt_key_2026_production_grade_change_in_prod
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Cloudinary (Optional - has local base64 fallback)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Razorpay (Optional - has Academic Test Mode)
RAZORPAY_KEY_ID=rzp_test_giftora_demo_key
RAZORPAY_KEY_SECRET=giftora_demo_secret_2026
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_giftora_demo_key
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Credentials for Evaluators

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@giftora.com` | `AdminPassword123!` | Full Admin Dashboard, Order & Product Management |
| **Customer** | `customer@giftora.com` | `Customer123!` | Shopping, Custom Studio, Order Tracking, Profile |

> **Pro-Tip:** On the `/login` page, click the **"Admin Demo"** or **"Customer Demo"** buttons for 1-click automatic authentication!

---

## 🧪 Testing Scenarios (Grading Checklist)

1. **Browsing:** Visit `/shop` and filter by category (*e.g. Photo Frames*), search by keyword, and sort by price.
2. **Custom Studio:** Click **"Personalize"** on any product or visit `/customize/artisan-walnut-wood-photo-frame`. Upload a photo or select a sample memory, adjust scale and position, type custom messages, choose fonts, and toggle gift packaging.
3. **Cart & Coupons:** Add customized item to cart (`/cart`). Apply promo code `WELCOME10` to get 10% off. Notice the free shipping threshold meter.
4. **Checkout:** Proceed to `/checkout`. Select **"Instant Verified Payment (Academic Evaluation Mode)"** or enter test card details for Razorpay.
5. **Success & Tracking:** View confirmation screen with confetti at `/payment/success`. Click **"Track Order Status"** to view live 5-step dispatch progress and customization inspection.
6. **Admin Dashboard:** Log in as admin and visit `/admin`. Inspect live revenue metrics, update order production stages at `/admin/orders`, and view customers at `/admin/customers`.

---

## 📄 Academic Project Report

For full architectural diagrams, component trees, and Viva Voce questions & answers, refer to [ACADEMIC_REPORT_INT257.md](file:///c:/Users/ASUS/Desktop/Project%205/ACADEMIC_REPORT_INT257.md).

---

## 📜 License
Developed for academic assessment at Lovely Professional University. All rights reserved.
