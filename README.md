# 🛒 Premium Ecommerce Backend API

A high-performance, secure, and production-ready RESTful API ecosystem for modern ecommerce applications. Built with a robust **Service-Oriented Architecture**, this backend handles everything from complex role-based permissions to real-time stock management and automated promotions.

---

## 🏗️ Project Architecture
This project follows the **Domain-Driven Design (DDD)** pattern, ensuring a clean separation of concerns:

-   **Models**: Mongoose schemas enforcing strict data validation (NaN protection, type safety).
-   **Routes**: Modular endpoint definitions organized by domain (Admin, User, Product, etc.).
-   **Controllers**: Request orchestration logic.
-   **Services**: Reusable business logic (Email, OTP, Coupon calculation).
-   **Middlewares**: Multi-layered security (JWT, RBAC, File Uploads).

---

## 🚀 Core Features & Business Logic

### 🔐 1. Hybrid Authentication System
-   **Dual-Layer Security**: Standard password protection + 6-digit OTP verification.
-   **User Auth**: Registration → OTP Email → Verified Access.
-   **Admin Auth**: Role-based JWTs with specific access scopes.
-   **Automatic Expiry**: OTPs self-destruct after 5 minutes using MongoDB TTL indexes.

### 📦 2. Advanced Product & Inventory Engine
-   **Image Ecosystem**: Integrated with **AWS S3** for high-availability image storage.
-   **Validation**: Enforced 2–5 images per product at the schema level.
-   **Stock Integrity**: Atomic operations to prevent "NaN" stock errors and over-ordering.

### 🎫 3. Smart Coupon & Promotion System
-   **Multi-Type Support**: Percentage-based (`PERCENT`) or Flat-rate (`FLAT`) discounts.
-   **Intelligent Guardrails**: Minimum order values, maximum discount caps, and usage limits.
-   **Real-time Validation**: Coupons are validated on-the-fly during the checkout process.

### 🛒 4. Transactional Order Management
-   **Snapshotting**: Orders capture product prices at the time of purchase to protect against future price changes.
-   **Automated Stock Sync**: Stock is deducted upon order placement and **instantly restored** if an order is cancelled.
-   **Admin Control**: Domain-specific roles like `ORDER_MANAGER` and `PRODUCT_MANAGER` for operational efficiency.

---

## 🛠️ Technology Stack
| Layer | Technology |
| :--- | :--- |
| **Runtime** | Node.js (Latest stable) |
| **Framework** | Express.js (v5+) |
| **Database** | MongoDB with Mongoose |
| **Storage** | AWS S3 via SDK v3 |
| **Messaging** | Nodemailer (SMTP/Gmail) |
| **Security** | JWT, Bcrypt.js,Helmet|

---

## 🗺️ API Route Map

### 👤 User Endpoints
- `POST /api/users/register` - New user signup (triggers OTP)
- `POST /api/users/verify-otp` - Link account to email
- `POST /api/users/login` - Secure JWT generation
- `/api/cart` - Full CRUD functionality (Add/Update/Remove/Clear)
- `/api/user/orders` - Order history & Placement logic

### 👨‍💼 Admin Control
- `/api/admin` - Login/Forgot/Reset Password
- `/api/admin/orders` - Status management (Shipped/Delivered)
- `/api/admin/coupons` - Full promotion management
- `/api/products` - Product CRUD (Available to `PRODUCT_MANAGER`)
- `/api/categories` - Organization (Available to `PRODUCT_MANAGER`)

---

## 🚦 Setup & Installation

1. **Clone & Install**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Configure your `.env` with `MONGO_URI`, `JWT_SECRET`, `EMAIL_USER/PASS`, and `AWS_S3` credentials.

3. **Database Reset (Optional)**:
   Use `src/utils/createRootAdmin.js` to initialize the system.

4. **Launch**:
   ```bash
   node server.js
   ```

---
*Developed with focus on Scalability, Security, and Data Integrity.*