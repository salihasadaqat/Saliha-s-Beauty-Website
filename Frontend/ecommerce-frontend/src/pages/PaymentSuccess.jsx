import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyStripePayment = async () => {
      try {
        const sessionId =
          searchParams.get("session_id");

        if (!sessionId) {
          setError("Stripe session ID is missing.");
          setLoading(false);
          return;
        }

        const response = await API.post(
          "/payments/verify-payment",
          {
            sessionId,
          }
        );

        if (response.data.success) {
          setSuccess(true);
        }

      } catch (error) {
        console.error(
          "Payment verification error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Payment verification failed."
        );
      } finally {
        setLoading(false);
      }
    };

    verifyStripePayment();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-success" />

        <h4 className="mt-3">
          Verifying your payment...
        </h4>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center mt-5">
        <div className="alert alert-danger">
          {error}
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/orders")}
        >
          View Orders
        </button>
      </div>
    );
  }

  return (
    <div className="container text-center mt-5">

      <div className="card shadow-sm p-5">

        <h1 className="text-success">
          ✅ Payment Successful!
        </h1>

        <h4 className="mt-3">
          Payment Status: Paid
        </h4>

        <p className="text-muted">
          Your order has been successfully paid.
        </p>

        <p>
          Order Status:{" "}
          <strong>Processing</strong>
        </p>

        <button
          className="btn btn-success mt-3"
          onClick={() => navigate("/orders")}
        >
          View My Orders
        </button>

      </div>

    </div>
  );
}

export default PaymentSuccess;