module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 10px 30px rgba(15, 23, 42, 0.06)",
        elevated: "0 20px 60px rgba(2, 6, 23, 0.12)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      colors: {
        brand: {
          orange: "#f97316",
          slate: "#0f172a",
        },
      },
    },
  },
  plugins: [],
};
