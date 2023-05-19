import './index.css';
import 'xterm/css/xterm.css';
import 'tachyons/css/tachyons.css';
import { Engine } from 'xor4-game/src/engine';
import { Buffer } from 'buffer';
import { fitAddon, createTerm } from './term';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'xor4-game/src/shared';

console.log('PAGE WAS RELOADED')

window.addEventListener('load', async () => {
  console.log('ON LOAD');
  const terminalEl = document.querySelector('#terminal') as HTMLElement;
  if (!terminalEl) throw new Error('Cant find the element.');

  const audioEl = document.querySelector('#audio-player') as HTMLAudioElement;
  if (!audioEl) throw new Error('Cant find audio player element');

  const term = createTerm(terminalEl);

  const engine = new Engine({
    send: (str) => term.write(str),
  });
  global.engine = engine;

  term.onKey(({ key }) => {
    const input = Buffer.from(key).toString('hex');
    engine.handleInput(input);
  });

  await engine.init();

  await engine.load();

  registerSoundEvents(engine.events, audioEl);

  engine.start();
  term.focus();
});

function registerSoundEvents(bus, el) {
  const events = [
    'fail',
    'step',
    'rotate',
  ];

  events.forEach((name) => {
    bus.on(`sound:${name}`, () => {
      el.src = `main_window/assets/sounds/${name}.wav`;
      el.currentTime = 0;
      el.play();
    });
  });
}
