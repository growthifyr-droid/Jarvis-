import packageJson from '../../package.json';
import type { UpdaterStatusPayload, UpdaterState, UpdateProgressPayload } from '../../electron/shared/types';

export class VersionService {
  private static instance: VersionService;
  private currentVersion: string;
  private latestVersion: string | null = null;
  private state: UpdaterState = 'idle';
  private progress: UpdateProgressPayload | null = null;

  private constructor() {
    this.currentVersion = packageJson.version || '1.0.0';
  }

  public static getInstance(): VersionService {
    if (!VersionService.instance) {
      VersionService.instance = new VersionService();
    }
    return VersionService.instance;
  }

  public getCurrentVersion(): string {
    return this.currentVersion;
  }

  public getLatestVersion(): string | null {
    return this.latestVersion;
  }

  public getUpdateState(): UpdaterState {
    return this.state;
  }

  public getDownloadProgress(): UpdateProgressPayload | null {
    return this.progress;
  }

  public syncWithUpdaterStatus(status: UpdaterStatusPayload): void {
    if (status.currentVersion) {
      this.currentVersion = status.currentVersion;
    }
    this.latestVersion = status.availableVersion;
    this.state = status.state;
    this.progress = status.progress;
  }
}
