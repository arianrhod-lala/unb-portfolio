import test from 'node:test';
import assert from 'node:assert/strict';
import { profileStamps } from '../src/utils/profileStamps.ts';
import * as motion from '../src/utils/journeyMotion.ts';

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
