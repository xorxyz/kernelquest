export class GameLog {
  static LOGRING_SIZE = 8
  static EMPTY_LINE = `${Array(60).fill(' ').join('')};`
  buffer: Array<String>
}

export const prompt = '$ ';
