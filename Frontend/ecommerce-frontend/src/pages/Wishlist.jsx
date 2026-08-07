import React, { useEffect, useState } from "react";

import {
  getWishlist,
  removeFromWishlist,
  addToCart
} from "../utils/storage";

function Wishlist() {

  const [wishlist, setWishlist] = useState([]);


  useEffect(() => {

    setWishlist(getWishlist());

  }, []);


  const handleRemove = (id) => {

    removeFromWishlist(id);

    setWishlist(getWishlist());

  };


  const handleCart = (product) => {

    addToCart(product);

    alert(`${product.name} added to Cart 🛒`);

  };


  return (

    <div className="container mt-5 mb-5">

      <h2 className="text-center mb-4">
        ❤️ My Wishlist
      </h2>


      {wishlist.length === 0 ? (

        <div className="text-center">

          <h4>
            Your wishlist is empty
          </h4>

          <p>
            Click ❤️ on a product to add it here.
          </p>

        </div>

      ) : (

        <div className="row">

          {wishlist.map((product) => (

            <div
              className="col-md-6 col-lg-4 mb-4"
              key={product._id}
            >

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

                  <h5>
                    {product.name}
                  </h5>


                  <p className="text-muted">
                    {product.category}
                  </p>


                  <p>
                    {"⭐".repeat(product.rating)}
                  </p>


                  <strong className="text-danger">
                    Rs {product.discount}
                  </strong>


                  <div className="mt-3">

                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        handleCart(product)
                      }
                    >
                      🛒 Add Cart
                    </button>


                    <button
                      className="btn btn-outline-danger ms-2"
                      onClick={() =>
                        handleRemove(product._id)
                      }
                    >
                      Remove
                    </button>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );
}

export default Wishlist;