import { BrowserRouter, Routes, Route } from "react-router-dom";

// ==========================================
// COMPONENTS
// ==========================================

import Navbar from "./components/Navbar";

// ==========================================
// ROUTE GUARD
// ==========================================

import ProtectedRoute from "./components/ProtectedRoute";

// ==========================================
// CUSTOMER PAGES
// ==========================================

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";

import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyOTP from "./pages/VerifyOTP";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Checkout from "./pages/Checkout";

import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";

import Profile from "./pages/Profile";

import PaymentSuccess from "./pages/PaymentSuccess";

// ==========================================
// ADMIN
// ==========================================

import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import AdminProducts from "./pages/AdminProducts";
import AdminCategories from "./pages/AdminCategories";
import AdminOrders from "./pages/AdminOrders";
// ==========================================
// APP
// ==========================================

function App() {
  return (
    <BrowserRouter>

      {/* ====================================
          NAVBAR
      ==================================== */}

      <Navbar />

      {/* ====================================
          ROUTES
      ==================================== */}

      <Routes>

        {/* ==================================
            CUSTOMER - PUBLIC
        ================================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/products"
          element={<Products />}
        />
<Route
  path="/product/:id"
  element={<ProductDetails />}
/>

<Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

        {/* ==================================
            AUTHENTICATION
        ================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/verify-otp"
          element={<VerifyOTP />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* ==================================
            CUSTOMER - PROTECTED
        ================================== */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment-success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />

        {/* ==================================
            ADMIN
        ================================== */}
<Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>

<Route
  path="/admin/products"
  element={
    <AdminRoute>
      <AdminProducts />
    </AdminRoute>
  }
/>
<Route
  path="/admin/categories"
  element={
    <AdminRoute>
      <AdminCategories />
    </AdminRoute>
  }
/>

<Route
  path="/admin/orders"
  element={
    <AdminRoute>
      <AdminOrders />
    </AdminRoute>
  }
/>

      </Routes>

    </BrowserRouter>
  );
}

export default App;