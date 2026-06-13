import ReactDOM from "react-dom/client";
<<<<<<< HEAD
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
=======
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
>>>>>>> 82ba93c (Add GitHub Pages deployment)
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
<<<<<<< HEAD
    <Toaster />
=======
    <Toaster position="top-right" />
>>>>>>> 82ba93c (Add GitHub Pages deployment)
    <App />
  </BrowserRouter>,
);
