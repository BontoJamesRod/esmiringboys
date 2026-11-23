// Regenerates PNG icons from assets/kaligtasan-id-logo.svg. Run: npm run icons
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
const svg = readFileSync(new URL('../assets/kaligtasan-id-logo.svg', import.meta.url));
// Maskable icon: full-bleed navy with the mark scaled into the safe zone (80%).
const inner = svg.toString().replace(/<svg[^>]*>/, '').replace('</svg>', '').replace(/<rect width="64" height="64" rx="[\d.]+" fill="#12355B"\/>/, '');
const maskable = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#12355B"/><g transform="translate(6.4 6.4) scale(.8)">${inner}</g></svg>`);
const out = [
  [svg, 'public/pwa-192.png', 192], [svg, 'public/pwa-512.png', 512],
  [svg, 'public/apple-touch-icon.png', 180], [svg, 'assets/kaligtasan-id-logo.png', 512],
  [maskable, 'public/pwa-maskable-512.png', 512],
];
for (const [src, file, size] of out) {
  await sharp(src, { density: 600 }).resize(size, size).png().toFile(new URL('../' + file, import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'));
  console.log('wrote', file);
}
