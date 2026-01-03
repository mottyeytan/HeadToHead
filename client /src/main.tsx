import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { AppRouter } from "./global/router/router/Router";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
