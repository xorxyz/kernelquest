/* eslint-disable class-methods-use-this */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

import Vue from 'vue';

const DELAY = 5000;

class Sockets {
  readonly bus: Vue = new Vue()
  private ws: WebSocket
  private lastConnectedOn

  constructor() {
    this.init();
  }

  init() {
    // eslint-disable-next-line no-undef
    this.ws = new WebSocket('ws://localhost:3000/');

    this.ws.onopen = this.onOpen.bind(this);
    this.ws.onerror = this.onError.bind(this);
    this.ws.onmessage = this.onMessage.bind(this);
    this.ws.onclose = this.onClose.bind(this);
  }

  onOpen() {
    console.log('ws open');
    this.lastConnectedOn = Date.now();
  }

  onClose(e) {
    console.log('ws close', e.code);
    setTimeout(() => {
      this.init();
    }, DELAY);
  }

  onError(e) {
    console.log(e);
    const duration = (Date.now() - this.lastConnectedOn) / 1000;
    console.error(`ws error, connection lasted ${duration}s`);
  }

  onMessage(e) {
    console.log('ws message:', e.data);
    try {
      const parsed = JSON.parse(e.data);
      this.bus.$emit('message', parsed);
    } catch (err) {
      console.error('oops, json error', err);
    }
  }

  say(message) {
    this.ws.send(JSON.stringify({
      cmd: 'say',
      args: [message],
    }));
  }

  move(direction) {
    this.ws.send(JSON.stringify({
      cmd: 'move',
      args: [direction],
    }));
  }

  send(cmd, ...args) {
    this.ws.send(JSON.stringify({
      cmd,
      args,
    }));
  }
}

export default new Sockets();
