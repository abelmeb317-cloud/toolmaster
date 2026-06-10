import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useMemo } from "react";
import useProductStore from "../store/productStore";

import { Link } from "react-router-dom";
function Dashboard() {
  const products = useProductStore((s) => s.products);

  const stats = useMemo(() => {
    const totalProducts = Array.isArray(products) ? products.length : 0;

    // Revenue is approximated using only price (no order/sales/stock exists in current product model)
    const revenue = (Array.isArray(products) ? products : []).reduce(
      (sum, p) => sum + (Number(p.price) || 0),
      0,
    );

    return {
      totalProducts,
      orders: 0,
      revenue,
      lowStock: 0,
    };
  }, [products]);

  const salesData = useMemo(() => {
    // Deterministic monthly series derived from current prices.
    const base = Math.max(stats.revenue / 5, 0);
    const multipliers = [0.25, 0.5, 0.35, 0.7, 1];
    const months = ["Jan", "Feb", "Mar", "Apr", "May"];
    return months.map((month, i) => ({
      month,
      sales: Math.round(base * multipliers[i]),
    }));
  }, [stats.revenue]);

  const featuredProduct = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return null;
    return [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
  }, [products]);

  const recentProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return [...products].slice(0, 4);
  }, [products]);

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-500">ToolMaster Hardware Overview</p>
          </div>
          <Link
            to="/report"
            className="rounded-xl bg-orange-400 px-5 py-3 font-semibold text-white hover:bg-orange-600"
          >
            Report
          </Link>
        </div>
        {/* Stats Cards */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-orange-500 p-6 text-white shadow-md">
            <p>Total Products</p>
            <h2 className="mt-2 text-4xl font-bold">{stats.totalProducts}</h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <p className="text-slate-500">Orders</p>
            <h2 className="mt-2 text-4xl font-bold text-orange-500">
              {stats.orders}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <p className="text-slate-500">Revenue</p>
            <h2 className="mt-2 text-4xl font-bold text-orange-500">
              birr {stats.revenue.toFixed(0)}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <p className="text-slate-500">Low Stock</p>
            <h2 className="mt-2 text-4xl font-bold text-orange-500">
              {stats.lowStock}
            </h2>
          </div>
        </div>
        {/* Chart */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-slate-800">
            Monthly Sales
          </h2>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={salesData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="sales"
                stroke="#f97316"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Bottom Grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Product List */}
          <div className="rounded-2xl bg-white p-6 shadow-md lg:col-span-2">
            <h2 className="mb-4 text-xl font-semibold">Recent Products</h2>

            <div className="space-y-4">
              {recentProducts.length === 0 ? (
                <p className="text-slate-500">No products available.</p>
              ) : (
                recentProducts.map((p, idx) => (
                  <div
                    key={p.id}
                    className={
                      "flex items-center justify-between " +
                      (idx !== recentProducts.length - 1 ? "border-b pb-3" : "")
                    }
                  >
                    <span>{p.name}</span>
                    <span className="font-bold text-orange-500">
                      birr {Number(p.price || 0).toFixed(0)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Featured Product */}
          <div className="rounded-2xl bg-orange-500 p-6 text-white shadow-md">
            <h2 className="text-xl font-semibold">Featured Product</h2>

            {featuredProduct ? (
              <>
                <div className="mt-4 rounded-xl bg-orange-280 p-4">
                  <img
                    src={featuredProduct.image}
                    alt={featuredProduct.name}
                    className="h-48 w-full rounded-lg object-cover"
                  />
                </div>

                <h3 className="mt-4 text-2xl font-bold">
                  {featuredProduct.name}
                </h3>
                <p className="mt-2 text-orange-100">
                  {featuredProduct.description}
                </p>
                <p className="mt-4 text-3xl font-bold">
                  birr{Number(featuredProduct.price || 0).toFixed(0)}
                </p>

                <Link
                  to="/products"
                  className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-white py-3 font-semibold text-orange-500 shadow-sm hover:bg-orange-50 hover:shadow-md transition-all duration-200"
                >
                  View Product
                </Link>
              </>
            ) : (
              <p className="mt-4 text-orange-100">
                No featured product available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
