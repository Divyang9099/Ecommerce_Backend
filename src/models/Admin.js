import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: ["ROOT_ADMIN", "PRODUCT_MANAGER", "ORDER_MANAGER"],
      default: "PRODUCT_MANAGER"
    },
    isActive: {
      type: Boolean,
      default: true
    },


  },
  { timestamps: true }
);

// HASH PASSWORD BEFORE SAVE
adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// COMPARE PASSWORD
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


export default mongoose.model("Admin", adminSchema);

