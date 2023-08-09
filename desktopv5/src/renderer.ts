import { Game } from 'xor5-game/src';
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

    window.terminal = terminal
  
    const game = new Game({
      systemIO,
      terminal,
      audioPlayer,
    });

  // Pause the game when the window is not visible
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && game.running) {
      minimized = true;
      game.pause();
    }
    
    if (document.visibilityState === 'visible' && minimized) {
      minimized = false;
      game.start();
    }
  });

  if (!document.hidden) {
    game.start();
  } else {
    minimized = true;
  }
});
