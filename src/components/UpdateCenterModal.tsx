import React, { useState } from 'react';
import {
  RefreshCw,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  ShieldCheck,
  Server,
  ArrowRight,
  HardDrive,
} from 'lucide-react';
import { jarvisBridge } from '../services/jarvis-bridge';
import type { UpdaterStatusPayload } from '../../electron/shared/types';

interface UpdateCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: UpdaterStatusPayload;
}

export const UpdateCenterModal: React.FC<UpdateCenterModalProps> = ({
  isOpen,
  onClose,
  status,
}) => {
  const [isCheckingManual, setIsCheckingManual] = useState(false);

  if (!isOpen) return null;

  const handleCheckUpdates = async () => {
    setIsCheckingManual(true);
    try {
      await jarvisBridge.checkForUpdates();
    } finally {
      setIsCheckingManual(false);
    }
  };

  const handleDownload = async () => {
    await jarvisBridge.downloadUpdate();
  };

  const handleRestart = async () => {
    await jarvisBridge.installUpdateAndRestart();
  };

  const formatBytes = (bytes: number): string => {
    if (!bytes || bytes <= 0) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const percent = status.progress?.percent ?? 0;
  const transferred = status.progress?.transferred ?? 0;
  const total = status.progress?.total ?? 0;
  const speed = status.progress?.bytesPerSecond
    ? `${(status.progress.bytesPerSecond / (1024 * 1024)).toFixed(1)} MB/s`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none animate-in fade-in duration-200">
      <div
        id="jarvis-update-center-modal"
        className="w-full max-w-lg bg-[#0e1116] border border-[#1e242b] rounded-2xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.8)] flex flex-col gap-5 text-[#f0f3f6]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1c222a] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#151920] border border-[#262e38] flex items-center justify-center text-[#00f2a1]">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-sm font-bold tracking-wider text-[#f0f3f6]">
                JARVIS UPDATE CENTER
              </span>
              <span className="font-mono text-[10px] text-[#8c96a5] tracking-widest">
                AUTOMATIC RELEASE CHANNEL
              </span>
            </div>
          </div>

          <button
            id="btn-close-updater"
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#8c96a5] hover:text-white hover:bg-[#1c222a] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Channel & Version Status Banner */}
        <div className="bg-[#151920] rounded-xl border border-[#262e38] p-4 flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-[10px] text-[#8c96a5] tracking-wider">
              CURRENT INSTALLED VERSION
            </span>
            <span className="font-mono text-lg font-bold text-[#f0f3f6] flex items-center gap-2">
              v{status.currentVersion}
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0d1614] text-[#00f2a1] border border-[#00f2a1]/30 font-medium">
                Active
              </span>
            </span>
          </div>

          {status.availableVersion && (
            <div className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-[#5a6575]" />
              <div className="flex flex-col gap-0.5 text-right">
                <span className="font-mono text-[10px] text-[#38bdf8] tracking-wider">
                  NEW RELEASE
                </span>
                <span className="font-mono text-lg font-bold text-[#38bdf8]">
                  v{status.availableVersion}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* State Machine Status Displays */}
        {status.state === 'idle' && (
          <div className="bg-[#0b0d10] rounded-xl border border-[#1c222a] p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#8c96a5] font-mono text-xs">
              <ShieldCheck className="w-4 h-4 text-[#00f2a1]" />
              <span>Update channel active and standing by.</span>
            </div>
            <p className="text-xs text-[#8c96a5] leading-relaxed">
              Jarvis checks for GitHub release assets securely on startup. You can also trigger an immediate manual version check.
            </p>
          </div>
        )}

        {status.state === 'checking' && (
          <div className="bg-[#0b0d10] rounded-xl border border-[#1c222a] p-4 flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-[#00f2a1] animate-spin" />
            <div className="flex flex-col font-mono text-xs">
              <span className="text-[#f0f3f6] font-bold">Querying release channel...</span>
              <span className="text-[#8c96a5] text-[10px]">
                Validating release manifests against current semantic version.
              </span>
            </div>
          </div>
        )}

        {status.state === 'no-update' && (
          <div className="bg-[#0b0d10] rounded-xl border border-[#1c222a] p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#00f2a1]" />
            <div className="flex flex-col font-mono text-xs">
              <span className="text-[#f0f3f6] font-bold">You are on the latest version</span>
              <span className="text-[#8c96a5] text-[10px]">
                v{status.currentVersion} is the most recent release on GitHub.
              </span>
            </div>
          </div>
        )}

        {status.state === 'update-available' && (
          <div className="bg-[#0c1622] rounded-xl border border-[#1b3149] p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[#38bdf8] font-mono text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Update Available: Version {status.availableVersion}</span>
            </div>
            <p className="text-xs text-[#8c96a5] leading-relaxed">
              A new production release is available. This build includes core foundation stability enhancements and update channel packages.
            </p>
          </div>
        )}

        {status.state === 'downloading' && (
          <div className="bg-[#0b0d10] rounded-xl border border-[#1c222a] p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-[#00f2a1] font-bold flex items-center gap-2">
                <Download className="w-4 h-4 animate-bounce" />
                Downloading Update ({percent}%)
              </span>
              {speed && <span className="text-[#8c96a5]">{speed}</span>}
            </div>

            {/* High-Precision Progress Bar */}
            <div className="w-full h-2 bg-[#151920] rounded-full overflow-hidden border border-[#262e38]">
              <div
                className="h-full bg-[#00f2a1] rounded-full transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>

            <div className="flex items-center justify-between font-mono text-[10px] text-[#8c96a5]">
              <span>
                {formatBytes(transferred)} / {formatBytes(total || 64800000)}
              </span>
              <span>Target: v{status.availableVersion || '1.0.1'}</span>
            </div>
          </div>
        )}

        {status.state === 'downloaded' && (
          <div className="bg-[#0d1614] rounded-xl border border-[#10b981]/40 p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#00f2a1] font-mono text-xs font-bold">
              <CheckCircle2 className="w-5 h-5" />
              <span>Update Download Complete</span>
            </div>
            <p className="text-xs text-[#8c96a5] leading-relaxed">
              Version {status.availableVersion || '1.0.1'} has been verified and downloaded. Restart now to finalize installation through the NSIS updater.
            </p>
          </div>
        )}

        {status.state === 'error' && (
          <div className="bg-[#1f1010] rounded-xl border border-[#ef4444]/40 p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[#ef4444] flex-shrink-0" />
            <div className="flex flex-col font-mono text-xs">
              <span className="text-[#fca5a5] font-bold">Update Channel Notice</span>
              <span className="text-[#f87171]/80 text-[10px] leading-snug">
                {status.error || 'Unable to contact update server.'}
              </span>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1c222a]">
          <button
            id="btn-manual-check-updates"
            onClick={handleCheckUpdates}
            disabled={status.state === 'downloading' || isCheckingManual}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#151920] hover:bg-[#1c222a] border border-[#262e38] text-xs font-mono text-[#8c96a5] hover:text-white transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCheckingManual ? 'animate-spin' : ''}`} />
            <span>Check for Updates</span>
          </button>

          <div className="flex items-center gap-2">
            {status.state === 'update-available' && (
              <button
                id="btn-download-update"
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00f2a1] text-[#08120e] text-xs font-mono font-bold shadow-[0_0_12px_rgba(0,242,161,0.4)] hover:scale-105 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Update</span>
              </button>
            )}

            {status.state === 'downloaded' && (
              <button
                id="btn-restart-and-update"
                onClick={handleRestart}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00f2a1] text-[#08120e] text-xs font-mono font-bold shadow-[0_0_15px_rgba(0,242,161,0.5)] hover:scale-105 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restart & Update</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#151920] hover:bg-[#1c222a] border border-[#262e38] text-xs font-mono text-[#8c96a5] hover:text-white transition-all cursor-pointer"
            >
              {status.state === 'downloaded' ? 'Later' : 'Dismiss'}
            </button>
          </div>
        </div>

        {/* Development & Verification Helper */}
        {!jarvisBridge.isElectron && (
          <div className="bg-[#0b0d10] rounded-lg border border-[#1c222a] p-2.5 flex items-center justify-between text-[10px] font-mono text-[#8c96a5]">
            <span>Preview Mode Verification:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => jarvisBridge.checkForUpdates()}
                className="text-[#38bdf8] hover:underline cursor-pointer"
              >
                Trigger Available
              </button>
              <span>•</span>
              <button
                onClick={() => jarvisBridge.downloadUpdate()}
                className="text-[#00f2a1] hover:underline cursor-pointer"
              >
                Trigger Download
              </button>
              <span>•</span>
              <button
                onClick={() => jarvisBridge.resetMockStatus()}
                className="text-[#f87171] hover:underline cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
