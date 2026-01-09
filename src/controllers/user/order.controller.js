import Order from "../../models/Order.js";
import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";
import Coupon from "../../models/Coupon.js";
import { validateCoupon } from "../../services/coupon.service.js";

// =======================
// PLACE ORDER (WITH COUPON - SERVICE BASED)
// =======================
export const placeOrder = async (req, res) => {
  try {
    const { couponCode } = req.body;

    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;
    const orderItems = [];

    // -----------------------
    // Validate stock & calculate total
    // -----------------------
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);

      if (!product) {
        return res.status(400).json({ message: "Invalid product in cart" });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
        });
      }

      // Defensive check for NaN
      if (
        Number.isNaN(Number(product.stock)) ||
        Number.isNaN(Number(item.quantity))
      ) {
        return res.status(500).json({
          message: "Invalid stock or quantity data",
        });
      }

      // Reduce stock
      product.stock = Number(product.stock) - Number(item.quantity);
      await product.save();

      totalAmount += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // -----------------------
    // Apply Coupon (SERVICE)
    // -----------------------
    let discountAmount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      const { coupon, discountAmount: discount } =
        await validateCoupon({
          code: couponCode,
          orderAmount: totalAmount,
        });

      discountAmount = discount;

      appliedCoupon = {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      };

      // Increment coupon usage
      coupon.usedCount += 1;
      await coupon.save();
    }

    const finalAmount = totalAmount - discountAmount;

    // -----------------------
    // Create Order
    // -----------------------
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      discountAmount,
      finalAmount,
      coupon: appliedCoupon,
      status: "PLACED",
    });

    // -----------------------
    // Clear Cart
    // -----------------------
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// GET USER ORDERS
// =======================
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name price")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// GET USER ORDER BY ID
// =======================
export const getUserOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({
      _id: id,
      user: req.user._id,
    }).populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// CANCEL USER ORDER
// =======================
export const cancelUserOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "PLACED") {
      return res.status(400).json({
        message: "Order cannot be cancelled at this stage",
      });
    }

    // restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    order.status = "CANCELLED";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
