import Order from "../../models/Order.js";
import Product from "../../models/Product.js";

/**
 * ✅ CREATE ORDER (ADMIN)
 * Use-case: manual/admin-created order
 */
export const createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Order must contain at least one item",
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(400).json({
          message: "Invalid product ID",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
        });
      }

      // Deduct stock
      product.stock = Number(product.stock) - Number(item.quantity);
      await product.save();

      totalAmount += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const order = await Order.create({
      user: null, // admin-created order
      items: orderItems,
      totalAmount,
      status: "PLACED",
      createdBy: req.admin._id,
    });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ✅ GET ALL ORDERS (ADMIN)
 */
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ✅ UPDATE ORDER STATUS (ADMIN)
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["PLACED", "SHIPPED", "DELIVERED", "CANCELLED"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ❌ CANCEL ORDER (ADMIN)
 * Admin can cancel any order EXCEPT DELIVERED
 */
export const cancelOrderByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ❌ Do not allow cancelling delivered orders
    if (order.status === "DELIVERED") {
      return res.status(400).json({
        message: "Delivered orders cannot be cancelled",
      });
    }

    // If already cancelled, do nothing
    if (order.status === "CANCELLED") {
      return res.status(400).json({
        message: "Order is already cancelled",
      });
    }

    // 🔁 Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    order.status = "CANCELLED";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully by admin",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
