import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  // Build-Konfiguration für Library/Widget-Mode
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/widget.js'),
      name: 'ChancenPilotWidget',
      fileName: (format) => `cp-forms.${format}.js`
    },
    rollupOptions: {
      // jQuery wird mitgebündelt für "Sorglos-Widget"
      // Kunden müssen nichts extra laden
    },
    // Sourcemaps für Debugging
    sourcemap: true
  },

  // Test-Konfiguration für Vitest
  test: {
    globals: true,
    environment: 'jsdom'
  }
});
