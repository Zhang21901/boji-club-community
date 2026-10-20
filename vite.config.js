import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/boji-club-community/' : '/',
  plugins: [react()],
  server: {
    // Allows the temporary Cloudflare Tunnel hostname used for external preview.
    allowedHosts: true,
  },
})
