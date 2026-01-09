import express from "express";
import {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon
} from "../controllers/admin/coupon.controller.js";

import adminAuth from "../middlewares/adminAuth.middleware.js";
import allowRoles from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(adminAuth);
router.use(allowRoles("ROOT_ADMIN"));

router.post("/", createCoupon);
router.get("/", getAllCoupons);
router.patch("/:id", updateCoupon);
router.delete("/:id", deleteCoupon);

export default router;
