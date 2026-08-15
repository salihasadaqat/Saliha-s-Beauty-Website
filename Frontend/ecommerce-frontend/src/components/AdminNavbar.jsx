import React from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminNavbar() {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");

  };


  return (

    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">

      <div className="container">

        <Link
          to="/admin/dashboard"
          className="navbar-brand fw-bold"
        >
          👑 Saliha's Beauty Admin
        </Link>


        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>


        <div
          className="collapse navbar-collapse"
          id="adminNavbar"
        >

          <ul className="navbar-nav ms-auto">

            <li className="nav-item">

              <Link
                to="/admin/dashboard"
                className="nav-link"
              >
                📊 Dashboard
              </Link>

            </li>


            <li className="nav-item">

              <Link
                to="/admin/products"
                className="nav-link"
              >
                📦 Products
              </Link>

            </li>


            <li className="nav-item">

              <Link
                to="/admin/categories"
                className="nav-link"
              >
                🏷️ Categories
              </Link>

            </li>


            <li className="nav-item">

              <Link
                to="/admin/orders"
                className="nav-link"
              >
                🛒 Orders
              </Link>

            </li>


            <li className="nav-item ms-lg-2">

              <button
                className="btn btn-danger btn-sm mt-1"
                onClick={handleLogout}
              >
                Logout
              </button>

            </li>

          </ul>

        </div>

      </div>

    </nav>

  );

}

export default AdminNavbar;