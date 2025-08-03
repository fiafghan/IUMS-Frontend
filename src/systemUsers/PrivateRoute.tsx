import type { JSX } from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const user = localStorage.getItem("loggedInUser");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
