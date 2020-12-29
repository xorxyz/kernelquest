import * as Queue from 'bee-queue';

const queues = {
  actions: new Queue('actions'),
};

queues.actions.process(1, async (job, done) => {
  console.log('processing job:', job.data);
  done(null, `ok this job is done: ${job.id}`);
});

export default queues;
