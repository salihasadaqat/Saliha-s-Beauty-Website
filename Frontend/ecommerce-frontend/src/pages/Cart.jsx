import React, {
  useEffect,
  useState
} from "react";

import { useNavigate } from "react-router-dom";

import {
  getCart,
  increaseCartQuantity,
  decreaseCartQuantity,
  removeFromCart,
  getCartTotal
} from "../utils/storage";


function Cart() {
  const [cart, setCart] = useState([]);

  const navigate = useNavigate();


  // ==========================================
  // LOAD CART
  // ==========================================

  const loadCart = () => {
    setCart(getCart());
  };


  useEffect(() => {
    loadCart();

    window.addEventListener(
      "cartUpdated",
      loadCart
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        loadCart
      );
    };
  }, []);


  // ==========================================
  // QUANTITY
  // ==========================================

  const handleIncrease = (id) => {
    increaseCartQuantity(id);
    loadCart();
  };


  const handleDecrease = (id) => {
    decreaseCartQuantity(id);
    loadCart();
  };


  // ==========================================
  // REMOVE
  // ==========================================

  const handleRemove = (id) => {
    removeFromCart(id);
    loadCart();
  };


  const total = getCartTotal();


  return (
    <div className="container mt-5 mb-5">

      <h2 className="text-center mb-4">
        🛒 My Shopping Cart
      </h2>


      {cart.length === 0 ? (

        <div className="text-center">

          <h4>
            Your cart is empty.
          </h4>

          <p>
            Add some beauty products
            to your cart.
          </p>

          <button
            className="btn btn-danger"
            onClick={() =>
              navigate("/products")
            }
          >
            🛍️ Shop Products
          </button>

        </div>

      ) : (

        <>

          <div className="row">

            {cart.map((product) => {

              const price =
                Number(
                  product.discountPrice ??
                  product.discount ??
                  product.price ??
                  0
                );

              const itemTotal =
                price *
                Number(
                  product.quantity || 0
                );

              return (

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


                      <p className="text-danger fw-bold">
                        Rs {price}
                      </p>


                      {/* QUANTITY */}

                      <div className="d-flex align-items-center mb-3">

                        <button
                          className="btn btn-outline-danger"
                          onClick={() =>
                            handleDecrease(
                              product._id
                            )
                          }
                        >
                          −
                        </button>


                        <span
                          className="mx-3 fw-bold"
                        >
                          {product.quantity}
                        </span>


                        <button
                          className="btn btn-outline-danger"
                          onClick={() =>
                            handleIncrease(
                              product._id
                            )
                          }
                        >
                          +
                        </button>

                      </div>


                      <p>
                        Item Total:
                        <strong>
                          {" "}Rs {itemTotal}
                        </strong>
                      </p>


                      <button
                        className="btn btn-outline-danger w-100"
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


          {/* TOTAL */}

          <div className="card shadow p-4 mt-3">

            <h4>
              Total:
              <span className="text-danger">
                {" "}Rs {total}
              </span>
            </h4>


            <button
              className="btn btn-danger mt-3"
              onClick={() =>
                navigate("/checkout")
              }
            >
              Proceed to Checkout →
            </button>

          </div>

        </>

      )}

    </div>
  );
}


export default Cart;