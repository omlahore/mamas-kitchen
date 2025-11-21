import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Enable code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          'firebase-auth': ['firebase/auth'],
          'firebase-firestore': ['firebase/firestore'],
          'firebase-storage': ['firebase/storage'],
          'gsap': ['gsap'],
        }
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable minification (esbuild is faster and doesn't require extra dependencies)
    minify: 'esbuild',
    // Copy service worker to dist
    copyPublicDir: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
  },
  // CDN configuration - assets will be served from CDN in production
  base: process.env.NODE_ENV === 'production' ? '/' : '/',
});

