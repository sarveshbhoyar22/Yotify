import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Yotify',
        short_name: 'Yotify',
        description: 'Stream YouTube audio with style. Search, play, and enjoy your favorite music with custom controls.',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#1f1f1f',
        icons: [
          {
            src: '/favicon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/favicon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
