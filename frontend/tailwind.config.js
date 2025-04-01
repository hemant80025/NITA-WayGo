/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryLight: "#FCA5A5",
        secondaryLight: "#F5C0A9",
        navyBlue: "#1e40af",
        lightBlue: "#3b82f6",
        skyBlue: "#7dd3fc",
      },
    },
  },
  plugins: [],
}


