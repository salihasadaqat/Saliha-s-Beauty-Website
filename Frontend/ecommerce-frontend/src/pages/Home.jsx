import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>

      {/* Hero Section */}

      <section
        className="text-center py-5"
        style={{
          background:
            "linear-gradient(135deg, #ffe6f0, #fff5f8)"
        }}
      >

        <div className="container py-5">

          <h1
            className="display-4 fw-bold"
            style={{ color: "#d63384" }}
          >
            💄 Welcome to Saliha's Beauty
          </h1>

          <p className="lead mt-3">
            Discover beautiful cosmetics and skincare
            products at amazing prices.
          </p>

          <Link
            to="/products"
            className="btn btn-danger btn-lg mt-3"
          >
            🛍️ Shop Now
          </Link>

        </div>

      </section>


      {/* Features */}

      <section className="container py-5">

        <div className="row text-center">

          <div className="col-md-4 mb-3">
            <h3>💄</h3>
            <h5>Premium Beauty</h5>
            <p>
              Quality cosmetics for your beauty needs.
            </p>
          </div>

          <div className="col-md-4 mb-3">
            <h3>💰</h3>
            <h5>Best Prices</h5>
            <p>
              Amazing products at affordable prices.
            </p>
          </div>

          <div className="col-md-4 mb-3">
            <h3>🚚</h3>
            <h5>Easy Shopping</h5>
            <p>
              Simple and convenient online shopping.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;