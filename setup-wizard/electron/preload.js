const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  checkHomebrew: () => ipcRenderer.invoke('check-homebrew'),
  checkCliclick: () => ipcRenderer.invoke('check-cliclick'),
  checkPython: () => ipcRenderer.invoke('check-python'),
  checkDirectory: (path) => ipcRenderer.invoke('check-directory', path),
  checkFile: (path) => ipcRenderer.invoke('check-file', path),
  checkVenv: () => ipcRenderer.invoke('check-venv'),
  getUsername: () => ipcRenderer.invoke('get-username'),
  copyToClipboard: (text) => ipcRenderer.invoke('copy-to-clipboard', text),
  openUrl: (url) => ipcRenderer.invoke('open-url', url)
});
