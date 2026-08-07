import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";

function ResetPassword() {

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

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
        "/auth/reset-password",
        {
          email,
          otp,
          newPassword
        }
      );


      setMessage(response.data.message);


      setTimeout(() => {

        navigate("/login");

      }, 1500);


    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Password reset failed"
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

            <h2 className="text-center mb-3">
              Reset Password 🔐
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


              <div className="mb-3">

                <label className="form-label">
                  OTP
                </label>

                <input
                  type="text"
                  className="form-control text-center"
                  placeholder="Enter 6 digit OTP"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value)
                  }
                  maxLength="6"
                  required
                />

              </div>


              <div className="mb-3">

                <label className="form-label">
                  New Password
                </label>

                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  minLength="6"
                  required
                />

              </div>


              <button
                type="submit"
                className="btn btn-danger w-100"
                disabled={loading}
              >

                {loading
                  ? "Resetting..."
                  : "Reset Password"
                }

              </button>


            </form>

          </div>

        </div>

      </div>

    </div>

  );

}

export default ResetPassword;