# AURA — Full-Stack E-Commerce Web Application

A full-stack online store built with **React 19, Node.js, Express.js, and MongoDB**, featuring real-time visual package tracking, role-based access control (Admin & Customer), stock deduction, promo discounts, and administrative inventory management.

---

## 🌟 Key Features

### 1. Product Catalog & Browsing
- **Real-time Filter & Search**: Instant debounced search by keywords and filter by categories (`Electronics`, `Audio`, `Wearables`, `Accessories`, `Fashion`, `Home & Lifestyle`).
- **Dynamic Sorting**: Sort by Newest, Price (Low to High, High to Low), and Top Customer Rated.
- **Product Details Modal**: Full specifications table, real-time inventory stock indicators (In Stock, Low Stock alert, Out of Stock), customer rating stars, and instant "Add to Cart" / "Buy Now".

### 2. Shopping Bag & Checkout Flow
- **Slide-Over Bag Drawer**: Persistent cart stored in `localStorage` with quantity increment/decrement, remove actions, and free shipping progress tracker (Free Shipping on orders > $100).
- **Promo Coupon Engine**: Interactive discount codes:
  - `SAVE20`: 20% off entire order.
  - `WELCOME10`: 10% welcome discount.
- **Multi-Step Checkout Modal**:
  - Shipping address pre-filled for authenticated customers.
  - Payment method selection (`Credit/Debit Card`, `PayPal / UPI`, `Cash on Delivery`).
  - Automatic order pricing breakdown: Subtotal, Shipping, Tax (8%), and Promo Discount.
  - Automatic inventory stock decrementing upon order creation.

### 3. Real-Time Order Tracking Engine
- **Visual Progress Stepper**: 5-stage tracking bar (`Placed` ➔ `Processing` ➔ `In Transit` ➔ `Out for Delivery` ➔ `Delivered`).
- **Milestone Audit Logs**: Timestamped event log with facility locations and carrier notes.
- **Public & Customer Tracking**: Anyone with a tracking code (`TRK-XXXX-XXXX`) or Order Number (`ORD-XXXXX`) can track packages in real-time.
- **Order Cancellation**: Customers can cancel pending orders; stock is automatically restored to the product inventory.

### 4. Admin Management Dashboard
- **Executive Metrics**:
  - Total Verified Revenue ($)
  - Lifetime Customer Orders Count
  - Active SKUs Count
  - Low Stock Warning Alerts (products with $\le 5$ units)
- **Order Management Tab**:
  - View all customer orders with customer info, total, and timestamps.
  - Filter orders by status (`All`, `Placed`, `Processing`, `Shipped`, `Out for Delivery`, `Delivered`, `Cancelled`).
  - **Live Status Update Action**: Change status via dropdown; updates database immediately and appends to the customer's live tracking milestone log.
- **Product Inventory Tab**:
  - Add New Product modal with category, image URL, pricing, stock count, specifications, and badge labels.
  - Edit existing product details.
  - Delete product with real-time catalog sync.

### 5. Authentication & Role-Based Access Control (RBAC)
- **JWT Authentication**: JSON Web Tokens with password hashing via `bcryptjs`.
- **Role Verification**: Middleware protecting admin routes (`/api/products` modifications and `/api/orders` admin controls).
- **1-Click Demo Accounts Switcher**: Built-in header menu to toggle immediately between:
  - **Store Admin**: `admin@store.com` / `admin123`
  - **Customer**: `user@store.com` / `user123`

---

## 🏗️ Architecture & Tech Stack

```
E-commerse/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # MongoDB connection
│   │   ├── models/
│   │   │   ├── User.js             # User schema with bcrypt password hashing
│   │   │   ├── Product.js          # Product schema with stock & specifications
│   │   │   └── Order.js            # Order schema with tracking milestones
│   │   ├── middleware/
│   │   │   └── auth.js             # JWT verification & adminOnly guard
│   │   ├── controllers/
│   │   │   ├── authController.js   # Register, Login, Profile
│   │   │   ├── productController.js# Catalog filtering & Admin CRUD
│   │   │   ├── orderController.js  # Order placement, tracking & status updates
│   │   │   └── statController.js   # Admin metrics aggregation
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   └── statRoutes.js
│   │   ├── seeds/
│   │   │   └── seedData.js         # Auto-populates 10 products, demo users & orders
│   │   └── server.js               # Express server entry point
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Header with demo switcher & cart indicator
│   │   │   ├── ProductCard.jsx     # Card component with hover zoom & badge
│   │   │   ├── ProductModal.jsx    # Detail view with specs & instant Buy Now
│   │   │   ├── CartDrawer.jsx      # Slide-over cart with promo coupon input
│   │   │   ├── CheckoutModal.jsx   # Multi-step checkout & order confirmation
│   │   │   ├── OrderTimeline.jsx   # 5-step visual tracking progress bar
│   │   │   ├── AdminProductModal.jsx # Admin inventory creation/editing
│   │   │   └── Footer.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # User state & 1-click demo logins
│   │   │   └── CartContext.jsx     # Cart state, discounts & toast alerts
│   │   ├── pages/
│   │   │   ├── Storefront.jsx      # Main browsing & filtering page
│   │   │   ├── OrderTracking.jsx   # Live tracking with quick sample buttons
│   │   │   ├── MyOrders.jsx        # Customer order history & cancellation
│   │   │   ├── AdminDashboard.jsx  # Admin KPIs, orders & inventory management
│   │   │   └── AuthPage.jsx        # Login & Registration modal
│   │   ├── services/
│   │   │   └── api.js              # Centralized fetch API client
│   │   ├── App.jsx                 # Main layout & router
│   │   ├── index.css               # Tailored CSS design system with glassmorphism
│   │   └── main.jsx
│   ├── vite.config.js              # Vite config with backend proxy (/api)
│   └── package.json
└── package.json                    # Root script orchestration
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** running locally on default port `27017` (e.g., `mongodb://127.0.0.1:27017`)

### 1. Install Dependencies
```bash
# Install root, backend, and frontend packages:
npm run install:all
```
*(Or navigate to `backend/` and `frontend/` and run `npm install` in each).*

### 2. Seed Database (Optional - server auto-seeds if empty)
```bash
npm run seed
```
This populates 10 high-resolution products, default demo users, and active tracking orders.

### 3. Run the Full-Stack Application
You can run backend and frontend concurrently or in two separate terminals:

**Terminal 1 (Backend API on http://localhost:5000):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend Client on http://localhost:5173):**
```bash
cd frontend
npm run dev
```

Open **`http://localhost:5173`** in your browser.

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@store.com` | `admin123` | Full Admin Dashboard, Revenue KPIs, Order status editor, Catalog inventory CRUD |
| **Customer** | `user@store.com` | `user123` | Store browsing, Cart, Checkout, My Orders history, Order cancellation |

> **Pro Tip**: Use the **"Demo Accounts"** dropdown in the top navigation bar to switch roles with a single click.

---

## 📦 Sample Tracking Identifiers

Use the **Track Order** tab to test live shipment tracking:
- `TRK-9021-4819`: Sample order in **Shipped / In Transit** status.
- `TRK-3819-2041`: Sample order in **Delivered** status.
- Or any order tracking code generated during your test checkouts!
=======

