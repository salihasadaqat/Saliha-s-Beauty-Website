const express = require("express");

const {
  signup,
  verifySignupOTP,
  login,
  forgotPassword,
  resetPassword
} = require("../controllers/authController");


const router = express.Router();


router.post(
  "/signup",
  signup
);


router.post(
  "/verify-signup",
  verifySignupOTP
);


router.post(
  "/login",
  login
);


router.post(
  "/forgot-password",
  forgotPassword
);


router.post(
  "/reset-password",
  resetPassword
);


module.exports = router;