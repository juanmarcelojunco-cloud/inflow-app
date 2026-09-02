"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ChevronRight, Globe, Wallet, User, Sparkles } from "lucide-react";

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
      // Guardar en la tabla de perfiles basada en username
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

      // Establecer cookie para el middleware
      document.cookie = `inflow_user=${formData.username.toLowerCase()}; path=/; max-age=31536000`;

      router.push("/chat");
    } catch (error: any) {
      alert("Error al configurar tu perfil: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground selection:bg-primary selection:text-background">
      <div className="w-full max-w-lg space-y-12">

        {/* Header - International Corporate Style */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-2">
            <Sparkles size={12} />
            <span>Next-Gen Wealth Management</span>
          </div>
          <h1 className="text-6xl font-serif font-medium tracking-tighter text-foreground">
            in<span className="text-primary">Flow</span> <span className="text-sm block text-primary font-sans uppercase tracking-widest">Despliegue Forzado v3</span>
          </h1>
          <p className="text-muted text-sm font-sans max-w-xs mx-auto">
            Arquitectura financiera inteligente para el capital moderno.
          </p>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="bg-card border border-white/10 rounded-[2.5rem] p-10 shadow-2xl backdrop-blur-xl"
              >
                <div className="space-y-6">
                  <div className="space-y-2 text-center mb-8">
                    <h2 className="text-2xl font-serif font-medium">Bienvenido</h2>
                    <p className="text-muted text-sm">Crea tu identificador único para acceder.</p>
                  </div>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={20} />
                    <input
                      type="text"
                      placeholder="Username (ej: juan_flow)"
                      className="w-full bg-background border border-white/10 rounded-2xl p-5 pl-12 focus:ring-2 focus:ring-primary/50 outline-none transition-all text-lg"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                    />
                  </div>
                  <button
                    onClick={nextStep}
                    disabled={!formData.username}
                    className="w-full bg-primary text-background font-bold py-5 rounded-2xl hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
                  >
                    Continuar
                    <ChevronRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="bg-card border border-white/10 rounded-[2.5rem] p-10 shadow-2xl"
              >
                <div className="space-y-6">
                  <div className="space-y-2 text-center mb-8">
                    <h2 className="text-2xl font-serif font-medium">Tu Identidad</h2>
                    <p className="text-muted text-sm">¿Cómo quieres que te llame el asesor?</p>
                  </div>
                  <input
                    type="text"
                    placeholder="Nombre completo"
                    className="w-full bg-background border border-white/10 rounded-2xl p-5 focus:ring-2 focus:ring-primary/50 outline-none transition-all text-lg text-center"
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
                      className="flex-[2] bg-primary text-background font-bold py-5 rounded-2xl hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
                    >
                      Siguiente
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="bg-card border border-white/10 rounded-[2.5rem] p-10 shadow-2xl"
              >
                <div className="space-y-6">
                  <div className="space-y-2 text-center mb-8">
                    <h2 className="text-2xl font-serif font-medium">Flujo de Capital</h2>
                    <p className="text-muted text-sm">Selecciona la naturaleza de tus ingresos.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {["minuto", "hora", "dia", "semana", "quincena", "mes", "ano", "variable"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setFormData({...formData, tipo_ingreso: type})}
                        className={`p-4 rounded-2xl border transition-all capitalize text-sm font-medium ${
                          formData.tipo_ingreso === type
                          ? "bg-primary text-background border-primary shadow-lg shadow-primary/20"
                          : "bg-background border-white/10 text-foreground hover:border-primary/50"
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
                      className="flex-[2] bg-primary text-background font-bold py-5 rounded-2xl hover:brightness-110 transition-all flex items-center justify-center gap-2 text-lg"
                    >
                      Siguiente
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="bg-card border border-white/10 rounded-[2.5rem] p-10 shadow-2xl"
              >
                <div className="space-y-6">
                  <div className="space-y-2 text-center mb-8">
                    <h2 className="text-2xl font-serif font-medium">Capital Inicial</h2>
                    <p className="text-muted text-sm">Ingresa el monto base de tu flujo financiero.</p>
                  </div>
                  <div className="space-y-6">
                    <div className="flex gap-3 p-1 bg-background border border-white/10 rounded-2xl w-fit mx-auto">
                      {["USD", "PEN", "MXN"].map((curr) => (
                        <button
                          key={curr}
                          onClick={() => setFormData({...formData, moneda_preferida: curr})}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
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
                      <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={20} />
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full bg-background border border-white/10 rounded-2xl p-5 pl-12 focus:ring-2 focus:ring-primary/50 outline-none transition-all text-xl text-center font-serif"
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
                      className="flex-[2] bg-primary text-background font-bold py-5 rounded-2xl hover:brightness-110 transition-all flex items-center justify-center gap-2 text-lg shadow-lg shadow-primary/20"
                    >
                      {loading ? "Sincronizando..." : "Finalizar Setup"}
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
