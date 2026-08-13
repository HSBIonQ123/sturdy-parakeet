import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative base so the built bundle also works when opened from a path that
  // is not the server root — one less way for a presentation to fail.
  base: './',
  build: {
    // The topology is ~740KB of JSON inlined into the bundle. That is a
    // deliberate trade: one file, no fetch, guaranteed to work with the wifi
    // off. Raise the warning limit rather than pretending it is a surprise.
    chunkSizeWarningLimit: 1600,
    assetsInlineLimit: 0,
  },
});
