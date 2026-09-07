import express from "express";

import {
  getCategories,
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

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
  getCategories
);

router.get(
  "/:id",
  getCategory
);

// ==========================================
// ADMIN ONLY
// ==========================================

router.post(
  "/",
  protect,
  adminOnly,
  addCategory
);

router.put(
  "/:id",
  protect,
  adminOnly,
  updateCategory
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteCategory
);

// ==========================================
// EXPORT
// ==========================================

export default router;