import React, { useEffect, useState } from "react";
import API from "../api/axios";

function AdminProducts() {
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
    stock: "",
    image: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await API.get("/products");

      setProducts(
        Array.isArray(response.data)
          ? response.data
          : response.data.products || []
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to load products."
      );
    }
  };

  // ==========================================
  // INPUT
  // ==========================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      discountPrice: "",
      category: "",
      stock: "",
      image: "",
    });

    setEditingId(null);
    setError("");
  };

  // ==========================================
  // ADD / UPDATE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const data = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        discountPrice:
          form.discountPrice === ""
            ? 0
            : Number(form.discountPrice),
        category: form.category,
        stock: Number(form.stock),
        image: form.image,
      };

      if (editingId) {
        await API.put(
          `/products/${editingId}`,
          data
        );

        setMessage(
          "Product updated successfully."
        );
      } else {
        await API.post(
          "/products",
          data
        );

        setMessage(
          "Product added successfully."
        );
      }

      resetForm();
      await loadProducts();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to save product."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (product) => {
    setEditingId(product._id);

    setForm({
      name:
        product.name ||
        product.title ||
        "",

      description:
        product.description || "",

      price:
        product.price || "",

      discountPrice:
        product.discountPrice ||
        product.discount ||
        "",

      category:
        typeof product.category === "object"
          ? product.category._id
          : product.category || "",

      stock:
        product.stock || "",

      image:
        product.image || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await API.delete(
        `/products/${id}`
      );

      setMessage(
        "Product deleted successfully."
      );

      await loadProducts();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to delete product."
      );
    }
  };

  return (
    <div className="container mt-4 mb-5">

      <h2 className="fw-bold mb-4">
        📦 Product Management
      </h2>

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* ======================================
          PRODUCT FORM
      ======================================= */}

      <div className="card shadow-sm border-0 p-4 mb-5">

        <h4 className="mb-4">
          {editingId
            ? "✏️ Edit Product"
            : "➕ Add Product"}
        </h4>

        <form onSubmit={handleSubmit}>

          <div className="row">

            {/* NAME */}

            <div className="col-md-6 mb-3">
              <label className="form-label">
                Product Name
              </label>

              <input
                type="text"
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* PRICE */}

            <div className="col-md-3 mb-3">
              <label className="form-label">
                Price
              </label>

              <input
                type="number"
                name="price"
                className="form-control"
                value={form.price}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            {/* DISCOUNT */}

            <div className="col-md-3 mb-3">
              <label className="form-label">
                Discount Price
              </label>

              <input
                type="number"
                name="discountPrice"
                className="form-control"
                value={form.discountPrice}
                onChange={handleChange}
                min="0"
              />
            </div>

            {/* CATEGORY */}

            <div className="col-md-6 mb-3">
              <label className="form-label">
                Category
              </label>

              <input
                type="text"
                name="category"
                className="form-control"
                value={form.category}
                onChange={handleChange}
                placeholder="Category ID"
                required
              />
            </div>

            {/* STOCK */}

            <div className="col-md-3 mb-3">
              <label className="form-label">
                Stock
              </label>

              <input
                type="number"
                name="stock"
                className="form-control"
                value={form.stock}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            {/* IMAGE */}

            <div className="col-md-3 mb-3">
              <label className="form-label">
                Image URL
              </label>

              <input
                type="text"
                name="image"
                className="form-control"
                value={form.image}
                onChange={handleChange}
              />
            </div>

            {/* DESCRIPTION */}

            <div className="col-12 mb-3">
              <label className="form-label">
                Description
              </label>

              <textarea
                name="description"
                className="form-control"
                rows="4"
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <button
            type="submit"
            className="btn btn-danger me-2"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : editingId
              ? "Update Product"
              : "Add Product"}
          </button>

          {editingId && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}

        </form>
      </div>

      {/* ======================================
          PRODUCTS TABLE
      ======================================= */}

      <div className="card shadow-sm border-0 p-4">

        <h4 className="mb-4">
          📋 All Products
        </h4>

        <div className="table-responsive">

          <table className="table table-bordered table-hover align-middle">

            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {products.length === 0 ? (

                <tr>
                  <td
                    colSpan="7"
                    className="text-center"
                  >
                    No products found.
                  </td>
                </tr>

              ) : (

                products.map((product) => {

                  const category =
                    typeof product.category ===
                    "object"
                      ? product.category.name
                      : product.category;

                  return (
                    <tr key={product._id}>

                      <td>
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={
                              product.name ||
                              product.title
                            }
                            width="60"
                            height="60"
                            style={{
                              objectFit:
                                "cover",
                            }}
                            className="rounded"
                          />
                        ) : (
                          "No Image"
                        )}
                      </td>

                      <td>
                        {product.name ||
                          product.title}
                      </td>

                      <td>
                        Rs {product.price}
                      </td>

                      <td>
                        Rs{" "}
                        {product.discountPrice ||
                          product.discount ||
                          0}
                      </td>

                      <td>
                        {product.stock}
                      </td>

                      <td>
                        {category || "N/A"}
                      </td>

                      <td>

                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() =>
                            handleEdit(
                              product
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() =>
                            handleDelete(
                              product._id
                            )
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>
                  );
                })
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default AdminProducts;