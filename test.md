# 🧪 API Testing Guide

This document provides a comprehensive list of test cases for the Ecommerce Backend API. You can use tools like **Postman**, **Insomnia**, or **Thunder Client** to execute these requests.

**Base URL**: `http://localhost:8000/api`

---

## 👤 User Authentication & Profile

### 1. Register a New User
- **Endpoint**: `POST /users/register`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123"
  }
  ```
- **Goal**: User should be created with `isVerified: false`. An OTP will be sent to the email.

### 2. Verify OTP
- **Endpoint**: `POST /users/verify-otp`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "otp": "123456"
  }
  ```
- **Goal**: Account should be activated (`isVerified: true`).

### 3. User Login
- **Endpoint**: `POST /users/login`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "Password123"
  }
  ```
- **Goal**: Receive a `token`. Save this token for subsequent requests.

---

## 👨‍💼 Admin Operations

### 4. Admin Forgot Password (Send OTP)
- **Endpoint**: `POST /admin/forgot-password`
- **Body**:
  ```json
  {
    "email": "admin@ecommerce.com"
  }
  ```
- **Goal**: Receive an OTP on the admin email.

### 5. Admin Reset Password (Verify OTP)
- **Endpoint**: `POST /admin/reset-password`
- **Body**:
  ```json
  {
    "email": "admin@ecommerce.com",
    "otp": "123456",
    "newPassword": "NewAdminPassword123"
  }
  ```
- **Goal**: Password reset successfully.

---

## 📦 Product & Category Management (Admin)

### 6. Create Category
- **Endpoint**: `POST /categories`
- **Headers**: `Authorization: Bearer <ADMIN_TOKEN>`
- **Body**:
  ```json
  {
    "name": "Electronics",
    "description": "Gadgets and devices"
  }
  ```

### 7. Create Product
- **Endpoint**: `POST /products`
- **Headers**: `Authorization: Bearer <ADMIN_TOKEN>`, `Content-Type: multipart/form-data`
- **Form Data**:
  - `name`: "Smartphone X"
  - `price`: 999
  - `stock`: 50
  - `category`: `[CATEGORY_ID]`
  - `images`: (Select 2-5 files)
- **Goal**: Product created and images uploaded to S3.

---

## 🛒 Shopping Cart (User)

### 8. Add Item to Cart
- **Endpoint**: `POST /cart/add`
- **Headers**: `Authorization: Bearer <USER_TOKEN>`
- **Body**:
  ```json
  {
    "productId": "[PRODUCT_ID]",
    "quantity": 1
  }
  ```

### 9. View Cart
- **Endpoint**: `GET /cart`
- **Headers**: `Authorization: Bearer <USER_TOKEN>`

---

## 💳 Order Management

### 10. Place Order
- **Endpoint**: `POST /user/orders`
- **Headers**: `Authorization: Bearer <USER_TOKEN>`
- **Goal**: Cart is cleared, stock is deducted, and a new order is created.

### 11. View My Orders
- **Endpoint**: `GET /user/orders`
- **Headers**: `Authorization: Bearer <USER_TOKEN>`

### 12. Cancel Order
- **Endpoint**: `PUT /user/orders/:orderId/cancel`
- **Headers**: `Authorization: Bearer <USER_TOKEN>`
- **Goal**: Order status becomes `CANCELLED` and stock is restored.

### 13. Update Order Status (Admin)
- **Endpoint**: `PUT /admin/orders/:orderId/status`
- **Headers**: `Authorization: Bearer <ADMIN_TOKEN>`
- **Body**:
  ```json
  {
    "status": "SHIPPED"
  }
  ```

---

## 🔍 Validation & Error Cases

| Case | Expected Result |
| :--- | :--- |
| Login before OTP verification | 403 Forbidden |
| Place order with insufficient stock | 400 Bad Request |
| Access admin route with user token | 403 Forbidden |
| Register with existing email | 400 Bad Request |
| Create product with < 2 images | 400 Validation Error |
| Cancel order after status is SHIPPED | 400 Bad Request |
| Reset password with expired OTP | 400 Bad Request |
