import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // 백엔드 OAuth 리다이렉트가 3000으로 오므로 맞춤
  },
})
