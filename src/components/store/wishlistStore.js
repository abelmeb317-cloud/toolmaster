import { create } from "zustand";

const useWishlistStore = create((set) => ({
  wishlist: [],

  toggleWishlist: (product) =>
    set((state) => {
      const exists = state.wishlist.find((p) => p.id === product.id);

      return {
        wishlist: exists
          ? state.wishlist.filter((p) => p.id !== product.id)
          : [...state.wishlist, product],
      };
    }),
}));

export default useWishlistStore;
