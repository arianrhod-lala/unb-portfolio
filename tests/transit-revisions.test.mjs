import test from 'node:test';
import assert from 'node:assert/strict';
import { profileStamps } from '../src/utils/profileStamps.ts';
import * as motion from '../src/utils/journeyMotion.ts';
import * as journey from '../src/utils/stationJourney.ts';

test('a station dwell holds the train while boarding advances without more scrolling', () => {
  assert.equal(typeof journey.StationJourney, 'function');
  const controller = new journey.StationJourney();
  const stops = [{ id: 'home', y: 0 }, { id: 'about', y: 500 }];
  controller.step(100, 0, stops);
  assert.equal(controller.step(510, 100, stops).phase, 'arriving');
  const early = controller.step(510, 500, stops);
  const late = controller.step(510, 1200, stops);
  assert.equal(early.y, 500);
  assert.equal(late.y, 500);
  assert.equal(early.phase, 'dwelling');
  assert.equal(early.stopId, 'about');
  assert(late.dwellProgress > early.dwellProgress);
  assert.equal(late.needsFrame, true);
  assert.equal(controller.step(550, 2150, stops).phase, 'departing');
  const finished = controller.step(550, 2500, stops);
  assert.equal(finished.y, 550);
  assert.equal(finished.phase, 'travel');
  assert.equal(finished.needsFrame, false);
  assert.equal(controller.step(550, 2600, stops).phase, 'travel');
});

test('large scroll jumps cancel or skip dwell and never queue missed stations', () => {
  const controller = new journey.StationJourney();
  const stops = [{ id: 'home', y: 0 }, { id: 'about', y: 500 }, { id: 'team', y: 1200 }];
  controller.step(100, 0, stops);
  assert.equal(controller.step(510, 100, stops).phase, 'arriving');
  const skipped = controller.step(2000, 300, stops);
  assert.equal(skipped.y, 2000);
  assert.equal(skipped.phase, 'travel');
  assert.equal(skipped.needsFrame, false);
  assert.equal(controller.step(2000, 4000, stops).phase, 'travel');
  assert.equal(controller.step(1190, 4200, stops).stopId, 'team', 'Reverse crossing can stop once again');
  controller.reset(800);
  const reset = controller.step(800, 4500, stops);
  assert.equal(reset.y, 800);
  assert.equal(reset.stopId, null);
});

test('origin boarding starts while parked and settles without an endless animation loop', () => {
  const controller = new journey.StationJourney();
  const stops = [{ id: 'home', y: 0 }];
  const start = controller.step(0, 0, stops);
  assert.equal(start.y, 0);
  assert.equal(start.phase, 'dwelling');
  assert.equal(start.stopId, 'home');
  assert(controller.step(0, 900, stops).dwellProgress > start.dwellProgress);
  const end = controller.step(0, 2500, stops);
  assert.equal(end.phase, 'travel');
  assert.equal(end.needsFrame, false);
});

test('each current member keeps a distinct repeatable stamp collection with no duplicates', () => {
  const members = ['kobe', 'ian', 'tyrone', 'allen', 'tristan'];
  const collections = members.map(id => profileStamps(id));
  for (const [index, collection] of collections.entries()) {
    assert.equal(collection.length, 10);
    assert.equal(new Set(collection.map(stamp => stamp.src)).size, 10);
    assert.deepEqual(collection, profileStamps(members[index]));
  }
  assert.equal(new Set(collections.map(stamps => stamps.slice(0, 5).map(stamp => stamp.src).join(','))).size, 5);
});

test('only cars in a bend turn; each car stays on its own track position', () => {
  assert.equal(typeof motion.trainCarPoses, 'function');
  const bends = [{ start: 100, end: 260, amplitude: 24 }];
  const cars = motion.trainCarPoses(0, 1, 44, bends);
  assert.equal(cars.length, 3);
  assert(cars[0].angle === 0);
  assert.equal(cars[0].x, 22);
  assert(Math.abs(cars[1].angle) > 1);
  assert(Math.abs(cars[2].angle - cars[1].angle) > 1);
  for (const car of cars) assert.equal(car.x, 22 + motion.trackOffset(car.y, bends));
  const straight = motion.trainCarPoses(300, 1, 44, bends);
  assert(straight.every(car => car.angle === 0 && car.x === 22));
  assert.deepEqual(motion.trainCarPoses(0, 1, 44, bends), cars);
});

test('commuters board and exit opposite side doors, disappearing outside their scene', () => {
  assert.equal(typeof motion.commuterPose, 'function');
  const car = { x: 22, y: 150, angle: 0 };
  const pose = (progress, kind, side, compact = false) => motion.commuterPose(progress, kind, car, 150, side, compact ? 16 / 44 : 52 / 44, compact);
  for (const side of [-1, 1]) {
    const entering = [pose(0.2, 'board', side), pose(0.8, 'board', side)];
    assert(Math.abs(entering[1].x - car.x) < Math.abs(entering[0].x - car.x));
    const exiting = [pose(0.2, 'exit', side), pose(0.8, 'exit', side)];
    assert(Math.abs(exiting[1].x - car.x) > Math.abs(exiting[0].x - car.x));
    assert.equal(Math.sign(exiting[1].x - car.x), side);
    assert(exiting[1].opacity > 0);
    for (const kind of ['board', 'exit']) {
      assert.equal(pose(-0.1, kind, side).opacity, 0);
      assert.equal(pose(1.1, kind, side).opacity, 0);
    }
  }
  const compact = pose(0.7, 'exit', -1, true);
  assert(compact.x >= 0, 'Left-side compact commuters must stay on screen');
  const before = pose(0.2, 'exit', 1);
  pose(0.9, 'exit', 1);
  assert.deepEqual(pose(0.2, 'exit', 1), before);
});
