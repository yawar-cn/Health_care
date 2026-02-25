/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b1220",
        stone: "#f6f4f1",
        frost: "#eef2f5",
        ocean: "#1f7a8c",
        mint: "#62c4b8",
        dusk: "#4a5878",
        sun: "#f5b465",
        blush: "#f08a7c"
      },
      fontFamily: {
        display: ["Outfit", "ui-sans-serif", "system-ui"],
        sans: ["Manrope", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        soft: "0 10px 30px rgba(11, 18, 32, 0.08)",
        glow: "0 0 0 1px rgba(31, 122, 140, 0.2), 0 16px 40px rgba(31, 122, 140, 0.15)"
      }
    }
  },
  plugins: []
};
