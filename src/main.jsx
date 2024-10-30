import { Fragment, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthContextProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <Fragment>
    {/* <StrictMode> */}
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
    {/* </StrictMode> */}
  </Fragment>
);
