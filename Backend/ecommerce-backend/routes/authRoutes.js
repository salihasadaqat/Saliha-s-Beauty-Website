const express = require("express");

const router = express.Router();

const {
  signup,
  verifySignupOTP,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

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

module.exports = router;