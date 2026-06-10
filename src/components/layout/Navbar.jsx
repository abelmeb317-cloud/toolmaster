import { Link, NavLink } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import useCartStore from "../store/cartStore";
import MobileMenu from "./MobileMenu";

function Navbar() {
  const cartCount = useCartStore((state) =>
    state.cart.reduce((total, item) => total + (item.quantity ?? 0), 0),
  );

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

          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
