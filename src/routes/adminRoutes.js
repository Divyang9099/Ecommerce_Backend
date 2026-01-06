import express from "express";
import { loginAdmin, createAdmin } from "../controllers/adminController.js";
import protect from "../middlewares/authMiddleware.js";
import allowRoles from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);

// ROOT ADMIN creates other admins
router.post(
  "/create",
  protect,
  allowRoles("ROOT_ADMIN"),
  createAdmin
);

export default router;
