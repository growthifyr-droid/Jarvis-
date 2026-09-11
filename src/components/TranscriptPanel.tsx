import React, { useState } from 'react';
import { Bot, Send, Mic, Sparkles } from 'lucide-react';
import packageJson from '../../package.json';

interface Message {
  id: string;
  sender: 'jarvis' | 'operator';
  timestamp: string;
  badge?: string;
  stats?: string;
  text: string;
}

interface TranscriptPanelProps {
  currentVersion?: string;
}

export const TranscriptPanel: React.FC<TranscriptPanelProps> = ({
  currentVersion = packageJson.version || '1.0.0',
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'jarvis',
      timestamp: '12:01:10 PM',
      badge: 'Brain API Engine',
      text: `Jarvis Neural Interface initialized with Brain API multi-provider routing (v${currentVersion}). Standing by for voice or text instructions.`,
    },
    {
      id: 'm2',
      sender: 'operator',
      timestamp: '12:01:18 PM',
      text: 'Status report on core subsystems.',
    },
    {
      id: 'm3',
      sender: 'jarvis',
      timestamp: '12:01:22 PM',
      badge: 'System Core',
      stats: '14ms 54 tok',
      text: `All neural matrices nominal. Brain API provider router online with automatic failover, priority scheduling, and SafeStorage encryption. Auto-updater linked to v${currentVersion} release channel.`,
    },
  ]);

  const [inputVal, setInputVal] = useState('');

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = inputVal.trim();
    if (!clean) return;

    const time = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const userMsg: Message = {
      id: 'usr_' + Date.now(),
      sender: 'operator',
      timestamp: time,
      text: clean,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');

    setTimeout(() => {
      const respTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      const reply: Message = {
        id: 'jarvis_' + Date.now(),
        sender: 'jarvis',
        timestamp: respTime,
        badge: 'System Core',
        stats: '11ms 32 tok',
        text: `Command acknowledged. Operating within Phase 1 Desktop Foundation parameters (v${currentVersion}). IPC bridge and telemetry channels verified.`,
      };
      setMessages((prev) => [...prev, reply]);
    }, 600);
  };

  return (
    <aside
      id="transcript-panel"
      className="hidden lg:flex w-[280px] xl:w-[320px] flex-shrink-0 bg-[#080a0d] border-l border-[#151921] flex-col select-none"
    >
      {/* Header */}
      <div className="h-12 border-b border-[#1c222a] px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f2a1]" />
          <span className="font-mono text-xs font-bold text-[#f0f3f6] tracking-widest">
            TRANSCRIPT
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0f1216] border border-[#1c222a] text-[#00f2a1] font-mono text-[10px]">
          <Sparkles className="w-3 h-3" />
          <span className="truncate max-w-[120px]">Google Gemini</span>
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 font-mono text-xs">
        {messages.map((m) => {
          if (m.sender === 'jarvis') {
            return (
              <div key={m.id} className="flex flex-col gap-1.5 items-start">
                <div className="flex items-center gap-2 flex-wrap text-[11px]">
                  <div className="flex items-center gap-1 text-[#00f2a1] font-bold">
                    <Bot className="w-3.5 h-3.5" />
                    <span>JARVIS AI</span>
                  </div>
                  <span className="text-[#3b434e]">•</span>
                  <span className="text-[#8c96a5]">{m.timestamp}</span>
                  {m.badge && (
                    <span className="bg-[#111418] text-[#38bdf8] px-1.5 py-0.2 rounded border border-[#1e2730] text-[9px]">
                      {m.badge}
                    </span>
                  )}
                  {m.stats && (
                    <span className="text-[#5a6575] text-[9px] ml-auto font-mono">
                      {m.stats}
                    </span>
                  )}
                </div>

                <div className="bg-[#111418] border border-[#1e242b] rounded-xl p-3 text-[#d1d5db] leading-relaxed shadow-[0_2px_8px_rgba(0,0,0,0.3)] text-left font-sans text-xs">
                  {m.text}
                </div>
              </div>
            );
          }

          return (
            <div key={m.id} className="flex flex-col gap-1.5 items-end">
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-[#8c96a5] font-bold tracking-wider">OPERATOR</span>
                <span className="text-[#3b434e]">•</span>
                <span className="text-[#8c96a5]">{m.timestamp}</span>
              </div>

              <div className="bg-[#151920] border border-[#262e38] rounded-xl p-2.5 px-3.5 text-[#f0f3f6] max-w-[90%] text-left font-sans text-xs shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                {m.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Chat Input Area */}
      <div className="p-3 border-t border-[#1c222a] bg-[#0b0d10]">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            id="input-transcript-command"
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Enter command or message..."
            className="w-full bg-[#111418] border border-[#1e242b] rounded-full py-2 pl-4 pr-18 text-xs text-[#f0f3f6] placeholder-[#5a6575] focus:outline-none focus:border-[#00f2a1]/60 transition-colors font-sans"
          />

          <div className="absolute right-1.5 flex items-center gap-1">
            <button
              type="button"
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#8c96a5] hover:text-[#00f2a1] transition-colors"
              title="Voice Input"
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
            <button
              id="btn-transcript-send"
              type="submit"
              className="w-7 h-7 rounded-full bg-[#00f2a1] text-[#08120e] flex items-center justify-center shadow-[0_0_8px_rgba(0,242,161,0.3)] hover:scale-105 transition-transform cursor-pointer"
              title="Send Command"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Footer info line */}
        <div className="flex items-center justify-between px-2 pt-2 text-[10px] font-mono text-[#5a6575]">
          <span>Standing by for command</span>
          <span>v{currentVersion}</span>
        </div>
      </div>
    </aside>
  );
};
