import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      maxlength: 500,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

<<<<<<< HEAD
    stock: {
=======
    quantity: {
>>>>>>> 5b738b36991f8f7182b4bd3c805e368a3b628b26
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
<<<<<<< HEAD
    images: {
      type: [String],
      validate: [arr => arr.length >= 2 && arr.length <= 5, "2–5 images required"]
    },
=======

>>>>>>> 5b738b36991f8f7182b4bd3c805e368a3b628b26
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
