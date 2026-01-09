import express from "express";
import {
  createOrder,
  getOrders,
  updateOrderStatus,
  cancelOrderByAdmin as cancelOrder,
} from "../controllers/admin/order.controller.js";

import protect from "../middlewares/adminAuth.middleware.js";
import allowRoles from "../middlewares/role.middleware.js";

const router = express.Router();

// Create order (admin)
router.post(
  "/",
  protect,
  allowRoles("ROOT_ADMIN", "ORDER_MANAGER"),
  createOrder
);

// Get all orders
router.get(
  "/",
  protect,
  allowRoles("ROOT_ADMIN", "ORDER_MANAGER"),
  getOrders
);

// Update order status
router.put(
  "/:id/status",
  protect,
  allowRoles("ROOT_ADMIN", "ORDER_MANAGER"),
  updateOrderStatus
);
// Cancel order

router.delete(
  "/:id/cancel",
  protect,
  allowRoles("ROOT_ADMIN", "ORDER_MANAGER"),
  cancelOrder
);
export default router;
