import { BrowserWindow } from 'electron';
import { autoUpdater, ProgressInfo, UpdateInfo } from 'electron-updater';
import { ConfigService } from '../../config';
import { IPC_CHANNELS } from '../../../shared/constants';
import type { UpdaterStatusPayload, UpdaterState } from '../../../shared/types';

export class UpdaterService {
  private static instance: UpdaterService;
  private mainWindow: BrowserWindow | null = null;
  private isChecking = false;
  private isDownloading = false;

  private status: UpdaterStatusPayload = {
    state: 'idle',
    currentVersion: '1.0.0',
    availableVersion: null,
    progress: null,
    error: null,
    lastChecked: null,
  };

  private constructor() {
    const config = ConfigService.getInstance();
    this.status.currentVersion = config.getVersion();

    // Configure autoUpdater
    autoUpdater.autoDownload = false; // User controls when download starts
    autoUpdater.autoInstallOnAppQuit = true;
    autoUpdater.allowPrerelease = false;

    this.setupListeners();
  }

  public static getInstance(): UpdaterService {
    if (!UpdaterService.instance) {
      UpdaterService.instance = new UpdaterService();
    }
    return UpdaterService.instance;
  }

  public setMainWindow(window: BrowserWindow): void {
    this.mainWindow = window;
  }

  private setupListeners(): void {
    autoUpdater.on('checking-for-update', () => {
      this.updateState('checking', {
        error: null,
        lastChecked: new Date().toISOString(),
      });
    });

    autoUpdater.on('update-available', (info: UpdateInfo) => {
      this.isChecking = false;
      this.updateState('update-available', {
        availableVersion: info.version,
        error: null,
      });
    });

    autoUpdater.on('update-not-available', () => {
      this.isChecking = false;
      this.updateState('no-update', {
        availableVersion: null,
        error: null,
      });
    });

    autoUpdater.on('download-progress', (progressObj: ProgressInfo) => {
      this.isDownloading = true;
      this.updateState('downloading', {
        progress: {
          percent: Math.round(progressObj.percent * 10) / 10,
          transferred: progressObj.transferred,
          total: progressObj.total,
          bytesPerSecond: progressObj.bytesPerSecond,
        },
      });
    });

    autoUpdater.on('update-downloaded', (info: UpdateInfo) => {
      this.isDownloading = false;
      this.updateState('downloaded', {
        availableVersion: info.version,
        progress: {
          percent: 100,
          transferred: this.status.progress?.total || 0,
          total: this.status.progress?.total || 0,
          bytesPerSecond: 0,
        },
      });
    });

    autoUpdater.on('error', (err: Error) => {
      this.isChecking = false;
      this.isDownloading = false;
      const cleanMessage = this.sanitizeErrorMessage(err);
      this.updateState('error', {
        error: cleanMessage,
      });
    });
  }

  private sanitizeErrorMessage(err: Error): string {
    const msg = err.message || 'Unknown update service error';
    if (msg.includes('net::ERR_INTERNET_DISCONNECTED') || msg.includes('ENOTFOUND')) {
      return 'Network connection unavailable. Operating in offline mode.';
    }
    if (msg.includes('404') || msg.includes('cannot find')) {
      return 'No release publication found for this repository channel yet.';
    }
    return msg.replace(/[\n\r]+/g, ' ').substring(0, 150);
  }

  private updateState(state: UpdaterState, partial: Partial<UpdaterStatusPayload>): void {
    this.status = {
      ...this.status,
      ...partial,
      state,
    };

    this.broadcastStatus();
  }

  private broadcastStatus(): void {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send(IPC_CHANNELS.UPDATER_STATUS_CHANGED, this.status);
    }
  }

  public getStatus(): UpdaterStatusPayload {
    return { ...this.status };
  }

  public async checkForUpdates(): Promise<UpdaterStatusPayload> {
    const config = ConfigService.getInstance();

    if (this.isChecking) {
      return this.status;
    }

    this.isChecking = true;
    this.updateState('checking', {
      error: null,
      lastChecked: new Date().toISOString(),
    });

    // In development mode, mock checking or check safely if configured
    if (config.isDevelopment()) {
      // Simulate checking delay then report safe dev status
      setTimeout(() => {
        this.isChecking = false;
        // In dev mode, keep state clean or report dev check complete
        this.updateState('no-update', {
          error: null,
          lastChecked: new Date().toISOString(),
        });
      }, 1200);

      return this.status;
    }

    try {
      await autoUpdater.checkForUpdates();
    } catch (err: unknown) {
      this.isChecking = false;
      const errorMsg = err instanceof Error ? this.sanitizeErrorMessage(err) : 'Update check failed';
      this.updateState('error', { error: errorMsg });
    }

    return this.status;
  }

  public async downloadUpdate(): Promise<void> {
    const config = ConfigService.getInstance();

    if (this.isDownloading) {
      return;
    }

    if (config.isDevelopment()) {
      // Dev mode demonstration simulation: simulate real progress steps for UI validation
      this.isDownloading = true;
      this.updateState('downloading', {
        progress: { percent: 0, transferred: 0, total: 65400000, bytesPerSecond: 2500000 },
      });

      let currentPercent = 0;
      const interval = setInterval(() => {
        currentPercent += 12.5;
        if (currentPercent >= 100) {
          clearInterval(interval);
          this.isDownloading = false;
          this.updateState('downloaded', {
            availableVersion: this.status.availableVersion || '1.0.1',
            progress: { percent: 100, transferred: 65400000, total: 65400000, bytesPerSecond: 0 },
          });
        } else {
          this.updateState('downloading', {
            progress: {
              percent: Math.round(currentPercent * 10) / 10,
              transferred: Math.round((currentPercent / 100) * 65400000),
              total: 65400000,
              bytesPerSecond: 3200000,
            },
          });
        }
      }, 500);

      return;
    }

    try {
      this.isDownloading = true;
      this.updateState('downloading', {
        progress: { percent: 0, transferred: 0, total: 0, bytesPerSecond: 0 },
      });
      await autoUpdater.downloadUpdate();
    } catch (err: unknown) {
      this.isDownloading = false;
      const errorMsg = err instanceof Error ? this.sanitizeErrorMessage(err) : 'Download failed';
      this.updateState('error', { error: errorMsg });
    }
  }

  public async installUpdateAndRestart(): Promise<void> {
    if (this.status.state !== 'downloaded') {
      return;
    }

    const config = ConfigService.getInstance();
    if (config.isDevelopment()) {
      // In dev mode, simulate restart/updated state
      this.updateState('idle', {
        currentVersion: this.status.availableVersion || '1.0.1',
        availableVersion: null,
        progress: null,
        error: null,
      });
      return;
    }

    // Call real autoUpdater install and restart
    // isSilent: false, isForceRunAfter: true ensures polite, standard restart
    autoUpdater.quitAndInstall(false, true);
  }
}
