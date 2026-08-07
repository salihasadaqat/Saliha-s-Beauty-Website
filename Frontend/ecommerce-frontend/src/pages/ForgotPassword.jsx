import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

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
        "/auth/forgot-password",
        {
          email
        }
      );

      setMessage(response.data.message);

      // Go to reset password page
      navigate("/reset-password", {
        state: {
          email: email
        }
      });

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Something went wrong"
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
              Forgot Password 🔐
            </h2>

            <p className="text-center text-muted">
              Enter your registered email.
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
                  Email
                </label>

                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>


              <button
                type="submit"
                className="btn btn-danger w-100"
                disabled={loading}
              >

                {loading
                  ? "Generating OTP..."
                  : "Send OTP"
                }

              </button>

            </form>

          </div>

        </div>

      </div>

    </div>

  );

}

export default ForgotPassword;