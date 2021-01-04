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

  const message = 'command not found';

  switch (job.data.cmd) {
    case 'say': {
      // console.log('say:', payload);
      // broadcast(connections, userId, action, payload);

      break;
    }
    default:
      break;
  }

  done(null, message);
}
