import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'MusicHub',
        short_name: 'MusicHub',
        description: 'Self-hosted personal music library manager',
        start_url: '/',
        lang: 'pt-BR',
        display: 'standalone',
        background_color: '#0f1115',
        theme_color: '#0f1115',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Only precache the built app shell. Everything that talks to the backend (auth,
        // library data, media streaming/covers, websocket) must always hit the network —
        // caching it would risk serving stale library state or streaming from cache with an
        // expired token. navigateFallbackDenylist keeps SPA-shell fallback off API paths too.
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        navigateFallbackDenylist: [
          /^\/(auth|users|library|downloads|queue|metadata|playlists|settings|integrations|dashboard|socket\.io)(\/|$)/,
        ],
      },
    }),
  ],
  server: {
    port: 5173,
  },
});
