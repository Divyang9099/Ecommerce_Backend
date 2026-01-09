import express from "express";
import protect from "../middlewares/adminAuth.middleware.js";
import allowRoles from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router.post(
  "/",
  protect,
  allowRoles("PRODUCT_MANAGER", "ROOT_ADMIN"),
  upload.array("images", 5),
  createProduct
);

router.get("/", getProducts);
router.get("/:id", getProducts);

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
