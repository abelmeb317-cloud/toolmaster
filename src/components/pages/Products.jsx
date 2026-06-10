import { useMemo } from "react";
import ProductCard from "../features/ProductCard";
import SearchBar from "../SearchBar";
import FilterBar from "../FilterBar";
import useProductStore from "../store/productStore";

function Products() {
  const products = useProductStore((state) => state.filteredProducts);
  const searchTerm = useProductStore((state) => state.searchTerm);
  const category = useProductStore((state) => state.category);

  const heading = useMemo(() => {
    if (searchTerm) return `Search results for "${searchTerm}"`;
    if (category !== "all") return `Category: ${category}`;
    return "All products";
  }, [category, searchTerm]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-8 rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{heading}</h1>
            <p className="mt-2 text-slate-600">
              Browse premium hardware, accessories, and pro-grade equipment.
            </p>
          </div>
          <SearchBar />
        </div>
        <div className="mt-6">
          <FilterBar />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Products;
