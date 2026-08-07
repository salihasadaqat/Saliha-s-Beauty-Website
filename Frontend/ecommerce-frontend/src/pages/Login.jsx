import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

  const response = await API.post(
    "/auth/login",
    {
      email,
      password
    }
  );

  // Save login token
  localStorage.setItem(
    "token",
    response.data.token
  );

  // Save user
  localStorage.setItem(
    "user",
    JSON.stringify(response.data.user)
  );

  // Automatically open Products
  navigate("/products");

} catch (error) {

  setError(
    error.response?.data?.message ||
    "Login failed"
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

            <h2 className="text-center mb-4">
              Login 💄
            </h2>


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
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>


              <div className="mb-3">

                <label className="form-label">
                  Password
                </label>

                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
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
                  ? "Logging in..."
                  : "Login"
                }

              </button>


            </form>


            <div className="text-center mt-3">

              <Link to="/forgot-password">
                Forgot Password?
              </Link>

            </div>


            <div className="text-center mt-3">

              Don't have an account?{" "}

              <Link to="/signup">
                Signup
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Login;