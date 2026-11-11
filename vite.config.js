import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './', // relativne putanje: radi i na korijenu domene i u podmapi
  plugins: [react()],
});
