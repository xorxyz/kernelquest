import * as WebSocket from 'ws';
import * as BeeQueue from 'bee-queue';

const commandQueue = new BeeQueue('command');

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

  sendLog(message: string) {
    this.ws.send(JSON.stringify({
      action: 'event:log',
      payload: {
        message,
      },
    }));
  }

  handleMessage(message: string) {
    try {
      const parsed = JSON.parse(message);

      const job = commandQueue.createJob({
        userId: this.userId,
        timestamp: parsed.timestamp,
        frameId: parsed.frameId,
        line: parsed.line,
      });

      job.on('succeeded', (result) => {
        if (result) { this.sendLog(result); }
      });

      job.save();
    } catch (err) {
      console.error(`message from ${this.userId} is not json:`, message);
    }
  }
}
