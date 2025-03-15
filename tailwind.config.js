
/** @type {import("tailwindcss").Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    extend: {
      fontFamily: {
        "prim": "Markazi Text",
        "sec": "Karla",
        "text": "'Poppins', sans-serif"
      },
      animation: {
        testing: "testing 2s ease-in-out infinite"
      },
      keyframes: {
        testing: {
          "0%, 100%": { transform: "translate(0%)" },
          "20%": { transform: "translate(20%)" },
        }
      },
    },
  },
  plugins: [],
};
