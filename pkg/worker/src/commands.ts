import * as Queue from 'bee-queue';

console.log('hi');

const helpMessage = `hi! welcome to xor.
`;

const queue = new Queue('commands');

queue.process(1, processCommand);

export default {
  queue,
};

async function processCommand(job, done) {
  console.log('processing command:', job.id);

  let message = 'command not found';

  switch (job.data.cmd) {
    case 'help': {
      message = helpMessage;

      break;
    }
    case 'whoami': {
      message = job.data.userId;

      break;
    }
    case 'move': {
      message = '';

      // todo: move

      break;
    }
    default:
      break;
  }

  done(null, message);
}
