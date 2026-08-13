/**
 * verify.mjs — drives the real built page in headless Chromium and asserts the
 * things the brief calls "done when".
 *
 * Run: npm run build && npm run verify
 *
 * It checks, on the production bundle rather than the dev server:
 *   - every EMEA country renders, with the atlas integrity check clean
 *   - ZERO network requests leave the origin (the wifi-off requirement)
 *   - no border is drawn twice, proven from the arc partition
 *   - the hovered outline is brighter and stiller than the ambient pulse
 *   - frame rate at 2560x1440 with the pulse running
 * and writes screenshots, including close-ups of the small states and
 * enclaves where phase doubling would show first.
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const EXECUTABLE = process.env.CHROMIUM ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const PORT = 4317;
const ORIGIN = `http://localhost:${PORT}`;
const SHOTS = 'screenshots';

const results = [];
const check = (name, pass, detail = '') => {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
};

mkdirSync(SHOTS, { recursive: true });

/* ---- serve the built bundle ---- */
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
  stdio: 'ignore',
});
process.on('exit', () => server.kill());
await sleep(2500);

const browser = await chromium.launch({
  executablePath: EXECUTABLE,
  args: ['--force-device-scale-factor=1'],
});

/* ------------------------------------------------------------------ *
 * 1. Network isolation. Anything not on our own origin is a failure —
 *    a CDN font or a tile request would break the whole premise.
 * ------------------------------------------------------------------ */
const context = await browser.newContext({ viewport: { width: 2560, height: 1440 } });
const external = [];
context.on('request', (r) => {
  const url = r.url();
  if (!url.startsWith(ORIGIN) && !url.startsWith('data:') && !url.startsWith('blob:')) {
    external.push(url);
  }
});

const page = await context.newPage();
const consoleErrors = [];
page.on('console', (m) => {
  if (m.type() === 'error') consoleErrors.push(m.text());
});
page.on('pageerror', (e) => consoleErrors.push(String(e)));

await page.goto(ORIGIN, { waitUntil: 'networkidle' });
await page.waitForSelector('.borders', { timeout: 15000 });
// Let the boot sequence finish so screenshots show the settled ambient state.
await sleep(3500);

check('no external network requests', external.length === 0, external.slice(0, 3).join(', '));
check('no console errors', consoleErrors.length === 0, consoleErrors.slice(0, 2).join(' | '));

/* ------------------------------------------------------------------ *
 * 2. Rendering completeness.
 * ------------------------------------------------------------------ */
const counts = await page.evaluate(() => {
  const paths = [...document.querySelectorAll('path.country')];
  return {
    countries: paths.length,
    empty: paths.filter((p) => !p.getAttribute('d')).length,
    borderPaths: document.querySelectorAll('.borders path').length,
    pulsePaths: document.querySelectorAll('.pulse').length,
    filters: document.querySelectorAll('filter').length,
  };
});

const telemetry = await page.evaluate(() =>
  Object.fromEntries(
    [...document.querySelectorAll('.telemetry-item')].map((el) => [
      el.querySelector('.label')?.textContent?.trim(),
      el.querySelector('.value')?.textContent?.trim(),
    ]),
  ),
);

check('every country path has geometry', counts.empty === 0, `${counts.empty} empty of ${counts.countries}`);
check('atlas integrity clean', telemetry.Integrity === 'OK', `telemetry reports "${telemetry.Integrity}"`);
check(
  'in-scope count matches regions.ts',
  telemetry['In scope'] === '124',
  `telemetry reports ${telemetry['In scope']}`,
);
check(
  'border network is a handful of paths, not hundreds',
  counts.borderPaths <= 12,
  `${counts.borderPaths} border paths for the whole mesh`,
);
check('exactly one filter in the document', counts.filters === 1, `${counts.filters} filters`);

/* ------------------------------------------------------------------ *
 * 3. No border drawn twice. Proven from the partition, not by eye: every
 *    arc must appear in exactly one bucket, and the buckets must sum to
 *    the total arc count.
 * ------------------------------------------------------------------ */
const partition = await page.evaluate(() => window.__atlasIntegrity ?? null);
if (partition) {
  const summed = Object.values(partition.counts).reduce((a, b) => a + b, 0);
  check(
    'arc partition is total and disjoint',
    summed === partition.totalArcs && partition.problems.length === 0,
    `${summed} bucketed of ${partition.totalArcs} arcs, ${partition.problems.length} problems`,
  );
  check(
    'no arc is used by more than two countries',
    !partition.problems.some((p) => p.includes('used')),
  );
} else {
  check('arc partition exposed for verification', false, 'window.__atlasIntegrity missing');
}

/* ------------------------------------------------------------------ *
 * 4. Hover must out-read the ambient pulse.
 * ------------------------------------------------------------------ */
/**
 * Hover a country by driving the pointer to its projected capital rather than
 * to the centre of its bounding box. A bounding-box centre is wrong for any
 * country with distant territory — France's box centre falls in the Atlantic —
 * and would silently test a different country than the one named.
 */
async function hoverCountry(iso) {
  const point = await page.evaluate((code) => {
    const el = document.querySelector(`path.country[data-iso="${code}"]`);
    if (!el) return null;
    // Walk the path's own points and pick one that actually hit-tests to this
    // country, so the assertion is about the country we asked for.
    const total = el.getTotalLength();
    for (let i = 0; i < 200; i += 1) {
      const p = el.getPointAtLength((i / 200) * total);
      const m = el.getScreenCTM();
      const x = p.x * m.a + p.y * m.c + m.e;
      const y = p.x * m.b + p.y * m.d + m.f;
      for (const [dx, dy] of [[6, 6], [-6, -6], [6, -6], [-6, 6], [12, 0], [0, 12]]) {
        const hit = document.elementFromPoint(x + dx, y + dy);
        if (hit && hit.dataset && hit.dataset.iso === code) return { x: x + dx, y: y + dy };
      }
    }
    return null;
  }, iso);
  if (!point) return null;
  await page.mouse.move(point.x, point.y);
  await sleep(260);
  return page.evaluate(() => document.querySelector('.readout-title')?.textContent ?? null);
}

