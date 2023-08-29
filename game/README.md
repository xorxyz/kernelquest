# xor5

## API

```ts
import { contextBridge, ipcRenderer } from 'electron';
import { Game, ExitFn, LoadFn, SaveFn } from 'xor5-game';
import { SystemIO, Terminal, AudioPlayer } from './components';

window.addEventListener('load', () => {
  const io = new SystemIO();
  const terminal = new Terminal('#terminal');
  const audioPlayer = new AudioPlayer('#audio-player');

  const game = new Game({
    systemIO,
    terminal,
    audioPlayer
  });

  terminal.onKey(({ key }) => game.handleInput(key));

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      game.start();
    } else {
      game.pause();
    }
  });

  game.start();
});

```
