import { useEffect, useState } from "react";
import api from "../../api/axios";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api
      .get("/admin/orders")
      .then((res) => {
        if (!mounted) return;
        setOrders(res.data || []);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
    return () => (mounted = false);
  }, []);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-2xl font-bold">Orders</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Items</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Total</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b">
                <td className="p-3">#{o.id}</td>
                <td className="p-3">
                  {o.items?.map((it) => it.name).join(", ")}
                </td>
                <td className="p-3">
                  {new Date(o.createdAt).toLocaleString()}
                </td>
                <td className="p-3">birr {o.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Orders;
