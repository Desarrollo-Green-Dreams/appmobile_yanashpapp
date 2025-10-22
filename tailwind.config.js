/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F36C3F',
        'primary-hover': '#e55a2b', 
        secondary: '#17332a',
        background: '#f6f0e9',
        'text-primary': '#7d6f63',
        'text-secondary': '#b0a898'
      },
       fontFamily: {
        weidemann: ["Weidemann", "sans-serif"],
        humanist: ["Humanist", "sans-serif"],
      },
    }
  },
  plugins: []
}