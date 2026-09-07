import express from "express";

import {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

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

// ==========================================
// EXPORT
// ==========================================

export default router;