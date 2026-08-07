import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Signup() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    number: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);


    try {

      const response = await API.post(
        "/auth/signup",
        formData
      );


      setMessage(response.data.message);


      // Go to OTP page
      navigate("/verify-otp", {

        state: {
          email: response.data.email
        }

      });


    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Signup failed"
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-6">

          <div className="card shadow p-4">

            <h2 className="text-center mb-4">
              Create Account 💄
            </h2>


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
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="mb-3">

                <label className="form-label">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="mb-3">

                <label className="form-label">
                  Phone Number
                </label>

                <input
                  type="text"
                  name="number"
                  className="form-control"
                  value={formData.number}
                  onChange={handleChange}
                />

              </div>


              <div className="mb-3">

                <label className="form-label">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                />

              </div>


              <button
                type="submit"
                className="btn btn-danger w-100"
                disabled={loading}
              >

                {loading
                  ? "Creating Account..."
                  : "Signup"
                }

              </button>


            </form>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Signup;