import dns from "dns";

// ========================================
// DNS CONFIGURATION
// ========================================

if (process.env.NODE_ENV !== "production") {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";


// ========================================
// LOAD ENVIRONMENT VARIABLES
// ========================================

dotenv.config();


// ========================================
// CREATE EXPRESS APP
// ========================================

const app = express();


// ========================================
// CORS
// ========================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://saliha-s-beauty-full-stack-websites.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,
  })
);


// ========================================
// MORGAN
// ========================================

app.use(morgan("dev"));


// ========================================
// STRIPE WEBHOOK
// ========================================
// IMPORTANT:
// This must come BEFORE express.json()
// because Stripe needs the raw body.
// ========================================

import { stripeWebhook } from "./controllers/paymentController.js";

app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);


// ========================================
// BODY PARSER
// ========================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);


// ========================================
// IMPORT ROUTES
// ========================================

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminOrderRoutes from "./routes/adminOrderRoutes.js";


// ========================================
// API ROUTES
// ========================================

// Authentication
app.use("/api/auth", authRoutes);

// Products
app.use("/api/products", productRoutes);

// Categories
app.use("/api/categories", categoryRoutes);

// Orders
app.use("/api/orders", orderRoutes);

// Payments
app.use("/api/payments", paymentRoutes);

// Admin Dashboard
app.use("/api/admin", adminRoutes);

// Admin Orders
app.use("/api/admin/orders", adminOrderRoutes);


// ========================================
// HOME ROUTE
// ========================================

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Saliha's Beauty API is running successfully 💄",
  });
});


// ========================================
// 404 ROUTE
// ========================================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});


// ========================================
// ERROR HANDLER
// ========================================

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      message: "CORS error: Origin not allowed",
    });
  }

  return res.status(500).json({
    message: "Internal server error",
    error: err.message,
  });
});


// ========================================
// MONGODB CONNECTION
// ========================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:",
      error.message
    );
  });


// ========================================
// SERVER PORT
// ========================================

const port = process.env.PORT || 5000;


// ========================================
// START SERVER
// ========================================

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}


// ========================================
// EXPORT APP
// ========================================

export default app;