// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Target cloud: Astro non deve caricare file .env (in build li copierebbe in process.env, portando nei worker
// i valori dello stack locale). La configurazione cloud arriva solo dall'ambiente, già popolato prima di Astro
// da `node --env-file-if-exists=.env.cloud` negli script npm (le variabili esterne, es. Vercel, prevalgono).
const cloudTarget = process.env.TCS_SUPABASE_TARGET === 'cloud';

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
  vite: cloudTarget ? { envDir: false } : {},
});
