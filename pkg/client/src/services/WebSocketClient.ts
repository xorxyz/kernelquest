import { EventEmitter } from 'events';

const URL = 'ws://localhost:3000';

export default class WebSocketClient extends EventEmitter {
  ws: WebSocket
  delay: number = 5000;

  init() {
    const ws = new WebSocket(URL);

    ws.onopen = this.onOpen.bind(this);
    ws.onerror = this.onError.bind(this);
    ws.onmessage = this.onMessage.bind(this);
    ws.onclose = this.onClose.bind(this);

    this.ws = ws;
  }

  sendCommand(command: string) {
    this.ws.send(JSON.stringify({
      action: 'command',
      payload: {
        command,
      },
    }));
  }

  // eslint-disable-next-line class-methods-use-this
  onOpen() {
    console.log('ws open');
  }

  onClose(e) {
    console.warn('ws close', e.code);

    if (e.code === 1006) {
      // Couldn't reach the server
    }

    setTimeout(() => {
      this.init();
    }, this.delay);
  }

  // eslint-disable-next-line class-methods-use-this
  onError(e) {
    console.error('ws error', e);
  }

  onMessage(e) {
    const parsed = parseMessage(e.data);

    if (!parsed) {
      console.warn('message received contains invalid json', e.data);
      return false;
    }

    const valid = validateMessage(parsed);

    if (!valid) {
      console.warn('message received is invalid', parsed);
      return false;
    }

    this.emit('message', parsed);

    return true;
  }
}

function parseMessage(message) {
  let parsed;

  try {
    parsed = JSON.parse(message);
  } catch (err) {
    parsed = null;
  }

  return parsed;
}

function validateMessage(message) {
  return (
    (message && typeof message === 'object') &&
    (message.action && typeof message.action === 'string') &&
    (message.payload && typeof message.payload === 'object')
  );
}
