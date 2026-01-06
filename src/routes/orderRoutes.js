import express from "express";
import protect from "../middlewares/authMiddleware.js";
import allowRoles from "../middlewares/roleMiddleware.js";
import { cancelOrder } from "../controllers/orderController.js";
import {
  createOrder,
  getOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

router.post(
  "/",
  protect,
  allowRoles("ORDER_MANAGER", "ROOT_ADMIN"),
  createOrder
);

router.get(
  "/",
  protect,
  allowRoles("ORDER_MANAGER", "ROOT_ADMIN"),
  getOrders
);

router.put(
  "/:id/status",
  protect,
  allowRoles("ORDER_MANAGER", "ROOT_ADMIN"),
  updateOrderStatus
);

router.put(
  "/:id/cancel",
  protect,
  allowRoles("ORDER_MANAGER", "ROOT_ADMIN"),
  cancelOrder
);


export default router;
