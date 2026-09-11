import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/constants';
import type {
  AppConfig,
  JarvisApiBridge,
  SystemTelemetryData,
  UpdaterStatusPayload,
} from '../shared/types';

const apiBridge: JarvisApiBridge = {
  isElectron: true,

  getAppConfig: (): Promise<AppConfig> => {
    return ipcRenderer.invoke(IPC_CHANNELS.GET_APP_CONFIG);
  },

  getAppVersion: (): Promise<string> => {
    return ipcRenderer.invoke(IPC_CHANNELS.GET_APP_VERSION);
  },

  // Window Controls
  minimizeWindow: (): Promise<void> => {
    return ipcRenderer.invoke(IPC_CHANNELS.WINDOW_MINIMIZE);
  },

  maximizeWindow: (): Promise<void> => {
    return ipcRenderer.invoke(IPC_CHANNELS.WINDOW_MAXIMIZE);
  },

  closeWindow: (): Promise<void> => {
    return ipcRenderer.invoke(IPC_CHANNELS.WINDOW_CLOSE);
  },

  isWindowMaximized: (): Promise<boolean> => {
    return ipcRenderer.invoke(IPC_CHANNELS.WINDOW_IS_MAXIMIZED);
  },

  // Updater API
  checkForUpdates: (): Promise<UpdaterStatusPayload> => {
    return ipcRenderer.invoke(IPC_CHANNELS.UPDATER_CHECK);
  },

  downloadUpdate: (): Promise<void> => {
    return ipcRenderer.invoke(IPC_CHANNELS.UPDATER_DOWNLOAD);
  },

  installUpdateAndRestart: (): Promise<void> => {
    return ipcRenderer.invoke(IPC_CHANNELS.UPDATER_INSTALL);
  },

  getUpdaterStatus: (): Promise<UpdaterStatusPayload> => {
    return ipcRenderer.invoke(IPC_CHANNELS.UPDATER_GET_STATUS);
  },

  onUpdaterStatusChange: (callback: (status: UpdaterStatusPayload) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, status: UpdaterStatusPayload) => {
      callback(status);
    };
    ipcRenderer.on(IPC_CHANNELS.UPDATER_STATUS_CHANGED, listener);
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.UPDATER_STATUS_CHANGED, listener);
    };
  },

  // System Telemetry
  getTelemetry: (): Promise<SystemTelemetryData> => {
    return ipcRenderer.invoke(IPC_CHANNELS.GET_TELEMETRY);
  },
};

contextBridge.exposeInMainWorld('jarvisApi', apiBridge);
