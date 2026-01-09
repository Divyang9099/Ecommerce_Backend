import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/user/cart.controller.js";

import userProtect from "../middlewares/userAuth.middleware.js";

const router = express.Router();

// 🛒 Add item to cart
router.post("/add", userProtect, addToCart);


// 🛒 Get logged-in user's cart
router.get("/", userProtect, getCart);

// 🛒 Update quantity
router.put("/update", userProtect, updateCartItem);

// 🛒 Remove item
router.delete("/remove/:productId", userProtect, removeFromCart);
// 🛒 Clear cart
router.delete("/clear", userProtect, clearCart);


export default router;
