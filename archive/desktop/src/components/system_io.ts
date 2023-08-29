import { ISaveFileContents } from "xor5-game/src/shared/interfaces";
import { ExitFn, ISystemIO, LoadFn, SaveFn, SaveGameId } from "xor5-game/src/system/system_manager";

declare global {
  var electron: {
    exit: ExitFn
    save: SaveFn
    load: LoadFn
  };
}

export class SystemIO implements ISystemIO {
  exit () {
    window.electron.exit();
  }

  async save(saveGameId: SaveGameId, contents: ISaveFileContents): Promise<void> {
    await window.electron.save(saveGameId, contents);
  }

  async load(saveGameId: SaveGameId): Promise<ISaveFileContents> {
    return await window.electron.load(saveGameId);
  }
}
