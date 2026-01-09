import express from "express";
import cors from "cors";

// ROUTES
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import userOrderRoutes from "./routes/userOrderRoutes.js";
import adminOrderRoutes from "./routes/adminOrderRoutes.js";
import adminCouponRoutes from "./routes/adminCouponRoutes.js";

const app = express();

// GLOBAL MIDDLEWARES
app.use(cors());
app.use(express.json());

// ADMIN ROUTES
app.use("/api/admin", adminRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/coupons", adminCouponRoutes);


// USER (CUSTOMER) ROUTES
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/user/orders", userOrderRoutes);

// PUBLIC ROUTES
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/test", testRoutes);

// HEALTH CHECK
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/debug", (req, res) => {
  res.send("Debug route working");
});

export default app;
