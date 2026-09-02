import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
connectDB();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

// Test Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Fatima's E-Commerce API 🚀"
    });
});

if (process.env.NODE_ENV !== "production") {
    const port = process.env.PORT || 5000;

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

export default app;
