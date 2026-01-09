import Order from "../models/Order.js";
import Product from "../models/Product.js";

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "Order must contain products" });
    }

    let totalAmount = 0;
    const orderProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(400).json({ message: "Invalid product" });
      }

      if (product.quantity < item.quantity) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for ${product.name}` });
      }

      // decrease stock
      product.quantity -= item.quantity;
      await product.save();

      totalAmount += product.price * item.quantity;

      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const order = await Order.create({
      products: orderProducts,
      totalAmount,
      createdBy: req.admin._id,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL ORDERS (Order Manager & Root)
export const getOrders = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const orders = await Order.find()
      .skip(skip)
      .limit(limit)
      .populate("products.product", "name price")
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments();

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE ORDER STATUS
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "PENDING") {
      return res
        .status(400)
        .json({ message: "Only pending orders can be cancelled" });
    }

    // rollback inventory
    for (const item of order.products) {
      const product = await Product.findById(item.product);
      if (product) {
        product.quantity += item.quantity;
        await product.save();
      }
    }

    order.status = "CANCELLED";
    await order.save();

    res.json({ message: "Order cancelled and stock restored" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
