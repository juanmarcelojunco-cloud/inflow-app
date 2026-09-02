"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, Plus, History, Sparkles, LayoutDashboard, Settings, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string = input) => {
    if (!text.trim()) return;

    const userMsg = { role: 'user' as const, content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: messages }),
      });
      const data = await response.json();

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);

      if (data.action === "insert_transaction") {
        await handleTransaction(data.data);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Error de sincronización. Intenta de nuevo." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransaction = async (txData: any) => {
    const username = document.cookie.split('; ').find(row => row.startsWith('inflow_user='))?.split('=')[1];
    if (!username) return;

    await supabase.from('transactions').insert({
      username: username,
      descripcion: txData.descripcion,
      monto: txData.monto,
      tipo: txData.tipo,
      sobre_destino: txData.sobre_destino,
      rango_tiempo: txData.rango_tiempo,
      cantidad_tiempo: txData.cantidad_tiempo,
      estado_ingreso: txData.estado_ingreso,
    });
  };

  const handleLogout = () => {
    document.cookie = "inflow_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/onboarding");
  };

  return (
    <main className="h-screen flex bg-background text-foreground font-sans overflow-hidden">
      {/* Side Navigation - Corporate Layout */}
      <nav className="w-20 lg:w-64 bg-card border-r border-white/5 flex flex-col p-4 transition-all duration-300 hidden sm:flex">
        <div className="flex items-center gap-3 px-2 mb-12">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-background font-serif font-bold text-xl shadow-lg shadow-primary/20">iF</div>
          <span className="hidden lg:block text-lg font-serif font-medium tracking-tight">inFlow</span>
        </div>

        <div className="flex-1 space-y-2">
          <button
            onClick={() => router.push("/chat")}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-primary/10 text-primary border border-primary/20 transition-all"
          >
            <Sparkles size={20} />
            <span className="hidden lg:block font-medium">Asesor Inteligente</span>
          </button>
          <button
            onClick={() => router.push("/stats")}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-muted hover:bg-white/5 hover:text-foreground transition-all"
          >
            <LayoutDashboard size={20} />
            <span className="hidden lg:block font-medium">Panel de Control</span>
          </button>
          <button className="w-full flex items-center gap-3 p-3 rounded-xl text-muted hover:bg-white/5 hover:text-foreground transition-all">
            <Settings size={20} />
            <span className="hidden lg:block font-medium">Configuración</span>
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut size={20} />
          <span className="hidden lg:block font-medium">Cerrar Sesión</span>
        </button>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative">
        <header className="p-5 border-b border-white/5 flex justify-between items-center bg-background/50 backdrop-blur-xl sticky top-0 z-10">
          <div className="flex items-center gap-3 sm:hidden">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-background font-serif font-bold">iF</div>
          </div>
          <div className="hidden sm:block">
            <h2 className="text-sm font-medium text-muted uppercase tracking-widest">Centro de Comando</h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-muted hover:text-foreground transition-colors rounded-full hover:bg-white/5">
              <History size={20} />
            </button>
          </div>
        </header>

        {/* Chat Interface */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-center text-center space-y-6"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                <div className="relative w-24 h-24 bg-card border border-white/10 rounded-[2.5rem] flex items-center justify-center text-primary shadow-2xl">
                  <Sparkles size={48} />
                </div>
              </div>
              <div className="space-y-2 max-w-sm">
                <h3 className="text-2xl font-serif font-medium">Tu Copiloto Financiero</h3>
                <p className="text-muted text-sm">Toma el control de tu capital con lenguaje natural. Registra flujos, analiza metas o pide proyecciones.</p>
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-4 rounded-3xl shadow-sm ${
                  msg.role === 'user'
                  ? "bg-primary text-background rounded-tr-none font-medium shadow-primary/20"
                  : "bg-card border border-white/5 rounded-tl-none text-foreground"
                }`}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-card border border-white/5 p-4 rounded-3xl rounded-tl-none">
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input Area - Terminal Style */}
        <footer className="p-6 bg-background/80 backdrop-blur-md border-t border-white/5">
          <div className="max-w-4xl mx-auto flex gap-3 items-center">
            <button className="p-4 bg-card border border-white/10 rounded-2xl text-muted hover:text-primary transition-all active:scale-95 shadow-sm">
              <Plus size={22} />
            </button>
            <div className="flex-1 relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ej: Gané 50 soles hoy..."
                className="w-full bg-card border border-white/10 rounded-2xl p-5 pr-16 focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted/50 text-sm shadow-inner"
              />
              <button
                onClick={() => sendMessage()}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-primary/10 rounded-xl transition-all active:scale-95"
              >
                <Send size={20} />
              </button>
            </div>
            <button className="p-4 bg-primary text-background rounded-2xl hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary/20">
              <Mic size={22} />
            </button>
          </div>
        </footer >
      </div >
    </main>
  );
}
