"use client";

import { AlertCircle, FileText } from 'lucide-react';

interface ReportViewProps {
  reportContent: string | null;
  feedback: string | null;
}

export default function ReportView({ reportContent, feedback }: ReportViewProps) {
  if (!reportContent && !feedback) return null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      {feedback && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 shadow-lg flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-400 mb-1">Reviewer Feedback</h4>
            <p className="text-amber-200/80 leading-relaxed text-sm">{feedback}</p>
          </div>
        </div>
      )}

      {reportContent && (
        <div className="bg-[#1C1F26] rounded-xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="bg-white/5 px-6 py-4 flex items-center gap-3 border-b border-white/10">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span className="font-medium text-white tracking-wide">Final Output</span>
          </div>
          
          <div className="p-8 prose prose-invert prose-emerald max-w-none">
            {/* Simple Markdown Renderer. In a real app we'd use react-markdown */}
            {reportContent.split('\n').map((line, i) => {
              if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold mb-6 text-white">{line.replace('# ', '')}</h1>;
              if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-semibold mt-8 mb-4 text-emerald-50">{line.replace('## ', '')}</h2>;
              if (line.startsWith('**') && line.endsWith('**')) return <strong key={i} className="block mt-4 mb-2 text-white">{line.replace(/\*\*/g, '')}</strong>;
              if (line.trim() === '') return <div key={i} className="h-4" />;
              return <p key={i} className="text-white/70 leading-relaxed mb-4">{line}</p>;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
