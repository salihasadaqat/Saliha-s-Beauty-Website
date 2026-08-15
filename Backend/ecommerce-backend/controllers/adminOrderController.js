const Order = require("../models/Order");


// =====================================
// GET ALL ORDERS
// =====================================

const getAllOrders = async (req, res) => {

  try {

    const orders = await Order
      .find()
      .populate("user", "name email number")
      .populate("products.product")
      .sort({ createdAt: -1 });


    res.status(200).json(orders);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to get all orders",
      error: error.message
    });

  }

};


// =====================================
// UPDATE ORDER STATUS
// =====================================

const updateOrderStatus = async (req, res) => {

  try {

    const { status } = req.body;


    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled"
    ];


    if (!allowedStatuses.includes(status)) {

      return res.status(400).json({
        message: "Invalid order status"
      });

    }


    const order =
      await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        {
          new: true,
          runValidators: true
        }
      );


    if (!order) {

      return res.status(404).json({
        message: "Order not found"
      });

    }


    res.status(200).json({

      message:
        "Order status updated successfully",

      order

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      message:
        "Failed to update order status",

      error:
        error.message

    });

  }

};
// =====================================
// UPDATE PAYMENT STATUS
// =====================================

const updatePaymentStatus = async (req, res) => {

  try {

    const {
      paymentStatus,
      paymentId
    } = req.body;


    const allowedStatuses = [
      "Pending",
      "Paid",
      "Failed"
    ];


    if (!allowedStatuses.includes(paymentStatus)) {

      return res.status(400).json({
        message: "Invalid payment status"
      });

    }


    const updateData = {
      paymentStatus
    };


    // If payment is successful

    if (paymentStatus === "Paid") {

      updateData.paidAt = new Date();

      if (paymentId) {
        updateData.paymentId = paymentId;
      }

    }


    // If payment failed or pending

    if (
      paymentStatus === "Pending" ||
      paymentStatus === "Failed"
    ) {

      updateData.paidAt = null;

    }


    const order =
      await Order.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true
        }
      );


    if (!order) {

      return res.status(404).json({
        message: "Order not found"
      });

    }


    res.status(200).json({

      message:
        "Payment status updated successfully",

      order

    });


  } catch (error) {

    console.error(error);

    res.status(500).json({

      message:
        "Failed to update payment status",

      error:
        error.message

    });

  }

};

module.exports = {
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus
};