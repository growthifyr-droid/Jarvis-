import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { TelemetryPanel } from './components/TelemetryPanel';
import { NeuralHarmonicCore } from './components/NeuralHarmonicCore';
import { TranscriptPanel } from './components/TranscriptPanel';
import { UpdateCenterModal } from './components/UpdateCenterModal';
import { AgentsView } from './components/views/AgentsView';
import { BrainApiView } from './components/views/BrainApiView';
import { VoiceApiView } from './components/views/VoiceApiView';
import { MemoryView } from './components/views/MemoryView';
import { SettingsView } from './components/views/SettingsView';
import { ActivityLogView } from './components/views/ActivityLogView';
import { ReportsView } from './components/views/ReportsView';
import { AutomationsView } from './components/views/AutomationsView';
import { ThirdPartyAppsView } from './components/views/ThirdPartyAppsView';
import { DiagnosticsView } from './components/views/DiagnosticsView';
import { jarvisBridge } from './services/jarvis-bridge';
import { Sparkles, Download, RotateCcw, X } from 'lucide-react';
import type { UpdaterStatusPayload } from '../electron/shared/types';
import packageJson from '../package.json';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');
  const [isUpdateCenterOpen, setIsUpdateCenterOpen] = useState(false);
  const [dismissedBannerVersion, setDismissedBannerVersion] = useState<string | null>(null);

  const [updaterStatus, setUpdaterStatus] = useState<UpdaterStatusPayload>({
    state: 'idle',
    currentVersion: packageJson.version || '1.0.0',
    availableVersion: null,
    progress: null,
    error: null,
    lastChecked: null,
  });

  useEffect(() => {
    // Listen for live update events from Electron main process
    const unsubscribe = jarvisBridge.onUpdaterStatusChange((newStatus) => {
      setUpdaterStatus(newStatus);
    });

    // Check initial status
    jarvisBridge.getUpdaterStatus().then((status) => {
      setUpdaterStatus(status);
    });

    return () => unsubscribe();
  }, []);

  const showNotificationBanner =
    (updaterStatus.state === 'update-available' || updaterStatus.state === 'downloaded') &&
    dismissedBannerVersion !== updaterStatus.availableVersion;

  return (
    <div className="flex flex-col h-screen w-screen bg-[#08090b] text-[#f0f3f6] overflow-hidden font-sans select-none antialiased">
      {/* Top Application Header / Custom Window Bar */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenUpdateCenter={() => setIsUpdateCenterOpen(true)}
        updaterStatus={updaterStatus}
      />

      {/* In-App Update Notification Banner (Restrained, neutral dark background) */}
      {showNotificationBanner && (
        <div
          id="update-notification-banner"
          className="bg-[#11141a] border-b border-[#1c222b] px-6 py-2.5 flex items-center justify-between z-20 flex-shrink-0"
        >
          <div className="flex items-center gap-2.5 font-mono text-xs">
            <Sparkles className="w-4 h-4 text-[#38bdf8]" />
            <span className="font-bold text-[#f0f3f6]">
              {updaterStatus.state === 'downloaded'
                ? `Update v${updaterStatus.availableVersion || '1.0.1'} Ready to Install`
                : `Update Available: Jarvis v${updaterStatus.availableVersion || '1.0.1'}`}
            </span>
            <span className="text-[#8c96a5] hidden sm:inline">
              — Official production release ready.
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            {updaterStatus.state === 'downloaded' ? (
              <button
                onClick={() => jarvisBridge.installUpdateAndRestart()}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#00f2a1] text-[#08120e] font-bold shadow-[0_0_8px_rgba(0,242,161,0.3)] hover:scale-105 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart & Update</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  jarvisBridge.downloadUpdate();
                  setIsUpdateCenterOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#00f2a1] text-[#08120e] font-bold shadow-[0_0_8px_rgba(0,242,161,0.3)] hover:scale-105 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Update</span>
              </button>
            )}

            <button
              onClick={() => setIsUpdateCenterOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-[#151920] hover:bg-[#1a2029] border border-[#262e38] text-[#8c96a5] hover:text-white transition-colors cursor-pointer"
            >
              Details
            </button>

            <button
              onClick={() => setDismissedBannerVersion(updaterStatus.availableVersion)}
              className="w-6 h-6 flex items-center justify-center text-[#8c96a5] hover:text-white rounded cursor-pointer"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative w-full h-full">
        {/* CHAT TAB: 3-column layout (Left Telemetry + Center 1:1 Circle Jarvis + Right Transcript) */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex overflow-hidden relative w-full h-full">
            <TelemetryPanel />
            <NeuralHarmonicCore />
            <TranscriptPanel currentVersion={updaterStatus.currentVersion} />
          </div>
        )}

        {/* NON-CHAT PAGES: Full available width with centered PageContainer, NO left chat sidebar! */}
        {activeTab === 'agents' && <AgentsView />}
        {activeTab === 'third-party' && <ThirdPartyAppsView />}
        {activeTab === 'brain-api' && <BrainApiView />}
        {activeTab === 'voice-api' && <VoiceApiView />}
        {activeTab === 'memory' && <MemoryView />}
        {activeTab === 'activity-log' && <ActivityLogView />}
        {activeTab === 'reports' && <ReportsView />}
        {activeTab === 'automations' && <AutomationsView />}
        {activeTab === 'settings' && (
          <SettingsView
            onOpenUpdateCenter={() => setIsUpdateCenterOpen(true)}
            updaterStatus={updaterStatus}
          />
        )}
        {activeTab === 'diagnostics' && (
          <DiagnosticsView updaterStatus={updaterStatus} />
        )}
      </main>

      {/* Update Center Modal HUD */}
      <UpdateCenterModal
        isOpen={isUpdateCenterOpen}
        onClose={() => setIsUpdateCenterOpen(false)}
        status={updaterStatus}
      />
    </div>
  );
}
