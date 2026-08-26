/**
 * Measures optical weight per illustration.
 *
 * "Optical weight" is perceived visual mass, and the honest proxy for it is
 * alpha-weighted ink coverage — the share of the canvas actually painted,
 * weighted by opacity — plus the height of
 * the painted area. Rasterises each asset at 400px with the literal state
 * colours substituted in, then counts non-transparent pixels and finds the
 * content bounding box.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import puppeteer from 'puppeteer-core';

const ROOT = join(import.meta.dirname, '..', 'src', 'assets', 'illustrations', 'onboarding');
const CATS = ['people', 'goals', 'fitness-level', 'locations', 'equipment', 'time'];
const SIZE = 400;

const assets = [];
for (const cat of CATS) {
  for (const f of readdirSync(join(ROOT, cat)).filter((f) => f.endsWith('.svg'))) {
    let src = readFileSync(join(ROOT, cat, f), 'utf8');
    // resolve the two state references so the asset can be rasterised
    src = src.replaceAll('currentColor', '#E4262F').replaceAll('var(--ill-neutral)', '#9A9AA8');
    assets.push({ cat, file: f, src });
  }
}

/** Set CHROME_PATH if your browser is somewhere else. */
function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const candidates = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ];
  const found = candidates.find((c) => existsSync(c));
  if (!found) {
    console.error('No Chrome found. Set CHROME_PATH to your browser binary.');
    process.exit(1);
  }
  return found;
}

const browser = await puppeteer.launch({ executablePath: findChrome(), headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 600, height: 600 });
await page.goto('about:blank');

const results = await page.evaluate(async (assets, SIZE) => {
  const out = [];
  for (const a of assets) {
    const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(a.src);
    const img = new Image();
    img.width = SIZE;
    img.height = SIZE;
    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = () => rej(new Error('load failed: ' + a.file));
      img.src = url;
    });
    const c = document.createElement('canvas');
    c.width = SIZE;
    c.height = SIZE;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0, SIZE, SIZE);
    const { data } = ctx.getImageData(0, 0, SIZE, SIZE);

    let ink = 0, minX = SIZE, maxX = 0, minY = SIZE, maxY = 0;
    // the floor line is shared by every asset and must not count toward weight
    const FLOOR_Y0 = Math.floor((139 / 160) * SIZE);
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const alpha = data[(y * SIZE + x) * 4 + 3];
        // Weight by alpha rather than counting pixels over a threshold: a 12%
        // fill and an 8% fill differ by a hair perceptually, but a binary
        // threshold scores one as full ink and the other as none.
        if (alpha > 6) {
          if (y < FLOOR_Y0) {
            ink += alpha / 255;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
    }
    out.push({
      cat: a.cat,
      file: a.file,
      coverage: +((ink / (SIZE * SIZE)) * 100).toFixed(2),
      // back to the 160 canvas
      h: +(((maxY - minY) / SIZE) * 160).toFixed(1),
      w: +(((maxX - minX) / SIZE) * 160).toFixed(1),
      top: +((minY / SIZE) * 160).toFixed(1),
      left: +((minX / SIZE) * 160).toFixed(1),
      right: +((maxX / SIZE) * 160).toFixed(1),
    });
  }
  return out;
}, assets, SIZE);

await browser.close();

const byCat = {};
for (const r of results) (byCat[r.cat] ??= []).push(r);

const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
const overall = mean(results.map((r) => r.coverage));

console.log(`\nink coverage — overall mean ${overall.toFixed(2)}%\n`);
console.log('category        mean%   n   assets (coverage / content h / content w)');
console.log('─'.repeat(78));
for (const cat of CATS) {
  const rs = byCat[cat];
  const m = mean(rs.map((r) => r.coverage));
  const flag = Math.abs(m - overall) / overall > 0.18 ? '  <-- off' : '';
  console.log(`${cat.padEnd(15)} ${m.toFixed(2).padStart(5)}  ${String(rs.length).padStart(2)}${flag}`);
  for (const r of rs) {
    console.log(`   ${r.file.replace('.svg', '').padEnd(24)} ${String(r.coverage).padStart(5)}   h=${String(r.h).padStart(5)}  w=${String(r.w).padStart(5)}  x=${r.left}..${r.right}`);
  }
}

writeFileSync(
  join(import.meta.dirname, 'optical-weight.json'),
  JSON.stringify({ overall, results }, null, 1),
);
console.log('\nwrote ink.json');
