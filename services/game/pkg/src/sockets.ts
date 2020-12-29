/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

// eslint-disable-next-line no-undef
import Vue from 'vue';

const ws = new WebSocket('ws://localhost:3000/');

const bus = new Vue();

ws.onopen = function (e) {
  console.log('open');
};

ws.onerror = function (e) {
  console.error(e);
};

ws.onmessage = function (e) {
  console.log('message:', e.data);
  try {
    const parsed = JSON.parse(e.data);
    bus.$emit('message', parsed);
  } catch (err) {
    console.error('oops, json error', err);
  }
};

const sockets = {
  bus,
  say(message) {
    ws.send(JSON.stringify({
      cmd: 'say',
      args: [message],
    }));
  },
  move(direction) {
    ws.send(JSON.stringify({
      cmd: 'move',
      args: [direction],
    }));
  },
  send(cmd, ...args) {
    ws.send(JSON.stringify({
      cmd,
      args,
    }));
  },
};

export default sockets;
