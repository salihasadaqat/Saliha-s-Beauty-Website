const Stripe = require("stripe");
const Order = require("../models/Order");
const Product = require("../models/Product");

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY
);

// ======================================================
// CREATE STRIPE CHECKOUT SESSION
// ======================================================

const createCheckoutSession = async (req, res) => {
  try {
    const {
      products,
      shippingAddress,
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

    const orderProducts = [];
    let totalAmount = 0;

    // ==================================================
    // GET REAL PRODUCTS FROM DATABASE
    // ==================================================

    for (const item of products) {
      const product = await Product.findById(
        item.product || item._id
      );

      if (!product) {
        return res.status(404).json({
          message: "Product not found.",
        });
      }

      const quantity = Number(
        item.quantity || 1
      );

      if (quantity < 1) {
        return res.status(400).json({
          message:
            "Product quantity must be at least 1.",
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${
            product.name || product.title
          }. Available stock: ${product.stock}`,
        });
      }

      const price =
        product.discountPrice &&
        product.discountPrice > 0
          ? product.discountPrice
          : product.discount &&
            product.discount > 0
          ? product.discount
          : product.price;

      if (!price || price <= 0) {
        return res.status(400).json({
          message: `Invalid price for ${
            product.name || product.title
          }.`,
        });
      }

      totalAmount +=
        Number(price) * quantity;

      orderProducts.push({
        product: product._id,
        name:
          product.name ||
          product.title ||
          "Product",
        image: product.image || "",
        price: Number(price),
        quantity,
      });
    }

    // ==================================================
    // CREATE PENDING ORDER
    // ==================================================

    const order = await Order.create({
      user: req.user._id,

      products: orderProducts,

      shippingAddress: {
        fullName:
          shippingAddress.fullName,
        phone:
          shippingAddress.phone,
        address:
          shippingAddress.address,
        city:
          shippingAddress.city,
        country:
          shippingAddress.country,
        postalCode:
          shippingAddress.postalCode,
      },

      totalAmount,

      paymentMethod: "Stripe",

      paymentStatus: "Pending",

      status: "Pending",
    });

    // ==================================================
    // STRIPE LINE ITEMS
    // ==================================================

    const lineItems =
      orderProducts.map((item) => ({
        price_data: {
          currency: "pkr",

          product_data: {
            name: item.name,

            ...(item.image
              ? {
                  images: [item.image],
                }
              : {}),
          },

          unit_amount: Math.round(
            item.price * 100
          ),
        },

        quantity: item.quantity,
      }));

    // ==================================================
    // CREATE STRIPE CHECKOUT
    // ==================================================

    const session =
      await stripe.checkout.sessions.create({
        mode: "payment",

        payment_method_types: [
          "card",
        ],

        line_items: lineItems,

        metadata: {
          orderId:
            order._id.toString(),

          userId:
            req.user._id.toString(),
        },

        success_url:
          `${process.env.FRONTEND_URL}` +
          `/payment-success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${process.env.FRONTEND_URL}/checkout`,

        customer_email:
          req.user.email,
      });

    // Save Stripe session ID
    order.paymentId = session.id;

    await order.save();

    return res.status(200).json({
      message:
        "Stripe checkout session created.",

      sessionId:
        session.id,

      url:
        session.url,

      orderId:
        order._id,
    });
  } catch (error) {
    console.error(
      "Create Stripe Checkout Error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to create Stripe checkout session.",

      error: error.message,
    });
  }
};

// ======================================================
// STRIPE WEBHOOK
// ======================================================

const stripeWebhook = async (
  req,
  res
) => {
  const signature =
    req.headers["stripe-signature"];

  let event;

  try {
    event =
      stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
  } catch (error) {
    console.error(
      "Stripe Webhook Signature Error:",
      error.message
    );

    return res.status(400).send(
      `Webhook Error: ${error.message}`
    );
  }

  try {
    // ==================================================
    // CHECKOUT COMPLETED
    // ==================================================

    if (
      event.type ===
      "checkout.session.completed"
    ) {
      const session =
        event.data.object;

      const orderId =
        session.metadata?.orderId;

      if (!orderId) {
        console.error(
          "Stripe Order ID missing."
        );

        return res.json({
          received: true,
        });
      }

      const order =
        await Order.findById(
          orderId
        );

      if (!order) {
        console.error(
          "Order not found:",
          orderId
        );

        return res.json({
          received: true,
        });
      }

      // Prevent duplicate processing
      if (
        order.paymentStatus ===
        "Paid"
      ) {
        console.log(
          "Order already paid:",
          order._id
        );

        return res.json({
          received: true,
        });
      }

      // Verify payment
      if (
        session.payment_status !==
        "paid"
      ) {
        console.log(
          "Stripe session not paid yet."
        );

        return res.json({
          received: true,
        });
      }

      // ==================================================
      // CHECK STOCK AGAIN
      // ==================================================

      for (
        const item of order.products
      ) {
        const product =
          await Product.findById(
            item.product
          );

        if (!product) {
          throw new Error(
            `Product not found: ${item.product}`
          );
        }

        if (
          product.stock <
          item.quantity
        ) {
          throw new Error(
            `Not enough stock for ${
              product.name ||
              product.title
            }`
          );
        }
      }

      // ==================================================
      // REDUCE STOCK
      // ==================================================

      for (
        const item of order.products
      ) {
        const product =
          await Product.findById(
            item.product
          );

        product.stock -=
          item.quantity;

        await product.save();
      }

      // ==================================================
      // UPDATE ORDER
      // ==================================================

      order.paymentStatus =
        "Paid";

      order.paymentId =
        session.payment_intent ||
        session.id;

      order.paidAt =
        new Date();

      order.status =
        "Processing";

      await order.save();

      console.log(
        "================================"
      );

      console.log(
        "STRIPE PAYMENT SUCCESS"
      );

      console.log(
        "Order:",
        order._id.toString()
      );

      console.log(
        "Payment:",
        order.paymentId
      );

      console.log(
        "Stock updated successfully"
      );

      console.log(
        "================================"
      );
    }

    // ==================================================
    // PAYMENT FAILED
    // ==================================================

    if (
      event.type ===
      "payment_intent.payment_failed"
    ) {
      const paymentIntent =
        event.data.object;

      const orderId =
        paymentIntent.metadata?.orderId;

      if (orderId) {
        const order =
          await Order.findById(
            orderId
          );

        if (order) {
          order.paymentStatus =
            "Failed";

          await order.save();

          console.log(
            "Payment failed for order:",
            order._id.toString()
          );
        }
      }
    }

    // ==================================================
    // PAYMENT INTENT SUCCESS
    // ==================================================

    if (
      event.type ===
      "payment_intent.succeeded"
    ) {
      console.log(
        "PaymentIntent succeeded:",
        event.data.object.id
      );
    }

    return res.json({
      received: true,
    });
  } catch (error) {
    console.error(
      "Stripe Webhook Processing Error:",
      error
    );

    return res.status(500).json({
      message:
        "Webhook processing failed.",
    });
  }
};
const verifyPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        message: "Stripe session ID is required.",
      });
    }

    // Get the Checkout Session from Stripe
    const session = await stripe.checkout.sessions.retrieve(
      sessionId
    );

    // Check that Stripe payment was successful
    if (session.payment_status !== "paid") {
      return res.status(400).json({
        message: "Payment is not completed.",
        paymentStatus: session.payment_status,
      });
    }

    // Get order ID from Stripe metadata
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      return res.status(400).json({
        message: "Order ID not found in Stripe session.",
      });
    }

    // Find order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    // Update order
    order.paymentStatus = "Paid";

    order.paymentId =
      session.payment_intent || session.id;

    order.paidAt = new Date();

    order.status = "Processing";

    await order.save();

    console.log("================================");
    console.log("STRIPE PAYMENT VERIFIED");
    console.log("Order:", order._id.toString());
    console.log("Payment:", order.paymentId);
    console.log("Status: Paid");
    console.log("================================");

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully.",
      paymentStatus: "Paid",
      orderStatus: "Processing",
      order,
    });

  } catch (error) {
    console.error(
      "Verify Payment Error:",
      error
    );

    return res.status(500).json({
      message: "Unable to verify payment.",
      error: error.message,
    });
  }
};

// ======================================================
// EXPORTS
// ======================================================
module.exports = {
  createCheckoutSession,
  stripeWebhook,
  verifyPayment,
};