import { Rectangle, Vector } from "../../lib/math";

export const CLOCK_MS_DELAY = 60;

export const ROOM_WIDTH = 16;
export const ROOM_HEIGHT = 10;
export const MAX_X = ROOM_WIDTH - 1;
export const MAX_Y = ROOM_HEIGHT - 1;

export const bounds = new Rectangle(
  new Vector(0, 0), new Vector(ROOM_WIDTH, ROOM_HEIGHT)
);

export const DB_FILEPATH = '/tmp/xor4-test.txt';

export enum TokenType {}

export interface Token {
  type: TokenType
  lexeme: string
  literal?: object
  line: number
}

export const Keys = {
  CTRL_ARROW_UP: '1b5b313b3541',
  CTRL_ARROW_RIGHT: '1b5b313b3543',
  CTRL_ARROW_DOWN: '1b5b313b3542',
  CTRL_ARROW_LEFT: '1b5b313b3544',
  SHIFT_ARROW_UP: '1b5b313b3241',
  SHIFT_ARROW_DOWN: '1b5b313b3242',
  SHIFT_ARROW_LEFT: '1b5b313b3244',
  SHIFT_ARROW_RIGHT: '1b5b313b3243',
  CMD_ARROW_LEFT: '01',
  CMD_ARROW_RIGHT: '05',
  ARROW_UP: '1b5b41',
  ARROW_DOWN: '1b5b42',
  ARROW_LEFT: '1b5b44',
  ARROW_RIGHT: '1b5b43',
  ESCAPE: '1b',
  ENTER: '0d',
  BACKSPACE: '7f',
  TAB: '09',
  SPACE: '20',
  LOWER_B: '62',
  LOWER_D: '64',
  LOWER_G: '67',
  LOWER_I: '69',
  LOWER_P: '70',
  LOWER_R: '72',
  LOWER_S: '73',
  LOWER_W: '77',
};

export const Signals = {
  SIGINT: '03',
};
