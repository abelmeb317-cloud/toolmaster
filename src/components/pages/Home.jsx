import { Link, useNavigate } from "react-router-dom";
import { FaBoxOpen, FaTruck, FaWrench, FaShieldAlt } from "react-icons/fa";
import products from "../data/products";
import ProductCard from "../features/ProductCard";
import BenefitCard from "../sections/BenefitCard";
import PremiumSectionHeader from "../sections/PremiumSectionHeader";
import TrustedCompaniesStrip from "../sections/TrustedCompaniesStrip";
import { authStore } from "../store/authStore";

function Home() {
  const categories = Array.from(new Set(products.map((p) => p.category))).slice(
    0,
    6,
  );

  const featured = products.slice(0, 3);
  const bestSellers = products.slice(1, 5);
  const navigate = useNavigate();

  return (
    <div className="bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))]  from-orange-50 via-white to-slate-50 pb-16">
      {/* HERO */}
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-40%] h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-b from-orange-200/50 to-transparent blur-2xl" />
          <div className="absolute -left-24 top-40 h-72 w-72 rounded-full bg-orange-200/30 blur-2xl" />
        </div>

        <section className="mx-auto  flex max-w-7xl flex-col gap-1 px-2 py-14 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-3 ">
              <p className="uppercase tracking-[0.3em] text-xs font-semibold text-orange-600">
                Contractor-ready
              </p>
              <span
                className="h-1 w-1 rounded-full bg-orange-600"
                aria-hidden
              />
              <p className="text-xs font-medium text-slate-600">
                Fast shipping • Real support
              </p>
            </div>

            <h1 className="mt-5 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Build faster, safer,
              <span className="text-orange-600"> smarter</span>.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600">
              Premium construction gear, pro tools, and site supplies in one
              modern storefront—designed for crews that move.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-full bg-orange-500 px-7 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Shop now
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-3 text-sm font-semibold text-slate-900 transition hover:border-orange-300 hover:text-orange-600"
              >
                Get a quote
              </Link>
              {/* Admin dashboard quick access when signed in as admin */}
              {authStore.get()?.role === "ADMIN" && (
                <button
                  onClick={() => navigate("/admin")}
                  className="inline-flex items-center justify-center rounded-full border border-orange-500 bg-white px-7 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
                >
                  Admin Dashboard
                </button>
              )}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="flex items-center gap-2 rounded-2xl bg-white/70 px-3 py-2 shadow-sm ring-1 ring-slate-200/70">
                <FaTruck className="text-orange-600" />
                <p className="text-xs font-semibold text-slate-900">
                  2-day delivery
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-white/70 px-3 py-2 shadow-sm ring-1 ring-slate-200/70">
                <FaShieldAlt className="text-orange-600" />
                <p className="text-xs font-semibold text-slate-900">
                  Warranty-backed
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-white/70 px-3 py-2 shadow-sm ring-1 ring-slate-200/70">
                <FaWrench className="text-orange-600" />
                <p className="text-xs font-semibold text-slate-900">
                  Pro-grade picks
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-white/70 px-3 py-2 shadow-sm ring-1 ring-slate-200/70">
                <FaBoxOpen className="text-orange-600" />
                <p className="text-xs font-semibold text-slate-900">
                  Bulk friendly
                </p>
              </div>
            </div>
          </div>

          <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
            {featured.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-64 w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                </div>
                <div className="space-y-2 p-5">
                  <p className="text-xs uppercase tracking-[0.35em] text-orange-600">
                    {product.category}
                  </p>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {product.name}
                  </h2>
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {product.description}
                  </p>
                  <p className="mt-3 text-lg font-bold text-slate-900">
                    birr {product.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* CATEGORIES */}
      <section className="mx-auto mt-8 max-w-7xl px-4">
        <PremiumSectionHeader
          eyebrow="Shop by department"
          title="Everything you need for the job"
          description="From power tools to safety essentials—find the right gear fast."
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, idx) => (
            <Link
              key={c}
              to="/products"
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-100 opacity-60 blur-xl transition group-hover:opacity-100" />
              <div className="relative">
                <p className="text-xs uppercase tracking-[0.35em] text-orange-600">
                  Department
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">
                  {c}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Explore {c.toLowerCase()} collection #{idx + 1}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="mx-auto mt-14 max-w-7xl px-4">
        <PremiumSectionHeader
          eyebrow="Why crews choose ToolMaster"
          title="Premium service, pro-grade sourcing"
          description="Designed for speed—from first click to jobsite delivery."
        />

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <BenefitCard
            icon={<FaTruck className="text-xl" />}
            title="Fast delivery"
            description="Trackable shipping with priority options for urgent jobs."
          />
          <BenefitCard
            icon={<FaShieldAlt className="text-xl" />}
            title="Warranty support"
            description="Product-backed coverage and hassle-free help when you need it."
          />
          <BenefitCard
            icon={<FaWrench className="text-xl" />}
            title="Pro selections"
            description="Curated tools that perform in tough conditions."
          />
          <BenefitCard
            icon={<FaBoxOpen className="text-xl" />}
            title="Bulk-ready"
            description="Simple checkout for projects, teams, and recurring orders."
          />
        </div>
      </section>

      {/* TRUST */}
      <section className="mx-auto mt-14 max-w-7xl px-4">
        <TrustedCompaniesStrip />
      </section>

      {/* BEST SELLERS */}
      <section className="mx-auto mt-14 max-w-7xl px-4">
        <PremiumSectionHeader
          eyebrow="Best sellers"
          title="Top rated tools right now"
          description="Quick add items that are popular with builders and DIY pros."
        />

        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
