"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ChevronRight, Globe, Wallet, User, Sparkles, ArrowRight } from "lucide-react";

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
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground relative overflow-hidden">
      {/* Background Decorative Elements - International Corporate Look */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-xl z-10">
        {/* Brand Identity */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            <Sparkles size={12} />
            <span>Wealth Intelligence System</span>
          </div>
          <h1 className="text-7xl font-serif font-medium tracking-tighter text-foreground">
            in<span className="text-primary">Flow</span>
          </h1>
          <p className="text-muted text-sm font-sans max-w-xs mx-auto leading-relaxed">
            La arquitectura financiera definitiva para la gestión de capital moderno.
          </p>
        </motion.div>

        {/* Main Interactive Card */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-card/50 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-12 shadow-2xl"
              >
                <div className="space-y-8">
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl font-serif font-medium">Comienza tu Flujo</h2>
                    <p className="text-muted text-sm">Establece tu identificador único para iniciar.</p>
                  </div>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={22} />
                    <input
                      type="text"
                      placeholder="Username (ej: alex_flow)"
                      className="w-full bg-background/50 border border-white/10 rounded-2xl p-5 pl-14 focus:ring-2 focus:ring-primary/40 outline-none transition-all text-lg font-medium"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                    />
                  </div>
                  <button
                    onClick={nextStep}
                    disabled={!formData.username}
                    className="w-full bg-primary text-background font-bold py-5 rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-lg shadow-lg shadow-primary/20"
                  >
                    Continuar
                    <ChevronRight size={22} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-card/50 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-12 shadow-2xl"
              >
                <div className="space-y-8">
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl font-serif font-medium">Tu Identidad</h2>
                    <p className="text-muted text-sm">¿Cómo desea que el asesor se dirija a usted?</p>
                  </div>
                  <input
                    type="text"
                    placeholder="Nombre completo"
                    className="w-full bg-background/50 border border-white/10 rounded-2xl p-5 focus:ring-2 focus:ring-primary/40 outline-none transition-all text-lg text-center font-medium"
                    value={formData.nombre_usuario}
                    onChange={(e) => setFormData({...formData, nombre_usuario: e.target.value})}
                  />
                  <div className="flex gap-4">
                    <button onClick={prevStep} className="flex-1 py-5 text-muted hover:text-foreground transition-colors rounded-2xl font-medium">
                      Volver
                    </button>
                    <button
                      onClick={nextStep}
                      disabled={!formData.nombre_usuario}
                      className="flex-[2] bg-primary text-background font-bold py-5 rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-lg shadow-lg shadow-primary/20"
                    >
                      Siguiente
                      <ChevronRight size={22} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-card/50 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-12 shadow-2xl"
              >
                <div className="space-y-8">
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl font-serif font-medium">Dinámica de Capital</h2>
                    <p className="text-muted text-sm">Seleccione el modelo de frecuencia de sus ingresos.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {["minuto", "hora", "dia", "semana", "quincena", "mes", "ano", "variable"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setFormData({...formData, tipo_ingreso: type})}
                        className={`p-4 rounded-2xl border transition-all capitalize text-sm font-medium ${
                          formData.tipo_ingreso === type
                          ? "bg-primary text-background border-primary shadow-lg shadow-primary/30 scale-[1.02]"
                          : "bg-background/50 border-white/10 text-foreground hover:border-primary/50 hover:bg-background"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <button onClick={prevStep} className="flex-1 py-5 text-muted hover:text-foreground transition-colors rounded-2xl font-medium">
                      Volver
                    </button>
                    <button
                      onClick={nextStep}
                      className="flex-[2] bg-primary text-background font-bold py-5 rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg shadow-lg shadow-primary/20"
                    >
                      Siguiente
                      <ChevronRight size={22} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-card/50 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-12 shadow-2xl"
              >
                <div className="space-y-8">
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl font-serif font-medium">Capital de Base</h2>
                    <p className="text-muted text-sm">Determine el monto inicial para la configuración del sistema.</p>
                  </div>
                  <div className="space-y-8">
                    <div className="flex justify-center gap-3 p-1.5 bg-background/50 border border-white/10 rounded-2xl w-fit mx-auto">
                      {["USD", "PEN", "MXN"].map((curr) => (
                        <button
                          key={curr}
                          onClick={() => setFormData({...formData, moneda_preferida: curr})}
                          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
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
                      <Wallet className="absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={22} />
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full bg-background/50 border border-white/10 rounded-2xl p-6 pl-14 focus:ring-2 focus:ring-primary/40 outline-none transition-all text-2xl text-center font-serif"
                        value={formData.sueldo_fijo_monto}
                        onChange={(e) => setFormData({...formData, sueldo_fijo_monto: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={prevStep} className="flex-1 py-5 text-muted hover:text-foreground transition-colors rounded-2xl font-medium">
                      Volver
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="flex-[2] bg-primary text-background font-bold py-5 rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg shadow-lg shadow-primary/20"
                    >
                      {loading ? "Sincronizando..." : "Finalizar Setup"}
                      {!loading && <ArrowRight size={22} />}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
