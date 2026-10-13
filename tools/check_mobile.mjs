// Проверка презентаций в браузере: телефон 390×844 и десктоп 1280×720.
// Запуск: python3 -m http.server 8080 & BASE=http://localhost:8080 node tools/check_mobile.mjs [<id> ...]
// Нужен playwright (CI ставит сам; локально — PW=<путь к playwright-core>, CHROME=<путь к Chrome>).
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW || 'playwright');
const ROOT = path.dirname(path.dirname(new URL(import.meta.url).pathname));
const BASE = process.env.BASE || 'http://localhost:8080';
const LIMIT = { phoneKB: 1500, desktopKB: 2500 };   // вес первой загрузки, без догрузки в фоне
const SKIP = new Set(['instructions', 'i', 'components', 'tools', '.git', '.github']);
const exc = fs.existsSync(path.join(ROOT, 'tools/deck-exceptions.json'))
  ? JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/deck-exceptions.json'), 'utf8')) : {};
const decks = process.argv.slice(2).length ? process.argv.slice(2)
  : fs.readdirSync(ROOT).filter((d) => !SKIP.has(d) && fs.existsSync(path.join(ROOT, d, 'index.html'))).sort();

async function measure(browser, deck, phone) {
  const ctx = await browser.newContext(phone
    ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
    : { viewport: { width: 1280, height: 720 } });
  const page = await ctx.newPage();
  let bytes = 0;
  page.on('response', async (r) => { try { const b = await r.body(); bytes += b.length; } catch (e) {} });
  await page.goto(`${BASE}/${deck}/`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(250);   // до фоновой догрузки снимков (она стартует после load + 300 мс)
  const kbFirst = Math.round(bytes / 1024);
  const res = await page.evaluate(() => {
    const iw = innerWidth, over = new Set();
    const scrollable = (e) => { for (let p = e; p && p !== document.body && p !== document.documentElement; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if (o === 'auto' || o === 'scroll') return true; } return false; };
    document.querySelectorAll('body *').forEach((e) => {
      const r = e.getBoundingClientRect();
      if (r.width > 0 && r.height > 0 && r.right > iw + 2 && !scrollable(e.parentElement)) over.add(e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.split(' ')[0] : ''));
    });
    const visible = [...document.querySelectorAll('section, .slide')].filter((s) => { const r = s.getBoundingClientRect(); return r.width > 200 && r.height > 100; }).length;
    // Видимый размер первого заголовка с учётом масштаба: ловит «слайд ужат в мелкую колонку».
    const h = [...document.querySelectorAll('h1, h2')].find((e) => e.getBoundingClientRect().width > 0);
    const headPx = h ? Math.round(parseFloat(getComputedStyle(h).fontSize) * h.getBoundingClientRect().width / (h.offsetWidth || 1)) : 0;
    return { docW: document.documentElement.scrollWidth, iw, over: [...over].slice(0, 6), visible, headPx };
  });
  await ctx.close();
  return { kbFirst, ...res };
}

const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
let failed = false;
for (const d of decks) {
  const errs = [];
  const ph = await measure(browser, d, true);
  const dt = await measure(browser, d, false);
  if (ph.docW > ph.iw + 2) errs.push(`телефон: страница шире экрана (${ph.docW} > ${ph.iw}) — горизонтальная прокрутка`);
  if (ph.over.length) errs.push(`телефон: за правый край вылезают ${ph.over.join(', ')}`);
  if (!ph.visible) errs.push('телефон: не видно ни одного слайда крупнее 200×100');
  if (ph.headPx && ph.headPx < 22) errs.push(`телефон: заголовок виден размером ${ph.headPx}px — слайд ужат, нужен режим ленты`);
  if (ph.kbFirst > LIMIT.phoneKB) errs.push(`телефон: первая загрузка ${ph.kbFirst} КБ (лимит ${LIMIT.phoneKB})`);
  if (dt.kbFirst > LIMIT.desktopKB) errs.push(`десктоп: первая загрузка ${dt.kbFirst} КБ (лимит ${LIMIT.desktopKB})`);
  const soft = d in exc;
  console.log(`${errs.length ? (soft ? '!' : '✗') : '✓'} ${d}  телефон ${ph.kbFirst} КБ, заголовок ${ph.headPx}px · десктоп ${dt.kbFirst} КБ`);
  errs.forEach((e) => console.log(`    ${soft ? 'внимание' : 'ошибка'}: ${e}${soft ? ' (исключение)' : ''}`));
  if (errs.length && !soft) failed = true;
}
await browser.close();
process.exit(failed ? 1 : 0);
