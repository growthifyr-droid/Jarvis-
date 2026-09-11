import React from 'react';
import { Zap, Play, Clock, ArrowRight } from 'lucide-react';
import { PageContainer } from '../common/PageContainer';

export const AutomationsView: React.FC = () => {
  return (
    <PageContainer
      id="automations-page"
      icon={<Zap className="w-5 h-5 text-[#00f2a1]" />}
      title="Automations & Pipelines"
      subtitle="Trigger & Action Pipeline for Background Agent Automations"
      badge={
        <span className="font-mono text-xs text-[#38bdf8] bg-[#0c1622] px-2.5 py-1 rounded-full border border-[#1b3149]">
          Phase 1 Shell
        </span>
      }
    >
      <div className="bg-[#111418] border border-[#1e242b] rounded-xl p-5 flex flex-col gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
        <span className="font-mono text-xs font-bold text-[#f0f3f6]">PIPELINE ARCHITECTURE</span>
        <p className="text-xs text-[#8c96a5] leading-relaxed font-sans">
          Background event triggers (schedules, system startup, IPC notifications) will interface with registered agent capabilities in future phases. In strict accordance with Phase 1 directives, simulated pipelines or dummy jobs are omitted.
        </p>
      </div>
    </PageContainer>
  );
};
