export const esc = (text: string) => '\u001B' + text;

export type AnsiColor = 'Black' | 'White' | 'Gray' | 'Red' | 'Green' | 'Blue' | 'Cyan' | 'DarkCyan' | 'Purple' | 'Yellow' | 'Brown';

export const bgColors: Record<AnsiColor, string> = {
  Black: '[40m',
  Gray: '[48;5;248m',
  White: '[107m',
  Red: '[41m',
  Green: '[42m',
  Blue: '[044m',
  Cyan: '[0;106m',
  DarkCyan: '[48;5;6m',
  Purple: '[0;105m',
  Yellow: '[0;103m',
  Brown: '[0;43m',
};

export const fgColors: Record<AnsiColor, string> = {
  Black: '[30m',
  White: '[37m',
  Green: '[32m',
  Gray: '[38;5;248m',
  Blue: '[34m',
  Cyan: '[36m'
};

export const Ansi = {
  setXY: (x: number, y: number): string => esc(`[${y};${x}H`),
  clearScreen: (): string => esc(`[2J`),
  bgColor(color: AnsiColor) {
    return esc(bgColors[color]);
  },
  fgColor(color: AnsiColor) {
    return esc(fgColors[color]);
  },
  reset() {
    return esc('[0m');
  },
  newline() {
    return esc('[G');
  }
};


// export const Screen = {
//   Clear: '[2J',
// };

// export const Line = {
//   ClearAfter: '[0K',
//   ClearBefore: '[1L',
//   Clear: '[2K',
//   Start: '[G',
// };

// export const Cursor = {
//   Blink: '[5;m',
//   EraseRight: '[K',
//   MoveLeft: '[1D',
//   MoveRight: '[1C',
//   up: (n) => `[${n}A`,
//   right: (n) => `[${n}C`,
//   down: (n) => `[${n}B`,
//   left: (n) => `[${n}D`,
//   setX: (x: number) => `[;${x}H]`,
//   setXY: (x: number, y: number) => `[${y};${x}H`,
//   set: (v: Vector) => `[${v.y};${v.x}H`,
// };