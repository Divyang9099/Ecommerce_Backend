
import express from "express";
import protect from "../middlewares/adminAuth.middleware.js";
import allowRoles from "../middlewares/role.middleware.js";
import { rootOnly, orderManagerOnly } from "../controllers/test.controller.js";

const router = express.Router();

router.get("/root", rootOnly);
router.get("/order", protect, allowRoles("ORDER_MANAGER"), orderManagerOnly);



export default router;