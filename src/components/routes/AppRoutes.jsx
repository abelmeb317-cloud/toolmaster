import { Routes, Route } from "react-router-dom";
import ProductDetails from "../pages/ProductDetails";
import Home from "../pages/Home";
import Products from "../pages/Products";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Dashboard from "../pages/Dashboard";
import Contact from "../pages/Contact";
import Report from "../pages/Report";
<<<<<<< HEAD
=======
import AdminLayout from "../../admin/layouts/AdminLayout";
import AdminDashboard from "../../admin/pages/Dashboard";
import AdminProducts from "../../admin/pages/Products";
import Orders from "../../admin/pages/Orders";
import Customers from "../../admin/pages/Customers";
import Inventory from "../../admin/pages/Inventory";
import Settings from "../../admin/pages/Settings";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

import ProtectedAdminRoute from "../ProtectedAdminRoute";
>>>>>>> 82ba93c (Add GitHub Pages deployment)

function AppRoutes() {
  return (
    <Routes>
<<<<<<< HEAD
=======
      {/* Website */}
>>>>>>> 82ba93c (Add GitHub Pages deployment)
      <Route path="/" element={<Home />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/products" element={<Products />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/report" element={<Report />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<Home />} />
<<<<<<< HEAD
=======
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<Orders />} />
        <Route path="customers" element={<Customers />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="settings" element={<Settings />} />
      </Route>
>>>>>>> 82ba93c (Add GitHub Pages deployment)
    </Routes>
  );
}

export default AppRoutes;
