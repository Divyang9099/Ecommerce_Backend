import Admin from "../../models/Admin.js";
import OTP from "../../models/OTP.js";
import generateToken from "../../services/token.service.js";
import sendEmail from "../../services/email.service.js";
import { generateOtp } from "../../services/otp.service.js";

// =======================
// ADMIN LOGIN
// =======================
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      token: generateToken(admin),
      role: admin.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// CREATE ADMIN
// =======================
export const createAdmin = async (req, res) => {
  try {
    const adminCount = await Admin.countDocuments();
    const { name, email, password, role } = req.body;

    // 🟢 BOOTSTRAP: FIRST ROOT ADMIN (NO AUTH)
    if (adminCount === 0) {
      const admin = await Admin.create({
        name,
        email,
        password,
        role: "ROOT_ADMIN",
      });

      return res.status(201).json({
        message: "Root admin created successfully",
        admin,
      });
    }

    // 🔒 AFTER BOOTSTRAP → ONLY ROOT_ADMIN
    const exists = await Admin.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = await Admin.create({
      name,
      email,
      password,
      role, // PRODUCT_MANAGER / ORDER_MANAGER
    });

    res.status(201).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// FORGOT PASSWORD (SEND OTP)
// =======================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await OTP.findOneAndUpdate(
      { email, purpose: "PASSWORD_RESET" },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    await sendEmail({
      to: admin.email,
      subject: "Admin Password Reset OTP",
      html: `
        <h3>Password Reset Request</h3>
        <p>Subject: Verify your email – MyShop

Hi ${admin.name},

We received a request to verify your email for MyShop.

Your One-Time Password (OTP) is:
<b>${otp}</b>
This OTP is valid for 5 minutes.
Do not share this code with anyone.

If you did not request this, you can safely ignore this email.

— MyShop Security Team
support@myshop.com
</p>
      `,
    });

    res.json({ message: "OTP sent to admin email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// RESET PASSWORD (VERIFY OTP)
// =======================
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const otpRecord = await OTP.findOne({ email, otp, purpose: "PASSWORD_RESET" });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    admin.password = newPassword; // Will be hashed by model pre-save hook
    await admin.save();

    // Delete OTP after success
    await OTP.deleteOne({ _id: otpRecord._id });

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
