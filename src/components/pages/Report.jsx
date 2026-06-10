import { useMemo } from "react";
import useProductStore from "../store/productStore";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";

function Report() {
  const products = useProductStore((s) => s.products);

  // 📊 REPORT CALCULATION (ONLY DATA)
  const report = useMemo(() => {
    const list = Array.isArray(products) ? products : [];

    const totalProducts = list.length;

    const totalValue = list.reduce((sum, p) => sum + (Number(p.price) || 0), 0);

    const avgPrice = totalProducts ? totalValue / totalProducts : 0;

    const highest = [...list].sort(
      (a, b) => (Number(b.price) || 0) - (Number(a.price) || 0),
    )[0];

    const lowest = [...list].sort(
      (a, b) => (Number(a.price) || 0) - (Number(b.price) || 0),
    )[0];

    return {
      totalProducts,
      totalValue,
      avgPrice,
      highest,
      lowest,
    };
  }, [products]);

  // 📄 PDF EXPORT FUNCTION
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("ToolMaster Inventory Report", 20, 20);

    doc.setFontSize(12);

    doc.text(`Total Products: ${report.totalProducts}`, 20, 40);
    doc.text(`Total Value: $${report.totalValue.toFixed(0)}`, 20, 50);
    doc.text(`Average Price: $${report.avgPrice.toFixed(0)}`, 20, 60);

    doc.text(
      `Price Range: ${
        report.lowest ? `$${report.lowest.price}` : "$0"
      } - ${report.highest ? `$${report.highest.price}` : "$0"}`,
      20,
      70,
    );

    let y = 90;

    doc.text("Product Breakdown:", 20, y);
    y += 10;

    products.forEach((p) => {
      doc.text(`${p.name} - $${Number(p.price || 0).toFixed(0)}`, 20, y);
      y += 8;
    });

    doc.save("inventory-report.pdf");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-slate-800">Inventory Report</h1>

        <p className="mt-2 text-slate-500">
          Full analytics overview of ToolMaster stock and pricing
        </p>

        {/* BUTTONS */}
        <div className="flex justify-end mt-4">
          <Link
            to="/dashboard"
            className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-3 font-semibold text-white shadow-md hover:from-orange-600 hover:to-orange-800 hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            Dashboard
          </Link>
          <button
            onClick={exportPDF}
            className="rounded-xl bg-orange-800 px-5 py-3 font-semibold text-white hover:bg-gray-900 ml-3 hover:scale-105 transition-transform duration-200"
          >
            Export PDF
          </button>
        </div>

        {/* SUMMARY */}
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-slate-500">Total Products</p>
            <h2 className="text-3xl font-bold text-orange-500">
              {report.totalProducts}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-slate-500">Total Inventory Value</p>
            <h2 className="text-3xl font-bold text-orange-500">
              birr{report.totalValue.toFixed(0)}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-slate-500">Average Price</p>
            <h2 className="text-3xl font-bold text-orange-500">
              birr{report.avgPrice.toFixed(0)}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <p className="text-slate-500">Price Range</p>
            <h2 className="text-xl font-bold text-orange-500">
              {report.lowest ? `birr${report.lowest.price}` : "birr 0"} -{" "}
              {report.highest ? `birr${report.highest.price}` : "birr 0"}
            </h2>
          </div>
        </div>

        {/* PRODUCT LIST */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Product Breakdown</h2>

          {report.totalProducts === 0 ? (
            <p className="text-slate-500">No products available.</p>
          ) : (
            <div className="space-y-3">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <span className="text-slate-700">{p.name}</span>
                  <span className="font-bold text-orange-500">
                    birr {Number(p.price || 0).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Report;
