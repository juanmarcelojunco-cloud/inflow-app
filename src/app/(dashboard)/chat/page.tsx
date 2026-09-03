"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Terminal, Cpu, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMsg = { role: "user" as const, content: message };
    setChatHistory(prev => [...prev, userMsg]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history: chatHistory }),
      });

      const data = await response.json();
      setChatHistory(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: "assistant", content: "ERROR: Financial core connection failure. Retrying..." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto space-y-6 animate-in fade-in duration-700">
      {/* Command Center Header */}
      <div className="bg-card border border-white/5 p-6 rounded-3xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/20">
            <Cpu size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white tracking-tight">Financial Command Center</h2>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              Gemini 1.5 Engine Active
            </div >
          </div >
        </div >
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-muted">
            <ShieldCheck size={12} />
            Encrypted Session
          </div >
        </div >
      </div >

      {/* Console Window */}
      <div className="flex-1 bg-card border border-white/5 rounded-3xl overflow-hidden flex flex-col h-[calc(100vh-260px)] shadow-2xl">
        {/* Terminal Top Bar */}
        <div className="h-10 bg-white/[0.02] border-b border-white/5 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-error/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-warning/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-success/50" />
            <span className="ml-3 text-[10px] font-mono text-muted uppercase tracking-widest">inflow_core_terminal</span>
          </div >
          <Terminal size={14} className="text-muted" />
        </div >

        {/* Log Area */}
        <div className="flex-1 overflow-y-auto p-8 font-mono text-sm space-y-6">
          {chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
              <div className="p-6 bg-white/[0.02] rounded-full border border-white/10 text-muted">
                <Bot size={48} />
              </div >
              <div className="max-w-md">
                <p className="text-lg font-medium text-white">System Ready for Input</p>
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  Enter financial commands to manage your flow.<br />
                  Example: <span className="text-primary">"Record income 500 USD"</span> or <span className="text-primary">"Analyze liquid assets"</span>
                </p>
              </div >
            </div >
          ) : (
            chatHistory.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex gap-4 ${msg.role === "user" ? "justify-start" : "justify-start"}`}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase font-bold ${msg.role === "user" ? "text-primary" : "text-muted"}`}>
                      {msg.role === "user" ? "USER_CMD" : "CORE_ADVISOR"}
                    </span>
                    <span className="text-[10px] text-white/20 font-mono">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div >
                  <div className={`p-4 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-white/[0.03] border border-white/10 text-slate-300"
                      : "bg-primary/5 border border-primary/20 text-white shadow-lg shadow-primary/5"
                  }`}>
                    {msg.content}
                  </div >
                </div >
              </motion.div>
            ))
          )}
          <div ref={scrollRef} />
        </div >

        {/* Input Area: Command Prompt */}
        <div className="p-6 bg-background border-t border-white/5">
          <div className="relative flex items-center gap-3 group">
            <div className="text-primary font-mono font-bold shrink-0">&gt;</div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Execute financial command..."
              className="flex-1 bg-transparent border-none outline-none text-white font-mono text-sm placeholder:text-muted/50"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !message.trim()}
              className="p-2 rounded-lg bg-primary text-white hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div >
        </div >
      </div >
    </div >
  );
}
