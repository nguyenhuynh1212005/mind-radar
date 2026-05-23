import { defineConfig } from 'vite';
import express from 'express';
import { registerRoutes } from './src/server/routes';

export default defineConfig({
  root: '.',
  publicDir: false,
  plugins: [
    {
      name: 'express-api',
      configureServer(server) {
        const app = express();
        registerRoutes(app);
        server.middlewares.use(app);
      }
    }
  ],
  build: {
    outDir: 'dist/ui',
    emptyOutDir: false,
    rollupOptions: {
      input: 'index.html'
    }
  },
  server: {
    host: '127.0.0.1',
    port: 5174,
    strictPort: false
  }
});
