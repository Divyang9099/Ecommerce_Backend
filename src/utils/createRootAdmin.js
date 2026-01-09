import Admin from "../models/Admin.js";
<<<<<<< HEAD
import { hashPassword } from "../services/password.service.js";
=======
import { hashPassword } from "./hashPassword.js";
>>>>>>> 5b738b36991f8f7182b4bd3c805e368a3b628b26

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
