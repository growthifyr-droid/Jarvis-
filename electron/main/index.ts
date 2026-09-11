import { app, BrowserWindow, ipcMain } from 'electron';
import fs from 'fs';
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
  const preloadPath = path.join(__dirname, 'preload.cjs');
  const iconPath = path.join(__dirname, '../build/icon.png');

  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'JARVIS',
    frame: false, // Custom borderless window matching reference screenshot
    titleBarStyle: 'hidden',
    backgroundColor: '#030708',
    show: false, // Show gracefully once ready-to-show to prevent blank flash
    icon: iconPath,
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

  // Temporary diagnostic: Open detached DevTools to inspect renderer
  win.webContents.openDevTools({ mode: 'detach' });

  // Log renderer lifecycle events
  win.webContents.on('did-finish-load', () => {
    console.log('Renderer loaded successfully');
  });

  win.webContents.on('console-message', (_event, level, message, line, sourceId) => {
    console.log(`[Renderer Log Level ${level}] ${message} (${sourceId}:${line})`);
  });

  win.webContents.on('render-process-gone', (_event, details) => {
    console.error('Render process gone:', details.reason);
  });

  const rendererPath = path.join(__dirname, '../dist/index.html');
  console.log('Resolved renderer path:', rendererPath);
  console.log('Renderer file exists:', fs.existsSync(rendererPath));

  // Load failure handling with retry and inline error page fallback
  let hasRetried = false;
  win.webContents.on('did-fail-load', (_event, errorCode, errorDescription) => {
    console.error(`Page failed to load: ${errorDescription} (code: ${errorCode})`);
    if (!hasRetried) {
      hasRetried = true;
      setTimeout(() => {
        if (!win.isDestroyed()) {
          win.loadFile(rendererPath);
        }
      }, 1000);
    } else {
      const errorHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>JARVIS</title>
            <style>
              body {
                background-color: #030708;
                color: #ef4444;
                font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                text-align: center;
              }
              h1 { font-size: 22px; font-weight: 600; margin-bottom: 8px; color: #f87171; }
              p { font-size: 14px; color: #94a3b8; }
            </style>
          </head>
          <body>
            <h1>Jarvis failed to load</h1>
            <p>Please reinstall.</p>
          </body>
        </html>
      `;
      win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(errorHtml)}`);
    }
  });

  // Load URL: In dev load Vite dev server, in prod load index.html from ../dist/index.html
  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else if (isDev && !app.isPackaged) {
    win.loadURL('http://localhost:3000');
  } else {
    win.loadFile(rendererPath);
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
