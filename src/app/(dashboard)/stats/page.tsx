"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, Package, Users, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
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

  const calculateTotal = () => {
    return transactions
      .filter(tx => tx.tipo === 'ingreso')
      .reduce((acc, tx) => acc + (tx.monto || 0), 0);
  };

  // Mock data for charts to ensure a professional look while we build the dynamic logic
  const revenueData = [
    { name: 'Jan', revenue: 4000, income: 2400 },
    { name: 'Feb', revenue: 3000, income: 1398 },
    { name: 'Mar', revenue: 2000, income: 9800 },
    { name: 'Apr', revenue: 2780, income: 3908 },
    { name: 'May', revenue: 1890, income: 4800 },
    { name: 'Jun', revenue: 2390, income: 3800 },
  ];

  const categoryData = [
    { name: 'Accessories', value: 400, color: '#3B82F6' },
    { name: 'Clothing', value: 300, color: '#22C55E' },
    { name: 'Shoes', value: 300, color: '#F59E0B' },
    { name: 'Other', value: 200, color: '#EF4444' },
  ];

  const stats = [
    { title: "Total Sales", value: `$${calculateTotal().toLocaleString()}`, trend: "+16%", trendColor: "text-success", icon: Wallet },
    { title: "Total Visitors", value: "140,841", trend: "+12.05%", trendColor: "text-success", icon: Users },
    { title: "Avg Order Value", value: `$560`, trend: "-3.64%", trendColor: "text-error", icon: Target },
    { title: "Conversion Rate", value: "48.78%", trend: "+2%", trendColor: "text-success", icon: Package },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#131A22] border border-[#1D2632] p-6 rounded-2xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-[#1D2632] rounded-lg text-primary">
                <stat.icon size={20} />
              </div>
              <span className={`text-xs font-medium ${stat.trendColor} flex items-center gap-1`}>
                {stat.trend === '+' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.trend}
              </span>
            </div>
            <p className="text-[#8B95A7] text-sm font-medium">{stat.title}</p>
            <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-[#131A22] border border-[#1D2632] p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Revenue Analytics</h3>
            <select className="bg-[#0B0F14] border border-[#1D2632] text-xs rounded-lg px-2 py-1 outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1D2632" vertical={false} />
                <XAxis dataKey="name" stroke="#8B95A7" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#8B95A7" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#131A22', borderColor: '#1D2632', color: '#FFF' }}
                  itemStyle={{ color: '#FFF' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                <Area type="monotone" dataKey="income" stroke="#22C55E" fillOpacity={1} fill="url(#colorInc)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Chart */}
        <div className="bg-[#131A22] border border-[#1D2632] p-6 rounded-2xl flex flex-col">
          <h3 className="text-lg font-semibold mb-6">Top Categories</h3>
          <div className="flex-1 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <RechartsPieChart>
                <Pie
                  data={categoryData}
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#131A22', borderColor: '#1D2632', color: '#FFF' }} />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold">1246</span>
              <span className="text-xs text-[#8B95A7]">pcs</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-xs text-[#8B95A7]">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Best Selling Products Table */}
      <div className="bg-[#131A22] border border-[#1D2632] rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-[#1D2632] flex justify-between items-center">
          <h3 className="text-lg font-semibold">Best Selling Products</h3>
          <button className="text-sm text-primary hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0B0F14] text-[#8B95A7] uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Sold</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D2632]">
              {[
                { name: "Premium Leather Wallet", price: "$59.00", sold: "1,204", status: "In Stock" },
                { name: "Minimalist Card Holder", price: "$29.00", sold: "856", status: "Low Quantity" },
                { name: "Luxury Travel Case", price: "$120.00", sold: "432", status: "Out of Stock" },
                { name: "Designer Keychain", price: "$15.00", sold: "2,104", status: "In Stock" },
              ].map((prod, i) => (
                <tr key={i} className="hover:bg-[#1D2632]/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{prod.name}</td>
                  <td className="px-6 py-4 text-[#8B95A7]">{prod.price}</td>
                  <td className="px-6 py-4 text-[#8B95A7]">{prod.sold}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                      prod.status === 'In Stock' ? 'bg-success/10 text-success' :
                      prod.status === 'Low Quantity' ? 'bg-warning/10 text-warning' :
                      'bg-error/10 text-error'
                    }`}>
                      {prod.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
