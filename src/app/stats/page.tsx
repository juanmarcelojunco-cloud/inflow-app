"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { TrendingUp, Wallet, Clock, Filter, ArrowUpRight, PieChart, Zap, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StatsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [timeFilter, setTimeFilter] = useState("mes");
  const [showProjected, setShowProjected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const username = document.cookie.split('; ').find(row => row.startsWith('inflow_user='))?.split('=')[1];
    if (!username) {
      router.push("/onboarding");
      return;
    }
    fetchUserData(username);
    fetchTransactions(username);
  }, [router]);

  const fetchUserData = async (username: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (!error && data) {
      setUserProfile(data);
    }
  };

  const fetchTransactions = async (username: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('username', username)
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

  const calculateProjected = () => {
    return transactions
      .filter(tx => tx.estado_ingreso === 'acumulado_trabajo' && tx.tipo === 'ingreso')
      .reduce((acc, tx) => acc + (tx.monto || 0), 0);
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-6 font-sans overflow-x-hidden">
      <header className="flex justify-between items-center mb-12 pt-4 max-w-7xl mx-auto">
        <div className="space-y-2">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl font-serif font-medium text-foreground tracking-tight"
          >
            Capital <span className="text-primary">Analytics</span>
          </motion.h1>
          <p className="text-muted text-sm font-sans uppercase tracking-widest opacity-70">
            Wealth Intelligence Overview
          </p>
        </div>
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowProjected(!showProjected)}
            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all border shadow-lg ${
              showProjected
                ? "bg-primary text-background border-primary shadow-primary/20"
                : "glass text-muted border-white/10"
            }`}
          >
            {showProjected ? "Vista Proyectada" : "Vista Líquida"}
          </motion.button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-8 rounded-[3rem] space-y-6 relative overflow-hidden group"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 blur-3xl rounded-full group-hover:bg-primary/20 transition-all" />
            <div className="flex items-center justify-between">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <Wallet size={24} />
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted">Patrimonio</span>
            </div>
            <div className="space-y-1">
              <p className="text-5xl font-serif font-bold text-foreground">
                {userProfile?.moneda_preferida || "USD"} {calculateTotal().toLocaleString()}
              </p>
              <p className="text-xs text-muted font-medium">Capital total disponible</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-8 rounded-[3rem] space-y-6 relative overflow-hidden group"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent/10 blur-3xl rounded-full group-hover:bg-accent/20 transition-all" />
            <div className="flex items-center justify-between">
              <div className="p-3 bg-accent/10 rounded-2xl text-accent">
                <Zap size={24} />
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted">Proyectado</span>
            </div>
            <div className="space-y-1">
              <p className="text-5xl font-serif font-bold text-foreground">
                {userProfile?.moneda_preferida || "USD"} {calculateProjected().toLocaleString()}
              </p>
              <p className="text-xs text-muted font-medium">Ingresos en camino (acumulados)</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-8 rounded-[3rem] space-y-6 relative overflow-hidden group"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-500/10 blur-3xl rounded-full group-hover:bg-green-500/20 transition-all" />
            <div className="flex items-center justify-between">
              <div className="p-3 bg-green-500/10 rounded-2xl text-green-400">
                <TrendingUp size={24} />
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted">Rendimiento</span>
            </div>
            <div className="space-y-1">
              <p className="text-5xl font-serif font-bold text-foreground">
                +14.2%
              </p>
              <p className="text-xs text-muted font-medium">Crecimiento vs mes anterior</p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1 space-y-8">
            <div className="glass p-6 rounded-[2.5rem] space-y-6">
              <div className="flex items-center gap-3 text-foreground font-medium">
                <Filter size={18} className="text-primary" />
                <span className="text-sm uppercase tracking-widest">Temporalidad</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {["dia", "semana", "mes", "ano"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setTimeFilter(f)}
                    className={`p-3 rounded-xl text-xs capitalize transition-all ${
                      timeFilter === f
                        ? "bg-primary text-background font-bold shadow-lg shadow-primary/20"
                        : "bg-background/40 text-muted hover:text-foreground border border-white/5"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass p-6 rounded-[2.5rem] space-y-4">
              <div className="flex items-center gap-3 text-foreground font-medium">
                <PieChart size={18} className="text-primary" />
                <span className="text-sm uppercase tracking-widest">Distribución</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-muted">Líquido</span>
                  <span className="font-bold">{(calculateTotal() / (calculateTotal() + calculateProjected()) * 100 || 0).toFixed(1)}%</span>
                </div>
                <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(calculateTotal() / (calculateTotal() + calculateProjected()) * 100 || 0)}%` }}
                    className="h-full bg-primary"
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted">Proyectado</span>
                  <span className="font-bold">{(calculateProjected() / (calculateTotal() + calculateProjected()) * 100 || 0).toFixed(1)}%</span>
                </div>
                <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(calculateProjected() / (calculateTotal() + calculateProjected()) * 100 || 0)}%` }}
                    className="h-full bg-accent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-bold text-muted uppercase tracking-widest flex items-center gap-2">
                <Clock size={16} className="text-primary" /> Actividad Reciente
              </h3>
              <button className="text-xs text-primary hover:underline flex items-center gap-1 transition-all">
                Ver todo <ChevronRight size={12} />
              </button>
            </div>

            <AnimatePresence mode="popLayout">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <p className="text-muted text-sm animate-pulse">Sincronizando con el núcleo financiero...</p>
                </div>
              ) : transactions.length === 0 ? (
                <div className="glass rounded-[3rem] p-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto text-muted mb-4">
                    <Wallet size={32} />
                  </div>
                  <h4 className="text-xl font-serif">No hay flujos registrados</h4>
                  <p className="text-muted text-sm max-w-xs mx-auto">Tus transacciones aparecerán aquí una vez que comiences a registrar tus ingresos y gastos.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {transactions.map((tx, i) => (
                    <motion.div
                      key={tx.id || i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="glass p-5 rounded-[2rem] flex justify-between items-center group hover:border-primary/40 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-5">
                        <div className={`p-3 rounded-2xl ${tx.tipo === 'ingreso' ? 'bg-primary/10 text-primary' : 'bg-red-500/10 text-red-400'}`}>
                          {tx.tipo === 'ingreso' ? <ArrowUpRight size={20} /> : <TrendingUp size={20} className="rotate-180" />}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium group-hover:text-primary transition-colors">{tx.descripcion}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-muted uppercase tracking-tighter">
                              {tx.rango_tiempo || 'unico'}
                            </span>
                            <span className="w-1 h-1 bg-muted rounded-full" />
                            <span className="text-[10px] text-muted uppercase tracking-tighter">
                              {tx.estado_ingreso?.replace('_', ' ') || 'n/a'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-serif font-bold ${tx.tipo === 'ingreso' ? 'text-primary' : 'text-red-400'}`}>
                          {tx.tipo === 'ingreso' ? '+' : '-'}{tx.monto}
                        </p>
                        <p className="text-[10px] text-muted opacity-60">{new Date(tx.fecha_transaccion).toLocaleDateString()}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
