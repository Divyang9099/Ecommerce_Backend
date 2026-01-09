import express from "express";
import {
  loginAdmin,
  createAdmin,
  forgotPassword,
  resetPassword,
} from "../controllers/admin/admin.controller.js";

import protect from "../middlewares/adminAuth.middleware.js";
import allowRoles from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/login", loginAdmin);



// CREATE ADMIN (ROOT ADMIN ONLY)
router.post(
  "/create",
  protect,
  allowRoles("ROOT_ADMIN"),
  createAdmin);
// forgot & reset password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
