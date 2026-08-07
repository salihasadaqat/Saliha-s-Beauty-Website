import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import api from "../api/axios";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log("Loading products...");

        const response = await api.get("/products");

        console.log("Products received:", response.data);

        setProducts(response.data);
      } catch (err) {
        console.error("PRODUCT ERROR:", err);

        setError(
          "Products could not be loaded. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      product.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mt-5 mb-5">

      <h2 className="text-center mb-4">
        💄 Our Beauty Products
      </h2>

      {loading && (
        <div className="text-center mt-5">
          <h4>Loading Products...</h4>
        </div>
      )}

      {error && (
        <div className="alert alert-danger text-center">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Search */}
          <input
            type="text"
            className="form-control mb-3"
            placeholder="🔍 Search Product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Category */}
          <select
            className="form-select mb-4"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">
              All Categories
            </option>

            <option value="Makeup">
              Makeup
            </option>

            <option value="Skin Care">
              Skin Care
            </option>

            <option value="Hair Care">
              Hair Care
            </option>
          </select>

          {/* Products */}
          <div className="row">

            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  className="col-md-6 col-lg-4 mb-4"
                  key={product._id}
                >
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div className="text-center">
                <h4>No Products Found</h4>
              </div>
            )}

          </div>
        </>
      )}

    </div>
  );
}

export default Products;