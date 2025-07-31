/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 將你的自訂顏色加到這裡
      colors: {
        'primary': '#4A90E2',
        'light-gray': '#F7F8FA',
        'dark-gray': '#1A202C',
        'medium-gray': '#A0AEC0',
      },
      // 將你的自訂陰影加到這裡
      boxShadow: {
        'subtle': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}