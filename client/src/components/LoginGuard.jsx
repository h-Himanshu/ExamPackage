import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Login from "./Elements/Login/login.jsx";

function LoginGuard() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("LoginGuard: Checking if user is already authenticated...");
    
    fetch("/user", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          console.log("LoginGuard: User is already authenticated, redirecting to dashboard");
          setIsAuthenticated(true);
        } else {
          console.log("LoginGuard: User not authenticated, showing login page");
          setIsAuthenticated(false);
        }
      })
      .catch((error) => {
        console.error("LoginGuard: Error checking authentication:", error);
        setIsAuthenticated(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        fontSize: "18px",
        backgroundColor: "#f5f5f5"
      }}>
        Loading...
      </div>
    );
  }

  // If user is authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // If not authenticated, show login page
  return <Login />;
}

export default LoginGuard;
