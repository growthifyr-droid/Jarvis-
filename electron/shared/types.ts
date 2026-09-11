/**
 * Shared Type Definitions & Contracts for JARVIS Desktop
 * Used across Electron Main, Preload, and React Renderer
 */

export type UpdaterState =
  | 'idle'
  | 'checking'
  | 'update-available'
  | 'no-update'
  | 'downloading'
  | 'downloaded'
  | 'error';

export interface UpdateProgressPayload {
  percent: number;
  transferred: number;
  total: number;
  bytesPerSecond: number;
}

export interface UpdateAvailablePayload {
  version: string;
  releaseDate?: string;
  releaseNotes?: string;
  releaseName?: string;
}

export interface UpdaterStatusPayload {
  state: UpdaterState;
  currentVersion: string;
  availableVersion: string | null;
  progress: UpdateProgressPayload | null;
  error: string | null;
  lastChecked: string | null;
}

export interface AppConfig {
  version: string;
  appName: string;
  isPackaged: boolean;
  isDev: boolean;
  platform: string;
  arch: string;
  updateFeedUrl?: string;
}

export interface SystemTelemetryData {
  pingLatency: number; // ms
  packetRate: number; // MB/s
  cpuUsage: number; // %
  memoryUsage: number; // %
  thermalTemp: number; // °C
  hostEnv: string;
  meshStatus: string;
  kernelActive: boolean;
  timestamp: string;
}

/**
 * Foundation Contract for Future Agent Registry
 */
export interface AgentDefinition {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  permissions: string[];
  enabled: boolean;
  memoryNamespace: string;
  version: string;
  metadata?: Record<string, unknown>;
}

/**
 * Secure IPC API Bridge exposed to renderer via window.jarvisApi
 */
export interface JarvisApiBridge {
  getAppConfig: () => Promise<AppConfig>;
  getAppVersion: () => Promise<string>;
  // Window controls
  minimizeWindow: () => Promise<void>;
  maximizeWindow: () => Promise<void>;
  closeWindow: () => Promise<void>;
  isWindowMaximized: () => Promise<boolean>;
  // Updater API
  checkForUpdates: () => Promise<UpdaterStatusPayload>;
  downloadUpdate: () => Promise<void>;
  installUpdateAndRestart: () => Promise<void>;
  getUpdaterStatus: () => Promise<UpdaterStatusPayload>;
  onUpdaterStatusChange: (callback: (status: UpdaterStatusPayload) => void) => () => void;
  // System Telemetry
  getTelemetry: () => Promise<SystemTelemetryData>;
  onTelemetryUpdate?: (callback: (telemetry: SystemTelemetryData) => void) => () => void;
  // Environment Check
  isElectron: boolean;
}

declare global {
  interface Window {
    jarvisApi?: JarvisApiBridge;
  }
}
