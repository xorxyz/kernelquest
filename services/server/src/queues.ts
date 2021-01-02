import * as Queue from 'bee-queue';
import * as uuid from 'uuid';
import PlayerConnection from './connection';
import { connections } from './sockets';

const queues = {
  actions: new Queue('actions'),
};

function emit(userId, action, payload) {
  connections.forEach((connection) => {
    connection.emit(userId, action, payload);
  });
}

queues.actions.process(1, async (job, done) => {
  console.log('processing action:', job.id);

  const { userId, action, payload } = job.data;

  switch (job.data.cmd) {
    case 'say': {
      console.log('say:', payload);
      emit(userId, action, payload);

      break;
    }
    default:
      break;
  }

  done(null, `ok this job is done: ${job.id}`);
});

// queues.history.process(async (job, done) => {
//   // console.log('announcing event:', job.id);
//   // connections.forEach((connection) => {
//   //   connection.emit(job.data.userId, job.data.action, job.data.payload);
//   // });

//   // console.log('this happened:', job.data);
//   done(null, 'ok');
// });

export default queues;
