const { chromium } = require(process.env.UNB_PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const settle = () => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const scrollTrain = async y => {
    await page.evaluate(y => {
      const track = document.querySelector('.journey-track');
      const train = document.querySelector('.journey-train');
      const travel = track.clientHeight - train.offsetHeight - 12;
      window.scrollTo({ top: y / travel * (document.documentElement.scrollHeight - innerHeight), behavior: 'instant' });
    }, y);
    await settle();
  };
  const waitForTravel = () => page.waitForFunction(() => document.querySelector('.journey-track').dataset.phase === 'travel', undefined, { timeout: 3500 });
  const inspectDwell = async (id, width) => {
    await page.waitForFunction(id => {
      const track = document.querySelector('.journey-track');
      return track.dataset.phase === 'dwelling' && track.dataset.dwellStop === id;
    }, id, { timeout: 1500 });
    const parked = await page.locator('.journey-train').evaluate(train => train.style.transform);
    const cars = await page.locator('[data-car]').evaluateAll(cars => cars.map(car => car.getAttribute('transform')));
    const actors = page.locator(`[data-commuter="${id}"]`);
    await page.waitForFunction(id => [...document.querySelectorAll(`[data-commuter="${id}"]`)].every(person => Number(person.style.opacity) > 0.1), id, { timeout: 1500 });
    const peopleBefore = await actors.evaluateAll(people => people.map(person => person.style.transform));
    await page.waitForTimeout(160);
    assert.equal(await page.locator('.journey-train').evaluate(train => train.style.transform), parked, 'Train must remain stationary while passengers walk without further scrolling');
    assert.deepEqual(await page.locator('[data-car]').evaluateAll(cars => cars.map(car => car.getAttribute('transform'))), cars, 'Every car must hold its position and angle during the stop');
    assert.notDeepEqual(await actors.evaluateAll(people => people.map(person => person.style.transform)), peopleBefore, 'People must keep walking when scrolling stops');
    assert(await actors.evaluateAll(people => people.every(person => {
      const box = person.getBoundingClientRect();
      return box.left >= 0 && box.right <= innerWidth && box.width >= (innerWidth > 1100 ? 23.99 : 11.99);
    })), `${width}/${id}: stopped commuters must stay on screen`);
    if (id === 'about' && [1440, 320].includes(width)) await page.screenshot({ path: `docs/screenshots/station-dwell-${width}.png` });
    const dock = await page.locator('.journey-train').evaluate(train => new DOMMatrixReadOnly(getComputedStyle(train).transform).m42);
    await scrollTrain(dock + 100);
    assert.equal(await page.locator('.journey-train').evaluate(train => train.style.transform), parked, 'Page scroll must remain free while the train dwells');
    await waitForTravel();
    const departed = await page.locator('.journey-train').evaluate(train => new DOMMatrixReadOnly(getComputedStyle(train).transform).m42);
    assert(Math.abs(departed - dock - 100) < 2, 'Train resumes towards current scroll position after boarding finishes');
    assert.equal(await actors.evaluateAll(people => people.filter(person => Number(person.style.opacity) > 0).length), 0, 'All commuters clear the doors before departure');
  };
  fs.mkdirSync('docs/screenshots', { recursive: true });
  try {
    const signatures = new Map();
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      for (const member of ['kobe', 'ian', 'tyrone', 'allen', 'tristan']) {
        await page.goto(`http://127.0.0.1:5173/#/team/${member}`);
        const dialog = page.getByRole('dialog');
        await dialog.waitFor();
        const background = dialog.locator('.profile-stamps');
        await background.locator('img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
        await dialog.evaluate(element => Promise.all(element.getAnimations().map(animation => animation.finished)));
        await settle();
        assert.equal(await background.locator('img').count(), 2);
        assert.equal(await dialog.getByText('Collected along the line').count(), 0);
        assert(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth + 1), `${member}/${width}: profile overflow`);
        const stamps = await background.evaluate(element => {
          const area = element.getBoundingClientRect();
          return [...element.querySelectorAll('img')].map(image => {
            const box = image.getBoundingClientRect();
            return { src: image.getAttribute('src'), rotation: image.style.transform,
              opacity: Number(getComputedStyle(image).opacity),
              contained: box.left >= area.left && box.right <= area.right && box.top >= area.top && box.bottom <= area.bottom };
          });
        });
        assert(stamps.every(stamp => stamp.contained && stamp.opacity > 0 && stamp.opacity <= 0.16), `${member}/${width}: background containment/readability`);
        const signature = stamps.map(stamp => stamp.src + stamp.rotation).join('|');
        if (signatures.has(member)) assert.equal(signature, signatures.get(member), 'Member stamps must survive reopening and resizing');
        else signatures.set(member, signature);
        if (member === 'ian') await page.screenshot({ path: `docs/screenshots/revised-pass-${width}.png` });
        await page.keyboard.press('Escape');
        await dialog.waitFor({ state: 'hidden' });
      }
    }
    assert.equal(new Set(signatures.values()).size, 5);

    for (const width of [1440, 1101, 1100, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('http://127.0.0.1:5173/');
      await page.evaluate(() => document.fonts.ready);
      await settle();
      assert.equal(await page.locator('[data-car]').count(), 3);
      assert.equal(await page.locator('[data-coupling]').count(), 2);
      const geometry = await page.evaluate(() => {
        const train = document.querySelector('.journey-train');
        const track = document.querySelector('.journey-track');
        const origin = track.getBoundingClientRect().top;
        return { travel: track.clientHeight - train.offsetHeight - 12,
          offsets: [...document.querySelectorAll('[data-car]')].map(car => new DOMPoint(22, 36).matrixTransform(car.getScreenCTM()).y - origin),
          stops: [...document.querySelectorAll('.journey-station')].map(stop => ({ id: stop.dataset.stop, top: parseFloat(stop.style.top) + track.clientWidth / 2 })) };
      });
      await inspectDwell('home', width);
      for (const stop of geometry.stops.slice(1)) {
        const dock = Math.max(0, Math.min(geometry.travel, stop.top - geometry.offsets[1]));
        await scrollTrain(dock - 40);
        await waitForTravel();
        await scrollTrain(dock + 12);
        await inspectDwell(stop.id, width);
      }
      if (width > 1100) {
        const entry = geometry.stops[1].top - 22 - 180 - geometry.offsets[1];
        await scrollTrain(entry);
        await waitForTravel();
        const angles = await page.locator('[data-car]').evaluateAll(cars => cars.map(car => {
          const matrix = car.transform.baseVal.consolidate().matrix;
          return Math.atan2(matrix.b, matrix.a) * 180 / Math.PI;
        }));
        assert(Math.abs(angles[0]) < 0.01, 'Rear car outside bend must stay straight');
        assert(Math.abs(angles[2]) > 1, 'Front car in bend must turn independently');
      }
      // Check real rendered car centers and coupling endpoints against SVG track geometry.
      for (const step of [0.18, 0.26, 0.35, 0.5, 0.65, 0.82]) {
        await scrollTrain(geometry.travel * step);
        assert(await page.evaluate(() => {
          const cars = [...document.querySelectorAll('[data-car]')];
          const rail = document.querySelector('.journey-rails path');
          const railMatrix = rail.getScreenCTM();
          const railLength = rail.getTotalLength();
          for (const car of cars) {
            const center = new DOMPoint(22, 36).matrixTransform(car.getScreenCTM());
            let distance = Infinity;
            for (let tick = 0; tick <= railLength; tick += 1) {
              const point = rail.getPointAtLength(tick).matrixTransform(railMatrix);
              distance = Math.min(distance, Math.hypot(point.x - center.x, point.y - center.y));
            }
            if (distance > 1.5) return false;
          }
          return [...document.querySelectorAll('[data-coupling]')].every((joint, index) => {
            const length = joint.getTotalLength();
            const a = joint.getPointAtLength(0).matrixTransform(joint.getScreenCTM());
            const b = joint.getPointAtLength(length).matrixTransform(joint.getScreenCTM());
            const carA = new DOMPoint(22, 72).matrixTransform(cars[index].getScreenCTM());
            const carB = new DOMPoint(22, 0).matrixTransform(cars[index + 1].getScreenCTM());
            return Math.hypot(a.x - carA.x, a.y - carA.y) < 0.1 && Math.hypot(b.x - carB.x, b.y - carB.y) < 0.1;
          });
        }), `Cars/couplings must follow the track at ${width}/${step}`);
      }
      await scrollTrain(geometry.travel);
      await waitForTravel();
      assert.equal(await page.locator('[data-commuter]').evaluateAll(people => people.filter(person => Number(getComputedStyle(person).opacity) > 0).length), 0);
      assert(await page.locator('.journey-train').evaluate(element => {
        const box = element.getBoundingClientRect();
        const buffer = document.querySelector('.journey-buffer').getBoundingClientRect();
        return box.top >= 0 && box.bottom <= innerHeight && box.bottom <= buffer.top + 1;
      }), 'Train must stop above the buffer');
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No page overflow');
      if (width === 320) {
        assert.equal(await page.locator('#team').getAttribute('data-scroll-mode'), 'pinned', 'The compact gutter must preserve the team browsing interaction');
        await page.evaluate(() => {
          const team = document.querySelector('#team');
          const start = team.getBoundingClientRect().top + scrollY - 64;
          window.scrollTo({ top: start + parseFloat(team.style.getPropertyValue('--team-travel')), behavior: 'instant' });
        });
        await settle();
        assert(await page.locator('.team-scroller').evaluate(scroller => {
          const view = scroller.getBoundingClientRect();
          const last = scroller.querySelector('.member-card:last-child').getBoundingClientRect();
          return last.left >= view.left - 1 && last.right <= view.right + 1;
        }), 'The final team card must fit beside the compact passenger gutter');
      }
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await settle();
      assert(await page.locator('.journey-passenger').evaluateAll(people => people.every(person => getComputedStyle(person).display === 'none')));
      assert.equal(await page.locator('.journey-train').evaluate(train => new DOMMatrixReadOnly(getComputedStyle(train).transform).m42), 0);
      await page.emulateMedia({ reducedMotion: 'no-preference' });
    }
    assert.deepEqual(errors, []);
    console.log('PASS: timed station dwell, stationary cars while all six passengers walk without scrolling, free page scroll and departure after boarding; seeded backgrounds, articulated geometry, buffer, mobile/reduced motion at five widths.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
