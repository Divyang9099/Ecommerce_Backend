import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
<<<<<<< HEAD
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    items: [
=======
    products: [
>>>>>>> 5b738b36991f8f7182b4bd3c805e368a3b628b26
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
<<<<<<< HEAD
      enum: ["PLACED", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PLACED",
    },
    coupon: {
      code: String,
      discountType: String,
      discountValue: Number
    },

    discountAmount: {
      type: Number,
      default: 0
    },

    finalAmount: {
      type: Number,
      required: true
    }

=======
      enum: ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
>>>>>>> 5b738b36991f8f7182b4bd3c805e368a3b628b26
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
