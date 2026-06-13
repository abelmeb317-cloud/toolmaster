import { create } from "zustand";

const useThemeStore = create((set) => ({
  dark: false,

  toggleTheme: () => set((state) => ({ dark: !state.dark })),
}));

export default useThemeStore;
