import Product from "../models/Product.js";
import Category from "../models/Category.js";

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const { name, price, quantity, category, description } = req.body;

    if (!name || !price || !quantity || !category) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const product = await Product.create({
      name,
      price,
      quantity,
      category,
      description,
      createdBy: req.admin._id,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET PRODUCTS
export const getProducts = async (req, res) => {
  try {
    let filter = {};

    if (req.admin.role === "PRODUCT_MANAGER") {
      filter.createdBy = req.admin._id;
    }

    const products = await Product.find(filter)
      .populate("category", "name")
      .populate("createdBy", "name email");

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (
      req.admin.role === "PRODUCT_MANAGER" &&
      product.createdBy.toString() !== req.admin._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    Object.assign(product, req.body);
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (
      req.admin.role === "PRODUCT_MANAGER" &&
      product.createdBy.toString() !== req.admin._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
