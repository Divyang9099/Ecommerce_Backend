import User from "../../models/User.js";
import OTP from "../../models/OTP.js";
import bcrypt from "bcryptjs";
import { generateOtp } from "../../services/otp.service.js";
import sendEmail from "../../services/email.service.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }



    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await User.create({
      name,
      email,
      password, // Will be hashed by model pre-save hook
      isVerified: false,
    });

    await OTP.create({
      email,
      otp,
      purpose: "VERIFICATION",
      expiresAt,
    });

    await sendEmail(
      email,
      "Verify your account",
      `Your OTP is ${otp}. It is valid for 5 minutes.`
    );

    res.status(201).json({
      message: "User registered. Please verify OTP.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    const otpRecord = await OTP.findOne({ email, otp, purpose: "VERIFICATION" });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    await user.save();

    // Delete OTP after successful verification
    await OTP.deleteOne({ _id: otpRecord._id });

    res.status(200).json({ message: "Account verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {



  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email }).select("+password");


    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        message: "Please verify your account using OTP",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.findOneAndUpdate(
      { email, purpose: "VERIFICATION" },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    await sendEmail(
      email,
      "Resend OTP",
      `Subject: Verify your email – MyShop

Hi ${user.name},

We received a request to verify your email for MyShop.

Your One-Time Password (OTP) is:
${otp}

This OTP is valid for 5 minutes.
Do not share this code with anyone.

If you did not request this, you can safely ignore this email.

— MyShop Security Team
support@myshop.com
`
    );

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};