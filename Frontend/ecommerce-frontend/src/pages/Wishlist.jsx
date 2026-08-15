import React, {
  useEffect,
  useState
} from "react";

import { useNavigate } from "react-router-dom";

import {
  getWishlist,
  removeFromWishlist,
  addToCart
} from "../utils/storage";


function Wishlist() {

  const [wishlist, setWishlist] =
    useState([]);

  const navigate = useNavigate();


  const loadWishlist = () => {
    setWishlist(getWishlist());
  };


  useEffect(() => {

    loadWishlist();

    window.addEventListener(
      "wishlistUpdated",
      loadWishlist
    );

    return () => {
      window.removeEventListener(
        "wishlistUpdated",
        loadWishlist
      );
    };

  }, []);


  const handleRemove = (id) => {

    removeFromWishlist(id);

    loadWishlist();
  };


  const handleAddToCart = (product) => {

    addToCart(product);

    alert(
      `${product.name} added to cart.`
    );
  };


  return (

    <div className="container mt-5 mb-5">

      <h2 className="text-center mb-4">
        ❤️ My Wishlist
      </h2>


      {wishlist.length === 0 ? (

        <div className="text-center">

          <h4>
            Your wishlist is empty.
          </h4>

          <p>
            Add your favorite beauty
            products here.
          </p>

          <button
            className="btn btn-danger"
            onClick={() =>
              navigate("/products")
            }
          >
            🛍️ Browse Products
          </button>

        </div>

      ) : (

        <div className="row">

          {wishlist.map((product) => {

            const price =
              Number(
                product.discountPrice ??
                product.discount ??
                product.price ??
                0
              );

            return (

              <div
                className="col-md-6 col-lg-4 mb-4"
                key={product._id}
              >

                <div className="card shadow h-100">

                  <img
                    src={product.image}
                    alt={product.name}
                    className="card-img-top"
                    style={{
                      height: "230px",
                      objectFit: "cover"
                    }}
                  />


                  <div className="card-body">

                    <h5>
                      {product.name}
                    </h5>


                    <p className="text-muted">
                      {product.category}
                    </p>


                    <h5 className="text-danger">
                      Rs {price}
                    </h5>


                    <button
                      className="btn btn-danger w-100 mt-2"
                      onClick={() =>
                        handleAddToCart(
                          product
                        )
                      }
                    >
                      🛒 Add to Cart
                    </button>


                    <button
                      className="btn btn-outline-danger w-100 mt-2"
                      onClick={() =>
                        handleRemove(
                          product._id
                        )
                      }
                    >
                      🗑️ Remove
                    </button>

                  </div>

                </div>

              </div>

            );
          })}

        </div>

      )}

    </div>
  );
}


export default Wishlist;