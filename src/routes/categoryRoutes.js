import express from "express";
import protect from "../middlewares/adminAuth.middleware.js";
import allowRoles from "../middlewares/role.middleware.js";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

const router = express.Router();

router.post(
  "/",
  protect,
  allowRoles("ROOT_ADMIN", "PRODUCT_MANAGER"),
  createCategory
);

router.get("/", getCategories);

router.put(
  "/:id",
  protect,
  allowRoles("ROOT_ADMIN", "PRODUCT_MANAGER"),
  updateCategory
);

router.delete(
  "/:id",
  protect,
  allowRoles("ROOT_ADMIN", "PRODUCT_MANAGER"),
  deleteCategory
);

export default router;
