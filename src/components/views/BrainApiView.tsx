import React from 'react';
import { Brain, Lock, Layers, Sparkles, CheckCircle2 } from 'lucide-react';
import { PageContainer } from '../common/PageContainer';

export const BrainApiView: React.FC = () => {
  return (
    <PageContainer
      id="brain-api-page"
      icon={<Brain className="w-5 h-5 text-[#38bdf8]" />}
      title="Brain API Management"
      subtitle="Multi-Provider AI Subsystem • SafeStorage Encryption Ready"
      badge={
        <span className="font-mono text-xs text-[#38bdf8] bg-[#101c2a] px-2.5 py-1 rounded-full border border-[#1d324c]">
          Phase 2 Extension Ready
        </span>
      }
    >
      {/* Foundation Architecture Banner */}
      <div className="bg-[#111418] border border-[#1e242b] rounded-xl p-5 flex items-start gap-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
        <div className="w-8 h-8 rounded-lg bg-[#0c1219] border border-[#1e2e42] flex items-center justify-center flex-shrink-0 text-[#38bdf8] mt-0.5">
          <Lock className="w-4 h-4" />
        </div>
        <div className="flex flex-col gap-1 text-xs">
          <span className="font-mono font-bold text-[#f0f3f6]">
            Foundation Isolation Architecture
          </span>
          <p className="text-[#8c96a5] leading-relaxed">
            In accordance with Phase 1 directives, live AI provider network calls and external API key fields are omitted. All desktop IPC contracts, multi-provider interfaces, and credential safe-storage hooks are fully plumbed and ready for seamless activation in Phase 2 without rewriting the desktop shell.
          </p>
        </div>
      </div>

      {/* Provider Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            name: 'Google Gemini',
            model: 'gemini-2.5-flash',
            desc: 'Default primary neural intelligence engine with high throughput streaming.',
            status: 'Contract Ready',
          },
          {
            name: 'Anthropic Claude',
            model: 'claude-3-7-sonnet',
            desc: 'Secondary reasoning failover provider with deep code analysis capabilities.',
            status: 'Contract Ready',
          },
          {
            name: 'OpenAI GPT-4o',
            model: 'gpt-4o',
            desc: 'Tertiary fallback provider for multi-modal instruction execution.',
            status: 'Contract Ready',
          },
        ].map((provider, i) => (
          <div
            key={i}
            className="bg-[#111418] border border-[#1e242b] hover:border-[#38bdf8]/40 rounded-xl p-5 flex flex-col justify-between gap-4 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#f0f3f6]">
                  {provider.name}
                </span>
                <span className="text-[10px] font-mono text-[#38bdf8] bg-[#0c1622] px-2 py-0.5 rounded border border-[#1b3149]">
                  {provider.status}
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#38bdf8]/80 font-medium">
                {provider.model}
              </span>
              <p className="text-xs text-[#8c96a5] leading-relaxed font-sans mt-1">
                {provider.desc}
              </p>
            </div>

            <div className="pt-3 border-t border-[#1a1f26] flex items-center justify-between font-mono text-[10px] text-[#5a6575]">
              <span>STORAGE:</span>
              <span className="text-[#8c96a5]">SafeStorage Encrypted</span>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
};
