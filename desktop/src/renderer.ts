import './index.css';
import 'xterm/css/xterm.css';
import 'tachyons/css/tachyons.css';
import { Engine } from 'xor4-game/src/engine';
import { Buffer } from 'buffer';
import { fitAddon, createTerm } from './term';

window.addEventListener('load', async () => {
  const terminalEl = document.querySelector('#terminal') as HTMLElement;
  if (!terminalEl) throw new Error('Cant find the element.');

  const audioEl = document.querySelector('#audio-player') as HTMLAudioElement;
  if (!audioEl) throw new Error('Cant find audio player element');

  const term = createTerm();
  term.open(terminalEl);

  const engine = new Engine({
    send: (str) => term.write(str),
  });

  await engine.init();

  await engine.load();

  engine.start();

  document.addEventListener('click', () => term.focus());

  term.onKey(({ key }) => {
    const input = Buffer.from(key).toString('hex');
    engine.handleInput(input);
  });

  term.focus();
  fitAddon.fit();

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
