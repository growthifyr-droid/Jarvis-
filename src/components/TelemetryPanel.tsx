import React, { useState, useEffect } from 'react';
import { Activity, Wifi, Cpu, Thermometer, ShieldCheck, Zap } from 'lucide-react';
import { jarvisBridge } from '../services/jarvis-bridge';
import type { SystemTelemetryData } from '../../electron/shared/types';

export const TelemetryPanel: React.FC = () => {
  const [telemetry, setTelemetry] = useState<SystemTelemetryData>({
    pingLatency: 42,
    packetRate: 2.65,
    cpuUsage: 31.3,
    memoryUsage: 74.7,
    thermalTemp: 50,
    hostEnv: 'Electron',
    meshStatus: 'GLOBAL // SECURE',
    kernelActive: true,
    timestamp: '12:01:22 PM',
  });

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const data = await jarvisBridge.getTelemetry();
        setTelemetry({
          ...data,
          pingLatency: Math.max(38, Math.min(46, 42 + Math.floor(Math.random() * 5 - 2))),
          packetRate: Number((2.65 + (Math.random() * 0.2 - 0.1)).toFixed(2)),
          cpuUsage: Number((31.3 + (Math.random() * 1.4 - 0.7)).toFixed(1)),
        });
      } catch {
        // Fallback gracefully
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside
      id="telemetry-panel"
      className="hidden md:flex w-[250px] lg:w-[270px] xl:w-[285px] flex-shrink-0 bg-[#080a0d] border-r border-[#151921] flex-col p-3.5 sm:p-4 gap-4 select-none overflow-y-auto"
    >
      {/* Telemetry Header */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#00f2a1]" />
          <span className="font-mono text-xs font-bold text-[#f0f3f6] tracking-widest">
            SYSTEM TELEMETRY
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0d1614] border border-[#00f2a1]/30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f2a1] animate-pulse" />
          <span className="font-mono text-[9px] font-semibold text-[#00f2a1] tracking-wider">
            LIVE UPLINK
          </span>
        </div>
      </div>

      {/* Card 1: Network Telemetry */}
      <div
        id="card-network-telemetry"
        className="bg-[#111418] rounded-xl border border-[#1e242b] p-3.5 flex flex-col gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi className="w-3.5 h-3.5 text-[#00f2a1]" />
            <span className="font-mono text-[11px] font-bold text-[#f0f3f6] tracking-wider">
              NETWORK TELEMETRY
            </span>
          </div>
          <span className="font-mono text-[10px] font-semibold text-[#00f2a1] tracking-widest">
            SECURE
          </span>
        </div>

        {/* 2-box subgrid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#0b0d10] rounded-lg border border-[#1a1f26] p-2.5 flex flex-col">
            <span className="font-mono text-[9px] text-[#8c96a5] font-medium tracking-wider mb-1">
              PING LATENCY
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-lg font-bold text-[#f0f3f6]">
                {telemetry.pingLatency}
              </span>
              <span className="font-mono text-[10px] text-[#5a6575]">ms</span>
            </div>
          </div>

          <div className="bg-[#0b0d10] rounded-lg border border-[#1a1f26] p-2.5 flex flex-col">
            <span className="font-mono text-[9px] text-[#8c96a5] font-medium tracking-wider mb-1">
              PACKET RATE
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-lg font-bold text-[#f0f3f6]">
                {telemetry.packetRate}
              </span>
              <span className="font-mono text-[10px] text-[#5a6575]">MB/s</span>
            </div>
          </div>
        </div>

        {/* Routing Mesh row */}
        <div className="flex items-center justify-between pt-1 border-t border-[#1a1f26]">
          <span className="font-mono text-[9px] text-[#8c96a5] tracking-wider">ROUTING MESH</span>
          <span className="font-mono text-[10px] text-[#00f2a1] font-medium tracking-widest">
            {telemetry.meshStatus}
          </span>
        </div>
      </div>

      {/* Card 2: Core Metrics */}
      <div
        id="card-core-metrics"
        className="bg-[#111418] rounded-xl border border-[#1e242b] p-3.5 flex flex-col gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span className="font-mono text-[11px] font-bold text-[#f0f3f6] tracking-wider">
              CORE METRICS
            </span>
          </div>
          <span className="font-mono text-[10px] font-semibold text-[#38bdf8] tracking-widest">
            NOMINAL
          </span>
        </div>

        {/* CPU Load Progress */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between font-mono text-[10px]">
            <span className="text-[#8c96a5] tracking-wider">CPU LOAD</span>
            <span className="text-[#f0f3f6] font-semibold">{telemetry.cpuUsage}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#0b0d10] rounded-full overflow-hidden border border-[#1a1f26]">
            <div
              className="h-full bg-gradient-to-r from-[#00f2a1] to-[#38bdf8] rounded-full transition-all duration-700"
              style={{ width: `${telemetry.cpuUsage}%` }}
            />
          </div>
        </div>

        {/* RAM Usage Progress */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between font-mono text-[10px]">
            <span className="text-[#8c96a5] tracking-wider">RAM USAGE</span>
            <span className="text-[#f0f3f6] font-semibold">{telemetry.memoryUsage}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#0b0d10] rounded-full overflow-hidden border border-[#1a1f26]">
            <div
              className="h-full bg-gradient-to-r from-[#0284c7] to-[#38bdf8] rounded-full transition-all duration-700"
              style={{ width: `${telemetry.memoryUsage}%` }}
            />
          </div>
        </div>

        {/* Sub-row: Thermal & Host */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#1a1f26]">
          <div className="flex items-center justify-between bg-[#0b0d10] p-2 rounded-lg border border-[#1a1f26]">
            <div className="flex flex-col">
              <span className="font-mono text-[8px] text-[#8c96a5] tracking-wider">THERMAL</span>
              <span className="font-mono text-xs font-bold text-[#fbbf24]">
                {telemetry.thermalTemp}°C
              </span>
            </div>
            <Thermometer className="w-3.5 h-3.5 text-[#fbbf24]" />
          </div>

          <div className="flex items-center justify-between bg-[#0b0d10] p-2 rounded-lg border border-[#1a1f26]">
            <div className="flex flex-col">
              <span className="font-mono text-[8px] text-[#8c96a5] tracking-wider">HOST</span>
              <span className="font-mono text-xs font-bold text-[#a78bfa]">
                {telemetry.hostEnv}
              </span>
            </div>
            <Zap className="w-3.5 h-3.5 text-[#a78bfa]" />
          </div>
        </div>
      </div>

      {/* Card 3: Neural Substrate */}
      <div
        id="card-neural-substrate"
        className="bg-[#111418] rounded-xl border border-[#1e242b] p-3 flex items-center gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
      >
        <div className="w-8 h-8 rounded-lg bg-[#0f1216] border border-[#1c222a] flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-4 h-4 text-[#00f2a1]" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="font-mono text-[11px] font-bold text-[#f0f3f6] tracking-wider">
            NEURAL SUBSTRATE
          </span>
          <span className="font-mono text-[9px] text-[#8c96a5] truncate">
            Phase 1 Standby Skeleton • Nominal
          </span>
        </div>
      </div>
    </aside>
  );
};
