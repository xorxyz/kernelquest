// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

type SaveGameId = 0 | 1 | 2

console.log('👋 Hello from preload');

contextBridge.exposeInMainWorld('electron', {
  // NODE_ENV: app.isPackaged ? 'production' : 'dev',
  exit: () => ipcRenderer.send('exit'),
  save: async (saveGameId: SaveGameId, history) => ipcRenderer.invoke('save', saveGameId, history),
  load: async (saveGameId: SaveGameId) => ipcRenderer.invoke('load', saveGameId),
});
