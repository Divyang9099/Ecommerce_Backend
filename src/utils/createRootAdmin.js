import Admin from "../models/Admin.js";
import { hashPassword } from "./hashPassword.js";

const createRootAdmin = async () => {
  const exists = await Admin.findOne({ role: "ROOT_ADMIN" });
  if (exists) return;

  await Admin.create({
    name: "Root Admin",
    email: "admin@shop.com",
    password: await hashPassword("Admin@123"),
    role: "ROOT_ADMIN"
  });

  console.log("Root Admin created");
};

export default createRootAdmin;
