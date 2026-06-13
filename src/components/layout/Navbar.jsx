import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import useCartStore from "../store/cartStore";
import MobileMenu from "./MobileMenu";
import { useEffect, useState } from "react";
import { authStore } from "../store/authStore";

function Navbar() {
  const cartCount = useCartStore((state) =>
    state.cart.reduce((total, item) => total + (item.quantity ?? 0), 0),
  );
  const [auth, setAuth] = useState(authStore.get());
  const navigate = useNavigate();

  useEffect(() => {
    function onStorage() {
      setAuth(authStore.get());
    }

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 text-2xl font-semibold tracking-tight text-slate-900"
        >
          <span className="inline-flex h-12 w-12 items-center justify-start rounded-full bg-orange-50 text-orange-300 ring-2 ring-orange-100 transition group-hover:bg-orange-100">
            <FaShoppingCart className="opacity-1 " />
            <span className="text-xl font-bold text-orange-500 px-2">TM</span>
          </span>
          ToolMaster
        </Link>

        <nav className="hidden items-center gap-8 text-base font-medium text-slate-700 md:flex">
          {[
            { to: "/", label: "Home" },
            { to: "/products", label: "Products" },
            { to: "/dashboard", label: "Dashboard" },
            { to: "/contact", label: "Contact" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `relative pb-1 transition ${
                  isActive
                    ? "text-orange-600 font-semibold border-b-2 border-orange-500"
                    : "text-slate-700 hover:text-orange-600"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            <FaShoppingCart />
            <span className="hidden sm:inline">Cart</span>
            <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs text-white">
              {cartCount}
            </span>
          </Link>

          {/* Admin quick link */}
          {auth?.role === "ADMIN" && (
            <button
              onClick={() => navigate("/admin")}
              className="hidden md:inline-flex items-center gap-2 rounded-full border border-orange-500 bg-white px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm transition hover:bg-orange-50"
            >
              Admin
            </button>
          )}

          {/* Login / Logout + username */}
          {auth?.token ? (
            <div className="hidden md:flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-slate-100 text-sm font-medium text-slate-800">
                {auth?.username}
              </span>
              <button
                onClick={() => {
                  authStore.logout();
                  setAuth(null);
                  navigate("/");
                }}
                className="inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-orange-300 hover:text-orange-600"
            >
              Login
            </Link>
          )}
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
