const Category = require("../models/Category");

// ==========================================
// GET ALL CATEGORIES
// ==========================================
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({
      createdAt: -1,
    });

    res.status(200).json(categories);
  } catch (error) {
    console.error("Get Categories Error:", error);

    res.status(500).json({
      message: "Failed to get categories",
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE CATEGORY
// ==========================================
const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(
      req.params.id
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("Get Category Error:", error);

    res.status(500).json({
      message: "Failed to get category",
      error: error.message,
    });
  }
};

// ==========================================
// ADD CATEGORY - ADMIN
// ==========================================
const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    const existingCategory =
      await Category.findOne({
        name: name.trim(),
      });

    if (existingCategory) {
      return res.status(400).json({
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name: name.trim(),
      description: description || "",
    });

    res.status(201).json({
      message: "Category added successfully",
      category,
    });
  } catch (error) {
    console.error("Add Category Error:", error);

    res.status(500).json({
      message: "Failed to add category",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE CATEGORY - ADMIN
// ==========================================
const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = await Category.findById(
      req.params.id
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    if (name !== undefined) {
      category.name = name.trim();
    }

    if (description !== undefined) {
      category.description = description;
    }

    await category.save();

    res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Update Category Error:", error);

    res.status(500).json({
      message: "Failed to update category",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE CATEGORY - ADMIN
// ==========================================
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(
      req.params.id
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete Category Error:", error);

    res.status(500).json({
      message: "Failed to delete category",
      error: error.message,
    });
  }
};

module.exports = {
  getCategories,
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
};