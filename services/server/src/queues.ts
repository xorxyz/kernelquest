const Queue = require('bee-queue');

const queues = {
  actions: new Queue('actions'),
};

export default queues;
