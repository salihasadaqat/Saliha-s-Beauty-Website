import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

function AdminCategories() {
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ==========================================
  // LOAD CATEGORIES
  // ==========================================

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      setError("");

      const response = await API.get("/categories");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.categories || [];

      setCategories(data);
    } catch (error) {
      console.error(
        "Load Categories Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load categories."
      );
    } finally {
      setLoadingCategories(false);
    }
  };

  // ==========================================
  // ADD / UPDATE CATEGORY
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      if (editingId) {
        await API.put(
          `/categories/${editingId}`,
          {
            name: name.trim(),
          }
        );

        setMessage(
          "Category updated successfully."
        );
      } else {
        await API.post(
          "/categories",
          {
            name: name.trim(),
          }
        );

        setMessage(
          "Category added successfully."
        );
      }

      setName("");
      setEditingId(null);

      await loadCategories();
    } catch (error) {
      console.error(
        "Category Save Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to save category."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (category) => {
    setEditingId(category._id);

    setName(
      category.name ||
        category.title ||
        ""
    );

    setError("");
    setMessage("");

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
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await API.delete(
        `/categories/${id}`
      );

      setMessage(
        "Category deleted successfully."
      );

      await loadCategories();
    } catch (error) {
      console.error(
        "Category Delete Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to delete category."
      );
    }
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const handleCancel = () => {
    setName("");
    setEditingId(null);
    setError("");
    setMessage("");
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loadingCategories) {
    return (
      <div className="container mt-5 text-center">

        <div className="spinner-border text-danger" />

        <p className="mt-3">
          Loading categories...
        </p>

      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">

      {/* ======================================
          HEADER
      ======================================= */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h2 className="fw-bold">
            🗂️ Category Management
          </h2>

          <p className="text-muted">
            Add, update and delete store categories.
          </p>

        </div>

        <Link
          to="/admin"
          className="btn btn-outline-secondary"
        >
          ← Dashboard
        </Link>

      </div>

      {/* ======================================
          MESSAGES
      ======================================= */}

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
          CATEGORY FORM
      ======================================= */}

      <div className="card shadow-sm border-0 p-4 mb-4">

        <h4 className="fw-bold mb-3">

          {editingId
            ? "✏️ Edit Category"
            : "➕ Add Category"}

        </h4>

        <form onSubmit={handleSubmit}>

          <div className="row align-items-end">

            <div className="col-md-8 mb-3">

              <label className="form-label">
                Category Name
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Example: Makeup"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
              />

            </div>

            <div className="col-md-4 mb-3">

              <button
                type="submit"
                className="btn btn-danger me-2"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Category"
                  : "Add Category"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              )}

            </div>

          </div>

        </form>

      </div>

      {/* ======================================
          CATEGORY LIST
      ======================================= */}

      <div className="card shadow-sm border-0 p-4">

        <div className="d-flex justify-content-between align-items-center mb-3">

          <h4 className="fw-bold mb-0">
            📋 All Categories
          </h4>

          <span className="badge bg-dark">
            {categories.length} Categories
          </span>

        </div>

        {categories.length === 0 ? (

          <div className="text-center py-5">

            <h5>
              No categories found.
            </h5>

            <p className="text-muted">
              Add your first category above.
            </p>

          </div>

        ) : (

          <div className="table-responsive">

            <table className="table table-bordered table-hover align-middle">

              <thead>
                <tr>
                  <th>#</th>
                  <th>Category Name</th>
                  <th>ID</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {categories.map(
                  (category, index) => (
                    <tr key={category._id}>

                      <td>
                        {index + 1}
                      </td>

                      <td className="fw-bold">
                        {category.name ||
                          category.title ||
                          "Unnamed"}
                      </td>

                      <td>
                        <small>
                          {category._id}
                        </small>
                      </td>

                      <td>

                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() =>
                            handleEdit(
                              category
                            )
                          }
                        >
                          ✏️ Edit
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() =>
                            handleDelete(
                              category._id
                            )
                          }
                        >
                          🗑️ Delete
                        </button>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminCategories;