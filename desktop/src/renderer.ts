import { Engine } from 'xor5-game/src';
import { SystemIO } from './components/system_io';
import { Terminal } from './components/terminal';
import { AudioPlayer } from './components/audio_player';

import 'tachyons/css/tachyons.css';
import 'xterm/css/xterm.css';
import './index.css';

let minimized = false;

window.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded');
  const systemIO = new SystemIO();
  const terminal = new Terminal('terminal');
  const audioPlayer = new AudioPlayer('audio-player');

  const engine = new Engine({
    systemIO,
    terminal,
    audioPlayer,
  });

  // Pause the engine when the window is not visible
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && engine.running) {
      minimized = true;
      engine.pause();
    }

    if (document.visibilityState === 'visible' && minimized) {
      minimized = false;
      engine.start();
    }
  });

  if (!document.hidden) {
    engine.start();
  } else {
    minimized = true;
  }
});
