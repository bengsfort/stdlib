import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        '2d': './2d.html',
      },
    },
  },
});
