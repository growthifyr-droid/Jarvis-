import React, { useState } from 'react';
import {
  Users,
  Shield,
  Cpu,
  Activity,
  Sparkles,
  Database,
  Lock,
  Workflow,
  Radio,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  RefreshCw,
  Terminal,
  Zap,
  Sliders,
  ChevronRight,
  HardDrive,
  Clock,
} from 'lucide-react';
import { PageContainer } from '../common/PageContainer';
import { Toggle } from '../common/Toggle';
import type { AgentDefinition } from '../../contracts/agent.contract';

interface ExtendedAgent extends AgentDefinition {
  code: string;
  iconType: 'cpu' | 'activity' | 'sparkles' | 'database' | 'lock' | 'workflow';
  category: string;
  cpuLoad: string;
  memoryUsage: string;
  latency: string;
  uptime: string;
  threads: number;
}

const INITIAL_AGENTS: ExtendedAgent[] = [
  {
    id: 'agent.system.supervisor',
    code: 'CORE-01',
    name: 'Neural Supervisor Core',
    description: 'Coordinates IPC dispatch, background event loops, and kernel thread health monitoring.',
    capabilities: [
      { name: 'ipc:dispatch', description: 'Dispatches typed events between processes', requiresPermission: false },
      { name: 'heartbeat:monitor', description: 'Monitors electron process health', requiresPermission: false },
    ],
    permissions: [{ scope: 'system:core', reason: 'Desktop foundation management', granted: true }],
    enabled: true,
    memoryNamespace: 'jarvis.core.supervisor',
    version: '1.0.0',
    iconType: 'cpu',
    category: 'System Core',
    cpuLoad: '0.8%',
    memoryUsage: '34.2 MB',
    latency: '4ms',
    uptime: '99.99%',
    threads: 4,
  },
  {
    id: 'agent.telemetry.watcher',
    code: 'WATCHDOG-02',
    name: 'Telemetry Watchdog',
    description: 'Aggregates real-time CPU, RAM, network packet latency, and thermal statistics for live HUD.',
    capabilities: [
      { name: 'telemetry:poll', description: 'Reads hardware and network metrics', requiresPermission: false },
    ],
    permissions: [{ scope: 'telemetry:read', reason: 'Hardware metrics monitoring', granted: true }],
    enabled: true,
    memoryNamespace: 'jarvis.telemetry',
    version: '1.0.0',
    iconType: 'activity',
    category: 'Monitoring',
    cpuLoad: '1.4%',
    memoryUsage: '18.6 MB',
    latency: '8ms',
    uptime: '99.98%',
    threads: 2,
  },
  {
    id: 'agent.updater.sentinel',
    code: 'SENTINEL-03',
    name: 'Release Sentinel',
    description: 'Monitors official GitHub release feeds, validates cryptographic hashes, and stages binary updates.',
    capabilities: [
      { name: 'update:check', description: 'Queries GitHub release feeds', requiresPermission: false },
      { name: 'update:download', description: 'Streams electron-updater binaries', requiresPermission: true },
    ],
    permissions: [{ scope: 'network:releases', reason: 'Auto-updater verification', granted: true }],
    enabled: true,
    memoryNamespace: 'jarvis.updater',
    version: '1.0.0',
    iconType: 'sparkles',
    category: 'Lifecycle',
    cpuLoad: '0.2%',
    memoryUsage: '12.1 MB',
    latency: '24ms',
    uptime: '100.0%',
    threads: 1,
  },
  {
    id: 'agent.memory.substrate',
    code: 'MEMORY-04',
    name: 'Memory Substrate Indexer',
    description: 'Manages namespaced local cache records, session state envelopes, and conversation history vectors.',
    capabilities: [
      { name: 'storage:read', description: 'Reads key-value state envelopes', requiresPermission: false },
      { name: 'storage:write', description: 'Persists user session parameters', requiresPermission: false },
    ],
    permissions: [{ scope: 'storage:session', reason: 'Client state isolation', granted: true }],
    enabled: true,
    memoryNamespace: 'jarvis.memory.substrate',
    version: '1.0.0',
    iconType: 'database',
    category: 'Data Layer',
    cpuLoad: '0.6%',
    memoryUsage: '42.8 MB',
    latency: '6ms',
    uptime: '99.95%',
    threads: 3,
  },
  {
    id: 'agent.security.guard',
    code: 'GUARD-05',
    name: 'Sandbox Security Guard',
    description: 'Enforces context isolation, validates IPC message arguments, and restricts Node primitives.',
    capabilities: [
      { name: 'security:audit', description: 'Validates context bridge payloads', requiresPermission: false },
    ],
    permissions: [{ scope: 'security:core', reason: 'IPC boundary enforcement', granted: true }],
    enabled: true,
    memoryNamespace: 'jarvis.security',
    version: '1.0.0',
    iconType: 'lock',
    category: 'Security',
    cpuLoad: '0.3%',
    memoryUsage: '15.4 MB',
    latency: '2ms',
    uptime: '100.0%',
    threads: 2,
  },
  {
    id: 'agent.workflow.orchestrator',
    code: 'FLOW-06',
    name: 'Task Flow Orchestrator',
    description: 'Schedules linear automation pipelines, trigger webhooks, and multi-step agent actions.',
    capabilities: [
      { name: 'workflow:queue', description: 'Manages step execution queue', requiresPermission: false },
    ],
    permissions: [{ scope: 'automation:queue', reason: 'Pipeline sequencing', granted: true }],
    enabled: false,
    memoryNamespace: 'jarvis.workflow',
    version: '1.0.0',
    iconType: 'workflow',
    category: 'Automation',
    cpuLoad: '0.0%',
    memoryUsage: '8.2 MB',
    latency: '0ms',
    uptime: 'Standby',
    threads: 0,
  },
];

