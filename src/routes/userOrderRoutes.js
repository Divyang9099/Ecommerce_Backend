import express from "express";
import {
  placeOrder,
  getUserOrders,
  cancelUserOrder,
  getUserOrderById,
} from "../controllers/user/order.controller.js";

import userProtect from "../middlewares/userAuth.middleware.js";

const router = express.Router();

// 🛒 Place order from cart
router.post(
  "/",
  userProtect,
  placeOrder
);

// 📦 Get logged-in user's orders
router.get(
  "/",
  userProtect,
  getUserOrders
);
// 📦 Get specific order by ID
router.get(
  "/:id",
  userProtect,
  getUserOrderById
);

// ❌ Cancel order (only if status = PLACED)
router.put(
  "/:id/cancel",
  userProtect,
  cancelUserOrder
);

export default router;
