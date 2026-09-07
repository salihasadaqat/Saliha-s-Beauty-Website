import Product from "../models/Product.js";
import Category from "../models/Category.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

// ==========================================
// ADMIN DASHBOARD
// ==========================================

const getDashboardStats = async (req, res) => {
  try {
    const totalProducts =
      await Product.countDocuments();

    const totalCategories =
      await Category.countDocuments();

    const totalUsers =
      await User.countDocuments();

    const totalOrders =
      await Order.countDocuments();

    // ==========================================
    // ORDER STATUS COUNTS
    // ==========================================

    const pendingOrders =
      await Order.countDocuments({
        status: "Pending",
      });

    const processingOrders =
      await Order.countDocuments({
        status: "Processing",
      });

    const shippedOrders =
      await Order.countDocuments({
        status: "Shipped",
      });

    const deliveredOrders =
      await Order.countDocuments({
        status: "Delivered",
      });

    // ==========================================
    // TOTAL SALES
    // PAID ORDERS ONLY
    // ==========================================

    const salesResult =
      await Order.aggregate([
        {
          $match: {
            paymentStatus: "Paid",
          },
        },
        {
          $group: {
            _id: null,
            totalSales: {
              $sum: "$totalAmount",
            },
          },
        },
      ]);

    const totalSales =
      salesResult.length > 0
        ? salesResult[0].totalSales
        : 0;

    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(200).json({
      totalProducts,
      totalCategories,
      totalUsers,
      totalOrders,
      totalSales,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
    });

  } catch (error) {
    console.error(
      "Dashboard Stats Error:",
      error
    );

    res.status(500).json({
      message:
        "Unable to load dashboard statistics.",
      error: error.message,
    });
  }
};

// ==========================================
// EXPORT
// ==========================================

export {
  getDashboardStats,
};