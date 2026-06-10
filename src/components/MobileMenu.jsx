import { useState } from "react";

import { FaBars, FaTimes } from "react-icons/fa";

import { Link } from "react-router-dom";

function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu-duplicate"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:border-orange-300"
      >
        {open ? <FaTimes /> : <FaBars />}
      </button>

      {open && (
        <div
          id="mobile-menu-duplicate"
          role="navigation"
          aria-label="Mobile menu"
          className="absolute top-16 right-4 z-40 w-40 rounded-xl border border-slate-200 bg-white shadow-lg p-4 flex flex-col gap-3"
        >
          <Link to="/" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link to="/products" onClick={() => setOpen(false)}>
            Products
          </Link>
          <Link to="/dashboard" onClick={() => setOpen(false)}>
            Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}

export default MobileMenu;
