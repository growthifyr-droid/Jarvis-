import React, { useState, useEffect } from 'react';
import { Settings, RefreshCw, Shield, Monitor, Bell, ExternalLink, Cpu } from 'lucide-react';
import { PageContainer } from '../common/PageContainer';
import { jarvisBridge } from '../../services/jarvis-bridge';
import type { AppConfig, UpdaterStatusPayload } from '../../../electron/shared/types';

interface SettingsViewProps {
  onOpenUpdateCenter: () => void;
  updaterStatus: UpdaterStatusPayload;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onOpenUpdateCenter,
  updaterStatus,
}) => {
  const [config, setConfig] = useState<AppConfig | null>(null);

  useEffect(() => {
    jarvisBridge.getAppConfig().then(setConfig);
  }, []);

  return (
    <PageContainer
      id="settings-page"
      icon={<Settings className="w-5 h-5 text-[#00f2a1]" />}
      title="System Settings"
      subtitle="Application Runtime, Safe Release Channels & Desktop Environment"
      actions={
        <button
          onClick={onOpenUpdateCenter}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#00f2a1]/15 text-[#00f2a1] border border-[#00f2a1]/40 font-mono text-xs font-semibold hover:bg-[#00f2a1]/25 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Update Center</span>
        </button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Release & Version Section */}
        <div className="bg-[#111418] border border-[#1e242b] rounded-xl p-5 flex flex-col justify-between gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#f0f3f6] tracking-wider flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#00f2a1]" />
                RELEASE & VERSIONING
              </span>
              <span className="font-mono text-[10px] text-[#00f2a1] bg-[#0d1614] px-2 py-0.5 rounded border border-[#00f2a1]/30">
                v{updaterStatus.currentVersion}
              </span>
            </div>

            <div className="flex flex-col gap-2 font-mono text-xs">
              <div className="flex justify-between py-2 border-b border-[#1a1f26]">
                <span className="text-[#8c96a5]">Application Version</span>
                <span className="text-[#f0f3f6] font-bold">{updaterStatus.currentVersion}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#1a1f26]">
                <span className="text-[#8c96a5]">Target Platform</span>
                <span className="text-[#f0f3f6]">Windows (x64) • NSIS</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#1a1f26]">
                <span className="text-[#8c96a5]">Auto-Updater Status</span>
                <span className="text-[#00f2a1] capitalize">{updaterStatus.state}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#1a1f26]">
                <span className="text-[#8c96a5]">GitHub Release Provider</span>
                <span className="text-[#38bdf8]">electron-updater</span>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenUpdateCenter}
            className="w-full py-2.5 rounded-lg bg-[#151920] hover:bg-[#1a2029] border border-[#262e38] text-xs font-mono text-[#f0f3f6] text-center transition-colors cursor-pointer"
          >
            Open Jarvis Update HUD
          </button>
        </div>

        {/* Runtime Security & IPC */}
        <div className="bg-[#111418] border border-[#1e242b] rounded-xl p-5 flex flex-col justify-between gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#f0f3f6] tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#38bdf8]" />
                RUNTIME ENVIRONMENT & SECURITY
              </span>
              <span className="font-mono text-[10px] text-[#38bdf8] bg-[#0c1622] px-2 py-0.5 rounded border border-[#1b3149]">
                ISOLATED
              </span>
            </div>

            <div className="flex flex-col gap-2 font-mono text-xs">
              <div className="flex justify-between py-2 border-b border-[#1a1f26]">
                <span className="text-[#8c96a5]">Context Isolation</span>
                <span className="text-[#00f2a1]">Enabled (Secure)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#1a1f26]">
                <span className="text-[#8c96a5]">Node Integration</span>
                <span className="text-[#ef4444]">Disabled (Hardened)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#1a1f26]">
                <span className="text-[#8c96a5]">IPC Bridge</span>
                <span className="text-[#00f2a1]">Preload Controlled</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#1a1f26]">
                <span className="text-[#8c96a5]">Desktop Host</span>
                <span className="text-[#f0f3f6]">{config?.platform || 'win32'} ({config?.arch || 'x64'})</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0b0d10] p-3 rounded-lg border border-[#1a1f26] text-[11px] text-[#8c96a5]">
            Phase 1 configuration: In strict alignment with instructions, credentials and external API keys are not accepted or stored in this foundation phase.
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
