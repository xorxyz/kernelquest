// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

// Preload Script
import { app, contextBridge } from 'electron';

contextBridge.exposeInMainWorld('env', {
  NODE_ENV: app.isPackaged ? 'production' : 'dev',
});

export {};
