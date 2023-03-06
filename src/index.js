import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import userAuthStorage from "./utils/userAuthStorage";
import AuthContextProvider from "./contexts/AuthContext";
import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const app = ReactDOM.createRoot(document.getElementById("root"));
app.render(
  <React.StrictMode>
    <AuthContextProvider userAuthStorage={userAuthStorage}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
