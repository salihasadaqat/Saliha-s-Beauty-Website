import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  if (!product) {
    return <h3 className="text-center mt-5">Loading...</h3>;
  }

  return (
    <div className="container mt-5">
      <div className="row">

        <div className="col-md-6">
          <img
            src={product.image}
            alt={product.name}
            className="img-fluid rounded shadow"
          />
        </div>

        <div className="col-md-6">

          <h2>{product.name}</h2>

          <p>⭐ {product.rating}</p>

          <p>
            <del>Rs {product.price}</del>
          </p>

          <h3 className="text-danger">
            Rs {product.discount}
          </h3>

          <p>
            Category: {product.category}
          </p>

          <p>
            {product.description || "Beautiful quality beauty product."}
          </p>

          <button className="btn btn-danger me-2">
            🛒 Add to Cart
          </button>

          <button className="btn btn-outline-danger">
            ❤️ Wishlist
          </button>

        </div>

      </div>
    </div>
  );
}

export default ProductDetails;