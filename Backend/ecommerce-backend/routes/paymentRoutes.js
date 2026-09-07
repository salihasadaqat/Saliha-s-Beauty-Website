import express from "express";

import {
  createCheckoutSession,
  stripeWebhook,
  verifyPayment,
} from "../controllers/paymentController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

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

// ==========================================
// EXPORT
// ==========================================

export default router;