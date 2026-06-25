import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { ProgressProvider } from "./context/ProgressContext";
import { FormProvider } from "./context/FormProvider";
import "./styles/global.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ProgressProvider>
        <FormProvider>
          <App />
        </FormProvider>
      </ProgressProvider>
    </BrowserRouter>
  </React.StrictMode>
);