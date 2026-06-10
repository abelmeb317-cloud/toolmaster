function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-3">
            <p className="text-2xl font-semibold tracking-tight text-slate-900">
              ToolMaster
            </p>
            <p className="text-sm leading-relaxed text-slate-600">
              Premium hardware for pro builders and fast-moving crews.
            </p>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-700 ring-1 ring-orange-100">
              <span
                className="h-1.5 w-1.5 rounded-full bg-orange-600"
                aria-hidden
              />
              2-day dispatch on most items
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">Shop</h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>
                <a
                  className="transition hover:text-orange-600"
                  href="/products"
                >
                  Power Tools
                </a>
              </li>
              <li>
                <a
                  className="transition hover:text-orange-600"
                  href="/products"
                >
                  Hand Tools
                </a>
              </li>
              <li>
                <a
                  className="transition hover:text-orange-600"
                  href="/products"
                >
                  Accessories
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">Support</h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>
                <a className="transition hover:text-orange-600" href="/contact">
                  Contact sales
                </a>
              </li>
              <li>
                <a
                  className="transition hover:text-orange-600"
                  href="/checkout"
                >
                  Shipping & returns
                </a>
              </li>
              <li>
                <a
                  className="transition hover:text-orange-600"
                  href="/dashboard"
                >
                  Order tracking
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-900">Newsletter</h4>
            <p className="text-sm text-slate-600">
              Get pro deals and new arrivals straight to your inbox.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2 rounded-2xl border border-slate-200 bg-white p-2">
                <input
                  className="w-full bg-transparent px-2 text-sm outline-none placeholder:text-slate-400"
                  placeholder="Email address"
                  aria-label="Email address"
                />
                <button className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600">
                  Join
                </button>
              </div>
              <p className="text-xs text-slate-500">
                By subscribing you agree to receive marketing emails.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-600">
            © 2026 ToolMaster Hardware. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <a className="transition hover:text-orange-600" href="/contact">
              Privacy
            </a>
            <a className="transition hover:text-orange-600" href="/contact">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
