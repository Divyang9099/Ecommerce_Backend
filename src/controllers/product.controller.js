import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { Upload } from "@aws-sdk/lib-storage";
import s3 from "../config/s3.js";
// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const { name, price, stock, category, description } = req.body;

    // 1️⃣ Validation
    if (!name || !price || !stock || !category) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    // 2️⃣ Check category
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category" });
    }

    // 3️⃣ Upload images to S3
    const imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const upload = new Upload({
          client: s3,
          params: {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `products/${Date.now()}-${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype,
          },
        });

        const result = await upload.done();
        imageUrls.push(result.Location);
      }
    }

    // 4️⃣ Create product
    const product = await Product.create({
      name,
      price,
      stock,
      category,
      description,
      images: imageUrls, // ✅ FIXED
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

    if (req.admin && req.admin.role === "PRODUCT_MANAGER" || req.admin && req.admin.role === "ROOT_ADMIN") {
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
