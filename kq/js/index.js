const swap = ([a, b]) => [b, a];
const LOOP_MS = 100;
const LOOP_SECONDS = LOOP_MS / 1000;

let snail = ['🐌__', '__🐌'];
let sheep = ['🌿🐑', '🐑🌿'];
let grass = ['`', `'`];
let ms = 0;
let timer = 0;

const room = document.getElementById('room');
const player = document.getElementById('player');
const draw = pair => {
  room.innerText = room.innerText.replace(new RegExp(pair[0], 'g'), pair[1]);
  return pair;
}

const cycle = () => {
  ms += LOOP_MS;

  if (ms % 400 === 0) {
    grass = swap(grass);
    draw(grass);
  }

  if (ms % 800 === 0) {
    sheep = swap(sheep);
    draw(sheep);

    snail = swap(snail);
    draw(snail);
  }
}

player.addEventListener('play', () => {
  timer = setInterval(cycle, LOOP_MS);
});

player.addEventListener('pause', () => {
  clearInterval(timer);
});

