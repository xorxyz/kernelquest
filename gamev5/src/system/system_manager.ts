import { HistoryEvent } from '../shared/action';

export interface SaveFileContents {
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

export type SaveFn = (saveGameId: SaveGameId, contents: SaveFileContents) => Promise<void>

export type LoadFn = (saveGameId: SaveGameId) => Promise<SaveFileContents>

export interface ISystemIO {
  exit: ExitFn,
  save: SaveFn,
  load: LoadFn
}

export class SystemManager {
  private systemIO: ISystemIO;

  constructor(systemIO: ISystemIO) {
    this.systemIO = systemIO;
  }

  async save(saveGameId: SaveGameId, contents: SaveFileContents): Promise<void> {
    await this.systemIO.save(saveGameId, contents);
  }

  async load(saveGameId: SaveGameId): Promise<SaveFileContents> {
    const contents = await this.systemIO.load(saveGameId);
    return contents;
  }

  exit(): void {
    this.systemIO.exit();
  }
}
