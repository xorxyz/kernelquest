import './index.css';
import 'xterm/css/xterm.css';
import 'tachyons/css/tachyons.css';
import { Engine } from 'xor4-game/src/engine';
import { Buffer } from 'buffer';
import { term } from './term';

document.addEventListener('DOMContentLoaded', async () => {
  const terminalEl = document.querySelector('#terminal') as HTMLElement;
  if (!terminalEl) throw new Error('Cant find the element.');

  const audioEl = document.querySelector('#audio-player') as HTMLAudioElement;
  if (!audioEl) throw new Error('Cant find audio player element');

  const engine = new Engine({
    send: (str) => term.write(str),
  });

  term.onKey(({ key }) => {
    const input = Buffer.from(key).toString('hex');
    engine.handleInput(input);
  });

  term.open(terminalEl);
  term.focus();

  document.addEventListener('click', () => term.focus());

  await engine.init();

  engine.start();

  registerSoundEvents(engine.events, audioEl);

  global.engine = engine;
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
