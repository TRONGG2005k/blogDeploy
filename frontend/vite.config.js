import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify('https://blog-test-trong.duckdns.org/api'),
    'import.meta.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify('305033698203-9o0n2e2m5flqiks1crns04vm7ce2uvnb.apps.googleusercontent.com'),
    'import.meta.env.VITE_GOOGLE_REDIRECT_URI': JSON.stringify('https://blog-test-trong.duckdns.org/authenticate'),
  },
})
