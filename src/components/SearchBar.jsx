import useProductStore from "./store/productStore";

function SearchBar() {
  const setSearch = useProductStore((s) => s.setSearchTerm);

  return (
    <div>
      <label className="sr-only" htmlFor="product-search">
        Search products
      </label>
      <input
        id="product-search"
        type="text"
        placeholder="Search products..."
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
      />
    </div>
  );
}

export default SearchBar;
