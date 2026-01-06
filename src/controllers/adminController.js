import Admin from "../models/Admin.js";
import { comparePassword } from "../utils/hashPassword.js";
import generateToken from "../utils/generateToken.js";

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
