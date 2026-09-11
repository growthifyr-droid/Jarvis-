import React from 'react';
import { FileText, BarChart2, ShieldAlert } from 'lucide-react';
import { PageContainer } from '../common/PageContainer';

export const ReportsView: React.FC = () => {
  return (
    <PageContainer
      id="reports-page"
      icon={<FileText className="w-5 h-5 text-[#00f2a1]" />}
      title="System Reports"
      subtitle="Diagnostic Artifacts & Automated Telemetry Snapshots"
      badge={
        <span className="font-mono text-xs text-[#38bdf8] bg-[#0c1622] px-2.5 py-1 rounded-full border border-[#1b3149]">
          Phase 1 Shell
        </span>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-[#111418] border border-[#1e242b] rounded-xl p-5 flex flex-col gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-[#f0f3f6]">UPTIME & RELIABILITY REPORT</span>
            <span className="text-[#00f2a1] font-mono text-[10px] bg-[#0d1614] px-2 py-0.5 rounded border border-[#00f2a1]/30">
              100% NOMINAL
            </span>
          </div>
          <p className="text-xs text-[#8c96a5] leading-relaxed">
            Tracks process crashes, window recreation cycles, and IPC latency percentiles across system sessions.
          </p>
        </div>

        <div className="bg-[#111418] border border-[#1e242b] rounded-xl p-5 flex flex-col gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-[#f0f3f6]">UPDATE TELEMETRY AUDIT</span>
            <span className="text-[#38bdf8] font-mono text-[10px] bg-[#0c1622] px-2 py-0.5 rounded border border-[#1b3149]">
              ELECTRON-BUILDER
            </span>
          </div>
          <p className="text-xs text-[#8c96a5] leading-relaxed">
            Validates hash checksums, NSIS differential package bytes, and GitHub CDN latency during automated updates.
          </p>
        </div>
      </div>
    </PageContainer>
  );
};
