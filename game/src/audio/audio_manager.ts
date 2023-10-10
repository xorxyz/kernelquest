import { IGameEvent, IKeyboardEvent } from '../shared/interfaces';

export interface IAudioPlayer {
  src: string
  currentTime: number
  playSound: (name: string) => void
  playMusic: (name: string) => void
  pauseMusic: () => void
}

export class AudioManager {
  private audioPlayer: IAudioPlayer;

  private tick = 0;
  
  private lastKey = '';

  constructor(audioPlayer: IAudioPlayer) {
    this.audioPlayer = audioPlayer;
  }

  update(tick: number, inputEvents: IKeyboardEvent[], gameEvents: IGameEvent[]): void {
    this.tick = tick;
    
    let failed = false;

    gameEvents.forEach((event): void => {
      if (event.agentId === 1 && event.failed) {
        this.audioPlayer.playSound('fail');
        failed = true;
      }
      if (event.failed) return;
      if (['step', 'get', 'put'].includes(event.action.name)) {
        this.audioPlayer.playSound(event.action.name);
      }
      if (['left', 'right'].includes(event.action.name)) {
        this.audioPlayer.playSound('rotate');
      }
      if (event.action.name === 'play_music' && event.action.args && event.action.args['title']) {
        this.audioPlayer.playMusic(event.action.args['title'] as string);
      }
      if (event.action.name === 'pause_music') {
        this.audioPlayer.pauseMusic();
      }
    });

    if (!failed) this.playKeySound(inputEvents);
  }

  playKeySound(inputEvents: IKeyboardEvent[]) {
    const keyDown = inputEvents.length;

    if (keyDown) {
      const key = inputEvents.slice(-1)[0]?.key || ''
      if (key === this.lastKey) {
        this.audioPlayer.playSound('same-key');
      } else {
        this.lastKey = key;
        this.audioPlayer.playSound('key');
      }
    };
  }
}
