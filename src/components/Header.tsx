import React, { useState, useEffect } from 'react';
import {
  Cpu,
  MessageSquare,
  Users,
  Layers,
  Brain,
  Mic,
  Database,
  Activity,
  FileText,
  Zap,
  Settings,
  ShieldCheck,
  Wifi,
  Battery,
  Minus,
  Square,
  X,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { jarvisBridge } from '../services/jarvis-bridge';
import type { UpdaterStatusPayload } from '../../electron/shared/types';

export type ActiveTab =
  | 'chat'
  | 'agents'
  | 'third-party'
  | 'brain-api'
  | 'voice-api'
  | 'memory'
  | 'activity-log'
  | 'reports'
  | 'automations'
  | 'settings'
  | 'diagnostics';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenUpdateCenter: () => void;
  updaterStatus: UpdaterStatusPayload;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenUpdateCenter,
  updaterStatus,
}) => {
  const [timeString, setTimeString] = useState<string>('');
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-US', {
          hour12: true,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMinimize = () => jarvisBridge.minimizeWindow();
  const handleMaximize = async () => {
    await jarvisBridge.maximizeWindow();
    const maximized = await jarvisBridge.isWindowMaximized();
    setIsMaximized(maximized);
  };
  const handleClose = () => jarvisBridge.closeWindow();

  const isUpdateAvailable =
    updaterStatus.state === 'update-available' || updaterStatus.state === 'downloaded';

  const navTabs: Array<{
    id: ActiveTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    badgeType?: 'accent' | 'primary';
  }> = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'agents', label: 'Agents', icon: Users, badge: 3, badgeType: 'primary' },
    { id: 'third-party', label: 'Third-Party Apps', icon: Layers },
    { id: 'brain-api', label: 'Brain API', icon: Brain, badge: 'Ph 2', badgeType: 'accent' },
    { id: 'voice-api', label: 'Voice API', icon: Mic, badge: 'Ph 4', badgeType: 'accent' },
    { id: 'memory', label: 'Memory', icon: Database },
    { id: 'activity-log', label: 'Activity Log', icon: Activity },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'automations', label: 'Automations', icon: Zap },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header id="jarvis-system-header" className="flex flex-col select-none flex-shrink-0 z-30 bg-[#060709]">
      {/* ROW 1: System Telemetry Header & Desktop Window Bar */}
      <div
        id="jarvis-system-row"
        className="h-10 bg-[#080a0e] border-b border-[#141820] flex items-center justify-between px-4 sm:px-6 select-none"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      >
        {/* LEFT: Branding & Kernel Active */}
        <div
          className="flex items-center gap-3.5 flex-shrink-0"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-[#0e1117] border border-[#1b212b] flex items-center justify-center text-[#00f2a1] shadow-[0_0_8px_rgba(0,242,161,0.2)]">
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#f0f3f6] tracking-wider leading-none">
                JARVIS AI
              </span>
              <span className="hidden md:inline font-mono text-[9px] text-[#8c96a5] tracking-[0.2em] font-medium leading-none">
                NEURAL INTERFACE
              </span>
            </div>
          </div>

          {/* Kernel Active Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0a1411] border border-[#00f2a1]/40 shadow-[0_0_6px_rgba(0,242,161,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f2a1] animate-pulse" />
            <span className="font-mono text-[9px] font-semibold tracking-wider text-[#00f2a1] leading-none">
              KERNEL ACTIVE
            </span>
          </div>
        </div>

        {/* RIGHT: Release Channel, Telemetry & Window Actions */}
        <div
          className="flex items-center gap-3 sm:gap-4 flex-shrink-0"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          {/* Release Channel / Updater Button */}
          <button
            id="btn-header-update-center"
            onClick={onOpenUpdateCenter}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] transition-all cursor-pointer ${
              isUpdateAvailable
                ? 'bg-[#00f2a1]/15 text-[#00f2a1] border border-[#00f2a1]/50 shadow-[0_0_8px_rgba(0,242,161,0.3)] animate-pulse'
                : 'bg-[#0e1117] text-[#8c96a5] border border-[#1b212b] hover:text-[#f0f3f6] hover:border-[#27303f]'
            }`}
            title="Open Jarvis Update Center"
          >
            {isUpdateAvailable ? (
              <Sparkles className="w-3 h-3 text-[#00f2a1]" />
            ) : (
              <RefreshCw className="w-2.5 h-2.5 text-[#8c96a5]" />
            )}
            <span>v{updaterStatus.currentVersion}</span>
            {isUpdateAvailable && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f2a1]" />
            )}
          </button>

          {/* Linked Badge */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0b131c] border border-[#38bdf8]/30 font-mono text-[9px] text-[#38bdf8]">
            <ShieldCheck className="w-2.5 h-2.5" />
            <span>LINKED</span>
          </div>

          {/* Desktop Telemetry Indicators */}
          <div className="hidden lg:flex items-center gap-3 text-[#8c96a5] font-mono text-[10px]">
            <div className="flex items-center gap-1">
              <Battery className="w-3.5 h-3.5 text-[#00f2a1]" />
              <span>100%</span>
            </div>
            <div className="flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5 text-[#00f2a1]" />
            </div>
            <span className="text-[#647184]">{timeString}</span>
          </div>

          {/* Window Control Buttons */}
          <div className="flex items-center gap-1 pl-1">
            <button
              onClick={handleMinimize}
              className="w-6 h-6 rounded flex items-center justify-center text-[#8c96a5] hover:text-white hover:bg-[#141820] transition-colors cursor-pointer"
              title="Minimize"
            >
              <Minus className="w-3 h-3" />
            </button>
            <button
              onClick={handleMaximize}
              className="w-6 h-6 rounded flex items-center justify-center text-[#8c96a5] hover:text-white hover:bg-[#141820] transition-colors cursor-pointer"
              title={isMaximized ? 'Restore' : 'Maximize'}
            >
              <Square className="w-2.5 h-2.5" />
            </button>
            <button
              onClick={handleClose}
              className="w-6 h-6 rounded flex items-center justify-center text-[#8c96a5] hover:text-[#ef4444] hover:bg-[#201111] transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* ROW 2: Dedicated Navigation Tabs (Equal Spacing, Centered, No Text Wrapping) */}
      <nav
        id="jarvis-navigation-row"
        aria-label="Main Navigation"
        className="h-11 bg-[#060709] border-b border-[#141820] px-3 sm:px-6 flex items-center overflow-x-auto no-scrollbar justify-start xl:justify-center"
      >
        <div className="flex items-center gap-2 sm:gap-3 py-1 flex-nowrap">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`whitespace-nowrap flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all duration-150 cursor-pointer flex-shrink-0 ${
                  isActive
                    ? 'bg-[#00f2a1]/10 text-[#00f2a1] border border-[#00f2a1]/40 font-semibold shadow-[0_0_12px_rgba(0,242,161,0.15)]'
                    : 'text-[#8c96a5] hover:text-[#f0f3f6] hover:bg-[#101319] border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="tracking-wide">{tab.label}</span>

                {tab.badge !== undefined && (
                  <span
                    className={`font-mono text-[9px] px-1.5 py-0.5 rounded leading-none flex-shrink-0 ${
                      isActive
                        ? 'bg-[#00f2a1]/20 text-[#00f2a1] border border-[#00f2a1]/40'
                        : tab.badgeType === 'accent'
                        ? 'bg-[#0e1722] text-[#38bdf8] border border-[#1b2a3a]'
                        : 'bg-[#12161f] text-[#00f2a1] border border-[#1c2633]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};

