import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Globale Test-Umgebung
    globals: true,

    // Test-Dateien finden
    include: ['tests/**/*.test.js', 'tests/**/*.spec.js'],

    // Reporter für Konsole
    reporters: ['verbose'],

    // Coverage-Optionen (optional)
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['public/js/**/*.js'],
      exclude: ['node_modules', 'tests']
    }
  }
});
