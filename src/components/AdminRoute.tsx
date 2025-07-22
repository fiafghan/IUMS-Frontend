// components/AdminRoute.tsx
import type { JSX } from "react";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }: { children: JSX.Element }) {
  const userStr = localStorage.getItem("loggedInUser");

  if (!userStr) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userStr);

  if (!user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
