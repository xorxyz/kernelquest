import { ISaveFileContents } from '../shared/interfaces';

export type SaveGameId = 0 | 1 | 2

export type ExitFn = () => void

export type SaveFn = (saveGameId: SaveGameId, contents: ISaveFileContents) => Promise<void>

export type LoadFn = (saveGameId: SaveGameId) => Promise<ISaveFileContents>

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
