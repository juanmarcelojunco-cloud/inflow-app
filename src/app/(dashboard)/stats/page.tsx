"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, Package, Users, Target, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";

export default function OverviewPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<any[]>([]);
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
    const { data } = await supabase.from('profiles').select('*').eq('username', username).single();
    if (data) setUserProfile(data);
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

  const calculateLiquid = () => {
    return transactions
      .filter(tx => tx.tipo === 'ingreso' && tx.estado_ingreso === 'depositado_banco')
      .reduce((acc, tx) => acc + (tx.monto || 0), 0);
  };

  const calculateAccrued = () => {
    return transactions
      .filter(tx => tx.tipo === 'ingreso' && tx.estado_ingreso === 'acumulado_trabajo')
      .reduce((acc, tx) => acc + (tx.monto || 0), 0);
  };

  const calculateTotal = () => calculateLiquid() + calculateAccrued();

  // High-fidelity mock data for charts
  const revenueData = [
    { name: 'Jan', revenue: 4000, accrued: 2400 },
    { name: 'Feb', revenue: 3000, accrued: 1398 },
    { name: 'Mar', revenue: 5000, accrued: 9800 },
    { name: 'Apr', revenue: 2780, accrued: 3908 },
    { name: 'May', revenue: 4890, accrued: 4800 },
    { name: 'Jun', revenue: 6390, accrued: 3800 },
  ];

  const categoryData = [
    { name: 'Projects', value: 400, color: '#60A5FA' },
    { name: 'Consulting', value: 300, color: '#22C55E' },
    { name: 'Dividends', value: 300, color: '#F59E0B' },
    { name: 'Other', value: 200, color: '#EF4444' },
  ];

  const secondaryStats = [
    { title: "Monthly Growth", value: "+14.2%", trend: "up", icon: TrendingUp },
    { title: "Active Projects", value: "12", trend: "stable", icon: Package },
    { title: "Client Base", value: "48", trend: "up", icon: Users },
    { title: "Efficiency", value: "94%", trend: "up", icon: Target },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Hero Metrics Section - The Focus of the App */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="group relative p-8 rounded-3xl bg-card border border-white/5 hover:border-primary/30 transition-all duration-500">
          <p className="text-[10px] uppercase tracking-widest text-muted font-semibold mb-2">Liquid Capital</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-serif font-bold text-white">
              {userProfile?.moneda_preferida || "USD"} {calculateLiquid().toLocaleString()}
            </h2>
            <span className="text-success text-xs font-medium">Banked</span>
          </div >
          <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(calculateLiquid() / (calculateTotal() || 1) * 100)}%` }}
              className="h-full bg-primary shadow-[0_0_10px_rgba(96,165,250,0.5)]"
            />
          </div >
        </div >

        <div className="group relative p-8 rounded-3xl bg-card border border-white/5 hover:border-primary/30 transition-all duration-500">
          <p className="text-[10px] uppercase tracking-widest text-muted font-semibold mb-2">Accrued Assets</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-serif font-bold text-white">
              {userProfile?.moneda_preferida || "USD"} {calculateAccrued().toLocaleString()}
            </h2>
            <span className="text-warning text-xs font-medium">Pending</span>
          </div >
          <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(calculateAccrued() / (calculateTotal() || 1) * 100)}%` }}
              className="h-full bg-warning shadow-[0_0_10px_rgba(245,158,11,0.5)]"
            />
          </div >
        </div >

        <div className="group relative p-8 rounded-3xl bg-primary text-white shadow-2xl shadow-primary/20 overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 blur-3xl rounded-full" />
          <p className="text-[10px] uppercase tracking-widest opacity-80 font-semibold mb-2">Total Wealth</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-serif font-bold">{userProfile?.moneda_preferida || "USD"} {calculateTotal().toLocaleString()}</h2>
          </div >
          <div className="mt-4 flex items-center gap-2 text-xs font-medium opacity-90">
            <Zap size={14} />
            <span>Optimized Flow Active</span>
          </div >
        </div >
      </div >

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Floating Area Chart */}
        <div className="lg:col-span-2 bg-card border border-white/5 p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-semibold text-white">Wealth Projection</h3>
              <p className="text-xs text-muted">Comparison between liquid and accrued flow</p>
            </div >
            <select className="bg-background border border-white/10 text-[10px] rounded-lg px-3 py-1 outline-none text-muted">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div >
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#60A5FA" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0A0D12', borderColor: '#1A1F26', color: '#FFF', borderRadius: '12px' }}
                  itemStyle={{ color: '#FFF' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#60A5FA"
                  fillOpacity={1}
                  fill="url(#colorRev)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div >
        </div >

        {/* Distribution Donut */}
        <div className="bg-card border border-white/5 p-8 rounded-3xl flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-8">Asset Distribution</h3>
          <div className="flex-1 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <RechartsPieChart>
                <Pie
                  data={categoryData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0A0D12', borderColor: '#1A1F26', color: '#FFF', borderRadius: '12px' }} />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-white">12%</span>
              <span className="text-[10px] text-muted uppercase tracking-widest">Variance</span>
            </div >
          </div >
          <div className="grid grid-cols-2 gap-3 mt-6">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/[0.03]">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-[10px] text-muted truncate">{cat.name}</span>
              </div >
            ))}
          </div >
        </div >
      </div >

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {secondaryStats.map((stat, i) => (
          <div key={stat.title} className="bg-card border border-white/5 p-6 rounded-2xl transition-all hover:bg-white/[0.05]">
            <div className="flex items-center gap-3 text-muted mb-3">
              <stat.icon size={16} className="text-primary" />
              <span className="text-[10px] uppercase tracking-widest font-medium">{stat.title}</span>
            </div >
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-white">{stat.value}</span>
              <span className={`text-xs ${stat.trend === 'up' ? 'text-success' : 'text-muted'}`}>
                {stat.trend === 'up' ? '↑' : '→'}
              </span>
            </div >
          </div >
        ))}
      </div >

      {/* Minimal Activity Table */}
      <div className="bg-card border border-white/5 rounded-3xl overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
          <button className="text-xs text-primary hover:text-primary/80 transition-colors">View Full Ledger</button>
        </div >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-muted uppercase text-[10px] tracking-widest font-semibold">
                <th className="px-8 py-4">Transaction</th>
                <th className="px-8 py-4">Amount</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-muted text-sm">
                    No transactions recorded in the current flow.
                  </td>
                </tr>
              ) : (
                transactions.map((tx, i) => (
                  <tr key={tx.id || i} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${tx.tipo === 'ingreso' ? 'bg-primary' : 'bg-error'}`} />
                        <span className="text-white font-medium">{tx.descripcion}</span>
                      </div >
                    </td>
                    <td className={`px-8 py-5 font-medium ${tx.tipo === 'ingreso' ? 'text-primary' : 'text-error'}`}>
                      {tx.tipo === 'ingreso' ? '+' : '-'}{tx.monto}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-1 h-1 rounded-full ${tx.estado_ingreso === 'depositado_banco' ? 'bg-success' : 'bg-warning'}`} />
                        <span className="text-xs text-muted capitalize">
                          {tx.estado_ingreso?.replace('_', ' ') || 'n/a'}
                        </span>
                      </div >
                    </td>
                    <td className="px-8 py-5 text-right text-muted text-xs">
                      {new Date(tx.fecha_transaccion).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div >
      </div >
    </div >
  );
}
