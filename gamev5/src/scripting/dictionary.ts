import { Word } from './word';

export class Dictionary {
  private words = new Map<string, Word>();

  add(name: string, word: Word): void {
    this.words.set(name, word);
  }

  remove(name: string): void {
    this.words.delete(name);
  }
}
