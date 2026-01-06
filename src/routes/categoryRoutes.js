import express from "express";
import protect from "../middlewares/authMiddleware.js";
import allowRoles from "../middlewares/roleMiddleware.js";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post(
  "/",
  protect,
  allowRoles("ROOT_ADMIN"),
  createCategory
);

router.get(
  "/",
  protect,
  allowRoles("ROOT_ADMIN"),
  getCategories
);

router.put(
  "/:id",
  protect,
  allowRoles("ROOT_ADMIN"),
  updateCategory
);

router.delete(
  "/:id",
  protect,
  allowRoles("ROOT_ADMIN"),
  deleteCategory
);

export default router;
