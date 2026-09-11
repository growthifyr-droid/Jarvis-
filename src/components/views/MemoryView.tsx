import React from 'react';
import { Database, HardDrive, Shield, Server } from 'lucide-react';
import { PageContainer } from '../common/PageContainer';

export const MemoryView: React.FC = () => {
  return (
    <PageContainer
      id="memory-page"
      icon={<Database className="w-5 h-5 text-[#00f2a1]" />}
      title="Memory & Persistence"
      subtitle="Local Substrate Architecture • Encrypted Vector & Episodic Storage"
      badge={
        <span className="font-mono text-xs text-[#00f2a1] bg-[#0d1614] px-2.5 py-1 rounded-full border border-[#00f2a1]/30">
          Phase 2 Target Module
        </span>
      }
    >
      {/* Boundary Banner */}
      <div className="bg-[#111418] border border-[#1e242b] rounded-xl p-5 flex items-start gap-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
        <div className="w-8 h-8 rounded-lg bg-[#0c1219] border border-[#1e2e42] flex items-center justify-center flex-shrink-0 text-[#00f2a1] mt-0.5">
          <HardDrive className="w-4 h-4" />
        </div>
        <div className="flex flex-col gap-1 text-xs">
          <span className="font-mono font-bold text-[#f0f3f6]">
            Database Boundary Specification
          </span>
          <p className="text-[#8c96a5] leading-relaxed">
            Phase 1 explicitly establishes the architectural isolation boundaries for future storage. In strict adherence to Phase 1 constraints, mock databases or temporary storage tables are omitted. The persistent substrate will reside in the Electron main process with SQLCipher encryption in Phase 2.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#111418] border border-[#1e242b] rounded-xl p-5 flex flex-col gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
          <span className="font-mono text-xs font-bold text-[#f0f3f6]">EPISODIC LOGS</span>
          <span className="text-xs text-[#8c96a5]">Session history and conversational memory partition.</span>
          <span className="font-mono text-[10px] text-[#00f2a1] bg-[#0d1614] px-2.5 py-1 rounded border border-[#00f2a1]/30 w-fit">
            Ready for Schema
          </span>
        </div>

        <div className="bg-[#111418] border border-[#1e242b] rounded-xl p-5 flex flex-col gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
          <span className="font-mono text-xs font-bold text-[#f0f3f6]">AGENT MEMORY SPACES</span>
          <span className="text-xs text-[#8c96a5]">Namespaced key-value partitions isolated per agent.</span>
          <span className="font-mono text-[10px] text-[#00f2a1] bg-[#0d1614] px-2.5 py-1 rounded border border-[#00f2a1]/30 w-fit">
            Ready for Schema
          </span>
        </div>

        <div className="bg-[#111418] border border-[#1e242b] rounded-xl p-5 flex flex-col gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
          <span className="font-mono text-xs font-bold text-[#f0f3f6]">SEMANTIC EMBEDDINGS</span>
          <span className="text-xs text-[#8c96a5]">High-dimensional vector indexing for episodic retrieval.</span>
          <span className="font-mono text-[10px] text-[#00f2a1] bg-[#0d1614] px-2.5 py-1 rounded border border-[#00f2a1]/30 w-fit">
            Ready for Schema
          </span>
        </div>
      </div>
    </PageContainer>
  );
};
