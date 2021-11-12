const ws = new WebSocket('ws://localhost:3737');

document.addEventListener('DOMContentLoaded', e => {
  const term = new window.Terminal({
    cols: 72,
    rows: 25,
    fontSize: 21,
    cursorBlink: true,
    fontFamily: 'ui-monospace, Menlo, Monaco, "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", "Oxygen Mono", "Ubuntu Monospace", "Source Code Pro", "Fira Mono", "Droid Sans Mono", "Courier New", monospace'
  });

  const containerElement = document.getElementById('container');
  const fitAddon = new window.FitAddon.FitAddon();
  const attachAddon = new window.AttachAddon.AttachAddon(ws);
  
  const unicode14Addon = new Unicode14Addon(true);
  term.loadAddon(unicode14Addon);
  term.unicode.activeVersion = '14';

  term.loadAddon(fitAddon);
  term.loadAddon(attachAddon);
  term.open(containerElement);
  fitAddon.fit();
});
