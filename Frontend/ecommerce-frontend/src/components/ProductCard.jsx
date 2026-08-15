import React from "react";
import { Link } from "react-router-dom";
import {
  addToCart,
  addToWishlist
} from "../utils/storage";

function ProductCard({ product }) {

  const stock = product.stock ?? 0;

  const isOutOfStock = stock <= 0;


  const handleCart = () => {

  const added = addToCart(product);

  if (added) {

    alert(
      `${product.name} added to Cart 🛒`
    );

  }

};


  const handleWishlist = () => {

    addToWishlist(product);

    alert(
      `${product.name} added to Wishlist ❤️`
    );

  };


  return (

    <div className="card shadow h-100">

      <div className="position-relative">

        <img
          src={product.image}
          className="card-img-top"
          alt={product.name}
          style={{
            height: "230px",
            objectFit: "cover"
          }}
        />


        {isOutOfStock && (

          <span
            className="badge bg-danger position-absolute top-0 end-0 m-2"
          >
            Out of Stock
          </span>

        )}

      </div>


      <div className="card-body">

        <Link
          to={`/product/${product._id}`}
          className="text-decoration-none text-dark"
        >

          <h5 className="card-title">
            {product.name}
          </h5>

        </Link>


        <p className="text-muted">
          {product.category}
        </p>


        <p>
          {"⭐".repeat(product.rating || 0)}
        </p>


        <div className="mb-3">

          <del className="text-muted">
            Rs {product.price}
          </del>

          <br />

          <strong className="text-danger fs-5">
            Rs {product.discount}
          </strong>

        </div>


        {/* STOCK */}

        {!isOutOfStock && (

          <p className={
            stock <= 5
              ? "text-warning fw-bold"
              : "text-success fw-bold"
          }>
            📦 {stock} left
          </p>

        )}


        {/* CART */}

        <button
          className="btn btn-danger"
          onClick={handleCart}
          disabled={isOutOfStock}
        >

          {isOutOfStock
            ? "Out of Stock"
            : "🛒 Add Cart"
          }

        </button>


        {/* WISHLIST */}

        <button
          className="btn btn-outline-danger ms-2"
          onClick={handleWishlist}
        >
          ❤️
        </button>

      </div>

    </div>

  );

}

export default ProductCard;