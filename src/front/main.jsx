import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { StoreProvider } from "./hooks/useGlobalReducer";
import { BackendURL } from "./components/BackendURL";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {(!import.meta.env.VITE_BACKEND_URL ||
      import.meta.env.VITE_BACKEND_URL === "") ? (
      <BackendURL />
    ) : (
      <StoreProvider>
        <RouterProvider router={router} />
      </StoreProvider>
    )}
  </React.StrictMode>
);
