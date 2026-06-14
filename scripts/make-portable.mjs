// Post-build: rewrite root-absolute URLs in dist/ to file-relative paths
// so the site works both via file:// (double-click dist/index.html) and on
// any GitHub Pages URL regardless of base path.
//
// - HTML attrs (href, src, action, poster, data-src, formaction, srcset)
// - CSS url(/...) references
// - Directory hrefs are expanded to /index.html (file:// won't auto-resolve)
// - Also writes .nojekyll so GitHub Pages serves the _astro/ folder

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url)).replace(/\/$/, '');

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

function relPrefix(filePath) {
  const rel = relative(DIST, filePath);
  const depth = rel.split('/').length - 1;
  return depth === 0 ? './' : '../'.repeat(depth);
}

function splitUrl(url) {
  const m = url.match(/^([^?#]*)(.*)$/);
  return { path: m[1], suffix: m[2] };
}

function isDirInDist(path) {
  if (!path) return false;
  try {
    return statSync(join(DIST, path)).isDirectory();
  } catch {
    return false;
  }
}

function rewriteUrl(url, prefix, opts = {}) {
  if (!url || !url.startsWith('/') || url.startsWith('//')) return url;
  const { path, suffix } = splitUrl(url);
  const hadTrailing = path.endsWith('/') && path !== '/';
  const clean = path === '/' ? '' : path.replace(/\/$/, '').slice(1);

  if (clean === '') {
    return prefix + 'index.html' + suffix;
  }

  let target = prefix + clean;
  if (opts.expandDir && isDirInDist(clean)) {
    target += '/index.html';
  } else if (hadTrailing) {
    target += '/';
  }
  return target + suffix;
}

function rewriteHtml(content, prefix) {
  content = content.replace(
    /\b(href|src|action|poster|data-src|formaction)=("|')(\/[^"'\s>]*)\2/g,
    (_, attr, q, url) => {
      const expandDir = attr === 'href' || attr === 'action' || attr === 'formaction';
      return `${attr}=${q}${rewriteUrl(url, prefix, { expandDir })}${q}`;
    }
  );
  content = content.replace(/\bsrcset=("|')([^"']*)\1/g, (_, q, val) => {
    const parts = val.split(',').map((p) => {
      const t = p.trim();
      if (!t) return t;
      const space = t.search(/\s/);
      if (space === -1) return rewriteUrl(t, prefix);
      return rewriteUrl(t.slice(0, space), prefix) + t.slice(space);
    });
    return `srcset=${q}${parts.join(', ')}${q}`;
  });
  return content;
}

function rewriteCss(content, prefix) {
  return content.replace(
    /url\(\s*(['"]?)(\/[^)'"\s]*)\1\s*\)/g,
    (_, q, url) => `url(${q}${rewriteUrl(url, prefix)}${q})`
  );
}

const counts = { html: 0, css: 0 };
for await (const file of walk(DIST)) {
  const prefix = relPrefix(file);
  if (/\.html?$/i.test(file)) {
    const orig = await readFile(file, 'utf8');
    const next = rewriteHtml(orig, prefix);
    if (next !== orig) {
      await writeFile(file, next);
      counts.html++;
    }
  } else if (/\.css$/i.test(file)) {
    const orig = await readFile(file, 'utf8');
    const next = rewriteCss(orig, prefix);
    if (next !== orig) {
      await writeFile(file, next);
      counts.css++;
    }
  }
}

writeFileSync(join(DIST, '.nojekyll'), '');
console.log(`make-portable: rewrote ${counts.html} HTML and ${counts.css} CSS files; wrote .nojekyll`);
