export class AudioPlayer {
  buttonEl: HTMLButtonElement
  audioEl: HTMLAudioElement

  constructor (buttonEl: HTMLButtonElement, audioEl: HTMLAudioElement) {
    this.buttonEl = buttonEl;
    this.audioEl = audioEl;

    buttonEl.addEventListener('click', e => {
      buttonEl.innerText = audioEl.muted
        ? '🔊 Music is not muted'
        : '🔇 Music is muted'

      audioEl.muted = !audioEl.muted;
    })
  }
}