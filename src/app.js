
import express from "express";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/test", testRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);



// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.get("/debug", (req, res) => {
  res.send("Debug route working");
});

export default app;
