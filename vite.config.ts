import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    process.env.ANALYZE === 'true'
      ? visualizer({
          filename: 'dist/bundle-report.html',
          gzipSize: true,
          template: 'treemap',
        })
      : null,
  ],
  server: {
    port: 5173,
  },
})
