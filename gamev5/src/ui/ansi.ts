export const ESC = '\u001B';

export const Ansi = {
  setXY: (x: number, y: number): string => `${ESC}[${y};${x}H`,
  clearScreen: (): string => `${ESC}[2J`,
};
