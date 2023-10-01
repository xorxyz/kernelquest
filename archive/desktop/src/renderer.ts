import { Engine } from 'xor5-game/src';
import { SystemIO } from './components/system_io';
import { Terminal } from './components/terminal';
import { AudioPlayer } from './components/audio_player';

import 'tachyons/css/tachyons.css';
import 'xterm/css/xterm.css';
import './index.css';

window.addEventListener('load', () => {
  const systemIO = new SystemIO();
  const terminal = new Terminal('#terminal');
  const audioPlayer = new AudioPlayer('#audio-player');

  const game = new Engine({
    systemIO,
    terminal,
    audioPlayer,
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      game.start();
    } else {
      game.pause();
    }
  });

  game.start();
});
