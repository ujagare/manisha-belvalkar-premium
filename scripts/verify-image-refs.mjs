import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';

const SRC = 'src';

const referenced = new Set();
function scanDir(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) { scanDir(full); continue; }
    if (!/\.(tsx|ts|jsx|js|mdx?|json)$/.test(entry)) continue;
    const content = readFileSync(full, 'utf8');
    // match "/images/..." or 'images/...' or `images/...`
    const re = new RegExp('["\']((?:/?)images/[^"\'\\s)\\]\\\\]+)["\']', 'g');
    let m;
    while ((m = re.exec(content)) !== null) {
      const p = m[1].replace(/^\/?images\//, '').replace(/\\/g, '/');
      referenced.add('public/images/' + p);
    }
  }
}
scanDir(SRC);

let missing = 0;
const sortedRefs = [...referenced].sort();
for (const p of sortedRefs) {
  const clean = p.split('\\').join('/');
  if (!existsSync(clean)) {
    console.log('MISSING:', clean);
    missing++;
  }
}
console.log('Referenced images: ' + referenced.size + ', missing: ' + missing);
