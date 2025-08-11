// electron/preload.js

import { contextBridge, ipcRenderer } from "electron";

// Expose limited APIs to the renderer process
contextBridge.exposeInMainWorld("electronAPI", {
  send: (channel, data) => {
    const validChannels = ["toMain"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, callback) => {
    const validChannels = ["fromMain"];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  },
});
