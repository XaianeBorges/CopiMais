/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deixe as cores prontas para o seu Figma
        primary: "#1E40AF", // Azul exemplo
        secondary: "#64748B", // Cinza exemplo
      }
    },
  },
  plugins: [],
}