"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, Plus, History, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ChatPage() {
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
      setMessages(prev => [...prev, { role: 'assistant', content: "Hubo un problema con la conexión. Intenta de nuevo." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransaction = async (txData: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('transactions').insert({
      user_id: user.id,
      descripcion: txData.descripcion,
      monto: txData.monto,
      tipo: txData.tipo,
      sobre_destino: txData.sobre_destino,
      rango_tiempo: txData.rango_tiempo,
      cantidad_tiempo: txData.cantidad_tiempo,
      estado_ingreso: txData.estado_ingreso,
    });
  };

  return (
    <main className="h-screen flex flex-col bg-background text-foreground font-sans overflow-hidden">
      {/* Header Premium */}
      <header className="p-5 border-b border-white/5 flex justify-between items-center bg-card/30 backdrop-blur-xl sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-background font-serif font-bold text-xl shadow-lg shadow-primary/20">
            iF
          </div>
          <div>
            <h1 className="text-lg font-serif font-medium leading-none">Asesor inFlow</h1>
            <p className="text-[10px] text-primary uppercase tracking-widest font-bold">Boutique Financiera</p>
          </div>
        </div>
        <button className="p-3 text-muted hover:text-foreground transition-all rounded-full hover:bg-white/5">
          <History size={22} />
        </button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-60"
          >
            <div className="w-20 h-20 bg-card rounded-[2rem] flex items-center justify-center text-primary shadow-inner border border-white/5">
              <Sparkles size={40} />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-serif">Hola, soy tu asesor personal</p>
              <p className="text-sm text-muted max-w-xs mx-auto">¿Qué registramos hoy? Puedes decirme: "Gané 100 soles hoy"</p>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-4 rounded-3xl shadow-sm ${
                msg.role === 'user'
                ? "bg-primary text-background rounded-tr-none font-medium"
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

      {/* Fast-Entry UI Premium */}
      <footer className="p-6 bg-card/50 backdrop-blur-md border-t border-white/5 space-y-4">
        <div className="max-w-3xl mx-auto flex gap-3 items-center">
          <button className="p-4 bg-background border border-white/10 rounded-2xl text-muted hover:text-primary transition-all active:scale-95 shadow-sm">
            <Plus size={22} />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Escribe tu flujo..."
              className="w-full bg-background border border-white/10 rounded-2xl p-4 pr-14 focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted/50 text-sm"
            />
            <button
              onClick={() => sendMessage()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-primary/10 rounded-xl transition-all active:scale-95"
            >
              <Send size={20} />
            </button>
          </div>
          <button className="p-4 bg-primary text-background rounded-2xl hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary/20">
            <Mic size={22} />
          </button>
        </div>
      </footer>
    </main>
  );
}
