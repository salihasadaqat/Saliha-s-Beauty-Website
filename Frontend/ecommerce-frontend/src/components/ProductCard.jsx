import React from "react";

import {
  addToCart,
  addToWishlist
} from "../utils/storage";

function ProductCard({ product }) {

  const handleCart = () => {

    addToCart(product);

    alert(`${product.name} added to Cart 🛒`);
  };


  const handleWishlist = () => {

    addToWishlist(product);

    alert(`${product.name} added to Wishlist ❤️`);
  };


  return (

    <div className="card shadow h-100">

      <img
        src={product.image}
        className="card-img-top"
        alt={product.name}
        style={{
          height: "230px",
          objectFit: "cover"
        }}
      />


      <div className="card-body">

        <h5 className="card-title">
          {product.name}
        </h5>


        <p className="text-muted">
          {product.category}
        </p>


        <p>
          {"⭐".repeat(product.rating)}
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


        {/* CART BUTTON */}

        <button
          className="btn btn-danger"
          onClick={handleCart}
        >
          🛒 Add Cart
        </button>


        {/* WISHLIST BUTTON */}

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