const { createHash } = require('crypto');

const arg = process.argv[2];

const salt = 'borrow recognize cable piece circumstance soul';
const plaintext = `${arg} ${salt}`

const hash = createHash('sha256').update(plaintext).digest('hex').slice(0, 128);

console.log(hash);
