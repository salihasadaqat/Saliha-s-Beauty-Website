import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import API from "../api/axios";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD PRODUCTS AND CATEGORIES
  // ==========================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [productsResponse, categoriesResponse] =
          await Promise.all([
            API.get("/products"),
            API.get("/categories"),
          ]);

        console.log("Products:", productsResponse.data);
        console.log("Categories:", categoriesResponse.data);

        // Products API returns array directly
        setProducts(
          Array.isArray(productsResponse.data)
            ? productsResponse.data
            : productsResponse.data.products || []
        );

        // Categories API
        setCategories(
          Array.isArray(categoriesResponse.data)
            ? categoriesResponse.data
            : categoriesResponse.data.categories || []
        );
      } catch (error) {
        console.error("Products Error:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load products."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ==========================================
  // FILTER PRODUCTS
  // ==========================================

  const filteredProducts = products.filter((product) => {
    const productName = product.name || product.title || "";

    const matchesSearch = productName
      .toLowerCase()
      .includes(search.toLowerCase());

    const productCategory =
      typeof product.category === "object"
        ? product.category?.name
        : product.category;

    const matchesCategory =
      category === "All" ||
      productCategory === category;

    return matchesSearch && matchesCategory;
  });

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <h3>💄 Loading Products...</h3>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">
          <h4>{error}</h4>

          <p className="mb-0">
            Please check your backend connection.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="container mt-5 mb-5">

      {/* TITLE */}
      <h2 className="text-center mb-4">
        💄 Saliha's Beauty Products
      </h2>

      {/* SEARCH */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Search Product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* CATEGORY */}
      <div className="mb-4">
        <select
          className="form-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">
            All Categories
          </option>

          {categories.map((cat) => (
            <option
              key={cat._id}
              value={cat.name}
            >
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* PRODUCT COUNT */}
      <div className="mb-4">
        <p className="text-muted">
          Showing {filteredProducts.length} product
          {filteredProducts.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* PRODUCTS */}
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
          <div className="col-12 text-center">
            <div className="alert alert-warning">
              <h4>No Products Found</h4>

              <p className="mb-0">
                Try another product name or category.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Products;