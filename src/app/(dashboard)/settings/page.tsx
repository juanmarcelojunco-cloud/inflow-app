"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Save, Globe, User, Bell, Shield, Palette, ChevronRight } from "lucide-react";

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
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Configuración</h1>
        <p className="text-[#8B95A7] text-sm">Personaliza tu experiencia de Wealth Management</p>
      </header>

      <div className="space-y-6">
        {/* Profile Section */}
        <section className="bg-[#131A22] border border-[#1D2632] p-6 rounded-2xl space-y-6">
          <div className="flex items-center gap-3 text-white font-semibold">
            <User size={20} className="text-primary" />
            <span>Identidad</span>
          </div >
          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-xs text-[#8B95A7] uppercase tracking-wider font-bold ml-1">Nombre de Usuario</label>
              <input
                type="text"
                value={profile.nombre_usuario}
                onChange={(e) => setProfile({...profile, nombre_usuario: e.target.value})}
                className="w-full bg-[#0B0F14] border border-[#1D2632] rounded-xl p-3 focus:ring-2 focus:ring-primary/40 outline-none transition-all text-sm"
              />
            </div >
          </div >
        </section>

        {/* Preferences Section */}
        <section className="bg-[#131A22] border border-[#1D2632] p-6 rounded-2xl space-y-6">
          <div className="flex items-center gap-3 text-white font-semibold">
            <Globe size={20} className="text-primary" />
            <span>Preferencias Financieras</span>
          </div >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs text-[#8B95A7] uppercase tracking-wider font-bold ml-1">Moneda Principal</label>
              <select
                value={profile.moneda_preferida}
                onChange={(e) => setProfile({...profile, moneda_preferida: e.target.value})}
                className="w-full bg-[#0B0F14] border border-[#1D2632] rounded-xl p-3 focus:ring-2 focus:ring-primary/40 outline-none transition-all text-sm appearance-none"
              >
                <option value="USD">🇺🇸 USD - Dólar</option>
                <option value="PEN">🇵🇪 PEN - Sol</option>
                <option value="MXN">🇲🇽 MXN - Peso</option>
              </select>
            </div >
            <div className="space-y-2">
              <label className="text-xs text-[#8B95A7] uppercase tracking-wider font-bold ml-1">Tipo de Ingreso</label>
              <select
                value={profile.tipo_ingreso}
                onChange={(e) => setProfile({...profile, tipo_ingreso: e.target.value})}
                className="w-full bg-[#0B0F14] border border-[#1D2632] rounded-xl p-3 focus:ring-2 focus:ring-primary/40 outline-none transition-all text-sm appearance-none"
              >
                <option value="variable">Variable</option>
                <option value="mensual">Mensual</option>
                <option value="quincenal">Quincenal</option>
                <option value="semanal">Semanal</option>
              </select>
            </div >
          </div >
        </section>

        {/* System Section */}
        <section className="bg-[#131A22] border border-[#1D2632] p-6 rounded-2xl space-y-6">
          <div className="flex items-center gap-3 text-white font-semibold">
            <Shield size={20} className="text-primary" />
            <span>Seguridad y Sistema</span>
          </div >
          <div className="space-y-3">
            {[
              { icon: Bell, label: "Notificaciones de Flujo" },
              { icon: Palette, label: "Modo Nocturno Premium" }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[#0B0F14] rounded-xl border border-[#1D2632]">
                <div className="flex items-center gap-3">
                  <item.icon size={18} className="text-[#8B95A7]" />
                  <span className="text-sm text-white">{item.label}</span>
                </div >
                <div className="w-10 h-5 bg-primary rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                </div >
              </div >
            ))}
          </div >
        </section>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg shadow-lg shadow-primary/20 disabled:opacity-50"
        >
          {loading ? "Guardando..." : (
            <>
              <Save size={20} />
              Guardar Cambios
            </>
          )}
        </button>
      </div >
    </div >
  );
}
