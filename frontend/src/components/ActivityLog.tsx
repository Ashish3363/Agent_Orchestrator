"use client";

import { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';

interface EventLog {
  agent_id: string;
  status: string;
  message: string;
  data?: any;
}

interface ActivityLogProps {
  events: EventLog[];
}

export default function ActivityLog({ events }: ActivityLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  if (events.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 mb-12">
      <div className="bg-[#0D1117] rounded-xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="flex items-center gap-2 bg-white/5 px-4 py-3 border-b border-white/10">
          <Terminal className="w-4 h-4 text-white/50" />
          <span className="text-sm font-mono text-white/50">agent_execution.log</span>
        </div>
        
        <div 
          ref={scrollRef}
          className="p-4 h-64 overflow-y-auto space-y-3 font-mono text-sm"
        >
          {events.map((ev, i) => (
            <div key={i} className="flex gap-4 items-start animate-fade-in origin-left">
              <span className="text-white/30 shrink-0">[{new Date().toLocaleTimeString()}]</span>
              
              <div className="flex-1">
                <span className={`font-semibold mr-2 ${
                  ev.agent_id === 'Planner' ? 'text-blue-400' : 
                  ev.agent_id === 'Researcher' ? 'text-purple-400' :
                  ev.agent_id === 'Writer' ? 'text-emerald-400' :
                  ev.agent_id === 'Reviewer' ? 'text-amber-400' : 'text-gray-400'
                }`}>
                  {ev.agent_id}
                </span>
                
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider mr-2 ${
                  ev.status === 'starting' ? 'bg-blue-500/20 text-blue-300' :
                  ev.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' :
                  ev.status === 'done' ? 'bg-white/20 text-white' :
                  'bg-white/10 text-white/50'
                }`}>
                  {ev.status}
                </span>
                
                <span className="text-white/80">{ev.message}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
