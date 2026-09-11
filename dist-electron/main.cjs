var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// electron/main/index.ts
var import_electron2 = require("electron");
var import_path = __toESM(require("path"), 1);

// electron/main/config.ts
var import_electron = require("electron");

// package.json
var package_default = {
  name: "jarvis-desktop",
  productName: "JARVIS",
  private: true,
  version: "1.0.2",
  type: "module",
  main: "dist-electron/main.cjs",
  scripts: {
    dev: "vite --port=3000 --host=0.0.0.0",
    build: "vite build && npm run build:electron",
    "build:renderer": "vite build",
    "build:electron": "esbuild electron/main/index.ts --bundle --platform=node --format=cjs --packages=external --outfile=dist-electron/main.cjs && esbuild electron/preload/index.ts --bundle --platform=node --format=cjs --packages=external --outfile=dist-electron/preload.cjs",
    "electron:dev": "npm run build:electron && electron .",
    preview: "vite preview",
    dist: "npm run build && electron-builder --win",
    release: "npm run build && electron-builder --win",
    clean: "rm -rf dist dist-electron release",
    lint: "tsc --noEmit"
  },
  dependencies: {
    "@google/genai": "^2.4.0",
    "@tailwindcss/vite": "^4.1.14",
    "@vitejs/plugin-react": "^5.0.4",
    dotenv: "^17.2.3",
    "electron-updater": "^6.8.9",
    express: "^4.21.2",
    "lucide-react": "^0.546.0",
    motion: "^12.23.24",
    react: "^19.0.1",
    "react-dom": "^19.0.1",
    vite: "^6.2.3"
  },
  devDependencies: {
    "@types/express": "^4.17.21",
    "@types/node": "^22.14.0",
    autoprefixer: "^10.4.21",
    electron: "^44.3.0",
    "electron-builder": "^26.15.3",
    esbuild: "^0.25.0",
    sharp: "^0.35.4",
    tailwindcss: "^4.1.14",
    tsx: "^4.21.0",
    typescript: "~5.8.2",
    vite: "^6.2.3"
  },
  optionalDependencies: {
    "@tailwindcss/oxide-win32-x64-msvc": "^4.1.14",
    "@rollup/rollup-win32-x64-msvc": "^4.63.1",
    "lightningcss-win32-x64-msvc": "^1.32.0",
    "@esbuild/win32-x64": "^0.25.0"
  }
};

// electron/main/config.ts
var ConfigService = class _ConfigService {
  constructor() {
    const isDev = process.env.NODE_ENV === "development" || !import_electron.app.isPackaged;
    this.config = {
      version: import_electron.app ? import_electron.app.getVersion() : package_default.version,
      appName: package_default.productName || "JARVIS",
      isPackaged: import_electron.app ? import_electron.app.isPackaged : false,
      isDev,
      platform: process.platform,
      arch: process.arch,
      updateFeedUrl: "https://github.com/YOUR_GITHUB_USERNAME/YOUR_JARVIS_REPOSITORY/releases"
    };
  }
  static getInstance() {
    if (!_ConfigService.instance) {
      _ConfigService.instance = new _ConfigService();
    }
    return _ConfigService.instance;
  }
  getConfig() {
    return { ...this.config };
  }
  getVersion() {
    return this.config.version || package_default.version || "1.0.0";
  }
  isDevelopment() {
    return this.config.isDev;
  }
  isProduction() {
    return !this.config.isDev;
  }
};

// electron/main/services/updater/updater.service.ts
var import_electron_updater = require("electron-updater");

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

