import React from "react";
import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");

  const userData = localStorage.getItem("user");

  // No login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  let user = null;

  try {
    user = userData
      ? JSON.parse(userData)
      : null;
  } catch (error) {
    console.error(
      "Invalid user data:",
      error
    );
  }

  // Not admin
  if (!user || user.role !== "admin") {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}

export default AdminRoute;