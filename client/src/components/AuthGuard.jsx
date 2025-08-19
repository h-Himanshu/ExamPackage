import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function AuthGuard({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // console.log("AuthGuard: Starting authentication check...");
    
    fetch("/user", {
      method: "GET",
      credentials: "include",
    })
      .then(async (response) => {
        console.log("AuthGuard: Response received:", {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          url: response.url
        });
        
        // Try to read the response body for more details
        const responseText = await response.text();
        // console.log("AuthGuard: Response body:", responseText);
        
        if (response.ok) {
          console.log("AuthGuard: User is authenticated ✓");
          setIsAuthenticated(true);
          setError(null);
        } else {
        //   console.log("AuthGuard: User is not authenticated ✗");
          setIsAuthenticated(false);
          setError(`Authentication failed: ${response.status} ${response.statusText}`);
        }
      })
      .catch((error) => {
        console.error("AuthGuard: Network error during authentication check:", error);
        setIsAuthenticated(false);
        setError(`Network error: ${error.message}`);
      })
      .finally(() => {
        console.log("AuthGuard: Authentication check completed");
        setIsLoading(false);
      });
  }, []);

//   console.log("AuthGuard render:", { isLoading, isAuthenticated, error });

//   if (isLoading) {
//     return (
//       <div style={{ 
//         display: "flex", 
//         flexDirection: "column",
//         justifyContent: "center", 
//         alignItems: "center", 
//         height: "100vh",
//         fontSize: "18px",
//         backgroundColor: "#f5f5f5"
//       }}>
//         <div>Checking authentication...</div>
//         {error && (
//           <div style={{ 
//             marginTop: "10px", 
//             fontSize: "14px", 
//             color: "red",
//             textAlign: "center"
//           }}>
//             Debug: {error}
//           </div>
//         )}
//       </div>
//     );
//   }

  if (!isAuthenticated) {
    // console.log("AuthGuard: Redirecting to login page");
    return <Navigate to="/login" replace />;
  }

//   console.log("AuthGuard: Rendering protected content");
  return children;
}

export default AuthGuard;
