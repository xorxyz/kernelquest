import * as assert from 'assert'

export default function run(runner) {
  try {
    runner()
  } catch (err) {
    console.error(formatError(err));
    process.exit(1);
  }
  
  console.log('all tests passed!\n');
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
