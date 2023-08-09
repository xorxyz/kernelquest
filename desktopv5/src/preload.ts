// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';
import { ExitFn, LoadFn, SaveFn } from 'xor5-game/src/system/system_manager';

console.log('👋 Hello from preload');

const exit: ExitFn = () => ipcRenderer.send('exit');
const save: SaveFn = (saveGameId, contents) => ipcRenderer.invoke('save', saveGameId, contents);
const load: LoadFn = (saveGameId) => ipcRenderer.invoke('load', saveGameId);

contextBridge.exposeInMainWorld('electron', {
  getPreloadPath: () => ipcRenderer.sendSync('get-preload-path'),
  exit,
  save,
  load,
});
