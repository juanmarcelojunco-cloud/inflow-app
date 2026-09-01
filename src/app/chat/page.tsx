"use client";
import React, { useState, useEffect, useRef } from "react";
import { Send, Mic, Plus, History } from "lucide-react";
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
      setMessages(prev => [...prev, { role: 'assistant', content: "Lo siento, tuve un problema de conexión. Intenta de nuevo." }]);
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
    <main className="h-screen flex flex-col bg-background text-foreground font-sans">
      {/* Header */}
      <header className="p-4 border-b border-white/10 flex justify-between items-center bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-background font-bold">iF</div>
          <h1 className="text-lg font-serif font-medium">Asesor inFlow</h1>
        </div>
        <button className="p-2 text-muted hover:text-foreground transition-colors">
          <History size={20} />
        </button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
            <div className="w-16 h-16 bg-card rounded-3xl flex items-center justify-center text-primary">
              <Mic size={32} />
            </div>
            <p className="text-muted max-w-[200px]">Hola, ¿qué registramos hoy?</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${
              msg.role === 'user'
              ? "bg-primary text-background rounded-tr-none"
              : "bg-card border border-white/10 rounded-tl-none"
            }`}>
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-card border border-white/10 p-3 rounded-2xl rounded-tl-none">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Fast-Entry UI */}
      <footer className="p-4 bg-card border-t border-white/10 space-y-4">
        <div className="flex gap-2 items-center">
          <button className="p-3 bg-background border border-white/10 rounded-xl text-muted hover:text-primary transition-colors">
            <Plus size={20} />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ej: Gané $50 hoy..."
              className="w-full bg-background border border-white/10 rounded-xl p-3 pr-12 focus:ring-2 focus:ring-primary outline-none transition-all"
            />
            <button
              onClick={() => sendMessage()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-primary/10 rounded-lg transition-all"
            >
              <Send size={20} />
            </button>
          </div>
          <button className="p-3 bg-primary text-background rounded-xl hover:opacity-90 transition-all active:scale-95">
            <Mic size={20} />
          </button>
        </div>
      </footer>
    </main>
  );
}
