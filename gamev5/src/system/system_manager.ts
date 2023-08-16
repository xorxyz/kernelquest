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

  save(saveGameId: SaveGameId, contents: ISaveFileContents, callback: () => void): void {
    this.systemIO.save(saveGameId, contents)
      .then((): void => {
        callback();
      })
      .catch((): void => {
        // Handle error
      });
  }

  load(saveGameId: SaveGameId, callback: (gameState: ISaveFileContents) => void): void {
    this.systemIO.load(saveGameId)
      .then((gameState): void => {
        callback(gameState);
      })
      .catch((): void => {
        // Handle error
      });
  }

  exit(): void {
    this.systemIO.exit();
  }
}
