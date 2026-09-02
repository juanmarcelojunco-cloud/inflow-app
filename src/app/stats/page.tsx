"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { TrendingUp, Wallet, Clock, Filter, ArrowUpRight } from "lucide-react";

export default function StatsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [timeFilter, setTimeFilter] = useState("mes");
  const [showProjected, setShowProjected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userCurrency, setUserCurrency] = useState("USD");

  useEffect(() => {
    fetchUserData();
    fetchTransactions();
  }, [timeFilter]);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('profiles').select('moneda_preferida').eq('id', user.id).single();
      if (data) setUserCurrency(data.moneda_preferida);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('fecha_transaccion', { ascending: false });

    if (!error && data) {
      setTransactions(data);
    }
    setLoading(false);
  };

  const calculateTotal = () => {
    return transactions
      .filter(tx => {
        if (!showProjected && tx.estado_ingreso === 'acumulado_trabajo') return false;
        return tx.tipo === 'ingreso';
      })
      .reduce((acc, tx) => acc + (tx.monto || 0), 0);
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-6 font-sans overflow-x-hidden">
      <header className="flex justify-between items-center mb-12 pt-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-serif font-medium text-primary tracking-tight">Estadísticas</h1>
          <p className="text-muted text-sm font-sans">Análisis de capital y flujo</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowProjected(!showProjected)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
              showProjected ? "bg-primary text-background border-primary" : "bg-background border-white/10 text-muted"
            }`}
          >
            {showProjected ? "Incluye Proyectado" : "Solo Líquido"}
          </button>
        </div>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-white/5 p-6 rounded-[2rem] space-y-3 shadow-xl"
        >
          <div className="flex items-center gap-2 text-muted">
            <Wallet size={16} />
            <span className="text-[10px] uppercase tracking-widest font-bold">Capital Total</span>
          </div>
          <p className="text-3xl font-serif font-bold text-primary">
            {userCurrency} {calculateTotal().toLocaleString()}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-white/5 p-6 rounded-[2rem] space-y-3 shadow-xl"
        >
          <div className="flex items-center gap-2 text-muted">
            <TrendingUp size={16} />
            <span className="text-[10px] uppercase tracking-widest font-bold">Crecimiento</span>
          </div>
          <p className="text-3xl font-serif font-bold text-secondary">
            +12.5%
          </p>
        </motion.div>
      </div>

      {/* Temporal Filter */}
      <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-4 no-scrollbar">
        <div className="p-2 bg-white/5 rounded-xl text-muted shrink-0">
          <Filter size={18} />
        </div>
        {["dia", "semana", "mes", "ano"].map((f) => (
          <button
            key={f}
            onClick={() => setTimeFilter(f)}
            className={`px-6 py-2 rounded-xl text-sm capitalize transition-all shrink-0 ${
              timeFilter === f ? "bg-primary text-background font-bold" : "bg-card border border-white/10 text-muted"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <div className="space-y-6">
        <h3 className="text-sm font-medium text-muted px-1 flex items-center gap-2 uppercase tracking-widest">
          <Clock size={14} /> Actividad Reciente
        </h3>

        <AnimatePresence>
          {loading ? (
            <div className="text-center py-20 text-muted animate-pulse">Sincronizando datos...</div>
          ) : (
            <div className="grid gap-4">
              {transactions.map((tx, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card border border-white/5 p-5 rounded-3xl flex justify-between items-center group hover:border-primary/30 transition-all"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium group-hover:text-primary transition-colors">{tx.descripcion}</p>
                    <p className="text-[10px] text-muted uppercase tracking-tighter">
                      {tx.rango_tiempo} • {tx.estado_ingreso.replace('_', ' ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${tx.tipo === 'ingreso' ? 'text-primary' : 'text-red-400'}`}>
                      {tx.tipo === 'ingreso' ? '+' : '-'}{tx.monto}
                    </span>
                    <ArrowUpRight size={14} className="text-muted group-hover:text-primary transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
