import { IGameEvent } from '../shared/interfaces';

export interface IAudioPlayer {
  src: string
  currentTime: number
  play: () => void
}

export class AudioManager {
  private audioPlayer: IAudioPlayer;

  private tick = 0;

  constructor(audioPlayer: IAudioPlayer) {
    this.audioPlayer = audioPlayer;
  }

  update(tick: number, gameEvents: IGameEvent[]): void {
    this.tick = tick;
    gameEvents.forEach((event): void => {
      if (event.agentId === 1 && event.failed) {
        this.play('fail');
      }
    });
  }

  play(src: string): void {
    this.audioPlayer.src = src;
    this.audioPlayer.play();
  }
}
