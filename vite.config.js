import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Optimize dependencies for Stellar SDK
  optimizeDeps: {
    include: [
      '@stellar/stellar-sdk',
      '@creit.tech/stellar-wallets-kit'
    ],
    exclude: []
  },
  
  // Build configuration
  build: {
    target: 'esnext',
    commonjsOptions: {
      include: [/stellar-sdk/, /stellar-wallets-kit/, /node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks: undefined // Let Vite handle chunking automatically
      }
    }
  },
  
  // Define global variables if needed
  define: {
    'process.env': {},
    global: 'globalThis'
  }
})
