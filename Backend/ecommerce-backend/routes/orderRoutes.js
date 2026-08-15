const express = require("express");

const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  getAdminOrderById,
  updateOrderStatus,
  updatePaymentStatus,
} = require("../controllers/orderController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

// ==========================================
// CUSTOMER
// ==========================================

// Create COD order
router.post(
  "/",
  protect,
  createOrder
);

// Customer's orders
router.get(
  "/my-orders",
  protect,
  getMyOrders
);

// Single customer order
router.get(
  "/:id",
  protect,
  getOrderById
);

// ==========================================
// ADMIN
// ==========================================

// All orders
router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllOrders
);

// Single admin order
router.get(
  "/admin/:id",
  protect,
  adminOnly,
  getAdminOrderById
);

// Update order status
router.put(
  "/admin/:id/status",
  protect,
  adminOnly,
  updateOrderStatus
);

// Update payment status
router.put(
  "/admin/:id/payment",
  protect,
  adminOnly,
  updatePaymentStatus
);

module.exports = router;