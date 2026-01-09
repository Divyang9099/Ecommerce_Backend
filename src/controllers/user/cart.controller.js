import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";

// 🛒 Add item to cart
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  const quantityNumber = Number(quantity);
  if (!Number.isInteger(quantityNumber) || quantityNumber <= 0) {
    return res.status(400).json({
      message: "Quantity must be a positive integer",
    });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({
      user: userId,
      items: [{ product: productId, quantity: quantityNumber }],
    });
  } else {
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantityNumber;
    } else {
      cart.items.push({ product: productId, quantity: quantityNumber });
    }
  }

  await cart.save();
  res.status(200).json(cart);
};

// 🛒 Get logged-in user's cart
export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate(
    "items.product"
  );

  if (!cart) {
    return res.status(404).json({ message: "Cart is empty" });
  }

  res.json(cart);
};

// 🛒 Update cart item quantity
export const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  const quantityNumber = Number(quantity);
  if (!Number.isInteger(quantityNumber) || quantityNumber < 1) {
    return res.status(400).json({ message: "Quantity must be a positive integer" });
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const item = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (!item) {
    return res.status(404).json({ message: "Item not found in cart" });
  }

  item.quantity = quantityNumber;
  await cart.save();

  res.json(cart);
};

// 🛒 Remove item from cart
export const removeFromCart = async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  await cart.save();
  res.json(cart);
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
