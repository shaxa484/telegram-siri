const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const os = require('os');

const execAsync = promisify(exec);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0f172a',
    show: false
  });

  // Load the app
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC Handlers for validation checks
ipcMain.handle('check-homebrew', async () => {
  try {
    await execAsync('which brew');
    const { stdout } = await execAsync('brew --version');
    return { installed: true, version: stdout.trim().split('\n')[0] };
  } catch (error) {
    return { installed: false };
  }
});

ipcMain.handle('check-cliclick', async () => {
  try {
    await execAsync('which cliclick');
    const { stdout } = await execAsync('cliclick -V');
    return { installed: true, version: stdout.trim() };
  } catch (error) {
    return { installed: false };
  }
});

ipcMain.handle('check-python', async () => {
  try {
    const { stdout } = await execAsync('python3 --version');
    return { installed: true, version: stdout.trim() };
  } catch (error) {
    return { installed: false };
  }
});

ipcMain.handle('check-directory', async (event, dirPath) => {
  try {
    const expandedPath = dirPath.replace('~', os.homedir());
    await fs.access(expandedPath);
    return { exists: true, path: expandedPath };
  } catch (error) {
    return { exists: false, path: expandedPath };
  }
});

ipcMain.handle('check-file', async (event, filePath) => {
  try {
    const expandedPath = filePath.replace('~', os.homedir());
    await fs.access(expandedPath);
    return { exists: true, path: expandedPath };
  } catch (error) {
    return { exists: false, path: expandedPath };
  }
});

ipcMain.handle('check-venv', async () => {
  try {
    const venvPath = path.join(os.homedir(), 'telegram-siri', 'venv');
    await fs.access(venvPath);
    return { exists: true, path: venvPath };
  } catch (error) {
    return { exists: false };
  }
});

ipcMain.handle('get-username', async () => {
  return os.userInfo().username;
});

ipcMain.handle('copy-to-clipboard', async (event, text) => {
  const { clipboard } = require('electron');
  clipboard.writeText(text);
  return true;
});

ipcMain.handle('open-url', async (event, url) => {
  const { shell } = require('electron');
  await shell.openExternal(url);
  return true;
});
