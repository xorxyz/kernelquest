export function coinFlip () {
  return Math.floor(Math.random() * 2) == 0
    ? 1
    : -1;
}
