import { Rectangle, Vector } from './math';

export const CLOCK_MS_DELAY = 30;

export const AREA_WIDTH = 16;
export const AREA_HEIGHT = 10;
export const MAX_X = AREA_WIDTH - 1;
export const MAX_Y = AREA_HEIGHT - 1;

export const SCREEN_WIDTH = 60;
export const SCREEN_HEIGHT = 20;
export const LINE_LENGTH = 65;
export const N_OF_LINES = 5;
export const CELL_WIDTH = 2;

export const bounds = new Rectangle(new Vector(0, 0), new Vector(AREA_WIDTH, AREA_HEIGHT));

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
  CTRL_C: '03',
  ARROW_UP: '1b5b41',
  ARROW_DOWN: '1b5b42',
  ARROW_LEFT: '1b5b44',
  ARROW_RIGHT: '1b5b43',
  ESCAPE: '1b',
  ENTER: '0d',
  BACKSPACE: '7f',
  TAB: '09',
  SPACE: '20',
  LOWER_A: '61',
  LOWER_B: '62',
  LOWER_D: '64',
  LOWER_G: '67',
  LOWER_H: '68',
  LOWER_I: '69',
  LOWER_P: '70',
  LOWER_Q: '71',
  LOWER_R: '72',
  LOWER_S: '73',
  LOWER_T: '74',
  LOWER_U: '75',
  LOWER_W: '77',
};

export const Signals = {
  SIGINT: '03',
};

export const EMPTY_CELL_CHARS = '..';// '➖';

export const CursorModeHelpText = [
  '<return> toggle between terminal & cursor mode.',
  '<space>  push a ref to the highlighted cell.',
  '<h>      print this help text.',
  '<w>      step forward.',
  '<a>      turn left.',
  '<s>      step backwards.',
  '<d>      turn right.',
  '<g>      get something.',
  '<p>      put something down.',
];

export const agentTypeNames = [
  'king', 'dragon',
  'stars',
  'wind', 'water', 'earth', 'fire',
  'fairy', 'elf', 'wizard', 'sheep', 'bug', 'man', 'spirit',
  'owl', 'deer', 'snail',
  'child', 'ancestor', 'demon',
  'snake', 'goblin', 'ogre', 'spider', 'wolf', 'ghost', 'rat', 'bat',
];

export const thingTypeNames = [
  'tree', 'wall', 'door', 'flag', 'crown', 'key', 'shield', 'skull', 'book', 'grass',
  'mountain', 'fruit', 'castle', 'village', 'candle', 'axe', 'bomb', 'bow', 'bag',
  'boot', 'bag', 'map', 'river', 'route', 'zone',
];
