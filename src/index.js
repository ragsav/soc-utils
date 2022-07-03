import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "antd/dist/antd.css";
import reportWebVitals from "./reportWebVitals";
import VirusTotalFileCheck from "./pages/virusTotal/virusTotalFileCheck";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <VirusTotalFileCheck />
  </React.StrictMode>
);

reportWebVitals();
