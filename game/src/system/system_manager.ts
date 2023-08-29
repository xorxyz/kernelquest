import { actions, isValidActionName } from '../world/actions';
import { IGameEvent, ISaveFileContents } from '../shared/interfaces';
import { IGameState, IValidGameEvent } from '../state/valid_state';

export type SaveGameId = 0 | 1 | 2 | 3

export type ExitFn = () => void

export type SaveFn = (saveGameId: SaveGameId, contents: ISaveFileContents) => Promise<void>

export type LoadFn = (saveGameId: SaveGameId) => Promise<ISaveFileContents>

export interface ISystemIO {
  exit: ExitFn,
  save: SaveFn,
  load: LoadFn
}

export class SystemManager {
  private saveFileContents: ISaveFileContents | null = null;

  private systemIO: ISystemIO;

  private saveGameId: SaveGameId = 0;

  constructor(systemIO: ISystemIO) {
    this.systemIO = systemIO;
  }

  save(contents: ISaveFileContents, callback: () => void): void {
    this.systemIO.save(this.saveGameId, contents)
      .then((): void => {
        callback();
      })
      .catch((): void => {
        // Handle error
      });
  }

  load(saveGameId: SaveGameId, callback: (gameState: IGameState) => void): void {
    this.systemIO.load(saveGameId)
      .then((saveFileContents): void => {
        this.saveGameId = saveGameId;
        this.saveFileContents = saveFileContents;
        const validGameState = {
          ...saveFileContents,
          history: this.validateGameEvents(),
          terminalText: [],
        };
        callback(validGameState);
      })
      .catch((): void => {
        // Handle error
      });
  }

  exit(): void {
    this.systemIO.exit();
  }

  private validateGameEvents(): IValidGameEvent[] {
    if (!this.saveFileContents) throw new Error('Tried to validate save file contents before loading it.');

    const { history } = this.saveFileContents;

    const validGameEvents = history.filter((e: IGameEvent): e is IValidGameEvent => {
      if (isValidActionName(e.action.name) && actions[e.action.name].validator.parse(e.action)) {
        return true;
      }

      throw new Error(
        `Couldn't load the save file contents because it contains an invalid action: ${JSON.stringify(e.action)}`,
      );
    });

    return validGameEvents;
  }
}