// electron/main/services/updater/updater.service.ts
var UpdaterService = class _UpdaterService {
  constructor() {
    this.mainWindow = null;
    this.isChecking = false;
    this.isDownloading = false;
    this.status = {
      state: "idle",
      currentVersion: "1.0.0",
      availableVersion: null,
      progress: null,
      error: null,
      lastChecked: null
    };
    const config = ConfigService.getInstance();
    this.status.currentVersion = config.getVersion();
    import_electron_updater.autoUpdater.autoDownload = false;
    import_electron_updater.autoUpdater.autoInstallOnAppQuit = true;
    import_electron_updater.autoUpdater.allowPrerelease = false;
    this.setupListeners();
  }
  static getInstance() {
    if (!_UpdaterService.instance) {
      _UpdaterService.instance = new _UpdaterService();
    }
    return _UpdaterService.instance;
  }
  setMainWindow(window) {
    this.mainWindow = window;
  }
  setupListeners() {
    import_electron_updater.autoUpdater.on("checking-for-update", () => {
      this.updateState("checking", {
        error: null,
        lastChecked: (/* @__PURE__ */ new Date()).toISOString()
      });
    });
    import_electron_updater.autoUpdater.on("update-available", (info) => {
      this.isChecking = false;
      this.updateState("update-available", {
        availableVersion: info.version,
        error: null
      });
    });
    import_electron_updater.autoUpdater.on("update-not-available", () => {
      this.isChecking = false;
      this.updateState("no-update", {
        availableVersion: null,
        error: null
      });
    });
    import_electron_updater.autoUpdater.on("download-progress", (progressObj) => {
      this.isDownloading = true;
      this.updateState("downloading", {
        progress: {
          percent: Math.round(progressObj.percent * 10) / 10,
          transferred: progressObj.transferred,
          total: progressObj.total,
          bytesPerSecond: progressObj.bytesPerSecond
        }
      });
    });
    import_electron_updater.autoUpdater.on("update-downloaded", (info) => {
      this.isDownloading = false;
      this.updateState("downloaded", {
        availableVersion: info.version,
        progress: {
          percent: 100,
          transferred: this.status.progress?.total || 0,
          total: this.status.progress?.total || 0,
          bytesPerSecond: 0
        }
      });
    });
    import_electron_updater.autoUpdater.on("error", (err) => {
      this.isChecking = false;
      this.isDownloading = false;
      const cleanMessage = this.sanitizeErrorMessage(err);
      this.updateState("error", {
        error: cleanMessage
      });
    });
  }
  sanitizeErrorMessage(err) {
    const msg = err.message || "Unknown update service error";
    if (msg.includes("net::ERR_INTERNET_DISCONNECTED") || msg.includes("ENOTFOUND")) {
      return "Network connection unavailable. Operating in offline mode.";
    }
    if (msg.includes("404") || msg.includes("cannot find")) {
      return "No release publication found for this repository channel yet.";
    }
    return msg.replace(/[\n\r]+/g, " ").substring(0, 150);
  }
  updateState(state, partial) {
    this.status = {
      ...this.status,
      ...partial,
      state
    };
    this.broadcastStatus();
  }
  broadcastStatus() {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send(IPC_CHANNELS.UPDATER_STATUS_CHANGED, this.status);
    }
  }
  getStatus() {
    return { ...this.status };
  }
  async checkForUpdates() {
    const config = ConfigService.getInstance();
    if (this.isChecking) {
      return this.status;
    }
    this.isChecking = true;
    this.updateState("checking", {
      error: null,
      lastChecked: (/* @__PURE__ */ new Date()).toISOString()
    });
    if (config.isDevelopment()) {
      setTimeout(() => {
        this.isChecking = false;
        this.updateState("no-update", {
          error: null,
          lastChecked: (/* @__PURE__ */ new Date()).toISOString()
        });
      }, 1200);
      return this.status;
    }
    try {
      await import_electron_updater.autoUpdater.checkForUpdates();
    } catch (err) {
      this.isChecking = false;
      const errorMsg = err instanceof Error ? this.sanitizeErrorMessage(err) : "Update check failed";
      this.updateState("error", { error: errorMsg });
    }
    return this.status;
  }
  async downloadUpdate() {
    const config = ConfigService.getInstance();
    if (this.isDownloading) {
      return;
    }
    if (config.isDevelopment()) {
      this.isDownloading = true;
      this.updateState("downloading", {
        progress: { percent: 0, transferred: 0, total: 654e5, bytesPerSecond: 25e5 }
      });
      let currentPercent = 0;
      const interval = setInterval(() => {
        currentPercent += 12.5;
        if (currentPercent >= 100) {
          clearInterval(interval);
          this.isDownloading = false;
          this.updateState("downloaded", {
            availableVersion: this.status.availableVersion || "1.0.1",
            progress: { percent: 100, transferred: 654e5, total: 654e5, bytesPerSecond: 0 }
          });
        } else {
          this.updateState("downloading", {
            progress: {
              percent: Math.round(currentPercent * 10) / 10,
              transferred: Math.round(currentPercent / 100 * 654e5),
              total: 654e5,
              bytesPerSecond: 32e5
            }
          });
        }
      }, 500);
      return;
    }
    try {
      this.isDownloading = true;
      this.updateState("downloading", {
        progress: { percent: 0, transferred: 0, total: 0, bytesPerSecond: 0 }
      });
      await import_electron_updater.autoUpdater.downloadUpdate();
    } catch (err) {
      this.isDownloading = false;
      const errorMsg = err instanceof Error ? this.sanitizeErrorMessage(err) : "Download failed";
      this.updateState("error", { error: errorMsg });
    }
  }
  async installUpdateAndRestart() {
    if (this.status.state !== "downloaded") {
      return;
    }
    const config = ConfigService.getInstance();
    if (config.isDevelopment()) {
      this.updateState("idle", {
        currentVersion: this.status.availableVersion || "1.0.1",
        availableVersion: null,
        progress: null,
        error: null
      });
      return;
    }
    import_electron_updater.autoUpdater.quitAndInstall(false, true);
  }
};

