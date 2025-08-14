import type { JSX } from "react";
import { Navigate } from "react-router-dom";

type RoleRouteProps = {
  children: JSX.Element;
  allowedRoles: string[];
};

export default function RoleChecker({ children, allowedRoles }: RoleRouteProps) {
  const currentUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  const userRole = currentUser?.user?.role || "";

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
}
