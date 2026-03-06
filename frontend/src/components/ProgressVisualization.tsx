"use client";

import { CheckCircle2, Circle, Loader2, PenTool, Search, LayoutDashboard, FileText } from "lucide-react";

interface ProgressVisualizationProps {
  status: string;
  currentAgent: string | null;
}

const steps = [
  { id: "planning", label: "Planner", icon: LayoutDashboard },
  { id: "researching", label: "Researcher", icon: Search },
  { id: "writing", label: "Writer", icon: PenTool },
  { id: "reviewing", label: "Reviewer", icon: CheckCircle2 },
  { id: "done", label: "Complete", icon: FileText },
];

export default function ProgressVisualization({ status, currentAgent }: ProgressVisualizationProps) {
  // revising is handled by writer/reviewer loops essentially
  const activeIndex = steps.findIndex((s) => s.id === status) !== -1 
    ? steps.findIndex((s) => s.id === status) 
    : (status === 'revising' ? 2 : 0); // Default to writing if revising

  return (
    <div className="w-full max-w-4xl mx-auto my-12">
      <div className="relative flex justify-between items-center">
        {/* Connecting Line */}
        <div className="absolute left-[5%] top-1/2 -translate-y-1/2 w-[90%] h-1 bg-white/10 rounded-full overflow-hidden">
             <div 
               className="h-full bg-emerald-500 transition-all duration-1000 ease-in-out"
               style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
             />
        </div>

        {steps.map((step, index) => {
          const isActive = index === activeIndex;
          const isPast = index < activeIndex;
          const isDone = status === 'done';
          const isRevising = status === 'revising' && step.id === 'writing';

          const Icon = step.icon;

          return (
            <div key={step.id} className="relative flex flex-col items-center gap-3 z-10 w-24">
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border-2 
                  ${isActive && !isDone ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)] scale-110' : ''}
                  ${isPast || isDone ? 'bg-emerald-500 border-emerald-500 text-white' : ''}
                  ${!isActive && !isPast && !isDone ? 'bg-black/80 border-white/20 text-white/40' : ''}
                  ${isRevising ? 'animate-pulse border-amber-400 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]' : ''}
                `}
              >
                {isActive && !isDone ? (
                   status === 'revising' && step.id === 'writing' ? <PenTool className="w-5 h-5" /> : <Loader2 className="w-5 h-5 animate-spin" />
                ) : isPast || isDone ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <span className={`text-xs font-medium tracking-wider uppercase transition-colors duration-300
                ${isActive || isDone ? 'text-emerald-400' : 'text-white/40'}
                ${isRevising ? 'text-amber-400' : ''}
              `}>
                {status === 'revising' && step.id === 'writing' ? 'Revising' : step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
