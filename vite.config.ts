import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES === 'true' ? '/design-prototypes/' : '/',
  server: {
    allowedHosts: true,
  },
})
