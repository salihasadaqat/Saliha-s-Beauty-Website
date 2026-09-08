import Category from "../models/Category.js";


// ==========================================
// GET ALL CATEGORIES
// ==========================================

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({})
      .sort({ createdAt: -1 })
      .lean();

    console.log(
      `Categories found: ${categories.length}`
    );

    return res.status(200).json(categories);

  } catch (error) {
    console.error(
      "Get Categories Error:",
      error
    );

    return res.status(500).json({
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
    ).lean();

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    return res.status(200).json(category);

  } catch (error) {
    console.error(
      "Get Category Error:",
      error
    );

    return res.status(500).json({
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

    const cleanName = name.trim();

    const existingCategory =
      await Category.findOne({
        name: cleanName,
      });

    if (existingCategory) {
      return res.status(400).json({
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name: cleanName,
      description: description?.trim() || "",
    });

    return res.status(201).json({
      message: "Category added successfully",
      category,
    });

  } catch (error) {
    console.error(
      "Add Category Error:",
      error
    );

    return res.status(500).json({
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

    const category =
      await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          message: "Category name cannot be empty",
        });
      }

      category.name = name.trim();
    }

    if (description !== undefined) {
      category.description =
        description.trim();
    }

    await category.save();

    return res.status(200).json({
      message: "Category updated successfully",
      category,
    });

  } catch (error) {
    console.error(
      "Update Category Error:",
      error
    );

    return res.status(500).json({
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
    const category =
      await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    await Category.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      message: "Category deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete Category Error:",
      error
    );

    return res.status(500).json({
      message: "Failed to delete category",
      error: error.message,
    });
  }
};


// ==========================================
// EXPORTS
// ==========================================

export {
  getCategories,
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
};