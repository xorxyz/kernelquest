export const ROOM_WIDTH = 16;
export const ROOM_HEIGHT = 10;
export const MAX_X = ROOM_WIDTH - 1;
export const MAX_Y = ROOM_HEIGHT - 1;

export const DB_FILEPATH = '/tmp/xor4-test.txt';

export enum TokenType {}

export interface Token {
  type: TokenType
  lexeme: string
  literal?: object
  line: number
}
