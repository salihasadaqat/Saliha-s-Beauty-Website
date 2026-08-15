const express = require("express");

const router = express.Router();

const {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

// ==========================================
// CUSTOMER / PUBLIC
// ==========================================

router.get(
  "/",
  getProducts
);

router.get(
  "/:id",
  getProduct
);

// ==========================================
// ADMIN ONLY
// ==========================================

router.post(
  "/",
  protect,
  adminOnly,
  addProduct
);

router.put(
  "/:id",
  protect,
  adminOnly,
  updateProduct
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);

module.exports = router;