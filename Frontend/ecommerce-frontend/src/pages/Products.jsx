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
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");

        console.log("Products:", response.data);

        setProducts(response.data);
      } catch (error) {
        console.error("Error:", error);

        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
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
        💄 Saliha's Beauty Products
      </h2>

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
        <option value="All">All Categories</option>
        <option value="Makeup">Makeup</option>
        <option value="Skin Care">Skin Care</option>
        <option value="Hair Care">Hair Care</option>
      </select>

      {/* Loading */}
      {loading && (
        <div className="text-center">
          <h4>Loading Products...</h4>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="alert alert-danger text-center">
          {error}
        </div>
      )}

      {/* Products */}
      {!loading && !error && (
        <div className="row">

          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                className="col-md-6 col-lg-3 mb-4"
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
      )}

    </div>
  );
}

export default Products;