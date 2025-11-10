import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        '2d': './2d.html',
      },
    },
  },
  plugins: [tsconfigPaths()],
});
