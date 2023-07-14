import { HistoryEvent } from '../shared/action';
import { noop } from '../shared/util';

export interface ISaveFileContents {
  name: string,
  stats: {
    level: number,
    gold: number,
    time: number
  },
  history: Array<HistoryEvent>
}

export type SaveGameId = 0 | 1 | 2

export type ExitFn = () => void

export type SaveFn = (saveGameId: SaveGameId, contents: ISaveFileContents) => Promise<void>

export type LoadFn = (saveGameId: SaveGameId) => Promise<ISaveFileContents>

export interface ISystemIO {
  exit: ExitFn,
  save: SaveFn,
  load: LoadFn
}

export const emptySaveFile = {
  name: '',
  stats: { level: 1, gold: 0, time: 0 },
  history: [],
};

export class NoSystemIO {
  exit = noop;
  // eslint-disable-next-line @typescript-eslint/no-empty-function, class-methods-use-this
  save = async (): Promise<void> => {};
  // eslint-disable-next-line class-methods-use-this
  load = async (): Promise<ISaveFileContents> => emptySaveFile;
}

export class SystemManager {
  private systemIO: ISystemIO;

  constructor(systemIO: ISystemIO) {
    this.systemIO = systemIO;
  }

  async save(saveGameId: SaveGameId, contents: ISaveFileContents): Promise<void> {
    await this.systemIO.save(saveGameId, contents);
  }

  async load(saveGameId: SaveGameId): Promise<ISaveFileContents> {
    const contents = await this.systemIO.load(saveGameId);
    return contents;
  }

  exit(): void {
    this.systemIO.exit();
  }
}
