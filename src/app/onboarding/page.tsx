"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ChevronRight, Wallet, User, Sparkles, ArrowRight, Globe, ShieldCheck } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    nombre_usuario: "",
    tipo_ingreso: "variable",
    sueldo_fijo_monto: "",
    moneda_preferida: "USD",
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          username: formData.username.toLowerCase(),
          nombre_usuario: formData.nombre_usuario,
          tipo_ingreso: formData.tipo_ingreso,
          sueldo_fijo_monto: parseFloat(formData.sueldo_fijo_monto) || 0,
          moneda_preferida: formData.moneda_preferida,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      document.cookie = `inflow_user=${formData.username.toLowerCase()}; path=/; max-age=31536000`;
      router.push("/chat");
    } catch (error: any) {
      alert("Error al configurar tu perfil: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground relative overflow-hidden font-sans">
      {/* Cinematic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[150px] rounded-full pointer-events-none animate-pulse" />

      <div className="w-full max-w-2xl z-10">
        {/* Brand Identity */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
            <Sparkles size={14} />
            <span>Wealth Intelligence System</span>
          </div>
          <h1 className="text-8xl font-serif font-medium tracking-tighter text-foreground">
            in<span className="text-primary">Flow</span>
          </h1>
          <p className="text-muted text-lg font-sans max-w-md mx-auto leading-relaxed opacity-80">
            La arquitectura financiera definitiva para la gestión de capital moderno.
          </p>
        </motion.div>

        {/* Main Interactive Card */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -20 }}
                className="glass rounded-[3rem] p-12 shadow-2xl"
              >
                <div className="space-y-10">
                  <div className="text-center space-y-3">
                    <h2 className="text-4xl font-serif font-medium">Comienza tu Flujo</h2>
                    <p className="text-muted text-sm">Establece tu identificador único para acceder al sistema.</p>
                  </div>
                  <div className="relative group">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={24} />
                    <input
                      type="text"
                      placeholder="Username (ej: alex_flow)"
                      className="w-full bg-background/40 border border-white/10 rounded-2xl p-6 pl-16 focus:ring-2 focus:ring-primary/40 outline-none transition-all text-xl font-medium placeholder:text-muted/40"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                    />
                  </div>
                  <button
                    onClick={nextStep}
                    disabled={!formData.username}
                    className="w-full bg-primary text-background font-bold py-6 rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-xl shadow-xl shadow-primary/20"
                  >
                    Continuar
                    <ChevronRight size={24} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -20 }}
                className="glass rounded-[3rem] p-12 shadow-2xl"
              >
                <div className="space-y-10">
                  <div className="text-center space-y-3">
                    <h2 className="text-4xl font-serif font-medium">Tu Identidad</h2>
                    <p className="text-muted text-sm">¿Cómo desea que el asesor inteligente se dirija a usted?</p>
                  </div>
                  <input
                    type="text"
                    placeholder="Nombre completo"
                    className="w-full bg-background/40 border border-white/10 rounded-2xl p-6 focus:ring-2 focus:ring-primary/40 outline-none transition-all text-xl text-center font-medium placeholder:text-muted/40"
                    value={formData.nombre_usuario}
                    onChange={(e) => setFormData({...formData, nombre_usuario: e.target.value})}
                  />
                  <div className="flex gap-4">
                    <button onClick={prevStep} className="flex-1 py-6 text-muted hover:text-foreground transition-colors rounded-2xl font-medium text-lg">
                      Volver
                    </button>
                    <button
                      onClick={nextStep}
                      disabled={!formData.nombre_usuario}
                      className="flex-[2] bg-primary text-background font-bold py-6 rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-xl shadow-xl shadow-primary/20"
                    >
                      Siguiente
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -20 }}
                className="glass rounded-[3rem] p-12 shadow-2xl"
              >
                <div className="space-y-10">
                  <div className="text-center space-y-3">
                    <h2 className="text-4xl font-serif font-medium">Dinámica de Capital</h2>
                    <p className="text-muted text-sm">Seleccione el modelo de frecuencia de sus ingresos.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {["minuto", "hora", "dia", "semana", "quincena", "mes", "ano", "variable"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setFormData({...formData, tipo_ingreso: type})}
                        className={`p-5 rounded-2xl border transition-all capitalize text-sm font-medium ${
                          formData.tipo_ingreso === type
                          ? "bg-primary text-background border-primary shadow-lg shadow-primary/30 scale-[1.02]"
                          : "bg-background/40 border-white/10 text-foreground hover:border-primary/50 hover:bg-background"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <button onClick={prevStep} className="flex-1 py-6 text-muted hover:text-foreground transition-colors rounded-2xl font-medium text-lg">
                      Volver
                    </button>
                    <button
                      onClick={nextStep}
                      className="flex-[2] bg-primary text-background font-bold py-6 rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-xl shadow-xl shadow-primary/20"
                    >
                      Siguiente
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -20 }}
                className="glass rounded-[3rem] p-12 shadow-2xl"
              >
                <div className="space-y-10">
                  <div className="text-center space-y-3">
                    <h2 className="text-4xl font-serif font-medium">Capital de Base</h2>
                    <p className="text-muted text-sm">Determine el monto inicial para la configuración del sistema.</p>
                  </div>
                  <div className="space-y-10">
                    <div className="flex justify-center gap-3 p-2 bg-background/40 border border-white/10 rounded-2xl w-fit mx-auto">
                      {["USD", "PEN", "MXN"].map((curr) => (
                        <button
                          key={curr}
                          onClick={() => setFormData({...formData, moneda_preferida: curr})}
                          className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                            formData.moneda_preferida === curr
                            ? "bg-primary text-background shadow-md"
                            : "text-muted hover:text-foreground"
                          }`}
                        >
                          {curr}
                        </button>
                      ))}
                    </div>
                    <div className="relative group">
                      <Wallet className="absolute left-6 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={24} />
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full bg-background/40 border border-white/10 rounded-2xl p-6 pl-16 focus:ring-2 focus:ring-primary/40 outline-none transition-all text-3xl text-center font-serif placeholder:text-muted/40"
                        value={formData.sueldo_fijo_monto}
                        onChange={(e) => setFormData({...formData, sueldo_fijo_monto: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={prevStep} className="flex-1 py-6 text-muted hover:text-foreground transition-colors rounded-2xl font-medium text-lg">
                      Volver
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="flex-[2] bg-primary text-background font-bold py-6 rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-xl shadow-xl shadow-primary/20"
                    >
                      {loading ? "Sincronizando..." : "Finalizar Setup"}
                      {!loading && <ArrowRight size={24} />}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 flex justify-center gap-8 text-muted/60"
        >
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest">
            <ShieldCheck size={14} />
            <span>Secure Encryption</span>
          </div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest">
            <Globe size={14} />
            <span>Global Access</span>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
