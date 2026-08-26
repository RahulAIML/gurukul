import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    // Illustrations live as real .svg files under src/assets/illustrations and
    // are imported as inline React components, so `currentColor` and CSS
    // custom properties reach them. An <img src="…"> cannot be recoloured,
    // which the illustration system requires for its state treatment.
    // default include is **/*.svg?react — which is exactly the import form
    // the registry uses, so it is left alone.
    svgr({
      svgrOptions: {
        // Guards against id collisions when several illustrations render on
        // one screen.
        svgoConfig: { plugins: [{ name: 'prefixIds' }] },
      },
    }),
  ],
  server: { port: 5173 },
});
