import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ['react-icons/ri', 'react-icons/fa'],
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    open: false,
  },
})
