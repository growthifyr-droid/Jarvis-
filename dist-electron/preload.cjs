// electron/preload/index.ts
var import_electron = require("electron");

// electron/shared/constants.ts
var IPC_CHANNELS = {
  // App Config & Version
  GET_APP_CONFIG: "jarvis:get-app-config",
  GET_APP_VERSION: "jarvis:get-app-version",
  // Window Management
  WINDOW_MINIMIZE: "jarvis:window-minimize",
  WINDOW_MAXIMIZE: "jarvis:window-maximize",
  WINDOW_CLOSE: "jarvis:window-close",
  WINDOW_IS_MAXIMIZED: "jarvis:window-is-maximized",
  // Auto Updater
  UPDATER_CHECK: "jarvis:updater-check",
  UPDATER_DOWNLOAD: "jarvis:updater-download",
  UPDATER_INSTALL: "jarvis:updater-install",
  UPDATER_GET_STATUS: "jarvis:updater-get-status",
  UPDATER_STATUS_CHANGED: "jarvis:updater-status-changed",
  // Telemetry
  GET_TELEMETRY: "jarvis:get-telemetry"
};

// electron/preload/index.ts
var apiBridge = {
  isElectron: true,
  getAppConfig: () => {
    return import_electron.ipcRenderer.invoke(IPC_CHANNELS.GET_APP_CONFIG);
  },
  getAppVersion: () => {
    return import_electron.ipcRenderer.invoke(IPC_CHANNELS.GET_APP_VERSION);
  },
  // Window Controls
  minimizeWindow: () => {
    return import_electron.ipcRenderer.invoke(IPC_CHANNELS.WINDOW_MINIMIZE);
  },
  maximizeWindow: () => {
    return import_electron.ipcRenderer.invoke(IPC_CHANNELS.WINDOW_MAXIMIZE);
  },
  closeWindow: () => {
    return import_electron.ipcRenderer.invoke(IPC_CHANNELS.WINDOW_CLOSE);
  },
  isWindowMaximized: () => {
    return import_electron.ipcRenderer.invoke(IPC_CHANNELS.WINDOW_IS_MAXIMIZED);
  },
  // Updater API
  checkForUpdates: () => {
    return import_electron.ipcRenderer.invoke(IPC_CHANNELS.UPDATER_CHECK);
  },
  downloadUpdate: () => {
    return import_electron.ipcRenderer.invoke(IPC_CHANNELS.UPDATER_DOWNLOAD);
  },
  installUpdateAndRestart: () => {
    return import_electron.ipcRenderer.invoke(IPC_CHANNELS.UPDATER_INSTALL);
  },
  getUpdaterStatus: () => {
    return import_electron.ipcRenderer.invoke(IPC_CHANNELS.UPDATER_GET_STATUS);
  },
  onUpdaterStatusChange: (callback) => {
    const listener = (_event, status) => {
      callback(status);
    };
    import_electron.ipcRenderer.on(IPC_CHANNELS.UPDATER_STATUS_CHANGED, listener);
    return () => {
      import_electron.ipcRenderer.removeListener(IPC_CHANNELS.UPDATER_STATUS_CHANGED, listener);
    };
  },
  // System Telemetry
  getTelemetry: () => {
    return import_electron.ipcRenderer.invoke(IPC_CHANNELS.GET_TELEMETRY);
  }
};
import_electron.contextBridge.exposeInMainWorld("jarvisApi", apiBridge);
