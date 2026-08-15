import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

function Orders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ===============================
  // FETCH MY ORDERS
  // ===============================

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        const response = await API.get(
          "/orders/my-orders"
        );

        setOrders(
          Array.isArray(response.data)
            ? response.data
            : []
        );

      } catch (error) {

        console.error(
          "Fetch orders error:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Unable to load your orders."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchOrders();

  }, []);


  // ===============================
  // ORDER STATUS CLASS
  // ===============================

  const getStatusClass = (status) => {

    switch (status) {

      case "Delivered":
        return "bg-success";

      case "Shipped":
        return "bg-primary";

      case "Processing":
        return "bg-warning text-dark";

      case "Confirmed":
        return "bg-info text-dark";

      case "Cancelled":
        return "bg-danger";

      case "Pending":
      default:
        return "bg-secondary";

    }

  };


  // ===============================
  // PAYMENT STATUS CLASS
  // ===============================

  const getPaymentStatusClass = (
    paymentStatus
  ) => {

    switch (paymentStatus) {

      case "Paid":
        return "bg-success";

      case "Failed":
        return "bg-danger";

      case "Pending":
      default:
        return "bg-warning text-dark";

    }

  };


  return (

    <div className="container mt-5 mb-5">

      <h2 className="text-center mb-4">
        📦 My Orders
      </h2>


      {/* ===============================
          LOADING
      =============================== */}

      {loading && (

        <div className="text-center mt-5">

          <div
            className="spinner-border text-danger"
            role="status"
          ></div>

          <h5 className="mt-3">
            Loading your orders...
          </h5>

        </div>

      )}


      {/* ===============================
          ERROR
      =============================== */}

      {!loading && error && (

        <div className="alert alert-danger text-center">

          {error}

        </div>

      )}


      {/* ===============================
          NO ORDERS
      =============================== */}

      {!loading &&
        !error &&
        orders.length === 0 && (

          <div className="text-center mt-5">

            <h4>
              You haven't placed any orders yet.
            </h4>

            <p className="text-muted">
              Your orders will appear here after
              you complete checkout.
            </p>

            <Link
              to="/products"
              className="btn btn-danger mt-3"
            >
              🛍️ Shop Now
            </Link>

          </div>

        )}


      {/* ===============================
          ORDERS
      =============================== */}

      {!loading &&
        !error &&
        orders.length > 0 && (

          <div className="row">

            {orders.map((order) => (

              <div
                className="col-md-6 col-lg-4 mb-4"
                key={order._id}
              >

                <div className="card shadow h-100">


                  {/* ===============================
                      ORDER HEADER
                  =============================== */}

                  <div className="card-header d-flex justify-content-between align-items-center">

                    <strong>
                      Order #
                      {order._id?.slice(-6)}
                    </strong>


                    <span
                      className={`badge ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {order.status ||
                        "Pending"}
                    </span>

                  </div>


                  <div className="card-body">


                    {/* ===============================
                        PRODUCTS
                    =============================== */}

                    <h6 className="mb-3">
                      🛍️ Ordered Products
                    </h6>


                    {order.products?.map(
                      (product, index) => (

                        <div
                          key={
                            product.product?._id ||
                            index
                          }
                          className="d-flex align-items-center mb-3"
                        >

                          {/* PRODUCT IMAGE */}

                          <img
                            src={
                              product.image ||
                              "/placeholder.jpg"
                            }
                            alt={
                              product.name ||
                              "Product"
                            }
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover"
                            }}
                            className="rounded me-3"
                          />


                          {/* PRODUCT INFO */}

                          <div>

                            <strong>
                              {product.name ||
                                "Product"}
                            </strong>

                            <br />

                            <small className="text-muted">
                              Quantity:{" "}
                              {product.quantity || 0}
                            </small>

                            <br />

                            <small>
                              Price: Rs{" "}
                              {product.price || 0}
                            </small>

                          </div>

                        </div>

                      )
                    )}


                    <hr />


                    {/* ===============================
                        PAYMENT INFORMATION
                    =============================== */}

                    <div className="alert alert-info">

                      {/* PAYMENT METHOD */}

                      <div className="mb-2">

                        💵{" "}

                        <strong>
                          Payment Method:
                        </strong>{" "}

                        {order.paymentMethod ||
                          "Cash on Delivery"}

                      </div>


                      {/* PAYMENT STATUS */}

                      <div className="mb-2">

                        💳{" "}

                        <strong>
                          Payment Status:
                        </strong>{" "}

                        <span
                          className={`badge ${getPaymentStatusClass(
                            order.paymentStatus
                          )}`}
                        >
                          {order.paymentStatus ||
                            "Pending"}
                        </span>

                      </div>


                      {/* ORDER STATUS */}

                      <div className="mb-2">

                        📦{" "}

                        <strong>
                          Order Status:
                        </strong>{" "}

                        <span
                          className={`badge ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {order.status ||
                            "Pending"}
                        </span>

                      </div>


                      {/* PAYMENT ID */}

                      {order.paymentId && (

                        <div className="mb-2">

                          🔑{" "}

                          <strong>
                            Payment ID:
                          </strong>{" "}

                          {order.paymentId}

                        </div>

                      )}


                      {/* PAID DATE */}

                      {order.paidAt && (

                        <div>

                          📅{" "}

                          <strong>
                            Paid At:
                          </strong>{" "}

                          {new Date(
                            order.paidAt
                          ).toLocaleString()}

                        </div>

                      )}

                    </div>


                    {/* ===============================
                        TOTAL
                    =============================== */}

                    <h5 className="text-danger">

                      Total: Rs{" "}

                      {order.totalAmount || 0}

                    </h5>


                    {/* ===============================
                        ORDER DATE
                    =============================== */}

                    <p className="text-muted">

                      📅{" "}

                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleDateString()
                        : "Date unavailable"}

                    </p>


                    {/* ===============================
                        ORDER DETAILS
                    =============================== */}

                    <Link
                      to={`/orders/${order._id}`}
                      className="btn btn-outline-danger w-100"
                    >
                      View Order Details
                    </Link>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

    </div>

  );

}

export default Orders;