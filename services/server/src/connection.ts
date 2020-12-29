import * as WebSocket from 'ws';
import * as uuid from 'uuid';

import queues from './queues';

export default class PlayerConnection {
  public userId: string
  private ws: WebSocket

  constructor(ws: WebSocket, userId: string) {
    console.log('new connection', userId);
    this.ws = ws;
    this.userId = userId;

    this.ws.on('message', this.handleMessage.bind(this));
  }

  log(message: string) {
    this.ws.send(JSON.stringify({
      type: 'event:log',
      payload: {
        message,
      },
    }));
  }

  handleMessage(message: string) {
    console.log('got message:', message);
    try {
      const o = JSON.parse(message);
      console.log('parsed message:', o);
      const job = queues.actions.createJob({
        userId: this.userId,
        cmd: o.cmd,
        args: o.args,
      });

      job.on('succeeded', (result) => {
        console.log('succeeded:', result);
        this.log(result);
      });

      job.setId(uuid.v4()).save();

      this.log(`Got your message! job id: ${job.id}`);
    } catch (err) {
      console.error(`message from ${this.userId} is not json:`, message);
    }
  }
}
