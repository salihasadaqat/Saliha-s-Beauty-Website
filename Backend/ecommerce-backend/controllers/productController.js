import Product from "../models/Product.js";

// ==========================================
// GET ALL PRODUCTS
// ==========================================

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("Get Products Error:", error);

    res.status(500).json({
      message: "Failed to get products",
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE PRODUCT
// ==========================================

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Get Product Error:", error);

    res.status(500).json({
      message: "Failed to get product",
      error: error.message,
    });
  }
};

// ==========================================
// ADD PRODUCT - ADMIN
// ==========================================

const addProduct = async (req, res) => {
  try {
    const {
      name,
      title,
      description,
      price,
      discount,
      discountPrice,
      category,
      image,
      stock,
    } = req.body;

    if (!name && !title) {
      return res.status(400).json({
        message: "Product name is required",
      });
    }

    if (price === undefined) {
      return res.status(400).json({
        message: "Product price is required",
      });
    }

    const product = await Product.create({
      name: name || title,
      title: title || name,
      description: description || "",
      price: Number(price),

      discount:
        discountPrice !== undefined
          ? Number(discountPrice)
          : Number(discount || price),

      discountPrice:
        discountPrice !== undefined
          ? Number(discountPrice)
          : Number(discount || price),

      category: category || "",
      image: image || "",
      stock: Number(stock || 0),
    });

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Add Product Error:", error);

    res.status(500).json({
      message: "Failed to add product",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE PRODUCT - ADMIN
// ==========================================

const updateProduct = async (req, res) => {
  try {
    const {
      name,
      title,
      description,
      price,
      discount,
      discountPrice,
      category,
      image,
      stock,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (name !== undefined) {
      product.name = name;
    }

    if (title !== undefined) {
      product.title = title;
    }

    if (description !== undefined) {
      product.description = description;
    }

    if (price !== undefined) {
      product.price = Number(price);
    }

    if (discountPrice !== undefined) {
      product.discountPrice = Number(discountPrice);
      product.discount = Number(discountPrice);
    } else if (discount !== undefined) {
      product.discount = Number(discount);
      product.discountPrice = Number(discount);
    }

    if (category !== undefined) {
      product.category = category;
    }

    if (image !== undefined) {
      product.image = image;
    }

    if (stock !== undefined) {
      product.stock = Number(stock);
    }

    await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update Product Error:", error);

    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE PRODUCT - ADMIN
// ==========================================

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);

    res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

// ==========================================
// EXPORTS
// ==========================================

export {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
};