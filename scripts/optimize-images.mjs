import sharp from 'sharp';
import { readdirSync, statSync, renameSync, existsSync } from 'fs';
import { join, parse, extname } from 'path';

const ROOT = 'public/images';
const dryRun = process.argv.includes('--dry-run');

// SEO-friendly rename map (manual curation for key images)
const RENAME = {
  'about-article-scanned': 'manisha-article-press',
  'about-health-mag': 'manisha-health-magazine',
  'about-portrait-1': 'manisha-portrait-healer',
  'about-portrait-2': 'manisha-portrait-meditation',
  'about-portrait-3': 'manisha-portrait-session',
  'about-success-today': 'manisha-success-story',
  'advanced-chakra-course': 'chakra-healing-course',
  'aishwarya-siddhi-course': 'aishwarya-siddhi-program',
  'books': 'manisha-spiritual-books',
  'candle': 'healing-candle-therapy',
  'chakra': 'chakra-energy-diagram',
  'devi-chakra-rotating': 'devi-chakra-mandala',
  'devi-chakra': 'devi-chakra-symbol',
  'devi-foreground': 'devi-healing-goddess',
  'devi': 'devi-meditation',
  'gold-abstract': 'spiritual-golden-texture',
  'hero-dark': 'manisha-homepage-hero',
  'hero-home-bg': 'manisha-homepage-background',
};

const results = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) { walk(full); continue; }
    const ext = extname(entry).toLowerCase().slice(1);
    if (!['jpg', 'jpeg', 'png'].includes(ext)) continue;

    const parsed = parse(entry);
    const seoName = RENAME[parsed.name] || parsed.name.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const outPath = join(dir, `${seoName}.webp`);

    if (existsSync(outPath)) {
      results.push({ src: full, out: outPath, status: 'exists', saved: 0 });
      continue;
    }

    const before = statSync(full).size;
    if (dryRun) {
      results.push({ src: full, out: outPath, status: 'dry-run', saved: before });
      continue;
    }

    sharp(full)
      .webp({ quality: 82, effort: 4 })
      .toFile(outPath)
      .then(() => {
        const after = statSync(outPath).size;
        const saved = Math.max(0, before - after);
        const pct = Math.round((saved / before) * 100);
        console.log(`OK  ${outPath}  ${before}B -> ${after}B  (-${pct}%)`);
        // keep original as .orig backup (user policy: never auto-delete)
        renameSync(full, full + '.orig');
      })
      .catch(e => console.error(`FAIL ${full}: ${e.message}`));
  }
}

walk(ROOT);
if (dryRun) console.log(JSON.stringify(results, null, 2));
console.log('DONE');
