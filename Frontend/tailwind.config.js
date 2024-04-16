// tailwind.config.js
const {nextui} = require("@nextui-org/react");
const { addDynamicIconSelectors } = require('@iconify/tailwind');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/pages/Supplier/Components/Layout/Supplier.css.{html,js}", "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}", 
  './index.html',
  './src/**/*.{html,js,jsx,ts,tsx}',],
 
  
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui(), addDynamicIconSelectors(),],
}
