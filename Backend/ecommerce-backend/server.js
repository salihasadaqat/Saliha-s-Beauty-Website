// ========================================
// LOAD ENVIRONMENT VARIABLES FIRST
// ========================================

import dotenv from "dotenv";

dotenv.config();


// ========================================
// DNS CONFIGURATION
// ========================================

import dns from "dns";

if (process.env.NODE_ENV !== "production") {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}


// ========================================
// IMPORT PACKAGES
// ========================================

import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";


// ========================================
// IMPORT CONTROLLERS
// ========================================

import { stripeWebhook } from "./controllers/paymentController.js";


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
// CREATE EXPRESS APP
// ========================================

const app = express();


// ========================================
// CORS CONFIGURATION
// ========================================

// ========================================
// CORS CONFIGURATION
// ========================================

// ========================================
// CORS CONFIGURATION
// ========================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",

  // Production frontend
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      // Exact allowed frontend URL
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow Vercel deployment URLs for this project
      if (
        /^https:\/\/saliha-s-beauty-website-[a-z0-9]+-saliha1\.vercel\.app$/.test(
          origin
        )
      ) {
        return callback(null, true);
      }

      console.log("Blocked CORS origin:", origin);

      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,
  })
);
// ========================================
// MORGAN LOGGER
// ========================================

app.use(morgan("dev"));


// ========================================
// STRIPE WEBHOOK
// ========================================
// IMPORTANT:
// Stripe webhook must come BEFORE express.json()
// ========================================

app.post(
  "/api/payments/webhook",
  express.raw({
    type: "application/json",
  }),
  stripeWebhook
);


// ========================================
// BODY PARSERS
// ========================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);


// ========================================
// API ROUTES
// ========================================

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/admin", adminRoutes);

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

const connectMongoDB = async () => {
  try {

    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is not defined in environment variables"
      );
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");

  } catch (error) {

    console.error("MongoDB connection failed:");
    console.error(error.message);

  }
};


// ========================================
// LOCAL SERVER
// ========================================

const port = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

}


// ========================================
// CONNECT TO MONGODB
// ========================================

connectMongoDB();


// ========================================
// EXPORT APP
// ========================================

export default app;