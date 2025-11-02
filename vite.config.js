import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],


build: {
    // Set a larger limit (e.g., 1000 kB)
    chunkSizeWarningLimit: 1000,
  }

})
