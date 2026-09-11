/**
 * IPC Channels Constants
 * Defined once to prevent typos and mismatched channel strings
 */

export const IPC_CHANNELS = {
  // App Config & Version
  GET_APP_CONFIG: 'jarvis:get-app-config',
  GET_APP_VERSION: 'jarvis:get-app-version',

  // Window Management
  WINDOW_MINIMIZE: 'jarvis:window-minimize',
  WINDOW_MAXIMIZE: 'jarvis:window-maximize',
  WINDOW_CLOSE: 'jarvis:window-close',
  WINDOW_IS_MAXIMIZED: 'jarvis:window-is-maximized',

  // Auto Updater
  UPDATER_CHECK: 'jarvis:updater-check',
  UPDATER_DOWNLOAD: 'jarvis:updater-download',
  UPDATER_INSTALL: 'jarvis:updater-install',
  UPDATER_GET_STATUS: 'jarvis:updater-get-status',
  UPDATER_STATUS_CHANGED: 'jarvis:updater-status-changed',

  // Telemetry
  GET_TELEMETRY: 'jarvis:get-telemetry',
} as const;
