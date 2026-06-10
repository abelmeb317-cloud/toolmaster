import { create } from "zustand";
import products from "../data/products";

const useProductStore = create((set, get) => ({
  products,
  searchTerm: "",
  category: "all",

  setSearchTerm: (value) => set({ searchTerm: value }),
  setCategory: (value) => set({ category: value }),

  filteredProducts: [],

  initDerived: () => {
    const { products, searchTerm, category } = get();
    const filtered = products.filter((p) => {
      const matchSearch = p.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchCategory = category === "all" || p.category === category;
      return matchSearch && matchCategory;
    });
    set({ filteredProducts: filtered });
  },
}));

// Initialize once on module load (client-side)
useProductStore.getState().initDerived();

// Recompute derived state whenever inputs change
const originalSetSearchTerm = useProductStore.getState().setSearchTerm;
const originalSetCategory = useProductStore.getState().setCategory;

useProductStore.setState({
  setSearchTerm: (value) => {
    originalSetSearchTerm(value);
    useProductStore.getState().initDerived();
  },
  setCategory: (value) => {
    originalSetCategory(value);
    useProductStore.getState().initDerived();
  },
});

export default useProductStore;
