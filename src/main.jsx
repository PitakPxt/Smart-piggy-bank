import { Fragment, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthContextProvider } from "./context/AuthContext";
import { SavingProvider } from "./context/SavingContext";
import TailwindcssIndicator from "./components/TailwindcssIndicator";

createRoot(document.getElementById("root")).render(
  <Fragment>
    {/* <StrictMode> */}
    <SavingProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </SavingProvider>
    {/* </StrictMode> */}
    <TailwindcssIndicator />
  </Fragment>
);
