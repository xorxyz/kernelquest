/* eslint-disable global-require */
import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import { readFile, writeFile } from 'fs/promises';
import { ISaveFileContents } from 'xor5-game/src/shared/interfaces';

// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// app.commandLine.appendSwitch('in-process-gpu');

// app.commandLine.appendSwitch('no-sandbox');
// app.commandLine.appendSwitch('disable-gpu-sandbox');
// app.commandLine.appendSwitch('disable-software-rasterizer');
// app.commandLine.appendSwitch('disable-gpu');
// app.commandLine.appendSwitch('disable-gpu-compositing');
// app.commandLine.appendSwitch('disable-gpu-rasterization');

app.commandLine.appendSwitch('enable-logging');
// app.commandLine.appendSwitch('view-stack-traces');
app.commandLine.appendSwitch('enable-gpu-driver-debug-logging');

// app.disableHardwareAcceleration();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

ipcMain.on('get-preload-path', (e) => {
  e.returnValue = MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY;
});

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    // 1280x720px
    width: 1280 + 240,
    height: 720,
    // thickFrame: false,
    // autoHideMenuBar: true,
    // fullscreen: true,
    // frame: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.resolve(__dirname, MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY),
    },
  });

  mainWindow.webContents.openDevTools();

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);// 'chrome://gpu');// MAIN_WINDOW_WEBPACK_ENTRY);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Disable navigation
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', () => {
    // event.preventDefault();
  });
});

// Disable creating new windows
app.on('web-contents-created', (_, contents) => {
  // contents.setWindowOpenHandler(() => ({ action: 'deny' }));
});

ipcMain.on('exit', () => {
  process.exit(0);
});

type SaveGameId = 0 | 1 | 2

ipcMain.handle('load', async (_, id: SaveGameId): Promise<ISaveFileContents> => {
  const filepath = path.join(app.getPath('userData'), `save-game-${id}.json`);

  console.log(`Loading ${filepath}...`);
  try {
    const file = await readFile(filepath, 'utf8');
    console.log('Loaded!');

    return JSON.parse(file);
  } catch (err) {
    return {
      name: '',
      stats: {
        level: 0,
        gold: 0,
        time: 0,
      },
      history: [],
    };
  }
});

ipcMain.handle('save', async (_, id: SaveGameId, history: Array<object>) => {
  const filepath = path.join(app.getPath('userData'), `save-game-${id}.json`);

  console.log(`Saving in ${filepath}...`);
  await writeFile(filepath, JSON.stringify(history));
  console.log('Saved!');

  return true;
});
