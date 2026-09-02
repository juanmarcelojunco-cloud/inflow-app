"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, CheckCircle2, Lock, User, CreditCard, Globe } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0: Auth, 1: Name, 2: Nature, 3: Amount
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nombre_usuario: "",
    tipo_ingreso: "variable",
    sueldo_fijo_monto: "",
    moneda_preferida: "USD",
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleAuth = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;
      nextStep();
    } catch (error: any) {
      alert("Error de registro: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesión no encontrada");

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          nombre_usuario: formData.nombre_usuario,
          tipo_ingreso: formData.tipo_ingreso,
          sueldo_fijo_monto: parseFloat(formData.sueldo_fijo_monto) || 0,
          moneda_preferida: formData.moneda_preferida,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      router.push("/chat");
    } catch (error: any) {
      alert("Error al guardar el perfil: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground overflow-hidden">
      <div className="w-full max-w-md space-y-12">

        {/* Brand Logo - Signature Element */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <h1 className="text-5xl font-serif font-medium text-primary tracking-tight">inFlow</h1>
          <div className="h-px w-12 bg-primary/50 mx-auto" />
          <p className="text-muted text-xs uppercase tracking-[0.2em] font-sans">Financial Boutique</p>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-card border border-white/5 rounded-[2rem] p-8 shadow-2xl space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-xl font-serif font-medium">Comienza tu flujo</h2>
                  <p className="text-muted text-sm">Crea una cuenta segura para gestionar tu capital.</p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                    <input
                      type="email"
                      placeholder="Correo electrónico"
                      className="w-full bg-background border border-white/10 rounded-2xl p-4 pl-12 focus:ring-1 focus:ring-primary outline-none transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                    <input
                      type="password"
                      placeholder="Contraseña"
                      className="w-full bg-background border border-white/10 rounded-2xl p-4 pl-12 focus:ring-1 focus:ring-primary outline-none transition-all"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>

                <button
                  onClick={handleAuth}
                  disabled={loading || !formData.email || !formData.password}
                  className="w-full bg-primary text-background font-bold py-4 rounded-2xl hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? "Creando cuenta..." : "Continuar"}
                  {!loading && <ChevronRight size={18} />}
                </button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-card border border-white/5 rounded-[2rem] p-8 shadow-2xl space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-xl font-serif font-medium">Identidad</h2>
                  <p className="text-muted text-sm">¿Cómo prefieres que te llame el asesor?</p>
                </div>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Tu nombre..."
                    className="w-full bg-background border border-white/10 rounded-2xl p-4 focus:ring-1 focus:ring-primary outline-none transition-all"
                    value={formData.nombre_usuario}
                    onChange={(e) => setFormData({...formData, nombre_usuario: e.target.value})}
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={prevStep} className="p-4 text-muted hover:text-foreground transition-colors rounded-2xl">
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!formData.nombre_usuario}
                    className="flex-1 bg-primary text-background font-bold py-4 rounded-2xl hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    Siguiente
                    <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-card border border-white/5 rounded-[2rem] p-8 shadow-2xl space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-xl font-serif font-medium">Naturaleza del Ingreso</h2>
                  <p className="text-muted text-sm">Define la frecuencia de tu flujo financiero.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {["minuto", "hora", "dia", "semana", "quincena", "mes", "ano", "variable"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFormData({...formData, tipo_ingreso: type})}
                      className={`p-3 rounded-xl border transition-all capitalize text-sm ${
                        formData.tipo_ingreso === type
                        ? "bg-primary text-background border-primary font-bold"
                        : "bg-background border-white/10 text-foreground hover:border-primary/50"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={prevStep} className="p-4 text-muted hover:text-foreground transition-colors rounded-2xl">
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextStep}
                    className="flex-1 bg-primary text-background font-bold py-4 rounded-2xl hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    Siguiente
                    <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-card border border-white/5 rounded-[2rem] p-8 shadow-2xl space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-xl font-serif font-medium">Capital Base</h2>
                  <p className="text-muted text-sm">Ingresa tu sueldo fijo o monto base mensual.</p>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-2 mb-4">
                    {["USD", "PEN", "MXN"].map((curr) => (
                      <button
                        key={curr}
                        onClick={() => setFormData({...formData, moneda_preferida: curr})}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                          formData.moneda_preferida === curr
                          ? "bg-primary text-background"
                          : "bg-background border border-white/10 text-muted"
                        }`}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full bg-background border border-white/10 rounded-2xl p-4 pl-12 focus:ring-1 focus:ring-primary outline-none transition-all"
                      value={formData.sueldo_fijo_monto}
                      onChange={(e) => setFormData({...formData, sueldo_fijo_monto: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={prevStep} className="p-4 text-muted hover:text-foreground transition-colors rounded-2xl">
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="flex-1 bg-primary text-background font-bold py-4 rounded-2xl hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? "Guardando..." : "Finalizar"}
                    {!loading && <CheckCircle2 size={18} />}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
