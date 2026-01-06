
import express from "express";
import  protect  from "../middlewares/authMiddleware.js";
import allowRoles from "../middlewares/roleMiddleware.js";
import { rootOnly, orderManagerOnly } from "../controllers/testController.js";

const router = express.Router();

router.get("/root", rootOnly);
router.get("/order", protect, allowRoles("ORDER_MANAGER"), orderManagerOnly);



export default router;