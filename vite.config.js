import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  // Dev: Dependencies pre-bundlen für schnelleres HMR
  optimizeDeps: {
    include: ['survey-core', 'survey-jquery', 'jquery']
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/widget.js'),
      name: 'FormWidget',
      fileName: (format) => `form-widget.${format}.js`
    },
    rollupOptions: {
      external: [],
    },
    sourcemap: true
  }
});
