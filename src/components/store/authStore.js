// src/store/authStore.js
const AUTH_KEY = "auth";

export const authStore = {
  set(data) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
  },

  get() {
    return JSON.parse(localStorage.getItem(AUTH_KEY));
  },

  logout() {
    localStorage.removeItem(AUTH_KEY);
  },
};
