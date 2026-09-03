"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, Plus, History, Sparkles, LayoutDashboard, Settings, LogOut, MessageSquare, Command } from "lucide-react";
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
      setMessages(prev => [...prev, { role: 'assistant', content: "Error de conexión con el núcleo financiero. Reintentando..." }]);
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
      rango_tiempo: txData.rango_tiempo || 'unico',
      cantidad_tiempo: txData.cantidad_tiempo || 1,
      estado_ingreso: txData.estado_ingreso || 'no_aplica',
      created_at: new Date().toISOString(),
    });
  };

  const handleLogout = () => {
    document.cookie = "inflow_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/onboarding");
  };

  return (
    <main className="h-screen flex bg-background text-foreground font-sans overflow-hidden">
      {/* Sidebar - Wealth Management Style */}
      <nav className="w-20 lg:w-72 bg-card border-r border-border flex flex-col p-6 transition-all duration-300 hidden sm:flex">
        <div className="flex items-center gap-4 px-2 mb-12">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-background font-serif font-bold text-2xl shadow-xl shadow-primary/20">iF</div>
          <span className="hidden lg:block text-2xl font-serif font-medium tracking-tight">inFlow</span>
        </div>

        <div className="flex-1 space-y-8">
          <div>
            <p className="hidden lg:block text-[11px] font-bold text-muted uppercase tracking-[0.2em] px-3 mb-6 opacity-60">Control Central</p>
            <div className="space-y-2">
              <button
                onClick={() => router.push("/chat")}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-primary/10 text-primary border border-primary/20 transition-all"
              >
                <MessageSquare size={22} />
                <span className="hidden lg:block font-medium">Asesor Inteligente</span>
              </button>
              <button
                onClick={() => router.push("/stats")}
                className="w-full flex items-center gap-4 p-4 rounded-2xl text-muted hover:bg-white/5 hover:text-foreground transition-all"
              >
                <LayoutDashboard size={22} />
                <span className="hidden lg:block font-medium">Panel de Control</span>
              </button>
              <button className="w-full flex items-center gap-4 p-4 rounded-2xl text-muted hover:bg-white/5 hover:text-foreground transition-all">
                <Settings size={22} />
                <span className="hidden lg:block font-medium">Configuración</span>
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-400 hover:bg-red-400/10 transition-all font-medium"
        >
          <LogOut size={22} />
          <span className="hidden lg:block">Cerrar Sesión</span>
        </button>
      </nav>

      {/* Main Interface */}
      <div className="flex-1 flex flex-col relative">
        <header className="p-6 border-b border-border flex justify-between items-center bg-background/50 backdrop-blur-2xl sticky top-0 z-10">
          <div className="flex items-center gap-3 sm:hidden">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-background font-serif font-bold">iF</div>
          </div>
          <div className="hidden sm:block">
            <h2 className="text-xs font-bold text-muted uppercase tracking-[0.3em]">Wealth Management System</h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-3 text-muted hover:text-foreground transition-colors rounded-full hover:bg-white/5 relative group">
              <History size={20} />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-card text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-border">Historial</span>
            </button>
          </div>
        </header>

        {/* Chat Window */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-center text-center space-y-10"
            >
              <div className="relative">
                <div className="absolute -inset-12 bg-primary/20 blur-3xl rounded-full animate-pulse" />
                <div className="relative w-28 h-28 bg-card border border-border rounded-[3rem] flex items-center justify-center text-primary shadow-2xl animate-float">
                  <Sparkles size={56} />
                </div>
              </div>
              <div className="space-y-4 max-w-lg mx-auto">
                <h3 className="text-4xl font-serif font-medium tracking-tight">Hola, soy tu Asesor</h3>
                <p className="text-muted text-lg leading-relaxed opacity-80">
                  Toma el control total de tu capital con lenguaje natural. Registra flujos, analiza metas o pide proyecciones avanzadas.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full px-4">
                {["Gané 500 soles hoy", "Registra gasto de 20 USD", "¿Cuál es mi saldo?"].map((hint) => (
                  <button
                    key={hint}
                    onClick={() => sendMessage(hint)}
                    className="p-4 glass rounded-2xl text-xs text-muted hover:text-primary transition-all hover:scale-105 text-center"
                  >
                    {hint}
                  </button>
                ))}
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
                <div className={`max-w-[85%] p-5 rounded-[2rem] shadow-sm ${
                  msg.role === 'user'
                  ? "bg-primary text-background rounded-tr-none font-medium shadow-primary/20"
                  : "bg-card border border-border rounded-tl-none text-foreground"
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
              <div className="bg-card border border-border p-5 rounded-[2rem] rounded-tl-none">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input Bar - Command Center Style */}
        <footer className="p-8 bg-background/50 backdrop-blur-3xl border-t border-border">
          <div className="max-w-4xl mx-auto flex gap-4 items-center">
            <button className="p-4 bg-card border border-border rounded-2xl text-muted hover:text-primary transition-all active:scale-95 shadow-sm group">
              <Plus size={24} className="group-hover:rotate-90 transition-transform" />
            </button>
            <div className="flex-1 relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors">
                <Command size={20} />
              </div>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Escribe tu flujo (ej: Gané 100 soles hoy)..."
                className="w-full bg-card border border-border rounded-2xl p-6 pl-14 focus:ring-2 focus:ring-primary/40 outline-none transition-all placeholder:text-muted/40 text-base shadow-inner"
              />
              <button
                onClick={() => sendMessage()}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-3 text-primary hover:bg-primary/10 rounded-xl transition-all active:scale-95"
              >
                <Send size={22} />
              </button>
            </div>
            <button className="p-4 bg-primary text-background rounded-2xl hover:brightness-110 transition-all active:scale-95 shadow-xl shadow-primary/20">
              <Mic size={24} />
            </button>
          </div>
        </footer >
      </div >
    </main>
  );
}
