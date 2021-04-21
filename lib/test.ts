import * as assert from 'assert';
import { esc, Style } from './esc';

export default function run(runner) {
  try {
    runner();
  } catch (err) {
    console.error(formatError(err));
    process.exit(1);
  }

  console.log(`${esc(Style.Invert)}all tests passed!\n${esc(Style.Reset)}`);
  process.exit(0);
}

function formatError(err: assert.AssertionError) {
  return `\
    a test failed :(

    err says: ${err.message}
    we expected: \`${err.expected}\`, 
    but we got \`${err.actual}\` 
  `;
}
