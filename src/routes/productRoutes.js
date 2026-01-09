import express from "express";
<<<<<<< HEAD
import protect from "../middlewares/adminAuth.middleware.js";
import allowRoles from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
=======
import protect from "../middlewares/authMiddleware.js";
import allowRoles from "../middlewares/roleMiddleware.js";
>>>>>>> 5b738b36991f8f7182b4bd3c805e368a3b628b26
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
<<<<<<< HEAD
} from "../controllers/product.controller.js";
=======
} from "../controllers/productController.js";
>>>>>>> 5b738b36991f8f7182b4bd3c805e368a3b628b26

const router = express.Router();

router.post(
  "/",
  protect,
  allowRoles("PRODUCT_MANAGER", "ROOT_ADMIN"),
<<<<<<< HEAD
  upload.array("images", 5),
  createProduct
);

router.get("/", getProducts);
router.get("/:id", getProducts);
=======
  createProduct
);

router.get(
  "/",
  protect,
  allowRoles("PRODUCT_MANAGER", "ROOT_ADMIN"),
  getProducts
);
>>>>>>> 5b738b36991f8f7182b4bd3c805e368a3b628b26

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
