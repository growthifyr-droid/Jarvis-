import React from 'react';
import { Mic, Radio, Volume2, Activity, Sliders } from 'lucide-react';
import { PageContainer } from '../common/PageContainer';

export const VoiceApiView: React.FC = () => {
  return (
    <PageContainer
      id="voice-api-page"
      icon={<Mic className="w-5 h-5 text-[#38bdf8]" />}
      title="Voice API Management"
      subtitle="Neural Audio Subsystem • Low-Latency Duplex Pipeline"
      badge={
        <span className="font-mono text-xs text-[#38bdf8] bg-[#101c2a] px-2.5 py-1 rounded-full border border-[#1d324c]">
          Phase 4 Target Module
        </span>
      }
    >
      {/* Informational Banner */}
      <div className="bg-[#111418] border border-[#1e242b] rounded-xl p-5 flex items-start gap-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
        <div className="w-8 h-8 rounded-lg bg-[#0c1219] border border-[#1e2e42] flex items-center justify-center flex-shrink-0 text-[#38bdf8] mt-0.5">
          <Radio className="w-4 h-4" />
        </div>
        <div className="flex flex-col gap-1 text-xs">
          <span className="font-mono font-bold text-[#f0f3f6]">
            Audio Stream Contract Boundary
          </span>
          <p className="text-[#8c96a5] leading-relaxed">
            The Neural Harmonic Core visualizer on the main Chat dashboard is coupled to this future audio bus. In Phase 4, PCM audio streams from the desktop input device will feed both real-time STT and the harmonic sphere oscillation frequency directly without altering the circular boundary.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-[#111418] border border-[#1e242b] rounded-xl p-5 flex flex-col gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-[#f0f3f6]">AUDIO INPUT DRIVER</span>
            <span className="font-mono text-[10px] text-[#38bdf8] bg-[#0c1622] px-2 py-0.5 rounded border border-[#1b3149]">
              WASAPI / CoreAudio
            </span>
          </div>
          <div className="bg-[#0b0d10] border border-[#1a1f26] p-3.5 rounded-lg font-mono text-xs text-[#8c96a5]">
            Default System Microphone (Auto-routed)
          </div>
        </div>

        <div className="bg-[#111418] border border-[#1e242b] rounded-xl p-5 flex flex-col gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-[#f0f3f6]">SAMPLE RATE & CHANNELS</span>
            <span className="font-mono text-[10px] text-[#38bdf8] bg-[#0c1622] px-2 py-0.5 rounded border border-[#1b3149]">
              Low-Latency Buffer
            </span>
          </div>
          <div className="bg-[#0b0d10] border border-[#1a1f26] p-3.5 rounded-lg font-mono text-xs text-[#8c96a5]">
            48,000 Hz • 16-bit PCM • Mono Full-Duplex
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
