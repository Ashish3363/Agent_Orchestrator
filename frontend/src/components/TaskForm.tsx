"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

interface TaskFormProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

export default function TaskForm({ onSubmit, isLoading }: TaskFormProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSubmit(query);
      setQuery("");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl transition-all duration-500 hover:shadow-emerald-500/10">
      <h2 className="text-2xl font-semibold mb-4 text-emerald-50 tracking-tight">Initate Task Pipeline</h2>
      
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
          placeholder="e.g. Research the pros and cons of microservices..."
          className="flex-1 bg-black/40 border border-white/20 rounded-xl px-5 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-light"
        />
        <button
          type="submit"
          disabled={!query.trim() || isLoading}
          className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-95"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
          <span>Launch</span>
        </button>
      </form>
    </div>
  );
}
