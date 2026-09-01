"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { TrendingUp, Wallet, Clock, Filter } from "lucide-react";

export default function StatsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [timeFilter, setTimeFilter] = useState("mes"); // dia, semana, mes, ano
  const [showProjected, setShowProjected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, [timeFilter]);

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

  const calculateTotal = (filterStatus: string) => {
    return transactions
      .filter(tx => {
        if (!showProjected && tx.estado_ingreso === 'acumulado_trabajo') return false;
        return tx.tipo === 'ingreso';
      })
      .reduce((acc, tx) => acc + (tx.monto || 0), 0);
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-6 font-sans">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-medium text-primary">Estadísticas</h1>
          <p className="text-muted text-sm">Análisis de tu flujo financiero</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowProjected(!showProjected)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
              showProjected ? "bg-secondary text-background border-secondary" : "bg-background border-white/20 text-muted"
            }`}
          >
            {showProjected ? "Incluye Proyectado" : "Solo Líquido"}
          </button>
        </div>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-card border border-white/10 p-4 rounded-3xl space-y-2">
          <div className="flex items-center gap-2 text-muted">
            <Wallet size={16} />
            <span className="text-xs uppercase tracking-wider">Total Ingresos</span>
          </div>
          <p className="text-2xl font-serif font-bold text-primary">${calculateTotal('total').toLocaleString()}</p>
        </div>
        <div className="bg-card border border-white/10 p-4 rounded-3xl space-y-2">
          <div className="flex items-center gap-2 text-muted">
            <TrendingUp size={16} />
            <span className="text-xs uppercase tracking-wider">Efectividad</span>
          </div>
          <p className="text-2xl font-serif font-bold text-secondary">84%</p>
        </div>
      </div>

      {/* Temporal Filter */}
      <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
        <div className="p-2 bg-white/5 rounded-lg text-muted">
          <Filter size={16} />
        </div>
        {["dia", "semana", "mes", "ano"].map((f) => (
          <button
            key={f}
            onClick={() => setTimeFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm capitalize transition-all ${
              timeFilter === f ? "bg-primary text-background font-bold" : "bg-card border border-white/10 text-muted"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted px-1 flex items-center gap-2">
          <Clock size={14} /> Recientes en el periodo
        </h3>
        {loading ? (
          <div className="text-center py-10 text-muted animate-pulse">Cargando datos...</div>
        ) : (
          transactions.map((tx, i) => (
            <div key={i} className="bg-card border border-white/10 p-4 rounded-2xl flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium">{tx.descripcion}</p>
                <p className="text-[10px] text-muted uppercase">{tx.rango_tiempo} • {tx.estado_ingreso}</p>
              </div>
              <div className={`text-sm font-bold ${tx.tipo === 'ingreso' ? 'text-primary' : 'text-red-400'}`}>
                {tx.tipo === 'ingreso' ? '+' : '-'}${tx.monto}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
