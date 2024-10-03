import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import { createRoot } from "react-dom/client";

ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')  // Make sure this matches the root element in your index.html
  );

// const container = document.getElementById("root");
// const root = createRoot(container);
// root.render(<App />);
