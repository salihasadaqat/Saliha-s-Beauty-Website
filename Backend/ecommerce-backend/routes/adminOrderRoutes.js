import express from "express";
import Order from "../models/Order.js";
import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// GET ALL ORDERS
// ==========================================

router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email");

    res.status(200).json(orders);
  } catch (error) {
    console.error("Admin Get Orders Error:", error);

    res.status(500).json({
      message: "Unable to load orders.",
      error: error.message,
    });
  }
});

// ==========================================
// GET SINGLE ORDER
// ==========================================

router.get("/:id", protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Admin Get Order Error:", error);

    res.status(500).json({
      message: "Unable to load order.",
      error: error.message,
    });
  }
});

// ==========================================
// UPDATE ORDER STATUS
// ==========================================

router.put("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status.",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    order.status = status;

    await order.save();

    res.status(200).json({
      message: "Order status updated.",
      order,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);

    res.status(500).json({
      message: "Unable to update order status.",
      error: error.message,
    });
  }
});

// ==========================================
// UPDATE PAYMENT STATUS
// ==========================================

router.put("/:id/payment", protect, adminOnly, async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    const allowedStatuses = [
      "Pending",
      "Paid",
      "Failed",
    ];

    if (!allowedStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        message: "Invalid payment status.",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    order.paymentStatus = paymentStatus;

    if (paymentStatus === "Paid") {
      order.paidAt = new Date();
    }

    await order.save();

    res.status(200).json({
      message: "Payment status updated.",
      order,
    });
  } catch (error) {
    console.error("Update Payment Status Error:", error);

    res.status(500).json({
      message: "Unable to update payment status.",
      error: error.message,
    });
  }
});

// ==========================================
// EXPORT
// ==========================================

export default router;