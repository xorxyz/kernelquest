import { IAudioPlayer } from "xor5-game/src/audio/audio_manager";

function createAudioEl(type: 'sounds' | 'music', name: string) {
  const el = document.createElement('audio');
  const source = document.createElement('source');
  el.hidden = true;
  el.appendChild(source);
  source.type = 'audio/wav';
  source.src = `https://alpha.kernel.quest/${type}/${name}.wav`
  el.play();
  el.pause();
  document.body.appendChild(el);

  el.addEventListener('error', function() {
    console.error('Audio playback error:', this.error);
  });
  return el;
}

export class AudioPlayer implements IAudioPlayer {
  private el: HTMLAudioElement;
  private keySoundIndex = 1;

  private sounds: Record<string, HTMLAudioElement> = {}
  private musics: Record<string, HTMLAudioElement> = {}

  private currentMusic = '';

  get src (): string {
    return ''
  }

  get currentTime (): number {
    return 0;
  };

  constructor (id: string) {
    const el = document.getElementById(id);
    if (!el) throw new Error('Could not find element ' + id);
    if (!(el instanceof HTMLAudioElement)) throw new Error('el ' + id + ' should be HTMLAudioElement');
    this.el = el;

    const keys = new Array(8).fill(0).map((_, i) =>  `key${i + 1}`);

    [...keys, 'fail', 'get', 'put', 'rotate'].forEach(name => {
      const el = createAudioEl('sounds', name);
      this.sounds[name] = el;
    });

    const songs: [string, number][] =  [
      ['title_screen', 0.4], ['village', 0.2], ['dungeon', 0.5], ['victory', 0.5]
    ];

    songs.forEach(([name, volume]) => {
      const el = createAudioEl('music', name);
      el.volume = volume;
      el.loop = true;
      el.classList.add('music');
      this.musics[name] = el;
    })
  }

  shuffleKeySoundIndex (): number {
    let next = this.keySoundIndex;
    const min = 1;
    const max = 8;
    while (next === this.keySoundIndex) {
      next = Math.floor(Math.random() * (max - min + 1) + min);
    }
    this.keySoundIndex = next;
    return this.keySoundIndex;
  }

  playSound (name: string) {
    if (name === 'key') {
      name = `key${this.shuffleKeySoundIndex()}`;
    }
    if (name === 'same-key') {
      name = `key${this.keySoundIndex}`;
    }

    const audio = this.sounds[name];

    audio.pause();
    audio.currentTime = 0;
    audio.play();
  }

  pauseMusic() {
    if (this.currentMusic) {
      const currentAudio = this.musics[this.currentMusic];
      currentAudio.pause();
    }
  }

  playMusic (name: string) {
    this.pauseMusic();

    const audio = this.musics[name];

    if (!audio) throw new Error(`Music '${name}' does not exist.`);

    this.currentMusic = name;

    audio.pause();
    audio.currentTime = 0;
    audio.play();
  }
}
