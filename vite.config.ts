import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from "vite-plugin-svgr";
import removeConsole from "vite-plugin-remove-console";
import { createHtmlPlugin } from 'vite-plugin-html';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), removeConsole(), createHtmlPlugin({
	minify: true
  })],
  resolve: {
    alias: {
      "@src": "/src",
      "@assets": "/src/assets",
      "@components": "/src/components",
    },
  },
  build: {
	assetsDir: './',
	minify: 'terser'
  }
})
