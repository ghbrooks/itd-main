// One-off: pull featured images from the live WordPress media library into
// src/assets/images/<collection>/<slug>.webp, resized to a sane hero width.
//
// Source map: scripts/wp-data/featured-images.json (generated from the WP
// `_thumbnail_id` postmeta during migration). Astro's <Image> handles the
// responsive variants at build time, so we only store one 1600px master here.
//
// Usage: node scripts/fetch-wp-images.mjs [collection ...]
//   e.g. node scripts/fetch-wp-images.mjs sectors blog pages

import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MAP = JSON.parse(await readFile(join(ROOT, 'scripts/wp-data/featured-images.json'), 'utf8'));
const OUT = join(ROOT, 'src/assets/images');
const UPLOADS = 'https://itd.com/wp-content/uploads/';
const MAX_WIDTH = 1600;
const CONCURRENCY = 6;

const wanted = process.argv.slice(2);
const collections = wanted.length ? wanted : Object.keys(MAP);

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

function candidates(entry) {
  const urls = [];
  if (entry.file) urls.push(UPLOADS + entry.file);
  if (entry.guid) urls.push(entry.guid.replace(/^http:/, 'https:'));
  // ShortPixel often keeps the original next to the converted one.
  if (entry.file) urls.push(UPLOADS + entry.file.replace(/\.(webp|avif)$/, '.jpg'));
  return [...new Set(urls)];
}

async function fetchFirst(urls) {
  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: { 'user-agent': 'itd-astro-migration/1.0' } });
      if (res.ok) return { url, buf: Buffer.from(await res.arrayBuffer()) };
    } catch (err) {
      // try next candidate
    }
  }
  return null;
}

async function processOne(collection, slug, entry) {
  const dest = join(OUT, collection, `${slug}.webp`);
  if (await exists(dest)) return 'skip';
  const got = await fetchFirst(candidates(entry));
  if (!got) return 'miss';
  try {
    const img = sharp(got.buf, { animated: false });
    const meta = await img.metadata();
    // Skip tiny logos — they are not hero material.
    if ((meta.width ?? 0) < 600) return 'small';
    await img
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(dest);
    return 'ok';
  } catch (err) {
    return `err:${err.message}`;
  }
}

const results = {};
for (const collection of collections) {
  const entries = Object.entries(MAP[collection] ?? {});
  await mkdir(join(OUT, collection), { recursive: true });
  const queue = [...entries];
  const tally = {};
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const [slug, entry] = queue.shift();
      const r = await processOne(collection, slug, entry);
      tally[r] = (tally[r] ?? 0) + 1;
      if (r !== 'ok' && r !== 'skip') console.log(`${collection}/${slug}: ${r}`);
    }
  });
  await Promise.all(workers);
  results[collection] = tally;
  console.log(collection, tally);
}
await writeFile(join(ROOT, 'scripts/wp-data/fetch-log.json'), JSON.stringify(results, null, 2));
