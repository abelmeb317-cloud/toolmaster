// src/store/authStore.js
const AUTH_KEY = "auth";

export const authStore = {
  set(data) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event("storage"));
  },

  get() {
    return JSON.parse(localStorage.getItem(AUTH_KEY));
  },

  logout() {
    localStorage.removeItem(AUTH_KEY);
    window.dispatchEvent(new Event("storage"));
  },
};
