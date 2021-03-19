import * as fs from 'fs';
import * as path from 'path';
import * as assert from 'assert';
import test from '../lib/test';

test(() => {
  const file = fs.readFileSync(path.join(__dirname, '../data/map.txt'), 'utf8');

  const MAP_WIDTH = 320;
  const MAP_HEIGHT = 100;
  const NEWLINE_COUNT = MAP_HEIGHT - 1;
  const FILE_SIZE = MAP_WIDTH * MAP_HEIGHT + NEWLINE_COUNT;

  assert.strictEqual(file.length, FILE_SIZE, 'file is the right size');
});
