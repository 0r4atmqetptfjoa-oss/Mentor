import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwind(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'maskable-icon.svg'],
      manifest: {
        name: 'Mentor',
        short_name: 'Mentor',
        theme_color: '#0EA5E9',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ],
        shortcuts: [
          { name: 'Quiz rapid', short_name: 'Quiz 10', url: '/teste?mode=rapid&n=10', icons: [{ src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' }] },
          { name: 'Greșeli', url: '/review-greseli', icons: [{ src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' }] },
          { name: 'Misiuni', url: '/misiuni', icons: [{ src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' }] }
        ]
      }
    })
  ]
})