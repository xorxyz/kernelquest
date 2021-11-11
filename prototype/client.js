const ws = new WebSocket('ws://localhost:3737');

const UnicodeV14 = /** @class */ (function () {
  function UnicodeV14() {
    this.version = '14';
  }

  UnicodeV14.prototype.wcwidth = function (num) {
    let x = widechar_wcwidth(num);
    if (x === widechar_widened_in_9) x = 2;
    if (x === widechar_private_use) x = 1;
    if (x === widechar_ambiguous) x = 1;
    if (x < 0) x = 0;
    return x;
  }
  return UnicodeV14;
}());

const Unicode14Addon = /** @class */ (function () {
  function Unicode14Addon() {
  }

  Unicode14Addon.prototype.activate = function (terminal) {
    terminal.unicode.register(new UnicodeV14());
  };
  Unicode14Addon.prototype.dispose = function () {
  };
  return Unicode14Addon;
}());

document.addEventListener('DOMContentLoaded', e => {
  const term = new window.Terminal({
    cols: 63,
    rows: 22,
    fontSize: 16,
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
