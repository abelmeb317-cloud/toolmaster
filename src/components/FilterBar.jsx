import useProductStore from "./store/productStore";

function FilterBar() {
  const setCategory = useProductStore((s) => s.setCategory);

  return (
    <div className="flex items-center gap-3">
      <label className="sr-only" htmlFor="product-category">
        Filter by category
      </label>
      <select
        id="product-category"
        onChange={(e) => setCategory(e.target.value)}
        className="rounded-2xl border border-slate-500 bg-white px-2 py-2 text-slate-800 shadow-md transition hover:border-orange-400 hover:shadow-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
      >
        <option value="all">All</option>
        <option value="Power Tools">Power Tools</option>
        <option value="Hand Tools">Hand Tools</option>
        <option value="Accessories">Accessories</option>
        <option value="Safety">Safety</option>
      </select>
    </div>
  );
}

export default FilterBar;
