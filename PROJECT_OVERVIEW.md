# 📄 Technical Project Overview: Ecommerce Backend

This document provides a deep-dive into the technical implementation and logic flows of the Ecommerce Backend for senior reviews or AI context sharing.

## 🏗️ Technical Architecture
- **Environment**: Node.js (ESM)
- **Database**: MongoDB (Mongoose ODM)
- **Pattern**: Controller-Service-Repository style (implemented via Mongoose models).
- **Security**: Cross-Origin Resource Sharing (CORS), JWT stateless authentication, Bcrypt password hashing.

---

## 🔑 Key Logic Modules

### 1. Authentication & Verification (OTP Flow)
- **Logic**: Users are created with `isVerified: false`.
- **OTP Generation**: A 6-digit cryptographic-safe code is generated via `crypto`.
- **TTL Mechanism**: OTPs are stored in a dedicated collection with a 300-second (5 min) TTL index.
- **Service Dependency**: `email.service.js` handles SMTP transmission via `nodemailer`.

### 2. Role-Based Access Control (RBAC)
- **Roles**: `ROOT_ADMIN`, `PRODUCT_MANAGER`, `ORDER_MANAGER`.
- **Middleware Implementation**: `role.middleware.js` intercepts requests and checks the `decoded.role` in the JWT against allowed roles for that specific route.
- **Hierarchy**: `ROOT_ADMIN` has absolute access to all domains including admin creation.

### 3. Inventory & Cart Consistency
- **Data Integrity**: All quantity inputs are strictly cast to `Number` at the controller boundary to prevent `NaN` injection into the database.
- **The "Order Atomicity" Problem**:
  - During checkout, the system validates stock for every item in the cart.
  - Stock is deducted immediately upon order success.
  - If a user/admin cancels an order (`status: CANCELLED`), the system automatically increments the stock back using Mongoose `$inc`.

### 4. Promotion Engine (Coupon Logic)
- **Schema**: Supports `PERCENT` and `FLAT` types.
- **Validation Chain**:
  1. Existence check.
  2. Expiration check.
  3. `isActive` flag check.
  4. Usage limit vs. `usedCount` check.
  5. `minOrderAmount` check.
- **Order Linking**: Every order stores its final `discountAmount` and a snapshot of the coupon used for historical billing accuracy.

---

## 📂 Modular Structure Explained

- **`src/config/`**: Decoupled infrastructure configs (DB connection, S3 Client setup).
- **`src/services/`**: Pure functions for business logic (OTP, Token Gen, Password Hashing, Coupon Validation). This keeps controllers lean and testable.
- **`src/middlewares/`**:
  - `adminAuth`: Validates admin-scope JWTs.
  - `userAuth`: Validates customer-scope JWTs (uses `userId` payload).
  - `upload`: Multer configuration integrated with AWS S3 using `multer-s3`.
- **`src/utils/`**: Maintenance scripts (e.g., `createRootAdmin.js`).

---

## 🚦 Deployment & Stability
- **Database Migrations**: Includes cleanup utilities to ensure legacy data types match the current strict numeric schema.
- **Error Handling**: Standardized JSON error responses with status codes (400, 401, 403, 404, 500).
- **Scalability**: Stateless JWTs allow the backend to be horizontally scaled behind a load balancer easily.

---
**Technical Note for AI/Seniors**: The codebase uses **ES Modules** (import/export). Environment variables are strictly required for S3 and SMTP functionality. The `server.js` serves as the entry point, while `app.js` is the core application logic container.
