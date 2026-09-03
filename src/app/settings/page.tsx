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
    <main className="min-h-screen bg-background text-foreground p-6 font-sans">
      <div className="max-w-3xl mx-auto space-y-12 pt-12">
        <header className="space-y-2">
          <h1 className="text-5xl font-serif font-medium tracking-tight">Configuración</h1>
          <p className="text-muted text-sm uppercase tracking-widest opacity-70">Personaliza tu experiencia de Wealth Management</p>
        </header>

        <div className="space-y-8">
          {/* Profile Section */}
          <section className="glass p-8 rounded-[3rem] space-y-6">
            <div className="flex items-center gap-3 text-foreground font-medium mb-4">
              <User size={20} className="text-primary" />
              <span className="text-lg">Identidad</span>
            </div >
            <div className="grid gap-6">
              <div className="space-y-2">
                <label className="text-xs text-muted uppercase tracking-widest font-bold ml-1">Nombre de Usuario</label>
                <input
                  type="text"
                  value={profile.nombre_usuario}
                  onChange={(e) => setProfile({...profile, nombre_usuario: e.target.value})}
                  className="w-full bg-background/40 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-primary/40 outline-none transition-all text-lg"
                />
              </div >
            </div >
          </section>

          {/* Preferences Section */}
          <section className="glass p-8 rounded-[3rem] space-y-6">
            <div className="flex items-center gap-3 text-foreground font-medium mb-4">
              <Globe size={20} className="text-primary" />
              <span className="text-lg">Preferencias Financieras</span>
            </div >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs text-muted uppercase tracking-widest font-bold ml-1">Moneda Principal</label>
                <select
                  value={profile.moneda_preferida}
                  onChange={(e) => setProfile({...profile, moneda_preferida: e.target.value})}
                  className="w-full bg-background/40 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-primary/40 outline-none transition-all text-lg appearance-none"
                >
                  <option value="USD">🇺🇸 USD - Dólar</option>
                  <option value="PEN">🇵🇪 PEN - Sol</option>
                  <option value="MXN">🇲🇽 MXN - Peso</option>
                </select>
              </div >
              <div className="space-y-2">
                <label className="text-xs text-muted uppercase tracking-widest font-bold ml-1">Tipo de Ingreso</label>
                <select
                  value={profile.tipo_ingreso}
                  onChange={(e) => setProfile({...profile, tipo_ingreso: e.target.value})}
                  className="w-full bg-background/40 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-primary/40 outline-none transition-all text-lg appearance-none"
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
          <section className="glass p-8 rounded-[3rem] space-y-6">
            <div className="flex items-center gap-3 text-foreground font-medium mb-4">
              <Shield size={20} className="text-primary" />
              <span className="text-lg">Seguridad y Sistema</span>
            </div >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-background/40 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <Bell size={18} className="text-muted" />
                  <span className="text-sm">Notificaciones de Flujo</span>
                </div >
                <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-background rounded-full" />
                </div >
              </div >
              <div className="flex items-center justify-between p-4 bg-background/40 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <Palette size={18} className="text-muted" />
                  <span className="text-sm">Modo Nocturno Premium</span>
                </div >
                <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-background rounded-full" />
                </div >
              </div >
            </div >
          </section>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-primary text-background font-bold py-6 rounded-3xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-xl shadow-xl shadow-primary/20 disabled:opacity-50"
          >
            {loading ? "Guardando..." : (
              <>
                <Save size={24} />
                Guardar Cambios
              </>
            )}
          </button>
        </div >
      </div >
    </main>
  );
}
