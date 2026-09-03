"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Save, Globe, User, Bell, Shield, Palette } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>({
    nombre_usuario: "",
    moneda_preferida: "USD",
    tipo_ingreso: "variable",
  });

  useEffect(() => {
    const username = document.cookie.split('; ').find(row => row.startsWith('inflow_user='))?.split('=')[1];
    if (!username) {
      router.push("/onboarding");
      return;
    }
    fetchProfile(username);
  }, []);

  const fetchProfile = async (username: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('username', username).single();
    if (data) setProfile(data);
  };

  const handleSave = async () => {
    setLoading(true);
    const username = document.cookie.split('; ').find(row => row.startsWith('inflow_user='))?.split('=')[1];
    if (username) {
      await supabase.from('profiles').upsert({
        username,
        ...profile,
        updated_at: new Date().toISOString(),
      });
    }
    setLoading(false);
    alert("Preferencias actualizadas correctamente.");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in duration-700">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">System Configuration</h1>
        <p className="text-muted text-sm">Manage your account identity and financial preferences</p>
      </header>

      <div className="space-y-8">
        {/* Identity Section */}
        <section className="bg-card border border-white/5 p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-3 text-white font-semibold">
            <User size={20} className="text-primary" />
            <span className="text-lg">Identity</span>
          </div >
          <div className="grid gap-6">
            <div className="space-y-2">
              <label className="text-[10px] text-muted uppercase tracking-widest font-bold ml-1">User Handle</label>
              <input
                type="text"
                value={profile.nombre_usuario}
                onChange={(e) => setProfile({...profile, nombre_usuario: e.target.value})}
                className="w-full bg-background border border-white/10 rounded-xl p-4 focus:ring-1 focus:ring-primary/50 outline-none transition-all text-sm text-white"
              />
            </div >
          </div >
        </section>

        {/* Preferences Section */}
        <section className="bg-card border border-white/5 p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-3 text-white font-semibold">
            <Globe size={20} className="text-primary" />
            <span className="text-lg">Financial Core</span>
          </div >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] text-muted uppercase tracking-widest font-bold ml-1">Primary Currency</label>
              <select
                value={profile.moneda_preferida}
                onChange={(e) => setProfile({...profile, moneda_preferida: e.target.value})}
                className="w-full bg-background border border-white/10 rounded-xl p-4 focus:ring-1 focus:ring-primary/50 outline-none transition-all text-sm text-white appearance-none"
              >
                <option value="USD">🇺🇸 USD - Dollar</option>
                <option value="PEN">🇵🇪 PEN - Sol</option>
                <option value="MXN">🇲🇽 MXN - Peso</option>
              </select>
            </div >
            <div className="space-y-2">
              <label className="text-[10px] text-muted uppercase tracking-widest font-bold ml-1">Income Model</label>
              <select
                value={profile.tipo_ingreso}
                onChange={(e) => setProfile({...profile, tipo_ingreso: e.target.value})}
                className="w-full bg-background border border-white/10 rounded-xl p-4 focus:ring-1 focus:ring-primary/50 outline-none transition-all text-sm text-white appearance-none"
              >
                <option value="variable">Variable / Freelance</option>
                <option value="mensual">Fixed Monthly</option>
                <option value="quincenal">Bi-Weekly</option>
                <option value="semanal">Weekly</option>
              </select>
            </div >
          </div >
        </section>

        {/* System Section */}
        <section className="bg-card border border-white/5 p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-3 text-white font-semibold">
            <Shield size={20} className="text-primary" />
            <span className="text-lg">System & Security</span>
          </div >
          <div className="space-y-3">
            {[
              { icon: Bell, label: "Flow Notifications" },
              { icon: Palette, label: "Obsidian Theme" }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-background border border-white/5 rounded-xl group hover:border-white/10 transition-all">
                <div className="flex items-center gap-3">
                  <item.icon size={18} className="text-muted group-hover:text-primary transition-colors" />
                  <span className="text-sm text-white">{item.label}</span>
                </div >
                <div className="w-10 h-5 bg-primary rounded-full relative cursor-pointer shadow-lg shadow-primary/20">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                </div >
              </div >
            ))}
          </div >
        </section>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-primary text-white font-bold py-5 rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg shadow-xl shadow-primary/20 disabled:opacity-50"
        >
          {loading ? "Syncing..." : (
            <>
              <Save size={20} />
              Sync Configuration
            </>
          )}
        </button>
      </div >
    </div >
  );
}
