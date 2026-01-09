import express from "express";
<<<<<<< HEAD
import {
  loginAdmin,
  createAdmin,
  forgotPassword,
  resetPassword,
} from "../controllers/admin/admin.controller.js";

import protect from "../middlewares/adminAuth.middleware.js";
import allowRoles from "../middlewares/role.middleware.js";
=======
import { loginAdmin, createAdmin } from "../controllers/adminController.js";
import protect from "../middlewares/authMiddleware.js";
import allowRoles from "../middlewares/roleMiddleware.js";
>>>>>>> 5b738b36991f8f7182b4bd3c805e368a3b628b26

const router = express.Router();

router.post("/login", loginAdmin);

<<<<<<< HEAD


// CREATE ADMIN (ROOT ADMIN ONLY)
=======
// ROOT ADMIN creates other admins
>>>>>>> 5b738b36991f8f7182b4bd3c805e368a3b628b26
router.post(
  "/create",
  protect,
  allowRoles("ROOT_ADMIN"),
<<<<<<< HEAD
  createAdmin);
// forgot & reset password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
=======
  createAdmin
);
>>>>>>> 5b738b36991f8f7182b4bd3c805e368a3b628b26

export default router;
