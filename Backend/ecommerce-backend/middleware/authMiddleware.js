const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ==========================================
// PROTECT
// ==========================================

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization token is required."
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Invalid authorization format."
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token is missing."
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id).select(
      "-password"
    );

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists."
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Protect middleware error:", error);

    return res.status(401).json({
      message: "Invalid or expired token."
    });
  }
};

// ==========================================
// ADMIN ONLY
// ==========================================

const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required."
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access denied."
    });
  }

  next();
};

module.exports = {
  protect,
  adminOnly
};