export const AgentsView: React.FC = () => {
  const [agents, setAgents] = useState<ExtendedAgent[]>(INITIAL_AGENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [restartingAgentId, setRestartingAgentId] = useState<string | null>(null);

  const toggleAgent = (id: string, newStatus: boolean) => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === id ? { ...agent, enabled: newStatus } : agent
      )
    );
  };

  const handleRestart = (id: string) => {
    setRestartingAgentId(id);
    setTimeout(() => {
      setRestartingAgentId(null);
    }, 1200);
  };

  const categories = ['ALL', 'System Core', 'Monitoring', 'Lifecycle', 'Data Layer', 'Security', 'Automation'];

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'ALL' || agent.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const activeCount = agents.filter((a) => a.enabled).length;

  const renderAgentIcon = (type: ExtendedAgent['iconType']) => {
    switch (type) {
      case 'cpu':
        return <Cpu className="w-4 h-4" />;
      case 'activity':
        return <Activity className="w-4 h-4" />;
      case 'sparkles':
        return <Sparkles className="w-4 h-4" />;
      case 'database':
        return <Database className="w-4 h-4" />;
      case 'lock':
        return <Lock className="w-4 h-4" />;
      case 'workflow':
        return <Workflow className="w-4 h-4" />;
      default:
        return <Cpu className="w-4 h-4" />;
    }
  };

  return (
    <PageContainer
      id="agents-registry-page"
      icon={<Users className="w-5 h-5 text-[#00f2a1]" />}
      title="Agent Subsystem Registry"
      subtitle="Phase 1 Pluggable Micro-Agent Architecture • Isolated Kernel Threads"
      badge={
        <span className="font-mono text-xs text-[#00f2a1] bg-[#0a1411] px-3 py-1 rounded-full border border-[#00f2a1]/40 shadow-[0_0_8px_rgba(0,242,161,0.2)]">
          {activeCount} of {agents.length} Active
        </span>
      }
    >
      {/* Top Controls: Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0a0c10] border border-[#171b22] rounded-xl p-3 shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
        {/* Search Input */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#060709] border border-[#1b2029] rounded-lg flex-1">
          <Search className="w-3.5 h-3.5 text-[#5a6575]" />
          <input
            type="text"
            placeholder="Search agents by name, code, or capabilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-[#f0f3f6] placeholder-[#5a6575] focus:outline-none font-mono"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg font-mono text-[10px] whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#00f2a1]/15 text-[#00f2a1] border border-[#00f2a1]/40 font-semibold'
                  : 'bg-[#0d1015] text-[#8c96a5] border border-[#171b22] hover:text-white hover:border-[#262e3b]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cybernetic Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAgents.map((agent) => {
          const isEnabled = agent.enabled;
          const isRestarting = restartingAgentId === agent.id;

          return (
            <div
              key={agent.id}
              id={`agent-card-${agent.id.replace(/\./g, '-')}`}
              className={`rounded-xl border p-5 flex flex-col justify-between gap-4 transition-all duration-200 relative overflow-hidden group shadow-[0_4px_16px_rgba(0,0,0,0.5)] ${
                isEnabled
                  ? 'bg-[#0a0d12] border-[#1a212d] hover:border-[#00f2a1]/50'
                  : 'bg-[#08090c] border-[#141820] opacity-80 hover:opacity-100'
              }`}
            >
              {/* Card Top Row: Code Badge, Icon, Title, and Toggle */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0 transition-all ${
                      isEnabled
                        ? 'bg-[#0d151c] border-[#00f2a1]/40 text-[#00f2a1] shadow-[0_0_12px_rgba(0,242,161,0.2)]'
                        : 'bg-[#0b0d10] border-[#1b2029] text-[#5a6575]'
                    }`}
                  >
                    {renderAgentIcon(agent.iconType)}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#10141c] border border-[#1e2533] text-[#38bdf8]">
                        {agent.code}
                      </span>
                      <span className="font-mono text-[9px] text-[#5a6575]">
                        v{agent.version}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#f0f3f6] mt-1 tracking-tight">
                      {agent.name}
                    </span>
                    <span className="font-mono text-[10px] text-[#8c96a5]">
                      {agent.category}
                    </span>
                  </div>
                </div>

                {/* State-Level Toggle */}
                <Toggle
                  id={`toggle-${agent.id}`}
                  enabled={isEnabled}
                  onChange={(val) => toggleAgent(agent.id, val)}
                  size="sm"
                />
              </div>

              {/* Description */}
              <p className="text-xs text-[#8c96a5] leading-relaxed line-clamp-2 min-h-[36px]">
                {agent.description}
              </p>

              {/* Live Telemetry Bar */}
              <div className="bg-[#06070a] border border-[#141820] rounded-lg p-2.5 grid grid-cols-3 gap-2 text-center font-mono text-[10px]">
                <div className="flex flex-col">
                  <span className="text-[#5a6575] text-[9px]">CPU LOAD</span>
                  <span className={`font-semibold ${isEnabled ? 'text-[#00f2a1]' : 'text-[#5a6575]'}`}>
                    {isEnabled ? agent.cpuLoad : '0.0%'}
                  </span>
                </div>
                <div className="flex flex-col border-x border-[#141820]">
                  <span className="text-[#5a6575] text-[9px]">RAM USAGE</span>
                  <span className={`font-semibold ${isEnabled ? 'text-[#38bdf8]' : 'text-[#5a6575]'}`}>
                    {isEnabled ? agent.memoryUsage : '0.0 MB'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[#5a6575] text-[9px]">LATENCY</span>
                  <span className={`font-semibold ${isEnabled ? 'text-[#f0f3f6]' : 'text-[#5a6575]'}`}>
                    {isEnabled ? agent.latency : '—'}
                  </span>
                </div>
              </div>

              {/* Capabilities Chips */}
              <div className="flex flex-wrap gap-1.5">
                {agent.capabilities.map((cap) => (
                  <span
                    key={cap.name}
                    className={`font-mono text-[9px] px-2 py-0.5 rounded border transition-colors ${
                      isEnabled
                        ? 'bg-[#0a1219] border-[#18283a] text-[#38bdf8]'
                        : 'bg-[#080a0d] border-[#141820] text-[#5a6575]'
                    }`}
                    title={cap.description}
                  >
                    {cap.name}
                  </span>
                ))}
              </div>

              {/* Footer: Namespace, Status & Restart Button */}
              <div className="pt-3 border-t border-[#141922] flex items-center justify-between font-mono text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isEnabled ? 'bg-[#00f2a1] animate-pulse' : 'bg-[#5a6575]'}`} />
                  <span className={`font-semibold tracking-wider ${isEnabled ? 'text-[#00f2a1]' : 'text-[#5a6575]'}`}>
                    {isEnabled ? 'ACTIVE // ARMED' : 'STANDBY'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[#5a6575] text-[9px] hidden sm:inline">
                    {agent.threads} threads
                  </span>
                  {isEnabled && (
                    <button
                      onClick={() => handleRestart(agent.id)}
                      disabled={isRestarting}
                      className="p-1 rounded bg-[#0d1117] border border-[#1b2230] text-[#8c96a5] hover:text-[#00f2a1] hover:border-[#00f2a1]/40 transition-colors cursor-pointer"
                      title="Cycle / Restart Subsystem Thread"
                    >
                      <RefreshCw className={`w-3 h-3 ${isRestarting ? 'animate-spin text-[#00f2a1]' : ''}`} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PageContainer>
  );
};
