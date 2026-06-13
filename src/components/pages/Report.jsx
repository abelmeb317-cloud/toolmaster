import { useMemo, useEffect, useState } from "react";
import useProductStore from "../store/productStore";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import api from "../../api/axios";

function Report() {
  const products = useProductStore((s) => s.products);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.allSettled([
      api.get("/admin/orders"),
      api.get("/admin/users")
    ]).then(([ordersRes, usersRes]) => {
      if (!mounted) return;
      if (ordersRes.status === "fulfilled") {
        setOrders(ordersRes.value.data || []);
      }
      if (usersRes.status === "fulfilled") {
        setUsers(usersRes.value.data || []);
      }
      setLoadingStats(false);
    }).catch(err => {
      console.error(err);
      if (mounted) setLoadingStats(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  // 📊 INVENTORY STATS
  const inventoryReport = useMemo(() => {
    const list = Array.isArray(products) ? products : [];
    const totalProducts = list.length;
    const totalValue = list.reduce((sum, p) => sum + (Number(p.price) * (Number(p.stock) || 0)), 0);
    const avgPrice = totalProducts ? list.reduce((sum, p) => sum + (Number(p.price) || 0), 0) / totalProducts : 0;
    const highest = [...list].sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0))[0];
    const lowest = [...list].sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0))[0];

    return {
      totalProducts,
      totalValue,
      avgPrice,
      highest,
      lowest,
    };
  }, [products]);

  // 💰 USER SPENDING STATS (USER INCOME)
  const userIncomeReport = useMemo(() => {
    const spendingMap = {};
    orders.forEach((order) => {
      const user = order.username || "Guest";
      spendingMap[user] = (spendingMap[user] || 0) + (Number(order.total) || 0);
    });
    return Object.entries(spendingMap)
      .map(([username, totalSpent]) => ({ username, totalSpent }))
      .sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  // 📈 PRODUCT SALES STATS
  const productSalesReport = useMemo(() => {
    const salesMap = {};
    orders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const key = item.name || "Unknown Product";
        const qty = Number(item.quantity) || 1;
        const price = Number(item.price) || 0;
        if (!salesMap[key]) {
          salesMap[key] = { qty: 0, revenue: 0 };
        }
        salesMap[key].qty += qty;
        salesMap[key].revenue += qty * price;
      });
    });
    return Object.entries(salesMap)
      .map(([name, data]) => ({ name, qty: data.qty, revenue: data.revenue }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [orders]);

  // 💰 GENERAL SALES SUMMARY
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  }, [orders]);

  const avgOrderValue = useMemo(() => {
    return orders.length ? totalRevenue / orders.length : 0;
  }, [orders, totalRevenue]);

  // 📄 PDF EXPORT FUNCTION
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("ToolMaster Premium Analytics & Sales Report", 20, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 26);

    doc.setDrawColor(220, 220, 220);
    doc.line(20, 30, 190, 30);

    // Section 1: Financial & Inventory Overview
    doc.setFontSize(14);
    doc.text("1. Executive Summary", 20, 40);
    doc.setFontSize(11);
    doc.text(`Total Sales Revenue: birr ${totalRevenue.toFixed(2)}`, 25, 48);
    doc.text(`Total Orders Placed: ${orders.length}`, 25, 54);
    doc.text(`Average Order Value: birr ${avgOrderValue.toFixed(2)}`, 25, 60);
    doc.text(`Total Unique Products: ${inventoryReport.totalProducts}`, 25, 66);
    doc.text(`Estimated Stock Value: birr ${inventoryReport.totalValue.toFixed(2)}`, 25, 72);

    // Section 2: Top Selling Products
    let y = 85;
    doc.setFontSize(14);
    doc.text("2. Product Sales Performance", 20, y);
    doc.setFontSize(11);
    y += 8;
    doc.text("Product Name", 25, y);
    doc.text("Qty Sold", 130, y);
    doc.text("Revenue", 160, y);
    y += 2;
    doc.line(20, y, 190, y);
    y += 6;

    productSalesReport.slice(0, 10).forEach((item) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(item.name.substring(0, 40), 25, y);
      doc.text(String(item.qty), 130, y);
      doc.text(`birr ${item.revenue.toFixed(2)}`, 160, y);
      y += 7;
    });

    // Section 3: Customer Revenue Breakdown
    y += 10;
    if (y > 240) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(14);
    doc.text("3. Customer Spending & User Revenue", 20, y);
    doc.setFontSize(11);
    y += 8;
    doc.text("Username", 25, y);
    doc.text("Total Spent / Contribution", 130, y);
    y += 2;
    doc.line(20, y, 190, y);
    y += 6;

    userIncomeReport.forEach((user) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(user.username, 25, y);
      doc.text(`birr ${user.totalSpent.toFixed(2)}`, 130, y);
      y += 7;
    });

    doc.save("ToolMaster-Comprehensive-Analytics.pdf");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
              Premium Analytics Report
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Real-time snapshot of sales revenue, product performance, and user income analysis.
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4 gap-3">
            <Link
              to="/admin"
              className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-xl shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition"
            >
              Back to Dashboard
            </Link>
            <button
              onClick={exportPDF}
              className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 transition"
            >
              Export Comprehensive PDF
            </button>
          </div>
        </div>

        {/* OVERVIEW STATS GRID */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Sales Revenue</p>
            <h2 className="text-3xl font-extrabold text-orange-600 mt-2">
              birr {totalRevenue.toFixed(2)}
            </h2>
            <p className="text-xs text-slate-400 mt-1">From {orders.length} total orders</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Order Value</p>
            <h2 className="text-3xl font-extrabold text-orange-600 mt-2">
              birr {avgOrderValue.toFixed(2)}
            </h2>
            <p className="text-xs text-slate-400 mt-1">Per transaction average</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Inventory Value</p>
            <h2 className="text-3xl font-extrabold text-orange-600 mt-2">
              birr {inventoryReport.totalValue.toFixed(2)}
            </h2>
            <p className="text-xs text-slate-400 mt-1">Stocked value of {inventoryReport.totalProducts} products</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Item Price</p>
            <h2 className="text-3xl font-extrabold text-orange-600 mt-2">
              birr {inventoryReport.avgPrice.toFixed(2)}
            </h2>
            <p className="text-xs text-slate-400 mt-1">Across catalog items</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 mb-8">
          {/* PRODUCT SALES PERFORMANCE */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">
              Product Sales Performance
            </h3>
            {productSalesReport.length === 0 ? (
              <p className="text-sm text-slate-500 py-4">No product sales recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead>
                    <tr>
                      <th className="text-left py-2 text-xs font-semibold text-slate-400 uppercase">Product</th>
                      <th className="text-center py-2 text-xs font-semibold text-slate-400 uppercase">Qty Sold</th>
                      <th className="text-right py-2 text-xs font-semibold text-slate-400 uppercase">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {productSalesReport.map((item) => (
                      <tr key={item.name}>
                        <td className="py-3 text-sm font-medium text-slate-800">{item.name}</td>
                        <td className="py-3 text-center text-sm text-slate-500">{item.qty}</td>
                        <td className="py-3 text-right text-sm font-semibold text-orange-600">birr {item.revenue.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* CUSTOMER INCOME & SPENDING REPORT */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">
              Customer Spending & Income Generated
            </h3>
            {userIncomeReport.length === 0 ? (
              <p className="text-sm text-slate-500 py-4">No customer purchases recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead>
                    <tr>
                      <th className="text-left py-2 text-xs font-semibold text-slate-400 uppercase">Customer</th>
                      <th className="text-right py-2 text-xs font-semibold text-slate-400 uppercase">Total Spent / Generated Income</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {userIncomeReport.map((user) => (
                      <tr key={user.username}>
                        <td className="py-3 text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <span className="h-6 w-6 rounded-full bg-slate-100 text-xs flex items-center justify-center font-bold text-slate-500">
                            {user.username[0].toUpperCase()}
                          </span>
                          {user.username}
                        </td>
                        <td className="py-3 text-right text-sm font-bold text-slate-900">birr {user.totalSpent.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* DETAILED INVENTORY OVERVIEW */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">
            Detailed Inventory Breakdown
          </h3>
          {products.length === 0 ? (
            <p className="text-sm text-slate-500 py-4">No products in inventory.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead>
                  <tr>
                    <th className="text-left py-2 text-xs font-semibold text-slate-400 uppercase">Product</th>
                    <th className="text-left py-2 text-xs font-semibold text-slate-400 uppercase">Category</th>
                    <th className="text-center py-2 text-xs font-semibold text-slate-400 uppercase">Price</th>
                    <th className="text-center py-2 text-xs font-semibold text-slate-400 uppercase">Stock Level</th>
                    <th className="text-right py-2 text-xs font-semibold text-slate-400 uppercase">Stock Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td className="py-3 text-sm font-semibold text-slate-800">{p.name}</td>
                      <td className="py-3 text-sm text-slate-500">{p.category}</td>
                      <td className="py-3 text-center text-sm text-slate-700">birr {Number(p.price || 0).toFixed(2)}</td>
                      <td className="py-3 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          (p.stock ?? 0) < 10 
                            ? "bg-red-50 text-red-700" 
                            : (p.stock ?? 0) < 30 
                              ? "bg-yellow-50 text-yellow-700" 
                              : "bg-green-50 text-green-700"
                        }`}>
                          {p.stock ?? 0} left
                        </span>
                      </td>
                      <td className="py-3 text-right text-sm font-semibold text-slate-900">
                        birr {(Number(p.price || 0) * Number(p.stock || 0)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Report;
