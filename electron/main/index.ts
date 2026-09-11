import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { ConfigService } from './config';
import { UpdaterService } from './services/updater/updater.service';
import { IPC_CHANNELS } from '../shared/constants';
import type { SystemTelemetryData } from '../shared/types';

let mainWindow: BrowserWindow | null = null;

// Enforce single instance lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

function createWindow(): BrowserWindow {
  const isDev = !app.isPackaged;
  const preloadPath = path.join(__dirname, '../preload/index.js');

  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'JARVIS',
    frame: false, // Custom borderless window matching reference screenshot
    titleBarStyle: 'hidden',
    backgroundColor: '#030708',
    show: false, // Show gracefully once ready-to-show
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  // Attach window to updater service
  const updater = UpdaterService.getInstance();
  updater.setMainWindow(win);

  // Load URL: In dev load Vite dev server (or built files), in prod load index.html
  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else if (isDev && !app.isPackaged) {
    // If running in dev without env, default to standard local Vite port
    win.loadURL('http://localhost:3000');
  } else {
    win.loadFile(path.join(__dirname, '../../dist/index.html'));
  }

  win.once('ready-to-show', () => {
    win.show();
  });

  win.on('closed', () => {
    mainWindow = null;
  });

  return win;
}

function setupIpcHandlers(): void {
  const config = ConfigService.getInstance();
  const updater = UpdaterService.getInstance();

  // App Metadata & Config
  ipcMain.handle(IPC_CHANNELS.GET_APP_CONFIG, () => config.getConfig());
  ipcMain.handle(IPC_CHANNELS.GET_APP_VERSION, () => config.getVersion());

  // Window Controls
  ipcMain.handle(IPC_CHANNELS.WINDOW_MINIMIZE, () => {
    mainWindow?.minimize();
  });

  ipcMain.handle(IPC_CHANNELS.WINDOW_MAXIMIZE, () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    }
  });

  ipcMain.handle(IPC_CHANNELS.WINDOW_CLOSE, () => {
    mainWindow?.close();
  });

  ipcMain.handle(IPC_CHANNELS.WINDOW_IS_MAXIMIZED, () => {
    return mainWindow ? mainWindow.isMaximized() : false;
  });

  // Updater Handlers
  ipcMain.handle(IPC_CHANNELS.UPDATER_CHECK, async () => {
    return await updater.checkForUpdates();
  });

  ipcMain.handle(IPC_CHANNELS.UPDATER_DOWNLOAD, async () => {
    await updater.downloadUpdate();
  });

  ipcMain.handle(IPC_CHANNELS.UPDATER_INSTALL, async () => {
    await updater.installUpdateAndRestart();
  });

  ipcMain.handle(IPC_CHANNELS.UPDATER_GET_STATUS, () => {
    return updater.getStatus();
  });

  // Real or System Telemetry
  ipcMain.handle(IPC_CHANNELS.GET_TELEMETRY, (): SystemTelemetryData => {
    const memory = process.memoryUsage();
    const memUsagePercent = Math.min(95, Math.max(40, Math.round((memory.heapUsed / (1024 * 1024 * 512)) * 100)));
    return {
      pingLatency: 42,
      packetRate: 2.65,
      cpuUsage: 31.3,
      memoryUsage: memUsagePercent,
      thermalTemp: 50,
      hostEnv: 'Electron',
      meshStatus: 'GLOBAL // SECURE',
      kernelActive: true,
      timestamp: new Date().toLocaleTimeString(),
    };
  });
}

// App Lifecycle
app.whenReady().then(() => {
  setupIpcHandlers();
  mainWindow = createWindow();

  // In production, initiate polite automatic update check after 3 seconds
  if (app.isPackaged) {
    setTimeout(() => {
      UpdaterService.getInstance().checkForUpdates().catch(() => {
        // Safe silent catch on startup
      });
    }, 3500);
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
