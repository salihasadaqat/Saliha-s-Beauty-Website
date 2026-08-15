import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [updatingId, setUpdatingId] = useState(null);

  const orderStatuses = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const paymentStatuses = [
    "Pending",
    "Paid",
    "Failed",
  ];

  // ==========================================
  // LOAD ORDERS
  // ==========================================

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        "/admin/orders"
      );

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.orders || [];

      setOrders(data);
    } catch (error) {
      console.error(
        "Load Orders Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UPDATE ORDER STATUS
  // ==========================================

  const updateOrderStatus = async (
    orderId,
    status
  ) => {
    try {
      setUpdatingId(orderId);
      setError("");
      setMessage("");

      await API.put(
        `/orders/admin/${orderId}/status`,
        {
          status,
        }
      );

      setMessage(
        "Order status updated successfully."
      );

      await loadOrders();
    } catch (error) {
      console.error(
        "Update Order Status Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to update order status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================
  // UPDATE PAYMENT STATUS
  // ==========================================

  const updatePaymentStatus = async (
    orderId,
    paymentStatus
  ) => {
    try {
      setUpdatingId(orderId);
      setError("");
      setMessage("");

      await API.put(
        `/orders/admin/${orderId}/payment`,
        {
          paymentStatus,
        }
      );

      setMessage(
        "Payment status updated successfully."
      );

      await loadOrders();
    } catch (error) {
      console.error(
        "Update Payment Status Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to update payment status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================
  // STATUS BADGE
  // ==========================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-warning text-dark";

      case "Processing":
        return "bg-info text-dark";

      case "Shipped":
        return "bg-primary";

      case "Delivered":
        return "bg-success";

      case "Cancelled":
        return "bg-danger";

      default:
        return "bg-secondary";
    }
  };

  const getPaymentClass = (status) => {
    switch (status) {
      case "Paid":
        return "bg-success";

      case "Failed":
        return "bg-danger";

      default:
        return "bg-warning text-dark";
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="container mt-5 text-center">

        <div className="spinner-border text-danger" />

        <p className="mt-3">
          Loading customer orders...
        </p>

      </div>
    );
  }

  return (
    <div className="container-fluid mt-4 mb-5">

      {/* ======================================
          HEADER
      ======================================= */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h2 className="fw-bold">
            🛒 Order Management
          </h2>

          <p className="text-muted mb-0">
            View and manage customer orders.
          </p>

        </div>

        <div>

          <button
            className="btn btn-outline-danger me-2"
            onClick={loadOrders}
          >
            🔄 Refresh
          </button>

          <Link
            to="/admin"
            className="btn btn-outline-secondary"
          >
            ← Dashboard
          </Link>

        </div>

      </div>

      {/* ======================================
          MESSAGES
      ======================================= */}

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* ======================================
          ORDER COUNT
      ======================================= */}

      <div className="card shadow-sm border-0 p-4 mb-4">

        <h5 className="fw-bold mb-0">
          📦 Total Orders: {orders.length}
        </h5>

      </div>

      {/* ======================================
          NO ORDERS
      ======================================= */}

      {orders.length === 0 ? (

        <div className="card shadow-sm border-0 p-5 text-center">

          <h4>
            No orders found.
          </h4>

          <p className="text-muted">
            Customer orders will appear here.
          </p>

        </div>

      ) : (

        <div className="row g-4">

          {orders.map((order) => (

            <div
              className="col-12"
              key={order._id}
            >

              <div className="card shadow-sm border-0">

                {/* ==========================
                    ORDER HEADER
                =========================== */}

                <div className="card-header bg-white p-3">

                  <div className="row align-items-center">

                    <div className="col-lg-3">

                      <strong>
                        Order ID
                      </strong>

                      <br />

                      <small className="text-muted">
                        {order._id}
                      </small>

                    </div>

                    <div className="col-lg-3">

                      <strong>
                        Customer
                      </strong>

                      <br />

                      <span>
                        {order.user?.name ||
                          "Unknown User"}
                      </span>

                      <br />

                      <small className="text-muted">
                        {order.user?.email ||
                          ""}
                      </small>

                    </div>

                    <div className="col-lg-2">

                      <strong>
                        Total
                      </strong>

                      <br />

                      <span className="fw-bold text-success">
                        Rs{" "}
                        {Number(
                          order.totalAmount || 0
                        ).toLocaleString()}
                      </span>

                    </div>

                    <div className="col-lg-2">

                      <strong>
                        Payment
                      </strong>

                      <br />

                      <span
                        className={`badge ${getPaymentClass(
                          order.paymentStatus
                        )}`}
                      >
                        {order.paymentStatus}
                      </span>

                    </div>

                    <div className="col-lg-2">

                      <strong>
                        Order Status
                      </strong>

                      <br />

                      <span
                        className={`badge ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>

                    </div>

                  </div>

                </div>

                {/* ==========================
                    ORDER BODY
                =========================== */}

                <div className="card-body">

                  {/* PRODUCTS */}

                  <h5 className="fw-bold mb-3">
                    📦 Ordered Products
                  </h5>

                  <div className="table-responsive">

                    <table className="table table-bordered align-middle">

                      <thead>

                        <tr>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Subtotal</th>
                        </tr>

                      </thead>

                      <tbody>

                        {(order.products || []).map(
                          (item, index) => (

                            <tr
                              key={
                                item.product ||
                                index
                              }
                            >

                              <td>

                                <div className="d-flex align-items-center">

                                  {item.image && (
                                    <img
                                      src={
                                        item.image
                                      }
                                      alt={
                                        item.name
                                      }
                                      style={{
                                        width: "55px",
                                        height: "55px",
                                        objectFit:
                                          "cover",
                                      }}
                                      className="rounded me-3"
                                    />
                                  )}

                                  <span>
                                    {item.name ||
                                      "Product"}
                                  </span>

                                </div>

                              </td>

                              <td>
                                Rs{" "}
                                {Number(
                                  item.price || 0
                                ).toLocaleString()}
                              </td>

                              <td>
                                {item.quantity}
                              </td>

                              <td className="fw-bold">
                                Rs{" "}
                                {Number(
                                  item.price || 0
                                ) *
                                  Number(
                                    item.quantity ||
                                      1
                                  )}
                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                  {/* SHIPPING */}

                  <h5 className="fw-bold mt-4">
                    🚚 Shipping Information
                  </h5>

                  <div className="row">

                    <div className="col-md-6">

                      <p className="mb-1">
                        <strong>
                          Name:
                        </strong>{" "}
                        {order.shippingAddress
                          ?.fullName || "-"}
                      </p>

                      <p className="mb-1">
                        <strong>
                          Phone:
                        </strong>{" "}
                        {order.shippingAddress
                          ?.phone || "-"}
                      </p>

                      <p className="mb-1">
                        <strong>
                          Address:
                        </strong>{" "}
                        {order.shippingAddress
                          ?.address || "-"}
                      </p>

                    </div>

                    <div className="col-md-6">

                      <p className="mb-1">
                        <strong>
                          City:
                        </strong>{" "}
                        {order.shippingAddress
                          ?.city || "-"}
                      </p>

                      <p className="mb-1">
                        <strong>
                          Country:
                        </strong>{" "}
                        {order.shippingAddress
                          ?.country || "-"}
                      </p>

                      <p className="mb-1">
                        <strong>
                          Postal Code:
                        </strong>{" "}
                        {order.shippingAddress
                          ?.postalCode || "-"}
                      </p>

                    </div>

                  </div>

                  <hr />

                  {/* ==========================
                      CONTROLS
                  =========================== */}

                  <div className="row g-3">

                    {/* ORDER STATUS */}

                    <div className="col-md-6">

                      <label className="form-label fw-bold">
                        Update Order Status
                      </label>

                      <select
                        className="form-select"
                        value={
                          order.status ||
                          "Pending"
                        }
                        disabled={
                          updatingId ===
                          order._id
                        }
                        onChange={(e) =>
                          updateOrderStatus(
                            order._id,
                            e.target.value
                          )
                        }
                      >

                        {orderStatuses.map(
                          (status) => (

                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>

                          )
                        )}

                      </select>

                    </div>

                    {/* PAYMENT STATUS */}

                    <div className="col-md-6">

                      <label className="form-label fw-bold">
                        Update Payment Status
                      </label>

                      <select
                        className="form-select"
                        value={
                          order.paymentStatus ||
                          "Pending"
                        }
                        disabled={
                          updatingId ===
                          order._id
                        }
                        onChange={(e) =>
                          updatePaymentStatus(
                            order._id,
                            e.target.value
                          )
                        }
                      >

                        {paymentStatuses.map(
                          (status) => (

                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>

                          )
                        )}

                      </select>

                    </div>

                  </div>

                  {updatingId ===
                    order._id && (
                    <div className="text-muted mt-3">
                      Updating order...
                    </div>
                  )}

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default AdminOrders;