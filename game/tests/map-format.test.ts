import * as fs from 'fs';
import * as path from 'path';
import * as assert from 'assert';

const file = fs.readFileSync(path.join(__dirname, '../data/map.txt'), 'utf8');

const MAP_WIDTH = 320;
const MAP_HEIGHT = 100;
const NEWLINE_COUNT = MAP_HEIGHT - 1;
const FILE_SIZE = MAP_WIDTH * MAP_HEIGHT + NEWLINE_COUNT;

try {
  assert.strictEqual(file.length, FILE_SIZE, 'file is the right size');
} catch (err) {
  console.error(formatError(err));
  process.exit(1);
}

console.log('all tests passed!\n');
process.exit(0);

function formatError(err) {
  return `\
    a test failed :(

    err says: ${err.message}
    we expected: \`${err.expected}\`, 
    but we got \`${err.actual}\` 
  `;
}
