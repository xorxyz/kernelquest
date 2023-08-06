import { IAudioPlayer } from "xor5-game/src/audio/audio_manager";

export class AudioPlayer implements IAudioPlayer {
  private el: HTMLElement;

  get src (): string {
    return ''
  }

  get currentTime (): number {
    return 0;
  };

  constructor (id: string) {
    const el = document.getElementById(id);
    if (!el) throw new Error('Could not find element ' + id);
    this.el = el;
  }

  play () {

  }
}
