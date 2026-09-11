import React from 'react';
import { Layers, Mail, MessageCircle, Calendar, ExternalLink } from 'lucide-react';
import { PageContainer } from '../common/PageContainer';

export const ThirdPartyAppsView: React.FC = () => {
  const integrations = [
    { name: 'WhatsApp Web Automation', category: 'Messaging', icon: MessageCircle, phase: 'Phase 3' },
    { name: 'Gmail Subsystem', category: 'Email', icon: Mail, phase: 'Phase 3' },
    { name: 'Google Calendar / Workspace', category: 'Schedule', icon: Calendar, phase: 'Phase 3' },
  ];

  return (
    <PageContainer
      id="third-party-apps-page"
      icon={<Layers className="w-5 h-5 text-[#00f2a1]" />}
      title="Third-Party Integrations"
      subtitle="External Service Connectors & OAuth Boundary Slots"
      badge={
        <span className="font-mono text-xs text-[#38bdf8] bg-[#0c1622] px-2.5 py-1 rounded-full border border-[#1b3149]">
          Phase 3 Target Module
        </span>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {integrations.map((app, i) => {
          const Icon = app.icon;
          return (
            <div
              key={i}
              className="bg-[#111418] border border-[#1e242b] rounded-xl p-5 flex flex-col justify-between gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-[#0c1219] border border-[#1e2e42] flex items-center justify-center text-[#00f2a1]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-[10px] text-[#38bdf8] bg-[#0c1622] px-2 py-0.5 rounded border border-[#1b3149]">
                    {app.phase}
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-[#f0f3f6]">{app.name}</span>
                <span className="text-xs text-[#8c96a5]">{app.category} connector hook reserved for Phase 3.</span>
              </div>

              <div className="pt-3 border-t border-[#1a1f26] flex items-center justify-between font-mono text-[10px] text-[#5a6575]">
                <span>CONNECTOR:</span>
                <span className="text-[#8c96a5]">Pluggable Architecture</span>
              </div>
            </div>
          );
        })}
      </div>
    </PageContainer>
  );
};
