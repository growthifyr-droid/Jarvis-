import React from 'react';
import { Activity, Clock, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import { PageContainer } from '../common/PageContainer';

export const ActivityLogView: React.FC = () => {
  const logs = [
    { time: '12:01:22 PM', type: 'KERNEL', event: 'IPC telemetry heartbeat cycle nominal.', status: 'OK' },
    { time: '12:01:10 PM', type: 'UPDATER', event: 'Release channel configured for production x64 feed.', status: 'OK' },
    { time: '12:00:58 PM', type: 'SECURITY', event: 'Context isolation verified. Node integration disabled.', status: 'SECURE' },
    { time: '12:00:55 PM', type: 'SYSTEM', event: 'JARVIS desktop window initialized.', status: 'OK' },
  ];

  return (
    <PageContainer
      id="activity-log-page"
      icon={<Activity className="w-5 h-5 text-[#00f2a1]" />}
      title="Activity Log"
      subtitle="Real-Time System Audit Trail & IPC Dispatch Telemetry"
      badge={
        <span className="font-mono text-xs text-[#00f2a1] bg-[#0d1614] px-2.5 py-1 rounded-full border border-[#00f2a1]/30">
          Stream Live
        </span>
      }
    >
      <div className="bg-[#111418] border border-[#1e242b] rounded-xl p-5 flex flex-col gap-3 font-mono text-xs shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
        {logs.map((log, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-2.5 px-3.5 rounded-lg bg-[#0b0d10] border border-[#1a1f26]"
          >
            <div className="flex items-center gap-3">
              <span className="text-[#8c96a5] text-[11px]">{log.time}</span>
              <span className="text-[#38bdf8] text-[10px] bg-[#0c1622] px-2 py-0.5 rounded border border-[#1b3149]">
                {log.type}
              </span>
              <span className="text-[#f0f3f6] font-sans text-xs">{log.event}</span>
            </div>
            <span className="text-[#00f2a1] text-[10px] bg-[#0d1614] px-2.5 py-0.5 rounded border border-[#00f2a1]/30 font-bold">
              {log.status}
            </span>
          </div>
        ))}
      </div>
    </PageContainer>
  );
};
