import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { viteSingleFile } from 'vite-plugin-singlefile';

/*
 * The app is written as plain functions that share one scope and are called
 * from inline handlers (onclick="A.go('x')"). This plugin joins the files in
 * src/app/ into a single ES module, imports the bundled libraries, and exposes
 * the few names the inline handlers use (A, S, render) on window.
 */
const APP_FILES = ['core', 'data', 'web', 'scan', 'tour', 'app'].map(n => resolve(__dirname, `src/app/${n}.js`));
const VIRTUAL = 'virtual:kid-app';
function kidApp() {
  return {
    name: 'kid-app',
    resolveId(id) { if (id === VIRTUAL) return '\0' + VIRTUAL; },
    load(id) {
      if (id !== '\0' + VIRTUAL) return;
      APP_FILES.forEach(f => this.addWatchFile(f));
      const body = APP_FILES.map(f => `/* ---- ${f.split(/[\\/]/).pop()} ---- */\n` + readFileSync(f, 'utf8').replace(/^'use strict';\s*/, '')).join('\n');
      return `import qrcode from 'qrcode-generator';\nimport jsQR from 'jsqr';\nimport { get as idbGet, set as idbSet, del as idbDel } from 'idb-keyval';\n${body}\n
Object.defineProperties(window, {
  A: { get: () => A, configurable: true },
  S: { get: () => S, configurable: true },
  DB: { get: () => DB, configurable: true },
  render: { get: () => render, configurable: true },
});\n`;
    },
    handleHotUpdate({ file, server }) {
      if (APP_FILES.some(f => resolve(f) === resolve(file))) {
        const m = server.moduleGraph.getModuleById('\0' + VIRTUAL);
        if (m) server.moduleGraph.invalidateModule(m);
        server.ws.send({ type: 'full-reload' });
        return [];
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const single = mode === 'single';
  return {
    base: './',
    plugins: [
      kidApp(),
      tailwindcss(),
      single
        ? [viteSingleFile({ removeViteModuleLoader: true }), {
            // No service worker in the one-file build: it runs from file://.
            name: 'no-pwa',
            resolveId: id => (id === 'virtual:pwa-register' ? '\0no-pwa' : undefined),
            load: id => (id === '\0no-pwa' ? 'export const registerSW = () => () => {};' : undefined),
          }]
        : VitePWA({
            registerType: 'autoUpdate',
            injectRegister: false,
            includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
            manifest: {
              name: 'Kaligtasan ID',
              short_name: 'Kaligtasan ID',
              description: 'Household QR ID for evacuation centers. Works offline.',
              theme_color: '#12355B',
              background_color: '#F7F6F2',
              display: 'standalone',
              start_url: './',
              scope: './',
              icons: [
                { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
                { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
                { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
              ],
            },
            workbox: {
              globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
              navigateFallback: 'index.html',
            },
          }),
    ],
    build: single
      ? { outDir: 'dist-single', emptyOutDir: true, assetsInlineLimit: 100_000_000, cssCodeSplit: false }
      : { outDir: 'dist', emptyOutDir: true },
    define: { __PWA__: JSON.stringify(!single) },
  };
});
