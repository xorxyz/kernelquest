import * as Queue from 'bee-queue';
// import { broadcast } from '../utils';
// import { connections } from '../sockets';

const queue = new Queue('commands');

queue.process(1, processCommand);

export default {
  queue,
};

async function processCommand(job, done) {
  console.log('processing command:', job.id);

  // const { userId, action, payload } = job.data;

  let message = 'command not found';

  switch (job.data.cmd) {
    case 'move': {
      // broadcast(connections, userId, action, payload);
      console.log('move!', job.data);
      message = '';

      break;
    }
    default:
      break;
  }

  done(null, message);
}
