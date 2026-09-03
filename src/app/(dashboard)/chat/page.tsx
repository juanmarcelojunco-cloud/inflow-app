"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Terminal } from "lucide-react";
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
      setChatHistory(prev => [...prev, { role: "assistant", content: "Lo siento, hubo un error en la conexión con el núcleo financiero." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* AI Header */}
      <div className="bg-[#131A22] border border-[#1D2632] p-6 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">AI Financial Advisor</h2>
            <p className="text-xs text-[#8B95A7]">Inteligencia financiera de alto rendimiento</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
          <Sparkles size={12} />
          Gemini Engine
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-[#131A22] border border-[#1D2632] rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-240px)]">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <div className="p-4 bg-[#0B0F14] rounded-full text-[#8B95A7]">
                <Terminal size={32} />
              </div>
              <div>
                <p className="text-lg font-medium">¿En qué puedo ayudarte hoy?</p>
                <p className="text-sm text-[#8B95A7]">Puedes decir: "Gané 500 USD" o "Analiza mis gastos"</p>
              </div>
            </div>
          ) : (
            chatHistory.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`p-2 rounded-lg shrink-0 ${msg.role === "user" ? "bg-primary text-white" : "bg-[#0B0F14] text-primary border border-[#1D2632]"}`}>
                    {msg.role === "user" ? <User size={18} /> : <Bot size={18} />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-white rounded-tr-none"
                      : "bg-[#1D2632] text-white rounded-tl-none"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#0B0F14] border-t border-[#1D2632]">
          <div className="flex gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Escribe un comando financiero..."
              className="flex-1 bg-[#131A22] border border-[#1D2632] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !message.trim()}
              className="bg-primary text-white p-3 rounded-xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
