import { useEffect, useRef, useState } from "react";

import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import useCartStore from "../store/cartStore";

function MobileMenu() {
  const [open, setOpen] = useState(false);
  const toggleBtnRef = useRef(null);
  const firstLinkRef = useRef(null);

  const cartCount = useCartStore((state) =>
    state.cart.reduce((total, item) => total + (item.quantity ?? 0), 0),
  );

  useEffect(() => {
    if (!open) return;

    const t = window.setTimeout(() => {
      firstLinkRef.current?.focus();
    }, 0);

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (open) return;
    toggleBtnRef.current?.focus();
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={toggleBtnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:border-orange-300"
      >
        {open ? <FaTimes /> : <FaBars />}
      </button>

      {open && (
        <div
          id="mobile-menu"
          role="menu"
          aria-label="Mobile menu"
          tabIndex={-1}
          className="absolute right-0 top-14 z-40 w-52 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl"
        >
          <div className="sr-only">Menu</div>

          <Link
            ref={firstLinkRef}
            to="/"
            onClick={() => setOpen(false)}
            className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-orange-50"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setOpen(false)}
            className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-orange-50"
          >
            Products
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setOpen(false)}
            className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-orange-50"
          >
            Dashboard
          </Link>
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-orange-50"
          >
            Contact
          </Link>
          <Link
            to="/cart"
            onClick={() => setOpen(false)}
            className="mt-3 inline-flex items-center justify-between rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-white"
          >
            Cart
            <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs text-orange-600">
              {cartCount}
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}

export default MobileMenu;
