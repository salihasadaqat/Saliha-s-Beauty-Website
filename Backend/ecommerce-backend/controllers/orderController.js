const Order = require("../models/Order");
const Product = require("../models/Product");

// ==========================================
// CREATE ORDER
// ==========================================

const createOrder = async (req, res) => {
  try {
    const {
      products,
      shippingAddress,
      paymentMethod,
    } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({
        message: "Your cart is empty.",
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        message: "Shipping information is required.",
      });
    }

    if (!["COD", "Stripe"].includes(paymentMethod)) {
      return res.status(400).json({
        message: "Invalid payment method.",
      });
    }

    const orderProducts = [];
    let totalAmount = 0;

    // ==========================================
    // GET REAL PRODUCTS FROM DATABASE
    // ==========================================

    for (const item of products) {
      const product = await Product.findById(
        item.product || item._id
      );

      if (!product) {
        return res.status(404).json({
          message: "Product not found.",
        });
      }

      const quantity = Number(item.quantity);

      if (!quantity || quantity < 1) {
        return res.status(400).json({
          message: `Invalid quantity for ${product.name}.`,
        });
      }

      // Check current stock
      if (product.stock < quantity) {
        return res.status(400).json({
          message:
            `Not enough stock for ${product.name}. ` +
            `Available stock: ${product.stock}`,
        });
      }

      // REAL DATABASE PRICE
      let price = Number(product.price);

      if (
        product.discountPrice !== undefined &&
        Number(product.discountPrice) > 0 &&
        Number(product.discountPrice) < price
      ) {
        price = Number(product.discountPrice);
      }

      const itemTotal = price * quantity;

      totalAmount += itemTotal;

      orderProducts.push({
        product: product._id,
        name: product.name || product.title,
        image: product.image || "",
        price,
        quantity,
      });
    }

    // ==========================================
    // COD
    // ==========================================

    if (paymentMethod === "COD") {
      // Reduce stock immediately for COD
      for (const item of orderProducts) {
        const product = await Product.findById(
          item.product
        );

        if (!product) {
          return res.status(404).json({
            message: "Product no longer exists.",
          });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            message:
              `Not enough stock for ${product.name}.`,
          });
        }

        product.stock -= item.quantity;

        await product.save();
      }

      const order = await Order.create({
        user: req.user._id,

        products: orderProducts,

        shippingAddress,

        totalAmount,

        paymentMethod: "COD",

        paymentStatus: "Pending",

        status: "Pending",

        stockReduced: true,
      });

      return res.status(201).json({
        message: "COD order placed successfully.",
        order,
      });
    }

    // ==========================================
    // STRIPE
    // ==========================================

    // Stripe order is created by paymentController.
    return res.status(200).json({
      message:
        "Stripe order should be created through the payment endpoint.",
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    res.status(500).json({
      message: "Failed to create order.",
      error: error.message,
    });
  }
};

// ==========================================
// MY ORDERS
// ==========================================

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate("user", "name email");

    res.status(200).json(orders);
  } catch (error) {
    console.error("My Orders Error:", error);

    res.status(500).json({
      message: "Unable to load your orders.",
      error: error.message,
    });
  }
};

// ==========================================
// SINGLE CUSTOMER ORDER
// ==========================================

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Get Order Error:", error);

    res.status(500).json({
      message: "Unable to load order.",
      error: error.message,
    });
  }
};

// ==========================================
// ADMIN - ALL ORDERS
// ==========================================

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email");

    res.status(200).json(orders);
  } catch (error) {
    console.error("Admin Orders Error:", error);

    res.status(500).json({
      message: "Unable to load orders.",
      error: error.message,
    });
  }
};

// ==========================================
// ADMIN - SINGLE ORDER
// ==========================================

const getAdminOrderById = async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    ).populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(
      "Admin Single Order Error:",
      error
    );

    res.status(500).json({
      message: "Unable to load order.",
      error: error.message,
    });
  }
};

// ==========================================
// ADMIN - UPDATE ORDER STATUS
// ==========================================

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status.",
      });
    }

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    order.status = status;

    await order.save();

    res.status(200).json({
      message: "Order status updated.",
      order,
    });
  } catch (error) {
    console.error(
      "Update Order Status Error:",
      error
    );

    res.status(500).json({
      message: "Unable to update order status.",
      error: error.message,
    });
  }
};

// ==========================================
// ADMIN - UPDATE PAYMENT STATUS
// ==========================================

const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    const allowedStatuses = [
      "Pending",
      "Paid",
      "Failed",
    ];

    if (!allowedStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        message: "Invalid payment status.",
      });
    }

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    order.paymentStatus = paymentStatus;

    if (paymentStatus === "Paid") {
      order.paidAt = new Date();
    }

    await order.save();

    res.status(200).json({
      message: "Payment status updated.",
      order,
    });
  } catch (error) {
    console.error(
      "Update Payment Status Error:",
      error
    );

    res.status(500).json({
      message: "Unable to update payment status.",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  getAdminOrderById,
  updateOrderStatus,
  updatePaymentStatus,
};