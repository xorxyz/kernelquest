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

  send(o: object) {
    this.ws.send(JSON.stringify(o));
  }

  // eslint-disable-next-line class-methods-use-this
  onOpen() {
    console.log('ws open');
  }

  say(message: string) {
    this.send({
      cmd: 'say',
      args: [message],
    });
  }

  move(direction) {
    this.send({
      cmd: 'move',
      args: [direction],
    });
  }

  onClose(e) {
    console.warn('ws close', e.code);
    setTimeout(() => {
      this.init();
    }, this.delay);
  }

  // eslint-disable-next-line class-methods-use-this
  onError(e) {
    console.error('ws error', e);
  }

  onMessage(e) {
    console.log('ws message:', e.data);
    try {
      const parsed = JSON.parse(e.data);
      this.emit('message', parsed);
    } catch (err) {
      console.error('oops, json error', err);
    }
  }
}