// electron/main/index.ts
var mainWindow = null;
var gotTheLock = import_electron2.app.requestSingleInstanceLock();
if (!gotTheLock) {
  import_electron2.app.quit();
} else {
  import_electron2.app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}
function createWindow() {
  const isDev = !import_electron2.app.isPackaged;
  const preloadPath = import_path.default.join(__dirname, "preload.cjs");
  const iconPath = import_path.default.join(__dirname, "../build/icon.png");
  const win = new import_electron2.BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: "JARVIS",
    frame: false,
    // Custom borderless window matching reference screenshot
    titleBarStyle: "hidden",
    backgroundColor: "#030708",
    show: false,
    // Show gracefully once ready-to-show to prevent blank flash
    icon: iconPath,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });
  const updater = UpdaterService.getInstance();
  updater.setMainWindow(win);
  let hasRetried = false;
  win.webContents.on("did-fail-load", (_event, errorCode, errorDescription) => {
    console.error(`Page failed to load: ${errorDescription} (code: ${errorCode})`);
    if (!hasRetried) {
      hasRetried = true;
      setTimeout(() => {
        if (!win.isDestroyed()) {
          win.loadFile(import_path.default.join(__dirname, "../dist/index.html"));
        }
      }, 1e3);
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
  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else if (isDev && !import_electron2.app.isPackaged) {
    win.loadURL("http://localhost:3000");
  } else {
    win.loadFile(import_path.default.join(__dirname, "../dist/index.html"));
  }
  win.once("ready-to-show", () => {
    win.show();
  });
  win.on("closed", () => {
    mainWindow = null;
  });
  return win;
}
function setupIpcHandlers() {
  const config = ConfigService.getInstance();
  const updater = UpdaterService.getInstance();
  import_electron2.ipcMain.handle(IPC_CHANNELS.GET_APP_CONFIG, () => config.getConfig());
  import_electron2.ipcMain.handle(IPC_CHANNELS.GET_APP_VERSION, () => config.getVersion());
  import_electron2.ipcMain.handle(IPC_CHANNELS.WINDOW_MINIMIZE, () => {
    mainWindow?.minimize();
  });
  import_electron2.ipcMain.handle(IPC_CHANNELS.WINDOW_MAXIMIZE, () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    }
  });
  import_electron2.ipcMain.handle(IPC_CHANNELS.WINDOW_CLOSE, () => {
    mainWindow?.close();
  });
  import_electron2.ipcMain.handle(IPC_CHANNELS.WINDOW_IS_MAXIMIZED, () => {
    return mainWindow ? mainWindow.isMaximized() : false;
  });
  import_electron2.ipcMain.handle(IPC_CHANNELS.UPDATER_CHECK, async () => {
    return await updater.checkForUpdates();
  });
  import_electron2.ipcMain.handle(IPC_CHANNELS.UPDATER_DOWNLOAD, async () => {
    await updater.downloadUpdate();
  });
  import_electron2.ipcMain.handle(IPC_CHANNELS.UPDATER_INSTALL, async () => {
    await updater.installUpdateAndRestart();
  });
  import_electron2.ipcMain.handle(IPC_CHANNELS.UPDATER_GET_STATUS, () => {
    return updater.getStatus();
  });
  import_electron2.ipcMain.handle(IPC_CHANNELS.GET_TELEMETRY, () => {
    const memory = process.memoryUsage();
    const memUsagePercent = Math.min(95, Math.max(40, Math.round(memory.heapUsed / (1024 * 1024 * 512) * 100)));
    return {
      pingLatency: 42,
      packetRate: 2.65,
      cpuUsage: 31.3,
      memoryUsage: memUsagePercent,
      thermalTemp: 50,
      hostEnv: "Electron",
      meshStatus: "GLOBAL // SECURE",
      kernelActive: true,
      timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString()
    };
  });
}
import_electron2.app.whenReady().then(() => {
  setupIpcHandlers();
  mainWindow = createWindow();
  if (import_electron2.app.isPackaged) {
    setTimeout(() => {
      UpdaterService.getInstance().checkForUpdates().catch(() => {
      });
    }, 3500);
  }
  import_electron2.app.on("activate", () => {
    if (import_electron2.BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createWindow();
    }
  });
});
import_electron2.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    import_electron2.app.quit();
  }
});
