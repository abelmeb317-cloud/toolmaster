import StatCard from "../components/StatsCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const salesData = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 6000 },
  { month: "Mar", sales: 8000 },
  { month: "Apr", sales: 5000 },
  { month: "May", sales: 9000 },
];

export default function Dashboard() {
  const [counts, setCounts] = useState({
    products: 0,
    users: 0,
    orders: 0,
    revenue: "$0",
  });

  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    Promise.allSettled([
      api.get("/admin/products?limit=1&page=1"),
      api.get("/admin/users"),
      api.get("/admin/orders"),
    ])
      .then((results) => {
        if (!mounted) return;
        const prodTotal =
          results[0].status === "fulfilled" ? results[0].value.data.total : 0;
        const users =
          results[1].status === "fulfilled" ? results[1].value.data.length : 0;
        const orders =
          results[2].status === "fulfilled" ? results[2].value.data.length : 0;
        const revenue =
          results[2].status === "fulfilled"
            ? results[2].value.data.reduce((s, o) => s + (o.total || 0), 0)
            : 0;

        setCounts({
          products: prodTotal,
          users,
          orders,
          revenue: `birr ${revenue}`,
        });
      })
      .catch(() => {
        /* ignore */
      });

    return () => (mounted = false);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Products"
          value={String(counts.products)}
          orange
          onClick={() => navigate("/admin/products")}
        />
        <StatCard
          title="Orders"
          value={String(counts.orders)}
          onClick={() => navigate("/admin/orders")}
        />
        <StatCard
          title="Customers"
          value={String(counts.users)}
          onClick={() => navigate("/admin/customers")}
        />
        <StatCard title="Revenue" value={counts.revenue} />
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Sales Analytics</h2>

        <ResponsiveContainer width="100%" height={350}>
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
    </div>
  );
}
