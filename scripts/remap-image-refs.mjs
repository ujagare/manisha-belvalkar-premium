import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname, parse, dirname, basename } from 'path';

const ROOT = 'public/images';
const SRC = 'src';

// Build remap from .orig files: old basename -> new webp relative path
const remap = [];
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) { walk(full); continue; }
    if (!entry.endsWith('.orig')) continue;
    const oldName = entry.replace(/\.orig$/, '');
    const parsed = parse(oldName);
    const seoName = parsed.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const oldBase = basename(oldName);
    const newRel = join(dir.replace(/\\/g, '/'), seoName + '.webp').replace(/^public\//, '');
    remap.push([oldBase, newRel]);
  }
}
walk(ROOT);
console.log(`Remap entries: ${remap.length}`);

// Sort longest basename first to avoid partial-match collisions
remap.sort((a, b) => b[0].length - a[0].length);

let totalFiles = 0;
function processDir(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) { processDir(full); continue; }
    if (!/\.(tsx|ts|jsx|js|mdx?|json)$/.test(entry)) continue;
    let content = readFileSync(full, 'utf8');
    let changed = false;
    for (const [oldBase, newRel] of remap) {
      const esc = oldBase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // images/ + optional subpath + oldbasename (no trailing .ext beyond escaped)
      const re = new RegExp(`(images/)(?:[^"'\\s)\\]]*\\/)?${esc}(?![a-zA-Z0-9.])`, 'g');
      if (re.test(content)) {
        content = content.replace(new RegExp(`(images/)(?:[^"'\\s)\\]]*\\/)?${esc}(?![a-zA-Z0-9.])`, 'g'), `$1${newRel}`);
        changed = true;
      }
    }
    if (changed) {
      writeFileSync(full, content);
      console.log(`UPDATED ${full}`);
      totalFiles++;
    }
  }
}
processDir(SRC);
console.log(`Files updated: ${totalFiles}`);
