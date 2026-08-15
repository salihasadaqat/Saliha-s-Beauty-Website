import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

function AdminOrderDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadOrder = async () => {

      try {

        const response =
          await API.get(`/orders/admin/${id}`);

        setOrder(response.data);

      } catch (error) {

        console.log(error);

        alert(
          error.response?.data?.message ||
          "Failed to load order"
        );

      } finally {

        setLoading(false);

      }

    };

    loadOrder();

  }, [id]);


  if (loading) {

    return (
      <h3 className="text-center mt-5">
        Loading order...
      </h3>
    );

  }


  if (!order) {

    return (
      <h3 className="text-center mt-5">
        Order not found
      </h3>
    );

  }


  return (

    <div className="container mt-5 mb-5">

      <button
        className="btn btn-secondary mb-4"
        onClick={() => navigate("/admin/orders")}
      >
        ← Back to Orders
      </button>


      <h2 className="mb-4">
        🧾 Order Details
      </h2>


      {/* Customer Information */}

      <div className="card shadow p-4 mb-4">

        <h4 className="mb-3">
          👤 Customer Information
        </h4>

        <p>
          <strong>Name:</strong>{" "}
          {order.user?.name || order.shippingAddress?.name}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {order.user?.email || "N/A"}
        </p>

        <p>
          <strong>Phone:</strong>{" "}
          {order.user?.number ||
            order.shippingAddress?.phone ||
            "N/A"}
        </p>

      </div>


      {/* Shipping Address */}

      <div className="card shadow p-4 mb-4">

        <h4 className="mb-3">
          🏠 Shipping Address
        </h4>

        <p>
          <strong>Name:</strong>{" "}
          {order.shippingAddress?.name}
        </p>

        <p>
          <strong>Phone:</strong>{" "}
          {order.shippingAddress?.phone}
        </p>

        <p>
          <strong>Address:</strong>{" "}
          {order.shippingAddress?.address}
        </p>

        <p>
          <strong>City:</strong>{" "}
          {order.shippingAddress?.city}
        </p>

      </div>


      {/* Products */}

      <div className="card shadow p-4 mb-4">

        <h4 className="mb-3">
          🛍️ Purchased Products
        </h4>

        <div className="table-responsive">

          <table className="table table-bordered">

            <thead className="table-dark">

              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>

            </thead>

            <tbody>

              {order.products.map(
                (item, index) => (

                  <tr key={index}>

                    <td>
                      <div className="d-flex align-items-center">

                        {item.image && (

                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                              marginRight: "10px"
                            }}
                          />

                        )}

                        {item.name}
                      </div>
                    </td>

                    <td>
                      Rs {item.price}
                    </td>

                    <td>
                      {item.quantity}
                    </td>

                    <td>
                      Rs{" "}
                      {item.price *
                        item.quantity}
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* Payment & Order Information */}

      <div className="card shadow p-4">

        <h4 className="mb-3">
          📦 Order Information
        </h4>

        <p>
          <strong>Order ID:</strong>{" "}
          {order._id}
        </p>

        <p>
          <strong>Payment Method:</strong>{" "}
          {order.paymentMethod}
        </p>

        <p>
          <strong>Payment Status:</strong>{" "}
          {order.paymentStatus || "Pending"}
        </p>

        <p>
          <strong>Order Status:</strong>{" "}
          {order.status}
        </p>

        <h4 className="mt-3">
          Total: Rs {order.totalAmount}
        </h4>

      </div>

    </div>

  );

}

export default AdminOrderDetails;