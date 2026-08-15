import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalSales: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/admin/dashboard");

      setStats({
        totalProducts:
          response.data.totalProducts || 0,

        totalCategories:
          response.data.totalCategories || 0,

        totalUsers:
          response.data.totalUsers || 0,

        totalOrders:
          response.data.totalOrders || 0,

        totalSales:
          response.data.totalSales || 0,

        pendingOrders:
          response.data.pendingOrders || 0,

        processingOrders:
          response.data.processingOrders || 0,

        shippedOrders:
          response.data.shippedOrders || 0,

        deliveredOrders:
          response.data.deliveredOrders || 0,
      });
    } catch (error) {
      console.error("Dashboard Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-danger" />

        <p className="mt-3">
          Loading Admin Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4 mb-5">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2 className="fw-bold">
            👑 Admin Dashboard
          </h2>

          <p className="text-muted mb-0">
            Saliha's Beauty Store Overview
          </p>
        </div>

        <button
          className="btn btn-outline-danger"
          onClick={loadDashboard}
        >
          🔄 Refresh
        </button>

      </div>

      {/* ==========================================
          ERROR
      ========================================== */}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* ==========================================
          MANAGEMENT BUTTONS
      ========================================== */}

      <div className="card shadow-sm border-0 p-4 mb-4">

        <h4 className="fw-bold mb-3">
          🛠️ Management
        </h4>

        <div className="d-flex flex-wrap gap-2">

          <Link
            to="/admin/products"
            className="btn btn-danger"
          >
            📦 Manage Products
          </Link>

          <Link
            to="/admin/categories"
            className="btn btn-primary"
          >
            🗂️ Manage Categories
          </Link>

          <Link
            to="/admin/orders"
            className="btn btn-success"
          >
            🛒 Manage Orders
          </Link>

        </div>

      </div>

      {/* ==========================================
          MAIN STATISTICS
      ========================================== */}

      <div className="row g-4">

        {/* PRODUCTS */}

        <div className="col-md-6 col-lg-3">

          <div className="card shadow-sm border-0 p-4 h-100">

            <h6 className="text-muted">
              📦 Total Products
            </h6>

            <h2 className="fw-bold">
              {stats.totalProducts}
            </h2>

            <Link
              to="/admin/products"
              className="btn btn-sm btn-outline-danger mt-2"
            >
              Manage Products
            </Link>

          </div>

        </div>

        {/* CATEGORIES */}

        <div className="col-md-6 col-lg-3">

          <div className="card shadow-sm border-0 p-4 h-100">

            <h6 className="text-muted">
              🗂️ Total Categories
            </h6>

            <h2 className="fw-bold">
              {stats.totalCategories}
            </h2>

            <Link
              to="/admin/categories"
              className="btn btn-sm btn-outline-primary mt-2"
            >
              Manage Categories
            </Link>

          </div>

        </div>

        {/* USERS */}

        <div className="col-md-6 col-lg-3">

          <div className="card shadow-sm border-0 p-4 h-100">

            <h6 className="text-muted">
              👥 Total Users
            </h6>

            <h2 className="fw-bold">
              {stats.totalUsers}
            </h2>

          </div>

        </div>

        {/* ORDERS */}

        <div className="col-md-6 col-lg-3">

          <div className="card shadow-sm border-0 p-4 h-100">

            <h6 className="text-muted">
              🛒 Total Orders
            </h6>

            <h2 className="fw-bold">
              {stats.totalOrders}
            </h2>

            <Link
              to="/admin/orders"
              className="btn btn-sm btn-outline-success mt-2"
            >
              Manage Orders
            </Link>

          </div>

        </div>

      </div>

      {/* ==========================================
          SALES
      ========================================== */}

      <div className="row g-4 mt-1">

        <div className="col-lg-4">

          <div className="card shadow-sm border-0 p-4">

            <h6 className="text-muted">
              💰 Total Sales
            </h6>

            <h2 className="fw-bold text-success">
              Rs{" "}
              {Number(
                stats.totalSales
              ).toLocaleString()}
            </h2>

            <small className="text-muted">
              Paid orders only
            </small>

          </div>

        </div>

      </div>

      {/* ==========================================
          ORDER STATUS
      ========================================== */}

      <h4 className="fw-bold mt-5 mb-3">
        📊 Order Status
      </h4>

      <div className="row g-4">

        {/* PENDING */}

        <div className="col-md-6 col-lg-3">

          <div className="card shadow-sm border-0 p-4">

            <h6 className="text-muted">
              ⏳ Pending
            </h6>

            <h2 className="fw-bold text-warning">
              {stats.pendingOrders}
            </h2>

          </div>

        </div>

        {/* PROCESSING */}

        <div className="col-md-6 col-lg-3">

          <div className="card shadow-sm border-0 p-4">

            <h6 className="text-muted">
              ⚙️ Processing
            </h6>

            <h2 className="fw-bold text-info">
              {stats.processingOrders}
            </h2>

          </div>

        </div>

        {/* SHIPPED */}

        <div className="col-md-6 col-lg-3">

          <div className="card shadow-sm border-0 p-4">

            <h6 className="text-muted">
              🚚 Shipped
            </h6>

            <h2 className="fw-bold text-primary">
              {stats.shippedOrders}
            </h2>

          </div>

        </div>

        {/* DELIVERED */}

        <div className="col-md-6 col-lg-3">

          <div className="card shadow-sm border-0 p-4">

            <h6 className="text-muted">
              ✅ Delivered
            </h6>

            <h2 className="fw-bold text-success">
              {stats.deliveredOrders}
            </h2>

          </div>

        </div>

      </div>

      {/* ==========================================
          QUICK ACTIONS
      ========================================== */}

      <div className="card shadow-sm border-0 p-4 mt-5">

        <h4 className="fw-bold mb-3">
          ⚡ Quick Actions
        </h4>

        <div className="d-flex flex-wrap gap-2">

          <Link
            to="/admin/products"
            className="btn btn-danger"
          >
            ➕ Add / Edit Products
          </Link>

          <Link
            to="/admin/categories"
            className="btn btn-primary"
          >
            ➕ Add / Edit Categories
          </Link>

          <Link
            to="/admin/orders"
            className="btn btn-success"
          >
            📋 View Customer Orders
          </Link>

          <Link
            to="/products"
            className="btn btn-outline-secondary"
          >
            👀 View Store
          </Link>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;