import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // GET SINGLE PRODUCT
  // ==========================================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("Product ID:", id);

        const response = await API.get(`/products/${id}`);

        console.log(
          "Product Details:",
          response.data
        );

        setProduct(response.data);
      } catch (error) {
        console.error(
          "Product Details Error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    } else {
      setLoading(false);
      setError("Product ID is missing.");
    }
  }, [id]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <h3>💄 Loading Product...</h3>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="container text-center mt-5">

        <div className="alert alert-danger">
          <h4>{error}</h4>
        </div>

        <button
          className="btn btn-danger mt-3"
          onClick={() => navigate("/products")}
        >
          ← Back to Products
        </button>

      </div>
    );
  }

  // ==========================================
  // PRODUCT NOT FOUND
  // ==========================================

  if (!product) {
    return (
      <div className="container text-center mt-5">

        <h3>Product Not Found</h3>

        <button
          className="btn btn-danger mt-3"
          onClick={() => navigate("/products")}
        >
          ← Back to Products
        </button>

      </div>
    );
  }

  // ==========================================
  // PRODUCT DATA
  // ==========================================

  const productName =
    product.name || product.title || "Beauty Product";

  const productCategory =
    typeof product.category === "object"
      ? product.category?.name
      : product.category;

  const sellingPrice =
    product.discount ||
    product.discountPrice ||
    product.price;

  const stock = product.stock ?? 0;

  const isOutOfStock = stock <= 0;

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="container mt-5 mb-5">

      {/* BACK BUTTON */}

      <button
        className="btn btn-outline-danger mb-4"
        onClick={() => navigate("/products")}
      >
        ← Back to Products
      </button>

      <div className="row align-items-center">

        {/* ==================================
            PRODUCT IMAGE
        ================================== */}

        <div className="col-md-6 mb-4">

          <div className="card shadow border-0">

            <img
              src={product.image}
              alt={productName}
              className="card-img-top"
              style={{
                width: "100%",
                height: "500px",
                objectFit: "contain",
                padding: "20px",
              }}
            />

          </div>

        </div>

        {/* ==================================
            PRODUCT INFORMATION
        ================================== */}

        <div className="col-md-6">

          {/* NAME */}

          <h1 className="fw-bold mb-3">
            {productName}
          </h1>

          {/* RATING */}

          {product.rating && (
            <div className="mb-3">
              <span className="fs-5">
                {"⭐".repeat(
                  Math.min(
                    Number(product.rating) || 0,
                    5
                  )
                )}
              </span>

              <span className="ms-2 text-muted">
                {product.rating}/5
              </span>
            </div>
          )}

          {/* CATEGORY */}

          {productCategory && (
            <p className="mb-3">
              <strong>Category:</strong>{" "}
              {productCategory}
            </p>
          )}

          {/* PRICE */}

          <div className="mb-4">

            {product.price &&
              Number(sellingPrice) <
                Number(product.price) && (
                <p className="mb-1">
                  <del className="text-muted">
                    Rs {product.price}
                  </del>
                </p>
              )}

            <h2 className="text-danger fw-bold">
              Rs {sellingPrice}
            </h2>

          </div>

          {/* DESCRIPTION */}

          <div className="mb-4">

            <h5 className="fw-bold">
              Product Description
            </h5>

            <p className="text-muted">
              {product.description ||
                "Beautiful quality beauty product from Saliha's Beauty."}
            </p>

          </div>

          {/* STOCK */}

          <div className="mb-4">

            {isOutOfStock ? (
              <span className="badge bg-danger fs-6">
                Out of Stock
              </span>
            ) : (
              <span className="badge bg-success fs-6">
                📦 {stock} available
              </span>
            )}

          </div>

          {/* BUTTONS */}

          <div className="mt-4">

            <button
              className="btn btn-danger btn-lg me-2"
              disabled={isOutOfStock}
              onClick={() => {
                console.log(
                  "Add to Cart:",
                  product
                );
              }}
            >
              🛒 Add to Cart
            </button>

            <button
              className="btn btn-outline-danger btn-lg"
              onClick={() => {
                console.log(
                  "Add to Wishlist:",
                  product
                );
              }}
            >
              ❤️ Wishlist
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;