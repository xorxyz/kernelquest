// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

// Preload Script
import { contextBridge, ipcRenderer } from 'electron';

console.log('👋 Hello from preload');

contextBridge.exposeInMainWorld('electron', {
  // NODE_ENV: app.isPackaged ? 'production' : 'dev',
  exit: () => {
    ipcRenderer.send('exit');
  },
});

export {};
