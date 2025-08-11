// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        flicker: {
          "0%, 19.999%, 22%, 62.999%, 64%, 100%": {
            opacity: "1",
            filter: "drop-shadow(0 0 4px #f97316) drop-shadow(0 0 6px #f97316)",
          },
          "20%, 21.999%, 63%, 63.999%": {
            opacity: "0.4",
            filter: "none",
          },
        },
      },
      animation: {
        flicker: "flicker 1.8s infinite ease-in-out",
      },
    },
  },
  plugins: [],
};
