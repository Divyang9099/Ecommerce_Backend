import mongoose from "mongoose";
<<<<<<< HEAD
import bcrypt from "bcryptjs";

=======
>>>>>>> 5b738b36991f8f7182b4bd3c805e368a3b628b26

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
<<<<<<< HEAD
      required: true,
      select: false
=======
      required: true
>>>>>>> 5b738b36991f8f7182b4bd3c805e368a3b628b26
    },
    role: {
      type: String,
      enum: ["ROOT_ADMIN", "PRODUCT_MANAGER", "ORDER_MANAGER"],
      default: "PRODUCT_MANAGER"
    },
    isActive: {
      type: Boolean,
      default: true
<<<<<<< HEAD
    },


=======
    }
>>>>>>> 5b738b36991f8f7182b4bd3c805e368a3b628b26
  },
  { timestamps: true }
);

<<<<<<< HEAD
// HASH PASSWORD BEFORE SAVE
adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// COMPARE PASSWORD
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


=======
>>>>>>> 5b738b36991f8f7182b4bd3c805e368a3b628b26
export default mongoose.model("Admin", adminSchema);

