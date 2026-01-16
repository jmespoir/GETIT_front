/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // 이 줄이 핵심입니다!
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}