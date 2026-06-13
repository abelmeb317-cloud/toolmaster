import { useEffect, useState } from "react";

import api from "../../api/axios";
import toast from "react-hot-toast";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: 0,
    stock: 0,
  });
  const [editing, setEditing] = useState(null);

  const load = (opts = {}) => {
    const nextPage = opts.page || page;
    const nextQ = typeof opts.q !== "undefined" ? opts.q : q;
    setLoading(true);
    api
      .get("/admin/products", { params: { page: nextPage, limit, q: nextQ } })
      .then((res) => {
        setProducts(res.data.data || []);
        setTotal(res.data.total || 0);
        setPage(nextPage);
        setQ(nextQ);
      })
      .catch((err) => {
        setProducts([]);
        setTotal(0);
        toast.error(
          err?.response?.data?.message ||
            "Failed to load products. Ensure server is running on port 5000.",
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load({ page: 1 });
  }, []);

  const add = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/products", form);
      setForm({ name: "", category: "", price: 0, stock: 0 });
      load({ page: 1, q: "" });
      toast.success("Product added");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Add failed");
    }
  };

  const remove = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this product?");
    if (!ok) return;

    try {
      await api.delete(`/admin/products/${id}`);
      load({ page });
      toast.success("Product deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  const startEdit = (p) => setEditing(p);
  const cancelEdit = () => setEditing(null);

  const uploadImage = async (file) => {
    const fd = new FormData();
    fd.append("image", file);
    try {
      const res = await api.post("/admin/upload", fd);
      return res.data.url;
    } catch (err) {
      toast.error("Image upload failed");
      return null;
    }
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/products/${editing.id}`, editing);
      setEditing(null);
      load({ page });
      toast.success("Product updated");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  // Suggestions
  const nameSuggestions = Array.from(
    new Set(products.map((p) => p.name)),
  ).filter(Boolean);
  const categorySuggestions = Array.from(
    new Set(products.map((p) => p.category)),
  ).filter(Boolean);

  const [showNameSuggest, setShowNameSuggest] = useState(false);
  const [showCategorySuggest, setShowCategorySuggest] = useState(false);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Products</h1>
          <div className="flex items-center gap-2">
            <input
              placeholder="Search products..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="p-2 border"
            />
            <button
              onClick={() => load({ page: 1, q })}
              className="rounded-xl bg-slate-200 px-3 py-2"
            >
              Search
            </button>
          </div>
        </div>

        <form onSubmit={add} className="mb-6 grid gap-3 sm:grid-cols-4">
          <div className="relative">
            <input
              required
              placeholder="Name"
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                setShowNameSuggest(true);
              }}
              onBlur={() => setTimeout(() => setShowNameSuggest(false), 150)}
              className="p-2 border"
            />
            {showNameSuggest && form.name && (
              <div className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded border bg-white">
                {nameSuggestions
                  .filter(
                    (s) =>
                      s.toLowerCase().includes(form.name.toLowerCase()) &&
                      s !== form.name,
                  )
                  .map((s) => (
                    <div
                      key={s}
                      onMouseDown={() => setForm({ ...form, name: s })}
                      className="cursor-pointer px-3 py-2 hover:bg-slate-100"
                    >
                      {s}
                    </div>
                  ))}
              </div>
            )}
          </div>
          <div className="relative">
            <input
              placeholder="Category"
              value={form.category}
              onChange={(e) => {
                setForm({ ...form, category: e.target.value });
                setShowCategorySuggest(true);
              }}
              onBlur={() =>
                setTimeout(() => setShowCategorySuggest(false), 150)
              }
              className="p-2 border"
            />
            {showCategorySuggest && form.category && (
              <div className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded border bg-white">
                {categorySuggestions
                  .filter(
                    (s) =>
                      s.toLowerCase().includes(form.category.toLowerCase()) &&
                      s !== form.category,
                  )
                  .map((s) => (
                    <div
                      key={s}
                      onMouseDown={() => setForm({ ...form, category: s })}
                      className="cursor-pointer px-3 py-2 hover:bg-slate-100"
                    >
                      {s}
                    </div>
                  ))}
              </div>
            )}
          </div>
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
            className="p-2 border"
          />
          <input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) =>
              setForm({ ...form, stock: Number(e.target.value) })
            }
            className="p-2 border"
          />
          <div className="sm:col-span-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                {form.image && (
                  <img
                    src={form.image}
                    alt="preview"
                    className="h-16 w-16 object-cover rounded"
                  />
                )}
                <input
                  type="file"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const url = await uploadImage(file);
                    if (url) setForm({ ...form, image: url });
                  }}
                />
              </div>

              <button className="rounded-xl bg-orange-500 px-4 py-2 text-white">
                Add Product
              </button>
            </div>
          </div>
        </form>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">birr {p.price}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(p)}
                        className="rounded px-3 py-1 bg-blue-500 text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => remove(p.id)}
                        className="rounded px-3 py-1 bg-red-500 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div>
            Page {page} of {Math.max(1, Math.ceil(total / limit))} — {total}{" "}
            items
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => page > 1 && load({ page: page - 1 })}
              className="rounded px-3 py-1 bg-slate-200"
            >
              Prev
            </button>
            <button
              onClick={() =>
                page < Math.ceil(total / limit) && load({ page: page + 1 })
              }
              className="rounded px-3 py-1 bg-slate-200"
            >
              Next
            </button>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                load({ page: 1 });
              }}
              className="p-2 border"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
      </div>

      {editing && (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
          <form onSubmit={saveEdit} className="grid gap-3 sm:grid-cols-2">
            <input
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              className="p-2 border"
            />
            <input
              value={editing.category}
              onChange={(e) =>
                setEditing({ ...editing, category: e.target.value })
              }
              className="p-2 border"
            />
            <input
              type="number"
              value={editing.price}
              onChange={(e) =>
                setEditing({ ...editing, price: Number(e.target.value) })
              }
              className="p-2 border"
            />
            <input
              type="number"
              value={editing.stock}
              onChange={(e) =>
                setEditing({ ...editing, stock: Number(e.target.value) })
              }
              className="p-2 border"
            />
            <div className="sm:col-span-2">
              <div className="mb-2">Image</div>
              <div className="flex items-center gap-3">
                {editing.image && (
                  <img
                    src={editing.image}
                    alt="preview"
                    className="h-16 w-16 object-cover rounded"
                  />
                )}
                <input
                  type="file"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const url = await uploadImage(file);
                    if (url) setEditing({ ...editing, image: url });
                  }}
                />
              </div>
            </div>

            <div className="sm:col-span-2 flex gap-2">
              <button className="rounded-xl bg-green-500 px-4 py-2 text-white">
                Save
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-xl bg-slate-200 px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Products;
