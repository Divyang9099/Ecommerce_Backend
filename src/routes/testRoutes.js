
import express from "express";
<<<<<<< HEAD
import protect from "../middlewares/adminAuth.middleware.js";
import allowRoles from "../middlewares/role.middleware.js";
import { rootOnly, orderManagerOnly } from "../controllers/test.controller.js";
=======
import  protect  from "../middlewares/authMiddleware.js";
import allowRoles from "../middlewares/roleMiddleware.js";
import { rootOnly, orderManagerOnly } from "../controllers/testController.js";
>>>>>>> 5b738b36991f8f7182b4bd3c805e368a3b628b26

const router = express.Router();

router.get("/root", rootOnly);
router.get("/order", protect, allowRoles("ORDER_MANAGER"), orderManagerOnly);



export default router;