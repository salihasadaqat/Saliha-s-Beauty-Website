import express from "express";

import {
  signup,
  verifySignupOTP,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// AUTHENTICATION
// ==========================================

router.post("/signup", signup);

router.post("/verify-signup", verifySignupOTP);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

// ==========================================
// PROTECTED USER ROUTES
// ==========================================

router.get(
  "/profile",
  protect,
  getProfile
);

router.put(
  "/profile",
  protect,
  updateProfile
);

router.put(
  "/change-password",
  protect,
  changePassword
);

// ==========================================
// EXPORT
// ==========================================

export default router;