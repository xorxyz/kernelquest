import * as cluster from 'cluster';
import * as os from 'os';
import server from './server';

const isProd = process.env.NODE_ENV === 'production';
const numCPUs = isProd ? os.cpus().length : 2;
const PORT = process.env.PORT || 3000;

if (isProd && cluster.isMaster) {
  runAsManager();
} else {
  runAsWorker();
}

function runAsManager() {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
  });
}

function runAsWorker() {
  console.log(`Worker ${process.pid} started`);
  const app = server();

  app.listen(Number(PORT), () => console.log('listening on ', PORT));
}
