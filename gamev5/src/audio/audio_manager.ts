export interface IAudioPlayer {
  soundSrc: string,
  audioEl: {
    src: string,
    currentTime: number,
    play: () => void
  }
}

export class AudioManager {
  private audioPlayer: IAudioPlayer;

  constructor(audioPlayer: IAudioPlayer) {
    this.audioPlayer = audioPlayer;
  }
}
