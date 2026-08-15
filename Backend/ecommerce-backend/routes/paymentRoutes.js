const express = require("express");

const router = express.Router();

const {
  createCheckoutSession,
  stripeWebhook,
  verifyPayment,
} = require("../controllers/paymentController");

const {
  protect,
} = require("../middleware/authMiddleware");

// ==========================================
// CREATE STRIPE CHECKOUT
// ==========================================

router.post(
  "/create-checkout-session",
  protect,
  createCheckoutSession
);

// ==========================================
// VERIFY STRIPE PAYMENT
// ==========================================

router.post(
  "/verify-payment",
  protect,
  verifyPayment
);

// ==========================================
// STRIPE WEBHOOK
// ==========================================

router.post(
  "/webhook",
  stripeWebhook
);

module.exports = router;