import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";

function VerifyOTP() {

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);


    try {

      const response = await API.post(
        "/auth/verify-signup",
        {
          email,
          otp
        }
      );


      setMessage(response.data.message);


      setTimeout(() => {

        navigate("/login");

      }, 1500);


    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Invalid OTP"
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-5">

          <div className="card shadow p-4">

            <h2 className="text-center">
              Verify OTP 🔐
            </h2>

            <p className="text-center text-muted">
              Enter the OTP shown in your backend terminal.
            </p>


            <p className="text-center">
              <strong>{email}</strong>
            </p>


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


            <form onSubmit={handleSubmit}>

              <input
                type="text"
                className="form-control mb-3 text-center"
                placeholder="Enter 6 digit OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value)
                }
                maxLength="6"
                required
              />


              <button
                className="btn btn-danger w-100"
                disabled={loading}
              >

                {loading
                  ? "Verifying..."
                  : "Verify OTP"
                }

              </button>

            </form>

          </div>

        </div>

      </div>

    </div>

  );

}

export default VerifyOTP;