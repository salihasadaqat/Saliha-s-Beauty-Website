import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api/axios";

import {
  getCart,
  removeFromCart,
} from "../utils/storage";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    country: "Pakistan",
    postalCode: "",
  });

  const [paymentMethod, setPaymentMethod] =
    useState("COD");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==========================================
  // LOAD CART
  // ==========================================

  useEffect(() => {
    const savedCart = getCart();

    setCart(savedCart);

    if (!savedCart || savedCart.length === 0) {
      navigate("/cart");
    }
  }, [navigate]);

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // PRODUCT PRICE
  // ==========================================

  const getProductPrice = (product) => {
    if (
      product.discountPrice !== undefined &&
      Number(product.discountPrice) > 0
    ) {
      return Number(product.discountPrice);
    }

    if (
      product.discount !== undefined &&
      Number(product.discount) > 0
    ) {
      return Number(product.discount);
    }

    return Number(product.price || 0);
  };

  // ==========================================
  // TOTAL
  // ==========================================

  const total = cart.reduce(
    (sum, product) => {
      const price = getProductPrice(product);

      const quantity =
        Number(product.quantity || 1);

      return sum + price * quantity;
    },
    0
  );

  // ==========================================
  // CLEAR CART
  // ==========================================

  const clearCart = () => {
    cart.forEach((product) => {
      removeFromCart(product._id);
    });
  };

  // ==========================================
  // PLACE ORDER / STRIPE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (
      !form.fullName ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.country ||
      !form.postalCode
    ) {
      setError(
        "Please complete all shipping information."
      );
      return;
    }

    try {
      setLoading(true);

      // ========================================
      // PRODUCTS SENT TO BACKEND
      // ========================================

      const orderProducts = cart.map(
        (product) => ({
          product: product._id,
          quantity:
            Number(product.quantity || 1),
        })
      );

      // ========================================
      // COD
      // ========================================

      if (paymentMethod === "COD") {
        const response = await API.post(
          "/orders",
          {
            products: orderProducts,

            shippingAddress: form,

            paymentMethod: "COD",
          }
        );

        clearCart();

        alert(
          response.data.message ||
            "Order placed successfully!"
        );

        navigate("/orders");

        return;
      }

      // ========================================
      // STRIPE
      // ========================================

      if (paymentMethod === "Stripe") {
        const response = await API.post(
          "/payments/create-checkout-session",
          {
            products: orderProducts,

            shippingAddress: form,
          }
        );

        // Stripe Checkout URL
        if (response.data.url) {
          window.location.href =
            response.data.url;

          return;
        }

        setError(
          "Unable to open Stripe Checkout."
        );

        return;
      }
    } catch (error) {
      console.error(
        "Checkout Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to place your order."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="container mt-5 mb-5">

      <h2 className="text-center mb-4">
        🛍️ Checkout
      </h2>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <div className="row">

        {/* =====================================
            SHIPPING INFORMATION
        ====================================== */}

        <div className="col-lg-7">

          <div className="card shadow p-4">

            <h4 className="mb-4">
              🚚 Shipping Information
            </h4>

            <form onSubmit={handleSubmit}>

              {/* FULL NAME */}

              <div className="mb-3">

                <label className="form-label">
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  className="form-control"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* PHONE */}

              <div className="mb-3">

                <label className="form-label">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* ADDRESS */}

              <div className="mb-3">

                <label className="form-label">
                  Address
                </label>

                <textarea
                  name="address"
                  className="form-control"
                  rows="3"
                  value={form.address}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* CITY + COUNTRY */}

              <div className="row">

                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    className="form-control"
                    value={form.city}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="col-md-6 mb-3">

                  <label className="form-label">
                    Country
                  </label>

                  <input
                    type="text"
                    name="country"
                    className="form-control"
                    value={form.country}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

              {/* POSTAL CODE */}

              <div className="mb-3">

                <label className="form-label">
                  Postal Code
                </label>

                <input
                  type="text"
                  name="postalCode"
                  className="form-control"
                  value={form.postalCode}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* =================================
                  PAYMENT METHOD
              ================================== */}

              <h5 className="mt-4">
                💳 Payment Method
              </h5>

              <div className="card p-3 mb-4">

                {/* COD */}

                <div className="form-check mb-3">

                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={
                      paymentMethod === "COD"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                  />

                  <label className="form-check-label">
                    💵 Cash on Delivery
                  </label>

                </div>

                {/* STRIPE */}

                <div className="form-check">

                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    value="Stripe"
                    checked={
                      paymentMethod === "Stripe"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                  />

                  <label className="form-check-label">
                    💳 Pay Online with Stripe
                  </label>

                </div>

              </div>

              {/* =================================
                  SUBMIT
              ================================== */}

              <button
                type="submit"
                className="btn btn-danger w-100"
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : paymentMethod === "Stripe"
                  ? "💳 Pay with Stripe"
                  : "🛍️ Place COD Order"}
              </button>

            </form>

          </div>

        </div>

        {/* =====================================
            ORDER SUMMARY
        ====================================== */}

        <div className="col-lg-5 mt-4 mt-lg-0">

          <div className="card shadow p-4">

            <h4 className="mb-4">
              🧾 Order Summary
            </h4>

            {cart.map((product) => {

              const price =
                getProductPrice(product);

              const quantity =
                Number(
                  product.quantity || 1
                );

              return (
                <div
                  key={product._id}
                  className="d-flex align-items-center mb-3"
                >

                  <img
                    src={product.image}
                    alt={
                      product.name ||
                      product.title
                    }
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                    }}
                    className="rounded me-3"
                  />

                  <div className="flex-grow-1">

                    <strong>
                      {product.name ||
                        product.title}
                    </strong>

                    <br />

                    <small>
                      Quantity: {quantity}
                    </small>

                  </div>

                  <strong>
                    Rs{" "}
                    {price * quantity}
                  </strong>

                </div>
              );
            })}

            <hr />

            <h4 className="text-danger">
              Total: Rs {total}
            </h4>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Checkout;