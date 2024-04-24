import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import Icons from 'unplugin-icons/vite';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), Icons()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
