/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@shadcn/ui/dist/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "poppins": ["Poppins",  "sans-serif"],
      }
      
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none", /* IE and Edge */
          "scrollbar-width": "none",    /* Firefox */
        },
        ".scrollbar-hide::-webkit-scrollbar": {
          display: "none", /* Chrome, Safari, Opera */
        },
      });
    },
  ],
}