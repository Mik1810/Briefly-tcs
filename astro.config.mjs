// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Sito interamente statico: i componenti React sono renderizzati in HTML durante la build.
// Nessuna direttiva client:* è usata, quindi nessun JavaScript React arriva al browser.
export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [react()],
  devToolbar: {
    enabled: false,
  },
});
