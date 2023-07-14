import { noop } from '../shared/util';

export interface IAudioPlayer {
  soundSrc: string,
  audioEl: {
    src: string,
    currentTime: number,
    play: () => void
  }
}

export class NoAudioPlayer {
  soundSrc = 'none';
  audioEl = {
    src: 'none',
    currentTime: 0,
    play: noop,
  };
}

export class AudioManager {
  private audioPlayer: IAudioPlayer;

  constructor(audioPlayer: IAudioPlayer) {
    this.audioPlayer = audioPlayer;
  }
}
