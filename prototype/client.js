import Sockette from './vendor/sockette-2.0.6.js';

const ws = new WebSocket('ws://localhost:3737');

// const ws = new Sockette('ws://localhost:3737', {
//   timeout: 5e3,
//   maxAttempts: 10,
//   onopen: e => console.log('Connected!', e),
//   // onmessage: e => console.log('Received:', e),
//   onreconnect: e => console.log('Reconnecting...', e),
//   onmaximum: e => console.log('Stop Attempting!', e),
//   onclose: e => console.log('Closed!', e),
//   onerror: e => console.log('Error:', e)
// });

// ws.send('Hello, world!');
// ws.json({type: 'ping'});
// ws.close(); // graceful shutdown

// Reconnect 10s later
setTimeout(ws.reconnect, 10e3);

document.addEventListener('DOMContentLoaded', e => {
  const term = new window.Terminal();
  const containerElement = document.getElementById('container');
  const fitAddon = new window.FitAddon.FitAddon();
  const attachAddon = new window.AttachAddon.AttachAddon(ws);
  
  term.loadAddon(fitAddon);
  term.loadAddon(attachAddon);
  term.open(containerElement);
  fitAddon.fit();
})
