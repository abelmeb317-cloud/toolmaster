import { create } from "zustand";
import products from "../data/products";
import api from "../../api/axios";

const useProductStore = create((set, get) => ({
  products: products, // fallback initial products
  searchTerm: "",
  category: "all",
  filteredProducts: [],

  setSearchTerm: (value) => {
    set({ searchTerm: value });
    get().initDerived();
  },
  setCategory: (value) => {
    set({ category: value });
    get().initDerived();
  },

  fetchProducts: async () => {
    try {
      const res = await api.get("/products");
      set({ products: res.data || [] });
      get().initDerived();
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  },

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

export default useProductStore;
