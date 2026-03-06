"use client";

import { useState, useEffect } from "react";
import TaskForm from "@/components/TaskForm";
import ProgressVisualization from "@/components/ProgressVisualization";
import ActivityLog from "@/components/ActivityLog";
import ReportView from "@/components/ReportView";
import { Sparkles } from "lucide-react";

export default function Home() {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [currentAgent, setCurrentAgent] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [reportContent, setReportContent] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Use Effect to handle SSE connections when a task is submitted
  useEffect(() => {
    if (!taskId) return;

    // Reset old state on new run
    setEvents([]);
    setReportContent(null);
    setFeedback(null);
    setIsLoading(true);

    const eventSource = new EventSource(`http://127.0.0.1:8001/api/tasks/${taskId}/events`);

    eventSource.onmessage = (e) => {
      const data = JSON.parse(e.data);
      
      // Accumulate logs
      setEvents((prev) => [...prev, data]);
      
      // Sync State
      if (data.data?.state) {
        const state = data.data.state;
        setStatus(state.status);
        setCurrentAgent(state.current_agent);
        setReportContent(state.final_report || state.draft); // Show draft if final report not ready
        setFeedback(state.feedback);
      }

      if (data.status === "done" && data.message === "Pipeline execution complete.") {
        setIsLoading(false);
        eventSource.close();
      }
    };

    eventSource.onerror = () => {
      setIsLoading(false);
      eventSource.close();
    };

    return () => eventSource.close();
  }, [taskId]);

  const handleTaskSubmit = async (query: string) => {
    setIsLoading(true);
    setStatus("planning");
    try {
      const res = await fetch("http://127.0.0.1:8001/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setTaskId(data.task_id);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-emerald-500/30 font-sans pb-24">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] rounded-full bg-purple-500/10 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-20">
        
        {/* Header section */}
        <header className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm font-medium mb-6 text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>Multi-Agent Task Orchestrator</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent">
            Automate Complex Workflows
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto font-light leading-relaxed">
            Submit a complex query and watch a pipeline of specialized AI agents plan, research, write, and review it in real-time.
          </p>
        </header>

        {/* Start section */}
        <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
           <TaskForm onSubmit={handleTaskSubmit} isLoading={isLoading} />
        </div>

        {/* Dynamic Process Tracking (Only shows when a task starts) */}
        {status && (
          <div className="mt-20 border-t border-white/10 pt-16">
            <ProgressVisualization status={status} currentAgent={currentAgent} />
            <ActivityLog events={events} />
            <ReportView reportContent={reportContent} feedback={feedback} />
          </div>
        )}

      </div>
    </main>
  );
}
