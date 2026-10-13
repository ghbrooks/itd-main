// Generates the raster brand assets BaseHead references:
//   public/og-default.png      1200×630 social card
//   public/apple-touch-icon.png 180×180
// Run: node scripts/make-brand-assets.mjs

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const logoSvg = await readFile(join(ROOT, 'public/logo.svg'), 'utf8');

// Logo rendered white on the brand navy, scaled to ~520px wide.
// The SVG has a square 500×500 canvas with the mark in the middle: render big,
// trim the transparent padding, then scale to the width we want.
const logoPng = await sharp(Buffer.from(logoSvg), { density: 300 })
  .resize({ width: 1400 })
  .png()
  .trim()
  .resize({ width: 300 })
  .png()
  .toBuffer();
const logoMeta = await sharp(logoPng).metadata();

// Tint the logo white: flatten alpha onto navy, then invert luminance mask.
const whiteLogo = await sharp({
  create: { width: logoMeta.width ?? 520, height: logoMeta.height ?? 200, channels: 4, background: '#ffffff' },
})
  .composite([{ input: logoPng, blend: 'dest-in' }])
  .png()
  .toBuffer();

const card = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#01215c"/>
      <stop offset="1" stop-color="#014b8f"/>
    </linearGradient>
    <radialGradient id="glow" cx="85%" cy="10%" r="60%">
      <stop offset="0" stop-color="#0284d5" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#0284d5" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g stroke="#ffffff" stroke-opacity="0.07">
    ${Array.from({ length: 22 }, (_, i) => `<line x1="${i * 56}" y1="0" x2="${i * 56}" y2="630"/>`).join('')}
    ${Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="${i * 56}" x2="1200" y2="${i * 56}"/>`).join('')}
  </g>
  <text x="80" y="430" font-family="Inter, Helvetica, Arial, sans-serif" font-size="54" font-weight="600" fill="#ffffff" letter-spacing="-1.5">Soft skills training that sticks.</text>
  <text x="80" y="490" font-family="Inter, Helvetica, Arial, sans-serif" font-size="28" fill="#a2ddf8">Virtual and in person · Tailored to your needs · Since 2002</text>
  <text x="80" y="570" font-family="Inter, Helvetica, Arial, sans-serif" font-size="24" fill="#ffffff" fill-opacity="0.7">itd.com</text>
</svg>`);

await sharp(card)
  .composite([{ input: whiteLogo, left: 80, top: 120 }])
  .png({ compressionLevel: 9 })
  .toFile(join(ROOT, 'public/og-default.png'));

// Apple touch icon from the favicon on a navy tile.
const favicon = await readFile(join(ROOT, 'public/favicon.svg'), 'utf8');
const icon = await sharp(Buffer.from(favicon)).resize({ width: 132, height: 132, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
await sharp({ create: { width: 180, height: 180, channels: 4, background: '#01215c' } })
  .composite([{ input: icon, gravity: 'centre' }])
  .png()
  .toFile(join(ROOT, 'public/apple-touch-icon.png'));

console.log('wrote public/og-default.png and public/apple-touch-icon.png');
