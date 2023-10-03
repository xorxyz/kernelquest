import path from 'path';
import budo from 'budo';
import build from './build';

process.env.NODE_ENV = 'development';

const PORT = 8080;

runBuild();

const b = budo('./src/index.js', {
  live: true,
  port: PORT,
  dir: path.join(__dirname, '../dist'),
  watchGlob: ['!dist/**', '**/*.{md,pug,styl,yml,png}'],
  staticOptions: {
    extensions: ['html'],
  },
}).on('connect', () => {
  console.log(`Serving site at http://localhost:${PORT}`);
}).on('watch', () => {
  runBuild();
  b.reload();
});

function runBuild() {
  try {
    build();
  } catch (err) {
    console.log(err);
  }
}
