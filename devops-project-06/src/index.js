import React from "react";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";

import App from "./components/App";
import Credit from "./components/Credit";

const rootElement = document.getElementById("root");
createRoot(rootElement).render(
  <StrictMode>
    <App />
    <Credit />
  </StrictMode>
);
