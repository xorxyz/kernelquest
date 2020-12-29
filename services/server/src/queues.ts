import * as Queue from 'bee-queue';

const queues = {
  actions: new Queue('actions'),
};

queues.actions.process(async (job, done) => {
  console.log('processing job:', job.id);
  done(null, `ok this job is done: ${job.id}`);
});

export default queues;
