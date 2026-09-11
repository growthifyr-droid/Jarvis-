import { app } from 'electron';
import type { AppConfig } from '../shared/types';
import packageJson from '../../package.json';

export class ConfigService {
  private static instance: ConfigService;
  private readonly config: AppConfig;

  private constructor() {
    const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

    this.config = {
      version: app ? app.getVersion() : packageJson.version,
      appName: packageJson.productName || 'JARVIS',
      isPackaged: app ? app.isPackaged : false,
      isDev,
      platform: process.platform,
      arch: process.arch,
      updateFeedUrl: 'https://github.com/YOUR_GITHUB_USERNAME/YOUR_JARVIS_REPOSITORY/releases',
    };
  }

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  public getConfig(): AppConfig {
    return { ...this.config };
  }

  public getVersion(): string {
    return this.config.version || packageJson.version || '1.0.0';
  }

  public isDevelopment(): boolean {
    return this.config.isDev;
  }

  public isProduction(): boolean {
    return !this.config.isDev;
  }
}
