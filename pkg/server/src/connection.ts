import * as WebSocket from 'ws';
import * as uuid from 'uuid';

import commandsJob from './jobs/process-commands';

export default class PlayerConnection {
  public userId: string
  private ws: WebSocket

  constructor(ws: WebSocket, userId: string) {
    console.log('new connection', userId);
    this.ws = ws;
    this.userId = userId;

    this.ws.on('message', this.handleMessage.bind(this));
  }

  emit(userId: string, action: string, payload: any) {
    this.ws.send(JSON.stringify({
      userId,
      payload,
      type: `event:${action}`,
    }));
  }

  log(message: string) {
    this.ws.send(JSON.stringify({
      action: 'event:log',
      payload: {
        message,
      },
    }));
  }

  handleMessage(message: string) {
    try {
      const o = JSON.parse(message);
      console.log('parsed message:', o);
      const job = commandsJob.queue.createJob({
        userId: this.userId,
        cmd: o.cmd,
        args: o.args,
      });

      job.on('succeeded', (result) => {
        console.log('succeeded:', result);
        this.log(result);
      });

      job.setId(uuid.v4()).save();
    } catch (err) {
      console.error(`message from ${this.userId} is not json:`, message);
    }
  }
}
