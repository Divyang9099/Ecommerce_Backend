import Admin from "../models/Admin.js";
import { comparePassword } from "../utils/hashPassword.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await comparePassword(password, admin.password);

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

export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      _id: admin._id,
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


