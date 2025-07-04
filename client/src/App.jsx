import { RouterProvider } from "react-router-dom";
import router from "./routes.jsx";

const App = () => {
  return (
    <>
      <div>
        <RouterProvider router={router} />
      </div>
    </>
  );
};

export default App;
