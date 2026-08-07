import React, { useEffect, useState } from "react";

import {
  getCart,
  removeFromCart
} from "../utils/storage";

function Cart() {

  const [cart, setCart] = useState([]);


  useEffect(() => {

    setCart(getCart());

  }, []);


  const handleRemove = (id) => {

    removeFromCart(id);

    setCart(getCart());

  };


  const total = cart.reduce(
    (sum, product) =>
      sum + product.discount * product.quantity,
    0
  );


  return (

    <div className="container mt-5 mb-5">

      <h2 className="text-center mb-4">
        🛒 My Shopping Cart
      </h2>


      {cart.length === 0 ? (

        <div className="text-center">

          <h4>
            Your cart is empty
          </h4>

          <p>
            Add some beauty products to your cart.
          </p>

        </div>

      ) : (

        <>

          <div className="row">

            {cart.map((product) => (

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


                    <p>
                      {product.category}
                    </p>


                    <p className="text-danger fw-bold">
                      Rs {product.discount}
                    </p>


                    <p>
                      Quantity: {product.quantity}
                    </p>


                    <button
                      className="btn btn-outline-danger"
                      onClick={() =>
                        handleRemove(product._id)
                      }
                    >
                      Remove
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>


          <div className="card p-4 shadow mt-3">

            <h4>
              Total: Rs {total}
            </h4>

            <button className="btn btn-danger mt-2">
              Proceed to Checkout
            </button>

          </div>

        </>

      )}

    </div>

  );
}

export default Cart;