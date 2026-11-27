const { chromium } = require(process.env.UNB_PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const expected = ['Ian', 'Tyrone', 'Allen', 'Tristan', 'Kobe'];
  fs.mkdirSync('docs/screenshots', { recursive: true });
  try {
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('http://127.0.0.1:5173/');
      await page.evaluate(() => document.fonts.ready);
      await page.waitForSelector('#team[data-scroll-mode="pinned"]');
      assert.deepEqual(await page.locator('.member-handle').allTextContents(), expected, 'Team cards must retain the published member order');
      assert.deepEqual(await page.locator('.team-station-index button').evaluateAll(buttons => buttons.map(button => button.childNodes[1].textContent)), expected, 'Member index must use the same order');
      assert.equal(await page.locator('[data-car]').count(), 3, 'Approved three-car train must remain');
      const scroller = page.locator('.team-scroller');
      await scroller.focus();
      await page.keyboard.press('End');
      await page.waitForFunction(() => {
        const scroller = document.querySelector('.team-scroller');
        const view = scroller.getBoundingClientRect();
        const card = scroller.querySelector('.member-card:last-child').getBoundingClientRect();
        return card.left >= view.left - 1 && card.right <= view.right + 1;
      });
      await page.screenshot({ path: `docs/screenshots/integration-kobe-last-${width}.png` });
      await page.locator('.member-card:last-child .view-profile-btn').click();
      const dialog = page.getByRole('dialog');
      await dialog.waitFor();
      assert.equal(await dialog.locator('.modal-title').textContent(), 'Kobe');
      assert.match(await dialog.locator('.member-pass-banner__route').textContent(), /Member 5 of 5/);
      assert.match(await dialog.locator('.profile-photo').getAttribute('src'), /^\/images\/kobe-profile\.jpg/);
      await dialog.locator('.profile-photo').evaluate(image => image.decode());
      assert.equal(await dialog.locator('.profile-stamps img').count(), 2, 'Preview background stamps must remain');
      await dialog.locator('.profile-modal-footer').getByRole('button', { name: /Ian/ }).click();
      await page.waitForFunction(() => document.querySelector('.modal-title')?.textContent === 'Ian');
      assert.equal(await dialog.locator('.modal-title').textContent(), 'Ian', 'Last member must wrap to the new first member');
      assert.match(await dialog.locator('.member-pass-banner__route').textContent(), /Member 1 of 5/);
      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'hidden' });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    }
    assert.deepEqual(errors, []);
    console.log('PASS: published member order, Kobe last/5 of 5 with latest portrait, wrap to Ian first, preview train/stamps retained, last-card access at 1440/390/320px.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
