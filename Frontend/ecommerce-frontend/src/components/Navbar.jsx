import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  getCartCount,
  getWishlistCount
} from "../utils/storage";

function Navbar() {

  const location = useLocation();
  const navigate = useNavigate();

  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });


  // ===============================
  // UPDATE CART & WISHLIST COUNTS
  // ===============================

  const updateCounts = () => {

    setCartCount(getCartCount());

    setWishlistCount(getWishlistCount());

  };


  // ===============================
  // UPDATE LOGIN USER
  // ===============================

  const updateUser = () => {

    const savedToken =
      localStorage.getItem("token");

    const savedUser =
      localStorage.getItem("user");

    setToken(savedToken);

    setUser(
      savedUser
        ? JSON.parse(savedUser)
        : null
    );

  };


  // ===============================
  // RUN WHEN PAGE/ROUTE CHANGES
  // ===============================

  useEffect(() => {

    updateCounts();

    updateUser();

  }, [location]);


  // ===============================
  // STORAGE EVENT
  // ===============================

  useEffect(() => {

    const handleStorage = () => {

      updateCounts();

      updateUser();

    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {

      window.removeEventListener(
        "storage",
        handleStorage
      );

    };

  }, []);


  // ===============================
  // LOGOUT
  // ===============================

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setToken(null);

    setUser(null);

    navigate("/login");

  };


  return (

    <nav className="navbar navbar-expand-lg pink-nav">

      <div className="container">


        {/* LOGO */}

        <Link
          className="navbar-brand text-white fw-bold"
          to="/"
        >
          💄 Saliha's Beauty 
        </Link>


        {/* MOBILE BUTTON */}

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menu"
          aria-controls="menu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >

          <span className="navbar-toggler-icon"></span>

        </button>


        <div
          className="collapse navbar-collapse"
          id="menu"
        >

          <ul className="navbar-nav ms-auto">


            {/* HOME */}

            <li className="nav-item">

              <Link
                className="nav-link text-white"
                to="/"
              >
                Home
              </Link>

            </li>


            {/* PRODUCTS */}

            <li className="nav-item">

              <Link
                className="nav-link text-white"
                to="/products"
              >
                Products
              </Link>

            </li>


            {/* WISHLIST */}

            <li className="nav-item">

              <Link
                className="nav-link text-white"
                to="/wishlist"
              >

                ❤️ Wishlist

                {wishlistCount > 0 && (

                  <span className="badge bg-light text-danger ms-1">

                    {wishlistCount}

                  </span>

                )}

              </Link>

            </li>


            {/* CART */}

            <li className="nav-item">

              <Link
                className="nav-link text-white"
                to="/cart"
              >

                🛒 Cart

                {cartCount > 0 && (

                  <span className="badge bg-light text-danger ms-1">

                    {cartCount}

                  </span>

                )}

              </Link>

            </li>


            {/* ===============================
                LOGGED IN USER
            =============================== */}

            {token ? (

              <>

                {/* PROFILE */}

                <li className="nav-item">

                  <Link
                    className="nav-link text-white"
                    to="/profile"
                  >
                    👤 Profile
                  </Link>

                </li>


                {/* MY ORDERS */}

                <li className="nav-item">

                  <Link
                    className="nav-link text-white"
                    to="/orders"
                  >
                    📦 Orders
                  </Link>

                </li>


                {/* ADMIN PANEL */}

                {user?.role === "admin" && (

                  <li className="nav-item">

                    <Link
                      className="nav-link text-white fw-bold"
                      to="/admin/dashboard"
                    >
                      👑 Admin
                    </Link>

                  </li>

                )}


                {/* LOGOUT */}

                <li className="nav-item">

                  <button
                    className="btn btn-light ms-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>

                </li>

              </>

            ) : (

              /* ===============================
                 LOGGED OUT USER
              =============================== */

              <>

                {/* LOGIN */}

                <li className="nav-item">

                  <Link
                    className="btn btn-light ms-2"
                    to="/login"
                  >
                    Login
                  </Link>

                </li>


                {/* SIGNUP */}

                <li className="nav-item">

                  <Link
                    className="btn btn-outline-light ms-2"
                    to="/signup"
                  >
                    Signup
                  </Link>

                </li>

              </>

            )}

          </ul>

        </div>

      </div>

    </nav>

  );

}

export default Navbar;