function TrustedCompaniesStrip() {
  const items = [
    { name: "ProBuild" },
    { name: "IronWorks" },
    { name: "GridLine" },
    { name: "SafeBond" },
    { name: "SteelStar" },
    { name: "CopperCore" },
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Trusted by teams building every day
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Fast shipping, real support, and pro-grade products.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {items.map((it) => (
            <div
              key={it.name}
              className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-2"
            >
              <span className="text-sm font-semibold text-slate-700">
                {it.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TrustedCompaniesStrip;
