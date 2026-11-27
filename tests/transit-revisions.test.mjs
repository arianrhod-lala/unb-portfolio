import test from 'node:test';
import assert from 'node:assert/strict';
import { profileStamps } from '../src/utils/profileStamps.ts';
import { passengerPose } from '../src/utils/journeyMotion.ts';

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

test('passengers board from above and disappear into the train without lingering', () => {
  const start = passengerPose(0, 'board', 44);
  const midway = passengerPose(0.5, 'board', 44);
  assert(start.y < midway.y);
  assert(start.opacity > 0);
  assert.equal(passengerPose(1, 'board', 44).opacity, 0);
  assert.equal(passengerPose(2, 'board', 44).opacity, 0);
});

test('exiting passengers walk outward, fade away, and scrub back without stale state', () => {
  assert.equal(passengerPose(-0.1, 'exit', 44).opacity, 0);
  const early = passengerPose(0.2, 'exit', 44);
  const late = passengerPose(0.7, 'exit', 44);
  assert(late.x > early.x);
  assert(late.opacity > 0);
  assert.equal(passengerPose(1, 'exit', 44).opacity, 0);
  assert.deepEqual(passengerPose(0.2, 'exit', 44), early);
  const compact = passengerPose(0.7, 'exit', 16);
  assert(compact.x < late.x);
  assert(compact.x >= 0 && compact.x <= 12);
});
