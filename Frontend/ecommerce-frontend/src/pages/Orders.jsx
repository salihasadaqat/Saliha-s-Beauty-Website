import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

function Orders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        const response = await API.get(
          "/orders/my-orders"
        );

        setOrders(response.data);

      } catch (error) {

        console.error(
          "Orders error:",
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
  // ORDER STATUS BADGE
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
        return "bg-secondary";

      default:
        return "bg-secondary";

    }

  };


  // ===============================
  // PAYMENT STATUS BADGE
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
          />

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
              📦 You haven't placed any
              orders yet.
            </h4>

            <p className="text-muted">
              Start shopping and your orders
              will appear here.
            </p>

            <Link
              to="/products"
              className="btn btn-danger mt-2"
            >
              🛍️ Shop Now
            </Link>

          </div>

        )}


      {/* ===============================
          ORDERS LIST
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


                  {/* ORDER HEADER */}

                  <div className="card-header d-flex justify-content-between align-items-center">

                    <strong>
                      Order #
                      {order._id.slice(-6)}
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
                        ORDERED PRODUCTS
                    =============================== */}

                    <h6 className="mb-3">
                      🛍️ Ordered Products
                    </h6>


                    {order.products?.map(
                      (product, index) => (

                        <div
                          key={index}
                          className="d-flex align-items-center mb-3"
                        >

                          {/* PRODUCT IMAGE */}

                          <img
                            src={product.image}
                            alt={product.name}
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover"
                            }}
                            className="rounded me-3"
                          />


                          {/* PRODUCT INFORMATION */}

                          <div>

                            <strong>
                              {product.name}
                            </strong>

                            <br />

                            <small className="text-muted">
                              Quantity:{" "}
                              {product.quantity}
                            </small>

                            <br />

                            <small>
                              Price: Rs{" "}
                              {product.price}
                            </small>

                          </div>

                        </div>

                      )
                    )}


                    <hr />


                    {/* ===============================
                        PAYMENT METHOD
                    =============================== */}

                    <p className="mb-2">

                      💵{" "}

                      <strong>
                        Payment Method:
                      </strong>{" "}

                      {order.paymentMethod ||
                        "Cash on Delivery"}

                    </p>


                    {/* ===============================
                        PAYMENT STATUS
                    =============================== */}

                    <p className="mb-2">

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

                    </p>


                    {/* ===============================
                        TOTAL
                    =============================== */}

                    <h5 className="text-danger mt-3">

                      Total: Rs{" "}

                      {order.totalAmount}

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
                        : "N/A"}

                    </p>


                    {/* ===============================
                        VIEW DETAILS
                    =============================== */}

                    <Link
                      to={`/orders/${order._id}`}
                      className="btn btn-outline-danger w-100 mt-2"
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