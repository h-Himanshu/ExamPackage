import { RouterProvider } from "react-router-dom";
import router from "./routes.jsx";
import { useEffect } from "react";
import crossTabLogout from "./utils/crossTabLogout.js";

const App = () => {
  // Initialize cross-tab logout functionality
  useEffect(() => {
    // The utility is already initialized in its constructor
    // This just ensures it's loaded when the app starts
    console.log("Cross-tab logout system initialized");
    
    // Cleanup on unmount
    return () => {
      crossTabLogout.cleanup();
    };
  }, []);

  return (
    <>
      <div>
        <RouterProvider router={router} />
      </div>
    </>
  );
};

export default App;
