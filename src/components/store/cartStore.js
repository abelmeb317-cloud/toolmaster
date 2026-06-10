import { create } from "zustand";

const getInitialCart = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
};

const saveCart = (cart) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
};

const useCartStore = create((set) => ({
  cart: getInitialCart(),

  addToCart: (product) =>
    set((state) => {
      const exists = state.cart.find((item) => item.id === product.id);
      const cart = exists
        ? state.cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [...state.cart, { ...product, quantity: 1 }];

      saveCart(cart);
      return { cart };
    }),

  removeFromCart: (id) =>
    set((state) => {
      const cart = state.cart.filter((item) => item.id !== id);
      saveCart(cart);
      return { cart };
    }),

  increaseQty: (id) =>
    set((state) => {
      const cart = state.cart.map((item) =>
        item.id === id ? { ...item, quantity: (item.quantity ?? 1) + 1 } : item,
      );
      saveCart(cart);
      return { cart };
    }),

  decreaseQty: (id) =>
    set((state) => {
      const cart = state.cart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: (item.quantity ?? 1) - 1 }
            : item,
        )
        .filter((item) => (item.quantity ?? 1) > 0);
      saveCart(cart);
      return { cart };
    }),

  clearCart: () =>
    set(() => {
      saveCart([]);
      return { cart: [] };
    }),
}));

export default useCartStore;
