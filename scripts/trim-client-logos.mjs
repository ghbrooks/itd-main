// One-off: trims the white/transparent padding the WordPress client logos carry
// (every file is a ~917x693 canvas with the mark in a thin band in the middle)
// and writes tight PNGs to src/assets/images/clients, where ClientLogoStrip
// picks them up via astro:assets. Re-run after dropping a new raw logo into
// public/images/clients:  node scripts/trim-client-logos.mjs
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const src = path.resolve('public/images/clients');
const out = path.resolve('src/assets/images/clients');
fs.mkdirSync(out, { recursive: true });

for (const file of fs.readdirSync(src).filter((f) => /\.(png|webp|jpe?g)$/i.test(f)).sort()) {
  const base = file.replace(/\.[^.]+$/, '');
  const target = path.join(out, `${base}.png`);
  // Some canvases carry a 1–2px off-white edge that defeats trim(), so shave the
  // border in a first pass (sharp applies trim before extract within one pipeline).
  const meta = await sharp(path.join(src, file)).metadata();
  const inset = 4;
  const shaved = await sharp(path.join(src, file))
    .extract({ left: inset, top: inset, width: meta.width - inset * 2, height: meta.height - inset * 2 })
    .flatten({ background: '#ffffff' })
    .toBuffer();
  const img = sharp(shaved).trim({ threshold: 40 });
  const { width, height } = await img.toBuffer({ resolveWithObject: true }).then((r) => r.info);
  await sharp(await img.toBuffer()).png({ compressionLevel: 9, palette: true }).toFile(target);
  console.log(`${file.padEnd(28)} -> ${width}x${height}`);
}
