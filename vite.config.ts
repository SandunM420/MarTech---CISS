import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // In production the API and the SPA are the same origin (Apache serves
      // /api from public_html/api). Locally the SPA is on :5173 and PHP's
      // built-in server is on :8787, so proxy across to keep the app's fetch
      // calls identical in both environments - and to keep the session cookie
      // same-origin, which it would not be if the app called :8787 directly.
      //
      // Start the PHP side with:
      //   php -S localhost:8787 -t public tools/php-dev-router.php
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: false,
      },
      // Uploaded images are written outside the Vite dev tree.
      '/uploads': {
        target: 'http://localhost:8787',
        changeOrigin: false,
      },
    },
  },
})
