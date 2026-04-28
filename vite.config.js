import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@stellar/stellar-sdk']
  },
  build: {
    target: 'esnext',
    commonjsOptions: {
      include: [/stellar-sdk/, /node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'stellar-sdk': ['@stellar/stellar-sdk']
        }
      }
    }
  }
})