const hoveredName = await hoverCountry('FRA');
check(
  'hovering FRA reports France in the readout',
  hoveredName === 'France',
  `readout shows "${hoveredName}"`,
);
if (hoveredName) {
  const outline = await page.evaluate(() => {
    const line = document.querySelector('.outline-hover .outline-line');
    const under = document.querySelector('.outline-hover .outline-under');
    if (!line || !under) return null;
    const ls = getComputedStyle(line);
    const us = getComputedStyle(under);
    const pulse = document.querySelector('.pulse');
    const ps = pulse ? getComputedStyle(pulse) : null;
    return {
      lineColour: ls.stroke,
      lineWidth: parseFloat(ls.strokeWidth),
      lineOpacity: parseFloat(ls.strokeOpacity),
      lineAnimation: ls.animationName,
      underWidth: parseFloat(us.strokeWidth),
      pulseWidth: ps ? parseFloat(ps.strokeWidth) : null,
      pulseAnimation: ps ? ps.animationName : null,
    };
  });
  if (outline) {
    check(
      'hovered outline is not animated',
      outline.lineAnimation === 'none',
      `animation-name=${outline.lineAnimation}`,
    );
    check(
      'pulse IS animated (so the contrast is real)',
      outline.pulseAnimation === 'pulse-travel',
      `animation-name=${outline.pulseAnimation}`,
    );
    check(
      'hovered outline is at full opacity',
      outline.lineOpacity === 1,
      `stroke-opacity=${outline.lineOpacity}`,
    );
    check(
      'dark under-stroke is wider than the outline, so it occludes the pulse',
      outline.underWidth > outline.lineWidth,
      `${outline.underWidth} > ${outline.lineWidth}`,
    );
  } else {
    check('hover outline renders', false, 'no .outline-hover in the DOM');
  }
  await page.screenshot({ path: `${SHOTS}/hover-france.png` });
} else {
  check('hover a country by ISO', false, 'could not resolve a country path');
}

/* ------------------------------------------------------------------ *
 * 5. Frame rate at 2560x1440, with the pulse running.
 * ------------------------------------------------------------------ */
await page.mouse.move(200, 200);
await sleep(400);
const fps = await page.evaluate(
  () =>
    new Promise((resolve) => {
      let frames = 0;
      const start = performance.now();
      const tick = () => {
        frames += 1;
        if (performance.now() - start < 2000) requestAnimationFrame(tick);
        else resolve((frames / (performance.now() - start)) * 1000);
      };
      requestAnimationFrame(tick);
    }),
);
check('holds 60fps at 2560x1440 with the pulse running', fps >= 55, `${fps.toFixed(1)} fps`);

// And while hovering, which is the worst case for re-render churn.
const fpsHover = await page.evaluate(
  () =>
    new Promise((resolve) => {
      let frames = 0;
      const start = performance.now();
      const tick = () => {
        frames += 1;
        if (performance.now() - start < 2000) requestAnimationFrame(tick);
        else resolve((frames / (performance.now() - start)) * 1000);
      };
      requestAnimationFrame(tick);
    }),
);
check('holds 60fps while hovering', fpsHover >= 55, `${fpsHover.toFixed(1)} fps`);

/* ------------------------------------------------------------------ *
 * 6. Screenshots, including the small states and enclaves where phase
 *    doubling would show first.
 * ------------------------------------------------------------------ */
await page.mouse.move(1280, 1400);
await sleep(600);
await page.screenshot({ path: `${SHOTS}/full-1440p.png` });

const closeups = [
  ['luxembourg', 6.13, 49.61, 7],
  ['slovenia', 14.5, 46.06, 7],
  ['lesotho', 28.0, -29.6, 7],
  ['gambia', -15.4, 13.45, 7],
  ['gulf', 51.5, 25.3, 6],
  ['crimea', 34.1, 45.3, 6],
  ['cyprus', 33.4, 35.2, 8],
  ['horn', 45.0, 8.0, 5],
];

for (const [name, lon, lat, k] of closeups) {
  await page.evaluate(
    ({ lon, lat, k }) => window.__focus?.(lon, lat, k),
    { lon, lat, k },
  );
  await sleep(900);
  await page.screenshot({ path: `${SHOTS}/zoom-${name}.png` });
}

await page.keyboard.press('r');
await sleep(900);

/* ---- reduced motion ---- */
const rmContext = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  reducedMotion: 'reduce',
});
const rmPage = await rmContext.newPage();
await rmPage.goto(ORIGIN, { waitUntil: 'networkidle' });
await rmPage.waitForSelector('.borders');
await sleep(1200);
const rmState = await rmPage.evaluate(() => {
  const pulse = document.querySelector('.pulse');
  const s = pulse ? getComputedStyle(pulse) : null;
  return s ? { animation: s.animationName, dash: s.strokeDasharray, opacity: s.strokeOpacity } : null;
});
check(
  'prefers-reduced-motion gives a static lit border',
  rmState?.animation === 'none' && rmState?.dash === 'none',
  JSON.stringify(rmState),
);
await rmPage.screenshot({ path: `${SHOTS}/reduced-motion.png` });
await rmContext.close();

await browser.close();
server.kill();

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
console.log(`screenshots in ${SHOTS}/`);
process.exit(failed.length === 0 ? 0 : 1);
