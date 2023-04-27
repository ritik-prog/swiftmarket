import React from "react";
import useAuth from "../hooks/useAuth";
import { CreateToast } from "../utils/Toast";
import { Navigate } from "react-router-dom";

// Higher-order component to check authentication before rendering child components
function withAuth(children: () => JSX.Element) {
  return function AuthenticatedComponent() {
    const { isAuthenticated, user } = useAuth();
    if (isAuthenticated && user?.verificationStatus) {
      // Render the child components if the user is authenticated and verified
      return <>{children()}</>;
    } else {
      CreateToast(
        "accessthispage",
        "Oops! It looks like you're not logged in. Please log in to access this page.",
        "error"
      );
      // Redirect the user to the login page
      return <Navigate replace to="/login" />;
    }
  };
}

export default withAuth;
