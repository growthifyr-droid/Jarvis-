import type {
  AppConfig,
  JarvisApiBridge,
  SystemTelemetryData,
  UpdaterStatusPayload,
} from '../../electron/shared/types';
import packageJson from '../../package.json';

type StatusListener = (status: UpdaterStatusPayload) => void;

class JarvisBridgeClient implements JarvisApiBridge {
  public isElectron: boolean = false;
  private mockListeners: Set<StatusListener> = new Set();
  private mockStatus: UpdaterStatusPayload = {
    state: 'idle',
    currentVersion: packageJson.version || '1.0.0',
    availableVersion: null,
    progress: null,
    error: null,
    lastChecked: null,
  };

  constructor() {
    this.isElectron = typeof window !== 'undefined' && Boolean(window.jarvisApi?.isElectron);
  }

  public async getAppConfig(): Promise<AppConfig> {
    if (this.isElectron && window.jarvisApi) {
      return await window.jarvisApi.getAppConfig();
    }
    return {
      version: packageJson.version || '1.0.0',
      appName: 'JARVIS',
      isPackaged: false,
      isDev: true,
      platform: 'win32',
      arch: 'x64',
    };
  }

  public async getAppVersion(): Promise<string> {
    if (this.isElectron && window.jarvisApi) {
      return await window.jarvisApi.getAppVersion();
    }
    return packageJson.version || '1.0.0';
  }

  public async minimizeWindow(): Promise<void> {
    if (this.isElectron && window.jarvisApi) {
      await window.jarvisApi.minimizeWindow();
    } else {
      console.log('[JarvisBridge] Window minimize requested');
    }
  }

  public async maximizeWindow(): Promise<void> {
    if (this.isElectron && window.jarvisApi) {
      await window.jarvisApi.maximizeWindow();
    } else {
      console.log('[JarvisBridge] Window maximize requested');
    }
  }

  public async closeWindow(): Promise<void> {
    if (this.isElectron && window.jarvisApi) {
      await window.jarvisApi.closeWindow();
    } else {
      console.log('[JarvisBridge] Window close requested');
    }
  }

  public async isWindowMaximized(): Promise<boolean> {
    if (this.isElectron && window.jarvisApi) {
      return await window.jarvisApi.isWindowMaximized();
    }
    return false;
  }

  public async checkForUpdates(): Promise<UpdaterStatusPayload> {
    if (this.isElectron && window.jarvisApi) {
      return await window.jarvisApi.checkForUpdates();
    }

    // Web/dev simulation for verification
    this.notifyMockStatus({
      state: 'checking',
      lastChecked: new Date().toISOString(),
      error: null,
    });

    await new Promise((r) => setTimeout(r, 1200));

    // By default in dev, show update available v1.0.1 or no-update
    this.notifyMockStatus({
      state: 'update-available',
      availableVersion: '1.0.1',
      lastChecked: new Date().toISOString(),
      error: null,
    });

    return this.mockStatus;
  }

  public async downloadUpdate(): Promise<void> {
    if (this.isElectron && window.jarvisApi) {
      await window.jarvisApi.downloadUpdate();
      return;
    }

    // Realistic download progress simulation for dev preview
    const totalBytes = 64_800_000;
    this.notifyMockStatus({
      state: 'downloading',
      progress: { percent: 0, transferred: 0, total: totalBytes, bytesPerSecond: 3_200_000 },
    });

    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      if (current >= 100) {
        clearInterval(interval);
        this.notifyMockStatus({
          state: 'downloaded',
          availableVersion: '1.0.1',
          progress: {
            percent: 100,
            transferred: totalBytes,
            total: totalBytes,
            bytesPerSecond: 0,
          },
        });
      } else {
        this.notifyMockStatus({
          state: 'downloading',
          progress: {
            percent: current,
            transferred: Math.round((current / 100) * totalBytes),
            total: totalBytes,
            bytesPerSecond: 3_400_000,
          },
        });
      }
    }, 450);
  }

  public async installUpdateAndRestart(): Promise<void> {
    if (this.isElectron && window.jarvisApi) {
      await window.jarvisApi.installUpdateAndRestart();
      return;
    }

    // Dev preview simulated restart
    this.notifyMockStatus({
      state: 'idle',
      currentVersion: this.mockStatus.availableVersion || '1.0.1',
      availableVersion: null,
      progress: null,
      error: null,
    });
  }

  public async getUpdaterStatus(): Promise<UpdaterStatusPayload> {
    if (this.isElectron && window.jarvisApi) {
      return await window.jarvisApi.getUpdaterStatus();
    }
    return { ...this.mockStatus };
  }

  public onUpdaterStatusChange(callback: (status: UpdaterStatusPayload) => void): () => void {
    if (this.isElectron && window.jarvisApi) {
      return window.jarvisApi.onUpdaterStatusChange(callback);
    }

    this.mockListeners.add(callback);
    callback({ ...this.mockStatus });
    return () => {
      this.mockListeners.delete(callback);
    };
  }

  public async getTelemetry(): Promise<SystemTelemetryData> {
    if (this.isElectron && window.jarvisApi) {
      return await window.jarvisApi.getTelemetry();
    }
    return {
      pingLatency: 42,
      packetRate: 2.65,
      cpuUsage: 31.3,
      memoryUsage: 74.7,
      thermalTemp: 50,
      hostEnv: 'Electron',
      meshStatus: 'GLOBAL // SECURE',
      kernelActive: true,
      timestamp: new Date().toLocaleTimeString(),
    };
  }

  public resetMockStatus(state: UpdaterStatusPayload['state'] = 'idle'): void {
    this.notifyMockStatus({
      state,
      availableVersion: null,
      progress: null,
      error: null,
    });
  }

  private notifyMockStatus(partial: Partial<UpdaterStatusPayload>): void {
    this.mockStatus = {
      ...this.mockStatus,
      ...partial,
    };
    for (const listener of this.mockListeners) {
      listener({ ...this.mockStatus });
    }
  }
}

export const jarvisBridge = new JarvisBridgeClient();
