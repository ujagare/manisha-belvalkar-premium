import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const SRC = 'src';

// Fix mangled paths: /images/public\images\foo\bar.webp -> /images/foo/bar.webp
// Also handle url('/images/public\images\...') inside CSS-in-JS strings.
const MANGLED = /(["'`(]|url\()['"]?\/?images\/public[\\/]images[\\/][^"'`)\s]+/g;

let totalFiles = 0;
function processDir(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) { processDir(full); continue; }
    if (!/\.(tsx|ts|jsx|js|mdx?|json)$/.test(entry)) continue;
    let content = readFileSync(full, 'utf8');
    const before = content;
    // Replace the mangled segment: /images/public\images\sub\file.webp -> /images/sub/file.webp
    content = content.replace(/images\/public[\\/]images[\\/]/g, 'images/');
    // Also normalize any remaining backslashes inside an images path
    content = content.replace(/(\/images\/[a-zA-Z0-9._-]+(?:\\[a-zA-Z0-9._-]+)+)/g, (m) =>
      m.replace(/\\/g, '/')
    );
    if (content !== before) {
      writeFileSync(full, content);
      console.log('FIXED ' + full);
      totalFiles++;
    }
  }
}
processDir(SRC);
console.log('Files fixed: ' + totalFiles);
