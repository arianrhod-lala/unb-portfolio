const { chromium } = require(process.env.UNB_PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const settle = () => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const scrollTo = async top => {
    await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), top);
    await settle();
  };
  const signatures = new Map();
  fs.mkdirSync('docs/screenshots', { recursive: true });
  try {
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      for (const member of ['kobe', 'ian', 'tyrone', 'allen', 'tristan']) {
        await page.goto(`http://127.0.0.1:5173/#/team/${member}`);
        const dialog = page.getByRole('dialog');
        await dialog.waitFor();
        await dialog.locator('.profile-stamps img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
        await settle();
        assert.equal(await dialog.locator('.profile-stamps img').count(), 5);
        assert(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth + 1), `${member}/${width}: profile overflows`);
        const stamps = await dialog.locator('.profile-stamps').evaluate(element => {
          const area = element.getBoundingClientRect();
          const sheet = element.closest('.profile-pass-sheet').getBoundingClientRect();
          return [...element.querySelectorAll('img')].map(image => {
            const box = image.getBoundingClientRect();
            return { src: image.getAttribute('src'), rotation: image.style.transform,
              contained: box.left >= area.left && box.right <= area.right && box.top >= area.top && box.bottom <= area.bottom && box.left >= sheet.left && box.right <= sheet.right };
          });
        });
        assert(stamps.every(stamp => stamp.contained), `${member}/${width}: rotated stamp crosses its border`);
        const signature = stamps.map(stamp => stamp.src + stamp.rotation).join('|');
        if (signatures.has(member)) assert.equal(signature, signatures.get(member), 'Collection must survive reopening and resizing');
        else signatures.set(member, signature);
        if (member === 'ian') {
          await dialog.locator('.profile-stamps').scrollIntoViewIfNeeded();
          await page.screenshot({ path: `docs/screenshots/transit-profile-${width}.png` });
        }
        await page.keyboard.press('Escape');
        await dialog.waitFor({ state: 'hidden' });
      }
    }
    assert.equal(new Set(signatures.values()).size, 5, 'Profiles must have different collections');

    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('http://127.0.0.1:5173/');
      await page.evaluate(() => document.fonts.ready);
      await settle();
      assert.equal(await page.locator('.journey-train [data-car]').count(), 4);
      const visibleBoarders = () => page.locator('[data-boarding]').evaluateAll(people => people.filter(person => Number(getComputedStyle(person).opacity) > 0).length);
      assert(await visibleBoarders() > 0, 'People enter from above at origin');
      const geometry = await page.evaluate(() => {
        const track = document.querySelector('.journey-track');
        const train = document.querySelector('.journey-train');
        const travel = track.clientHeight - train.offsetHeight - 12;
        const maxScroll = document.documentElement.scrollHeight - innerHeight;
        return { maxScroll, travel, width: track.clientWidth, trainWidth: train.clientWidth,
          stops: [...document.querySelectorAll('.journey-station')].map(stop => ({ id: stop.dataset.stop, top: parseFloat(stop.style.top) })) };
      });
      for (const [index, stop] of geometry.stops.entries()) {
        const start = Math.max(0, Math.min(geometry.travel - 150, stop.top + geometry.width / 2 - 34 * geometry.trainWidth / 44));
        const target = (start + 60) / geometry.travel * geometry.maxScroll;
        await scrollTo(target);
        const people = page.locator(`[data-exit="${stop.id}"]`);
        assert.equal(await people.evaluateAll(people => people.filter(person => Number(getComputedStyle(person).opacity) > 0.1).length), index % 2 + 1, `${width}/${stop.id}: expected 1–2 exits`);
        const snapshot = await people.evaluateAll(people => people.map(person => [person.style.transform, person.style.opacity]));
        assert(await people.evaluateAll(people => people.every(person => {
          const box = person.getBoundingClientRect();
          return box.left >= 0 && box.right <= innerWidth;
        })), 'Commuters leave inside the screen');
        if (width === 1440 && stop.id === 'about') await page.screenshot({ path: 'docs/screenshots/transit-passengers-desktop.png' });
        await scrollTo((start + 180) / geometry.travel * geometry.maxScroll);
        assert.equal(await people.evaluateAll(people => people.filter(person => Number(getComputedStyle(person).opacity) > 0).length), 0, 'People disappear after leaving');
        await scrollTo(target);
        const reversed = await people.evaluateAll(people => people.map(person => [person.style.transform, person.style.opacity]));
        assert.deepEqual(reversed, snapshot, 'Reverse scrolling restores the same scene');
      }
      await scrollTo(geometry.maxScroll);
      assert.equal(await visibleBoarders(), 0);
      assert.equal(await page.locator('[data-exit]').evaluateAll(people => people.filter(person => Number(getComputedStyle(person).opacity) > 0).length), 0);
      assert(await page.locator('.journey-train__model').evaluate(element => {
        const box = element.getBoundingClientRect();
        const buffer = document.querySelector('.journey-buffer').getBoundingClientRect();
        return box.top >= 0 && box.bottom <= innerHeight && box.bottom <= buffer.top + 1;
      }), 'Four-car train stops above the buffer');
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await settle();
      assert(await page.locator('.journey-passenger').evaluateAll(people => people.every(person => getComputedStyle(person).display === 'none')));
      assert.equal(await page.locator('.journey-train').evaluate(train => new DOMMatrixReadOnly(getComputedStyle(train).transform).m42), 0);
      await page.emulateMedia({ reducedMotion: 'no-preference' });
    }
    assert.deepEqual(errors, []);
    console.log('PASS: stable individual collections and stamp containment for all five profiles at 1440/390/320px; four cars; boarding, 1–2 exits at every station, reverse/jump scroll, buffer and reduced motion.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
