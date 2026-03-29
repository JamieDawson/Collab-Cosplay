/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      colors: {
        brand: {
          blue: {
            glow: "#38bdf8",
          },
          pink: {
            glow: "#f472b6",
          },
        },
      },
      boxShadow: {
        brand: "0 8px 32px -8px rgba(56, 189, 248, 0.25), 0 4px 16px -4px rgba(244, 114, 182, 0.2)",
        "brand-lg":
          "0 20px 50px -12px rgba(56, 189, 248, 0.2), 0 12px 24px -8px rgba(244, 114, 182, 0.15)",
      },
      backgroundImage: {
        "gradient-brand":
          "linear-gradient(135deg, #dbeafe 0%, #fae8ff 48%, #e0e7ff 100%)",
        "gradient-nav":
          "linear-gradient(90deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 27, 75, 0.88) 50%, rgba(15, 23, 42, 0.92) 100%)",
        "gradient-cta":
          "linear-gradient(125deg, #0ea5e9 0%, #d946ef 45%, #ec4899 100%)",
      },
    },
  },
  plugins: [],
};
