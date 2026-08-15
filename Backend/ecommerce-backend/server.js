const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// ==========================================
// ROUTES
// ==========================================

const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const adminRoutes = require("./routes/adminRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");

// Stripe webhook controller
const {
  stripeWebhook,
} = require("./controllers/paymentController");

// ==========================================
// APP
// ==========================================

const app = express();

// ==========================================
// CORS
// ==========================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ==========================================
// STRIPE WEBHOOK
// IMPORTANT:
// This MUST come before express.json()
// ==========================================

app.post(
  "/api/payments/webhook",
  express.raw({
    type: "application/json",
  }),
  stripeWebhook
);

// ==========================================
// NORMAL JSON REQUESTS
// ==========================================

app.use(express.json());

// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.json({
    message: "Saliha's Beauty Backend is running!",
  });
});

// ==========================================
// AUTH ROUTES
// ==========================================

app.use(
  "/api/auth",
  authRoutes
);

// ==========================================
// PAYMENT ROUTES
// ==========================================

app.use(
  "/api/payments",
  paymentRoutes
);

// ==========================================
// CUSTOMER ORDER ROUTES
// ==========================================

app.use(
  "/api/orders",
  orderRoutes
);

// ==========================================
// PRODUCT ROUTES
// ==========================================

app.use(
  "/api/products",
  productRoutes
);

// ==========================================
// CATEGORY ROUTES
// ==========================================

app.use(
  "/api/categories",
  categoryRoutes
);

// ==========================================
// ADMIN ROUTES
// ==========================================

app.use(
  "/api/admin",
  adminRoutes
);

// ==========================================
// ADMIN ORDER ROUTES
// ==========================================

app.use(
  "/api/admin/orders",
  adminOrderRoutes
);

// ==========================================
// 404 ROUTE
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    message: "API route not found",
    path: req.originalUrl,
  });
});

// ==========================================
// ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    message: "Internal server error",
    error: err.message,
  });
});

// ==========================================
// MONGODB + SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    if (!process.env.VERCEL) {
      app.listen(PORT, () => {
        console.log(
          `Server running on http://localhost:${PORT}`
        );
      });
    }
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:",
      error.message
    );
  });

module.exports = app;