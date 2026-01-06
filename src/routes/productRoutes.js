import express from "express";
import protect from "../middlewares/authMiddleware.js";
import allowRoles from "../middlewares/roleMiddleware.js";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.post(
  "/",
  protect,
  allowRoles("PRODUCT_MANAGER", "ROOT_ADMIN"),
  createProduct
);

router.get(
  "/",
  protect,
  allowRoles("PRODUCT_MANAGER", "ROOT_ADMIN"),
  getProducts
);

router.put(
  "/:id",
  protect,
  allowRoles("PRODUCT_MANAGER", "ROOT_ADMIN"),
  updateProduct
);

router.delete(
  "/:id",
  protect,
  allowRoles("PRODUCT_MANAGER", "ROOT_ADMIN"),
  deleteProduct
);

export default router;
