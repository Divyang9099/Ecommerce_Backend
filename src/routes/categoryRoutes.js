import express from "express";
<<<<<<< HEAD
import protect from "../middlewares/adminAuth.middleware.js";
import allowRoles from "../middlewares/role.middleware.js";
=======
import protect from "../middlewares/authMiddleware.js";
import allowRoles from "../middlewares/roleMiddleware.js";
>>>>>>> 5b738b36991f8f7182b4bd3c805e368a3b628b26
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
<<<<<<< HEAD
} from "../controllers/category.controller.js";
=======
} from "../controllers/categoryController.js";
>>>>>>> 5b738b36991f8f7182b4bd3c805e368a3b628b26

const router = express.Router();

router.post(
  "/",
  protect,
<<<<<<< HEAD
  allowRoles("ROOT_ADMIN", "PRODUCT_MANAGER"),
  createCategory
);

router.get("/", getCategories);
=======
  allowRoles("ROOT_ADMIN"),
  createCategory
);

router.get(
  "/",
  protect,
  allowRoles("ROOT_ADMIN"),
  getCategories
);
>>>>>>> 5b738b36991f8f7182b4bd3c805e368a3b628b26

router.put(
  "/:id",
  protect,
<<<<<<< HEAD
  allowRoles("ROOT_ADMIN", "PRODUCT_MANAGER"),
=======
  allowRoles("ROOT_ADMIN"),
>>>>>>> 5b738b36991f8f7182b4bd3c805e368a3b628b26
  updateCategory
);

router.delete(
  "/:id",
  protect,
<<<<<<< HEAD
  allowRoles("ROOT_ADMIN", "PRODUCT_MANAGER"),
=======
  allowRoles("ROOT_ADMIN"),
>>>>>>> 5b738b36991f8f7182b4bd3c805e368a3b628b26
  deleteCategory
);

export default router;
